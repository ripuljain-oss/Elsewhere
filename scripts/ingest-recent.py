#!/usr/bin/env python3
"""
Elsewhere Recents Ingest Pipeline
----------------------------------
Watches or ingests photos from iCloud Drive ("Elsewhere Ingest"), adapts them for
the web, extracts EXIF/GPS, drafts editorial captions, updates codebase metadata,
verifies the build, opens a GitHub PR, and merges to main.

Usage:
  # Ingest any new photos in the iCloud Ingest folder:
  python3 scripts/ingest-recent.py

  # Ingest a specific photo file:
  python3 scripts/ingest-recent.py --file ~/Downloads/photo.jpg

  # Dry run (processes image & shows diff without git commit/push):
  python3 scripts/ingest-recent.py --dry-run

  # Manual override for caption/location:
  python3 scripts/ingest-recent.py --file photo.jpg --location "Oak Park, Illinois" --caption "..."
"""

import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_INGEST_DIR = Path.home() / "Library" / "Mobile Documents" / "com~apple~CloudDocs" / "Elsewhere Ingest"
PROCESSED_SUBDIR = "processed"
PUBLIC_RECENTS_DIR = ROOT_DIR / "public" / "Assets" / "Recents"
RECENTS_JS_PATH = ROOT_DIR / "recents.js"
IMAGE_META_JS_PATH = ROOT_DIR / "imageMeta.js"
SPEC_TEST_PATH = ROOT_DIR / "tests" / "photo-aspect.spec.js"

# Allowed extensions
VALID_EXTENSIONS = {".jpg", ".jpeg", ".heic", ".png"}


def run_cmd(cmd, cwd=ROOT_DIR, check=True):
    """Run shell command and return stdout."""
    res = subprocess.run(cmd, shell=isinstance(cmd, str), cwd=cwd, capture_output=True, text=True)
    if check and res.returncode != 0:
        raise RuntimeError(f"Command failed [{res.returncode}]: {cmd}\nStdout: {res.stdout}\nStderr: {res.stderr}")
    return res.stdout.strip()


def extract_metadata_via_mdls(file_path: Path):
    """Extract creation date and GPS coordinates using macOS mdls."""
    cmd = ["mdls", "-name", "kMDItemContentCreationDate", "-name", "kMDItemLatitude", "-name", "kMDItemLongitude", str(file_path)]
    out = run_cmd(cmd, check=False)
    
    date_str = None
    lat = None
    lon = None

    date_match = re.search(r"kMDItemContentCreationDate\s*=\s*(\d{4}-\d{2}-\d{2})", out)
    if date_match:
        date_str = date_match.group(1)

    lat_match = re.search(r"kMDItemLatitude\s*=\s*([+-]?\d+(?:\.\d+)?)", out)
    if lat_match:
        lat = float(lat_match.group(1))

    lon_match = re.search(r"kMDItemLongitude\s*=\s*([+-]?\d+(?:\.\d+)?)", out)
    if lon_match:
        lon = float(lon_match.group(1))

    return date_str, lat, lon


def reverse_geocode(lat: float, lon: float):
    """Reverse-geocode GPS coordinates via OpenStreetMap Nominatim."""
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        req = urllib.request.Request(url, headers={"User-Agent": "ElsewhereIngest/1.0 (ripul.jain@gmail.com)"})
        with urllib.request.urlopen(req, timeout=6) as response:
            data = json.loads(response.read().decode("utf-8"))
            addr = data.get("address", {})
            
            suburb = addr.get("suburb") or addr.get("neighbourhood") or addr.get("quarter")
            city = addr.get("city") or addr.get("town") or addr.get("village") or addr.get("county")
            state = addr.get("state")
            country = addr.get("country")
            
            parts = []
            if suburb and city and suburb != city:
                parts.append(suburb)
                parts.append(city)
            elif city:
                parts.append(city)
                if state:
                    parts.append(state)
                elif country:
                    parts.append(country)
            elif state and country:
                parts.append(state)
                parts.append(country)
            
            return ", ".join(parts) if parts else data.get("display_name", "")
    except Exception as err:
        print(f"  [Notice] Reverse geocoding failed: {err}")
        return None


def convert_and_resize(source_path: Path, dest_path: Path, max_long_edge: int = 1800, quality: int = 82):
    """Converts (HEIC/PNG/JPEG) and resizes to web-optimized JPEG using sips."""
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    temp_target = dest_path.with_suffix(".tmp.jpg")
    
    # 1. Convert to jpeg
    run_cmd(["sips", "-s", "format", "jpeg", "-s", "formatOptions", str(quality), str(source_path), "--out", str(temp_target)])
    
    # 2. Resize long edge if larger than max_long_edge
    dims_out = run_cmd(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(temp_target)])
    w_match = re.search(r"pixelWidth:\s*(\d+)", dims_out)
    h_match = re.search(r"pixelHeight:\s*(\d+)", dims_out)
    
    if w_match and h_match:
        w, h = int(w_match.group(1)), int(h_match.group(1))
        if max(w, h) > max_long_edge:
            run_cmd(["sips", "-Z", str(max_long_edge), str(temp_target)])
            dims_out = run_cmd(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(temp_target)])
            w = int(re.search(r"pixelWidth:\s*(\d+)", dims_out).group(1))
            h = int(re.search(r"pixelHeight:\s*(\d+)", dims_out).group(1))
    else:
        w, h = 1800, 1800

    if dest_path.exists():
        dest_path.unlink()
    temp_target.rename(dest_path)
    return w, h


