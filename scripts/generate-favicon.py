#!/usr/bin/env python3
"""
Build the Elsewhere favicon set from the RMNP hero already used as og:image.

Source: public/Assets/RMNP/DSC_3271.jpg
Crop: square of the ridgeline + forest band (reads at 16px; same photo as social).
Small sizes: full-bleed crop with a gold #C8A96E rule.
Apple-touch / 192: warm-paper mat + gold rule (journal print, iOS home screen).
"""
from __future__ import annotations

import io
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "Assets" / "RMNP" / "DSC_3271.jpg"
OUT = ROOT / "public"

# 2400×1597 hero — square of peaks against sky, forest along the bottom for contrast.
CROP_LEFT, CROP_TOP, CROP_SIZE = 680, 8, 1024

PAPER = (247, 244, 239)  # #F7F4EF
GOLD = (200, 169, 110)  # #C8A96E


def load_crop() -> Image.Image:
    src = Image.open(SOURCE).convert("RGB")
    return src.crop((CROP_LEFT, CROP_TOP, CROP_LEFT + CROP_SIZE, CROP_TOP + CROP_SIZE))


def tune(img: Image.Image, size: int) -> Image.Image:
    if size <= 48:
        img = ImageEnhance.Contrast(img).enhance(1.2)
        img = ImageEnhance.Color(img).enhance(1.1)
        img = ImageEnhance.Sharpness(img).enhance(1.2)
    else:
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Color(img).enhance(1.04)
    return img


def gold_border(img: Image.Image, width: int) -> Image.Image:
    draw = ImageDraw.Draw(img)
    w, h = img.size
    for i in range(width):
        draw.rectangle([i, i, w - 1 - i, h - 1 - i], outline=GOLD)
    return img


def tab_icon(master: Image.Image, size: int) -> Image.Image:
    img = tune(master.copy(), size).resize((size, size), Image.Resampling.LANCZOS)
    return gold_border(img, 1 if size <= 32 else max(2, round(size * 0.035)))


def home_icon(master: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGB", (size, size), PAPER)
    mat = max(6, round(size * 0.07))
    gold = max(2, round(size * 0.016))
    inset = mat + gold + max(3, round(size * 0.02))
    photo_size = size - inset * 2
    photo = tune(master.copy(), size).resize((photo_size, photo_size), Image.Resampling.LANCZOS)
    canvas.paste(photo, (inset, inset))
    draw = ImageDraw.Draw(canvas)
    g0 = mat
    g1 = size - 1 - mat
    for i in range(gold):
        draw.rectangle([g0 + i, g0 + i, g1 - i, g1 - i], outline=GOLD)
    return canvas


def save_ico(path: Path, images: list[Image.Image]) -> None:
    blobs = []
    for im in images:
        buf = io.BytesIO()
        im.save(buf, format="PNG")
        blobs.append(buf.getvalue())
    offset = 6 + 16 * len(images)
    with path.open("wb") as fh:
        fh.write(struct.pack("<HHH", 0, 1, len(images)))
        cursor = offset
        for im, data in zip(images, blobs):
            w, h = im.size
            fh.write(
                struct.pack(
                    "<BBBBHHII",
                    w if w < 256 else 0,
                    h if h < 256 else 0,
                    0,
                    0,
                    1,
                    32,
                    len(data),
                    cursor,
                )
            )
            cursor += len(data)
        for data in blobs:
            fh.write(data)


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"missing source photo: {SOURCE}")
    master = load_crop()
    png16 = tab_icon(master, 16)
    png32 = tab_icon(master, 32)
    png48 = tab_icon(master, 48)
    png16.save(OUT / "favicon-16x16.png", optimize=True)
    png32.save(OUT / "favicon-32x32.png", optimize=True)
    home_icon(master, 180).save(OUT / "apple-touch-icon.png", optimize=True)
    home_icon(master, 192).save(OUT / "icon-192.png", optimize=True)
    save_ico(OUT / "favicon.ico", [png16, png32, png48])
    print("wrote favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, icon-192.png")


if __name__ == "__main__":
    main()
