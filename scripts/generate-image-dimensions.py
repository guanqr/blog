#!/usr/bin/env python3
"""
生成正文图片尺寸表 data/image_dimensions.json（LQIP 布局用）。
扫描 static/images 下 jpg/jpeg/png，写入公开路径 -> {width, height}。

新增或替换图片后运行：
    python scripts/generate-image-dimensions.py

依赖 Pillow（pip install Pillow）。尺寸表缺失的图片仍会走 AVIF/WebP
与原生懒加载，只是没有低清占位层。
"""

import json
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Please install Pillow: pip install Pillow")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "static" / "images"
OUT = ROOT / "data" / "image_dimensions.json"
EXTS = {".jpg", ".jpeg", ".png"}


def main():
    if not SRC.is_dir():
        print(f"Error: source directory not found: {SRC}")
        sys.exit(1)

    dimensions = {}
    skipped = 0
    for path in sorted(SRC.rglob("*")):
        if path.suffix.lower() not in EXTS:
            continue
        try:
            with Image.open(path) as img:
                width, height = img.size
                # 浏览器按 EXIF Orientation 旋转显示；方向 5–8 需交换宽高
                orientation = img.getexif().get(274, 1)
                if orientation in (5, 6, 7, 8):
                    width, height = height, width
        except Exception as exc:
            print(f"Skip {path}: {exc}")
            skipped += 1
            continue
        key = "/" + path.relative_to(ROOT / "static").as_posix()
        dimensions[key] = {"width": width, "height": height}

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dimensions, f, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        f.write("\n")

    print(f"Wrote {len(dimensions)} entries to {OUT.relative_to(ROOT)} (skipped {skipped})")


if __name__ == "__main__":
    main()
