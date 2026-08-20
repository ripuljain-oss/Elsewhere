#!/usr/bin/env bash
# Publish web JPEGs: Assets/<Trip> → public/Assets/<Trip>
# Usage (repo root): ./scripts/resize-assets.sh RMNP
#                    ./scripts/resize-assets.sh            # every folder under Assets/
# Long edge 2400px (sips -Z 2400); JPEG quality 78.
# Skips a file if the public copy already exists and is under ~2MB.
# Does not rewrite originals in Assets/. JPG/JPEG only.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_ROOT="$ROOT/Assets"
DST_ROOT="$ROOT/public/Assets"
MAX_BYTES=$((2 * 1024 * 1024))
QUALITY=78

if [[ ! -d "$SRC_ROOT" ]]; then
  echo "Missing $SRC_ROOT" >&2
  exit 1
fi

process_file() {
  local src="$1"
  local dst="$2"
  local dest_dir
  dest_dir="$(dirname "$dst")"
  mkdir -p "$dest_dir"

  if [[ -f "$dst" ]]; then
    local existing
    existing="$(stat -f%z "$dst" 2>/dev/null || stat -c%s "$dst")"
    if (( existing < MAX_BYTES )); then
      echo "skip  $(basename "$dst")  (public copy ${existing} bytes)"
      return 0
    fi
  fi

  local src_size
  src_size="$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src")"
  if (( src_size < MAX_BYTES )); then
    cp "$src" "$dst"
    echo "copy  $(basename "$dst")  (already ${src_size} bytes)"
    return 0
  fi

  cp "$src" "$dst"
  sips -Z 2400 -s format jpeg -s formatOptions "$QUALITY" "$dst" >/dev/null
  local out_size
  out_size="$(stat -f%z "$dst" 2>/dev/null || stat -c%s "$dst")"
  echo "resize  $(basename "$dst")  ${src_size} → ${out_size} bytes"
}

process_trip() {
  local trip="$1"
  local src_dir="$SRC_ROOT/$trip"
  local dst_dir="$DST_ROOT/$trip"
  if [[ ! -d "$src_dir" ]]; then
    echo "No source folder: $src_dir" >&2
    return 1
  fi
  echo "== $trip"
  local f
  local count=0
  shopt -s nullglob
  for f in "$src_dir"/*.[jJ][pP][gG] "$src_dir"/*.[jJ][pP][eE][gG]; do
    [[ -f "$f" ]] || continue
    process_file "$f" "$dst_dir/$(basename "$f")"
    count=$((count + 1))
  done
  shopt -u nullglob
  echo "($count JPEG(s))"
}

if [[ $# -gt 0 ]]; then
  for trip in "$@"; do
    process_trip "$trip"
  done
else
  shopt -s nullglob
  for dir in "$SRC_ROOT"/*/; do
    trip="$(basename "$dir")"
    [[ "$trip" == .* ]] && continue
    process_trip "$trip"
  done
  shopt -u nullglob
fi
