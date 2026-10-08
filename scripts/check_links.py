#!/usr/bin/env python3
"""Check that every local link, script, stylesheet and image in the site's
HTML (and every image in README.md) points at a file that exists, and that
same-page and cross-page #anchors match an id. Standard library only."""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("name"):
            self.ids.add(a["name"])
        for key in ("href", "src"):
            if a.get(key):
                self.refs.append(a[key])


def parse(path):
    c = Collector()
    c.feed(path.read_text(encoding="utf-8"))
    return c


def main():
    pages = sorted(ROOT.glob("*.html"))
    parsed = {p: parse(p) for p in pages}
    errors = []
    for page, c in parsed.items():
        for ref in c.refs:
            parts = urlsplit(ref)
            if parts.scheme or ref.startswith("//") or ref == "#":
                continue
            target = (page.parent / unquote(parts.path)).resolve() if parts.path else page
            if not target.exists():
                errors.append(f"{page.name}: missing file {ref}")
                continue
            if parts.fragment and target.suffix == ".html":
                ids = parsed[target].ids if target in parsed else parse(target).ids
                if parts.fragment not in ids:
                    errors.append(f"{page.name}: missing anchor {ref}")
    readme = ROOT / "README.md"
    if readme.exists():
        for img in re.findall(r"!\[[^\]]*\]\(([^)\s]+)", readme.read_text(encoding="utf-8")):
            if "://" not in img and not (ROOT / img).exists():
                errors.append(f"README.md: missing image {img}")
    for e in errors:
        print(e)
    print(f"Checked {len(pages)} pages: {len(errors)} problem(s).")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
