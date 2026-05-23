#!/usr/bin/env python3
"""
Sync nav and footer partials across all HTML pages.

Usage:
    python3 sync-partials.py          # sync all pages
    python3 sync-partials.py --dry    # preview changes without writing

Reads partials/nav.html and partials/footer.html, then replaces the
matching blocks in each HTML page. Injects class="active" on the
appropriate nav link based on the page config below.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent

# Pages to sync and their active nav targets.
# Keys: relative path from ROOT. Values: dict with active link config.
#   "product"  — data-product value to mark active (Audio/Notes nav links)
#   "account"  — True to mark the Account link active
PAGES = {
    "public/cloud/index.html":    {},
    "public/account/index.html":  {"account": True},
    "public/privacy.html":        {},
    "public/terms.html":          {},
    "public/subscribed.html":     {},
    "public/404.html":            {},
}

# Regex patterns for nav and footer blocks
NAV_RE = re.compile(
    r"([ \t]*)<!-- Navigation -->.*?</nav>",
    re.DOTALL,
)
FOOTER_RE = re.compile(
    r"([ \t]*)<!-- Footer -->.*?</footer>",
    re.DOTALL,
)


def load_partial(name: str) -> str:
    path = ROOT / "partials" / name
    return path.read_text()


def inject_active(nav_html: str, config: dict) -> str:
    """Add class="active" to the appropriate nav links."""
    result = nav_html

    product = config.get("product")
    if product:
        # Desktop nav-product link
        result = result.replace(
            f'class="nav-product" data-product="{product}"',
            f'class="nav-product active" data-product="{product}"',
        )
        # Mobile nav-mobile-link
        result = result.replace(
            f'class="nav-mobile-link" data-product="{product}"',
            f'class="nav-mobile-link active" data-product="{product}"',
        )

    if config.get("account"):
        result = result.replace(
            'class="nav-signin"',
            'class="nav-signin active"',
        )
        result = result.replace(
            '<a href="/account/" class="nav-mobile-link">',
            '<a href="/account/" class="nav-mobile-link active">',
        )

    return result


def sync_page(rel_path: str, config: dict, nav_partial: str, footer_partial: str, dry: bool) -> bool:
    filepath = ROOT / rel_path
    if not filepath.exists():
        print(f"  SKIP  {rel_path} (not found)")
        return False

    original = filepath.read_text()
    html = original

    # Replace nav
    nav_with_active = inject_active(nav_partial, config)
    nav_match = NAV_RE.search(html)
    if nav_match:
        indent = nav_match.group(1)
        # Re-indent if the partial indentation differs
        replacement = nav_with_active.rstrip()
        html = html[:nav_match.start()] + replacement + html[nav_match.end():]
    else:
        print(f"  WARN  {rel_path}: nav block not found")

    # Replace footer
    footer_match = FOOTER_RE.search(html)
    if footer_match:
        replacement = footer_partial.rstrip()
        html = html[:footer_match.start()] + replacement + html[footer_match.end():]
    else:
        print(f"  WARN  {rel_path}: footer block not found")

    if html == original:
        print(f"  OK    {rel_path} (no changes)")
        return False

    if dry:
        print(f"  DRY   {rel_path} (would update)")
    else:
        filepath.write_text(html)
        print(f"  SYNC  {rel_path}")
    return True


def main():
    dry = "--dry" in sys.argv

    nav_partial = load_partial("nav.html")
    footer_partial = load_partial("footer.html")

    print(f"Syncing {'(dry run) ' if dry else ''}nav + footer across {len(PAGES)} pages...\n")

    changed = 0
    for rel_path, config in PAGES.items():
        if sync_page(rel_path, config, nav_partial, footer_partial, dry):
            changed += 1

    print(f"\n{'Would update' if dry else 'Updated'} {changed} file(s).")


if __name__ == "__main__":
    main()
