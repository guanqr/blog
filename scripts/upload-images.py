#!/usr/bin/env python3
"""
Upload static/images/ to Alibaba Cloud OSS.
Uses a local cache (.upload-cache.json) to skip unchanged files.

Requires: pip install oss2

Usage:
    python scripts/upload-images.py
    python scripts/upload-images.py --config oss_config.json --source static/images
"""

import sys
import json
import argparse
import hashlib
from pathlib import Path

try:
    import oss2
except ImportError:
    print("Please install oss2: pip install oss2")
    sys.exit(1)

CACHE_FILE = ".upload-cache.json"
EXTENSIONS = {".jpg", ".jpeg", ".jfif", ".png", ".gif", ".svg", ".webp", ".ico", ".bmp"}


def load_json(path):
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def file_md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def upload_images(source_dir, config):
    auth = oss2.Auth(config["access_key_id"], config["access_key_secret"])
    bucket = oss2.Bucket(auth, config["endpoint"], config["bucket_name"])

    source = Path(source_dir).resolve()
    if not source.is_dir():
        print(f"Error: source directory not found: {source_dir}")
        sys.exit(1)

    cache = load_json(CACHE_FILE)
    base = source.parent

    # collect all image files
    files = []
    for img in source.rglob("*"):
        if img.suffix.lower() in EXTENSIONS:
            files.append(img)

    total = len(files)
    print(f"Found {total} images. Checking for changes...")

    # check local cache + remote
    to_upload = []
    new_cache = {}
    checked = 0
    skipped_cache = 0
    skipped_remote = 0

    for img in files:
        key = str(img.relative_to(base)).replace("\\", "/")
        mtime = img.stat().st_mtime
        size = img.stat().st_size

        # fast path: same mtime+size as last upload -> skip
        cached = cache.get(key)
        if cached and cached.get("mtime") == mtime and cached.get("size") == size:
            new_cache[key] = cached
            skipped_cache += 1
            continue

        md5 = file_md5(img)
        new_cache[key] = {"mtime": mtime, "size": size, "md5": md5}

        # check remote
        try:
            remote = bucket.head_object(key)
            remote_md5 = remote.headers.get("Content-MD5", "").strip('"').upper()
            if md5 == remote_md5:
                skipped_remote += 1
                continue
        except (oss2.exceptions.NotFound, oss2.exceptions.ServerError):
            pass
        except Exception:
            pass

        to_upload.append((img, key))
        checked += 1

    save_json(CACHE_FILE, new_cache)

    print(f"Checked {total}: {len(to_upload)} to upload, "
          f"{skipped_cache} cached, {skipped_remote} same on remote\n")

    if not to_upload:
        print("All files up to date.")
        return

    uploaded = 0
    errors = 0
    for i, (img, key) in enumerate(to_upload):
        try:
            bucket.put_object_from_file(key, str(img))
            uploaded += 1
            print(f"  [{uploaded}/{len(to_upload)}] {key}")
        except Exception as e:
            print(f"  error: {key} ({e})")
            errors += 1

    cdn = f"https://{config['bucket_name']}.oss-cn-hangzhou.aliyuncs.com"
    print(f"\nDone: {uploaded} uploaded, {skipped_cache + skipped_remote} skipped, {errors} errors")
    print(f"CDN: {cdn}/images/")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload static/images/ to OSS")
    parser.add_argument("--config", default="oss_config.json", help="Path to oss_config.json")
    parser.add_argument("--source", default="static/images", help="Local images directory")
    args = parser.parse_args()

    config = load_json(args.config)
    upload_images(args.source, config)