def slugify(text: str) -> str:
    """Generate clean URL slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def update_image_meta(rel_path: str, width: int, height: int):
    """Add new dimensions into imageMeta.js."""
    content = IMAGE_META_JS_PATH.read_text(encoding="utf-8")
    entry_line = f'  "{rel_path}": {{ width: {width}, height: {height} }},'
    
    if entry_line in content:
        return
    
    # Insert right above other /Assets/Recents/ entries or before closing bracket
    recents_idx = content.find('"/Assets/Recents/')
    if recents_idx != -1:
        line_start = content.rfind("\n", 0, recents_idx) + 1
        content = content[:line_start] + entry_line + "\n" + content[line_start:]
    else:
        close_idx = content.find("};")
        line_start = content.rfind("\n", 0, close_idx) + 1
        content = content[:line_start] + entry_line + "\n" + content[line_start:]
        
    IMAGE_META_JS_PATH.write_text(content, encoding="utf-8")
    print(f"  [Updated] imageMeta.js with {rel_path} ({width}×{height})")


def update_recents_js(slug: str, date_str: str, rel_path: str, location: str, caption: str):
    """Prepend entry to RECENTS array in recents.js."""
    content = RECENTS_JS_PATH.read_text(encoding="utf-8")
    match = re.search(r"export const RECENTS = \[\n", content)
    if not match:
        raise ValueError("Could not locate 'export const RECENTS = [' in recents.js")
    
    insert_pos = match.end()
    new_entry = (
        f"  {{\n"
        f'    slug: "{slug}",\n'
        f'    date: "{date_str}",\n'
        f'    image: "{rel_path}",\n'
        f'    location: "{location}",\n'
        f'    caption: "{caption}",\n'
        f"  }},\n"
    )
    
    content = content[:insert_pos] + new_entry + content[insert_pos:]
    RECENTS_JS_PATH.write_text(content, encoding="utf-8")
    print(f"  [Updated] recents.js with '{slug}'")


def update_test_count():
    """Increment photo count expectation in tests/photo-aspect.spec.js to match RECENTS."""
    recents_text = RECENTS_JS_PATH.read_text(encoding="utf-8")
    total_entries = len(re.findall(r"slug:\s*\"", recents_text))
    
    spec_text = SPEC_TEST_PATH.read_text(encoding="utf-8")
    updated_spec = re.sub(
        r"(test\(\"Recents feed photos keep natural proportions\".*?toHaveCount\()\d+(\);.*?toBe\()\d+(\);)",
        rf"\g<1>{total_entries}\g<2>{total_entries}\g<3>",
        spec_text,
        flags=re.DOTALL
    )
    if updated_spec != spec_text:
        SPEC_TEST_PATH.write_text(updated_spec, encoding="utf-8")
        print(f"  [Updated] tests/photo-aspect.spec.js count to {total_entries}")


def process_image(file_path: Path, args):
    """Full pipeline for a single image."""
    print(f"\n--- Processing: {file_path.name} ---")
    
    # 1. Date & GPS
    exif_date, lat, lon = extract_metadata_via_mdls(file_path)
    date_str = args.date or exif_date or datetime.date.today().isoformat()
    
    # Location
    location = args.location
    if not location and lat is not None and lon is not None:
        print(f"  Coordinates found: {lat}, {lon}")
        location = reverse_geocode(lat, lon)
    if not location:
        location = input("  Enter location (e.g. 'South Loop, Chicago' or 'Estes Park, Colorado'): ").strip() if args.interactive else "Chicago, Illinois"

    # Slug
    slug = args.slug or slugify(f"{location}-{file_path.stem}")

    # Target filename in public/Assets/Recents/
    clean_stem = slug if (" " in file_path.stem or file_path.stem.lower() in {"jpeg image", "image", "photo"}) else file_path.stem
    out_name = f"{clean_stem}.jpeg" if file_path.suffix.lower() == ".jpeg" else f"{clean_stem}.jpg"
    dest_path = PUBLIC_RECENTS_DIR / out_name
    rel_path = f"/Assets/Recents/{out_name}"

    # 2. Resize & Adapt
    width, height = convert_and_resize(file_path, dest_path, max_long_edge=1800, quality=82)
    print(f"  Adapted: {dest_path.name} ({width}×{height}, {dest_path.stat().st_size} bytes)")

    # 3. Caption
    caption = args.caption
    if not caption:
        if args.interactive:
            print("\n  Write caption (~20-25 words, 1 verified factual detail, no feelings):")
            caption = input("  > ").strip()
        else:
            caption = f"Photograph in {location}, recorded on {date_str}."

    print(f"  Location: {location}")
    print(f"  Date: {date_str}")
    print(f"  Caption: {caption}")

    if args.dry_run:
        print("  [DRY RUN] Skipping file modifications, git commit, and PR creation.")
        return

    # 4. Update files
    update_image_meta(rel_path, width, height)
    update_recents_js(slug, date_str, rel_path, location, caption)
    update_test_count()

    # 5. Verification tests
    print("\n  Running test suite...")
    test_cmd = "node tests/css-height-auto.test.mjs && node tests/sitemap.test.mjs && npm run build"
    run_cmd(test_cmd)
    print("  ✓ Verification tests & build passed.")

    # 6. Git branch, commit, PR
    branch_name = f"cursor/recents-{slug}"
    print(f"\n  Git operations on branch: {branch_name}")
    run_cmd(f"git checkout -b {branch_name}")
    run_cmd(f'git add "{dest_path}" recents.js imageMeta.js tests/photo-aspect.spec.js')
    
    commit_msg = (
        f"Add {location} Recents photo\n\n"
        f"Web-sized {width}×{height} JPEG from ingest.\n"
        f"Slug: {slug}\n"
        f"Date: {date_str}\n\n"
        f"Co-authored-by: ripuljain-oss <ripul.jain@gmail.com>"
    )
    subprocess.run(["git", "commit", "-m", commit_msg], cwd=ROOT_DIR, check=True)
    run_cmd(f"git push -u origin {branch_name}")
    
    # 7. PR creation
    pr_body = (
        f"Adds new Travel Recents photo for **{location}**.\n\n"
        f"- Source: `{file_path.name}`\n"
        f"- Web image: `{rel_path}` ({width}×{height})\n"
        f"- Date: `{date_str}`\n"
        f"- Caption: {caption}\n\n"
        f"Automated build & tests verified."
    )
    pr_url = run_cmd([
        "gh", "pr", "create",
        "--title", f"Add {location} Recents photo",
        "--body", pr_body,
        "--head", branch_name,
        "--base", "main"
    ])
    print(f"  ✓ Created PR: {pr_url}")

    # 8. Auto-merge if not disabled
    if not args.no_merge:
        print("  Merging PR to main...")
        # Direct merge
        merge_res = run_cmd(["gh", "pr", "merge", branch_name, "--merge", "--delete-branch"], check=False)
        print(f"  Merge output: {merge_res}")
        run_cmd("git checkout main")
        run_cmd("git pull origin main")
        print("  ✓ Merged to main and synced.")

    # 9. Move original to processed folder
    processed_dir = file_path.parent / PROCESSED_SUBDIR
    processed_dir.mkdir(parents=True, exist_ok=True)
    shutil.move(str(file_path), str(processed_dir / file_path.name))
    print(f"  ✓ Moved original to {processed_dir / file_path.name}")


def main():
    parser = argparse.ArgumentParser(description="Elsewhere Recents Photo Ingest")
    parser.add_argument("--file", type=Path, help="Single image file to ingest")
    parser.add_argument("--folder", type=Path, default=DEFAULT_INGEST_DIR, help="Folder to scan for new photos")
    parser.add_argument("--location", help="Location override (e.g. 'South Loop, Chicago')")
    parser.add_argument("--caption", help="Caption text override")
    parser.add_argument("--slug", help="URL slug override")
    parser.add_argument("--date", help="Date override (YYYY-MM-DD)")
    parser.add_argument("--dry-run", action="store_true", help="Perform processing without modifying repo or pushing")
    parser.add_argument("--no-merge", action="store_true", help="Create PR but do not auto-merge")
    parser.add_argument("--interactive", action="store_true", help="Prompt for location/caption if missing")

    args = parser.parse_args()

    if args.file:
        if not args.file.exists():
            print(f"File not found: {args.file}", file=sys.stderr)
            sys.exit(1)
        process_image(args.file, args)
        return

    ingest_dir = args.folder
    if not ingest_dir.exists():
        print(f"Ingest folder does not exist: {ingest_dir}", file=sys.stderr)
        print("Creating it now...")
        ingest_dir.mkdir(parents=True, exist_ok=True)
        print("Done. Save photos from your iPhone into 'Elsewhere Ingest' in iCloud Drive.")
        return

    candidates = sorted([
        f for f in ingest_dir.iterdir()
        if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS and not f.name.startswith(".")
    ])

    if not candidates:
        print(f"No pending photos in {ingest_dir}")
        print("To add one, save a photo from your iPhone into 'Elsewhere Ingest' in iCloud Drive.")
        return

    print(f"Found {len(candidates)} photo(s) in {ingest_dir}")
    for cand in candidates:
        process_image(cand, args)


if __name__ == "__main__":
    main()
