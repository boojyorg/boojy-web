#!/usr/bin/env python3
"""
Replace all ?v=... cache-busting strings with the current git commit hash.

Usage:
    python3 bump-cache.py          # update all HTML files
    python3 bump-cache.py --dry    # preview changes without writing
"""

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent

# Same page list as sync-partials.py
PAGES = [
    "public/privacy.html",
    "public/terms.html",
    "public/subscribed.html",
    "public/404.html",
]

VERSION_RE = re.compile(r"\?v=[a-zA-Z0-9_.-]+")


def get_git_hash() -> str:
    result = subprocess.run(
        ["git", "rev-parse", "--short", "HEAD"],
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    return result.stdout.strip()


def bump_file(rel_path: str, version: str, dry: bool) -> bool:
    filepath = ROOT / rel_path
    if not filepath.exists():
        print(f"  SKIP  {rel_path} (not found)")
        return False

    original = filepath.read_text()
    updated = VERSION_RE.sub(f"?v={version}", original)

    if updated == original:
        print(f"  OK    {rel_path} (no changes)")
        return False

    count = len(VERSION_RE.findall(original))
    if dry:
        print(f"  DRY   {rel_path} ({count} version strings)")
    else:
        filepath.write_text(updated)
        print(f"  BUMP  {rel_path} ({count} version strings → ?v={version})")
    return True


def main():
    dry = "--dry" in sys.argv
    version = get_git_hash()

    if not version:
        print("ERROR: Could not get git commit hash.")
        sys.exit(1)

    print(f"{'Preview' if dry else 'Bumping'} cache strings to ?v={version}\n")

    changed = 0
    for rel_path in PAGES:
        if bump_file(rel_path, version, dry):
            changed += 1

    print(f"\n{'Would update' if dry else 'Updated'} {changed} file(s).")


if __name__ == "__main__":
    main()
