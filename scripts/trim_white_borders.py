#!/usr/bin/env python3
"""
Trim white (or near-white) borders from images in a folder.
Saves in place. Uses Pillow + numpy; considers a pixel "white" if R,G,B >= threshold.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

# Treat pixel as border if all channels >= this (0-255). 248 = allow slight off-white.
WHITE_THRESHOLD = 248


def get_content_bbox(im, threshold=WHITE_THRESHOLD):
    """Return (left, upper, right, lower) bounding box of non-white pixels."""
    arr = np.array(im)
    if arr.ndim == 2:
        non_white = arr < threshold
    else:
        # RGB or RGBA: non-white where any channel < threshold
        non_white = np.any(arr[:, :, :3] < threshold, axis=2)
    if not np.any(non_white):
        return None
    rows = np.any(non_white, axis=1)
    cols = np.any(non_white, axis=0)
    y_min, y_max = np.where(rows)[0][[0, -1]]
    x_min, x_max = np.where(cols)[0][[0, -1]]
    return (int(x_min), int(y_min), int(x_max) + 1, int(y_max) + 1)


def trim_white_borders(path_in, path_out=None, threshold=WHITE_THRESHOLD):
    path_out = path_out or path_in
    im = Image.open(path_in).convert("RGB")
    bbox = get_content_bbox(im, threshold)
    if bbox is None:
        print(f"  (no non-white pixels in {path_in.name}, skipping)")
        return False
    cropped = im.crop(bbox)
    cropped.save(path_out, "JPEG", quality=95)
    return True


def main():
    # Default: public/Assets/Roatan (relative to project root)
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent
    folder = project_root / "public" / "Assets" / "Roatan"
    if not folder.is_dir():
        print(f"Folder not found: {folder}")
        sys.exit(1)

    extensions = {".jpg", ".jpeg", ".png"}
    files = sorted(f for f in folder.iterdir() if f.suffix.lower() in extensions and f.is_file())
    if not files:
        print(f"No image files in {folder}")
        sys.exit(0)

    print(f"Trimming white borders in {folder} ({len(files)} images)...")
    for f in files:
        trim_white_borders(f)
        print(f"  Trimmed: {f.name}")
    print("Done.")


if __name__ == "__main__":
    main()
