"""Extrait la partie blanche d'un picto craie (fond noir) → PNG transparent."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image


def extract_white_chalk(
    src: Path,
    dest: Path,
    threshold: int = 45,
    crop: bool = True,
    padding: int = 8,
    min_row_pixels: int = 6,
) -> None:
    img = Image.open(src).convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    rgb = arr[..., :3]
    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]

    opaque = lum > threshold
    out = np.zeros_like(arr, dtype=np.uint8)
    out[opaque, 0] = 255
    out[opaque, 1] = 255
    out[opaque, 2] = 255
    out[opaque, 3] = 255

    result = Image.fromarray(out, 'RGBA')

    if crop:
        mask = out[..., 3] > 0
        row_counts = mask.sum(axis=1)
        col_counts = mask.sum(axis=0)
        rows = np.where(row_counts >= min_row_pixels)[0]
        cols = np.where(col_counts >= min_row_pixels)[0]
        if rows.size and cols.size:
            y0, y1 = int(rows[0]), int(rows[-1]) + 1
            x0, x1 = int(cols[0]), int(cols[-1]) + 1
            result = result.crop((
                max(0, x0 - padding),
                max(0, y0 - padding),
                min(result.width, x1 + padding),
                min(result.height, y1 + padding),
            ))

    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, optimize=True)
    print(f'Saved {dest} ({dest.stat().st_size} bytes, {result.size[0]}x{result.size[1]})')


if __name__ == '__main__':
    src = Path(sys.argv[1])
    for dest_str in sys.argv[2:]:
        extract_white_chalk(src, Path(dest_str))
