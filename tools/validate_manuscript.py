#!/usr/bin/env python3
"""Regression guard for `manuscript_html/index.html`.

Runs four checks that earlier iterations had to run by hand, so that
silent regressions of the iter-21 (CSS scoping) and iter-27 (inventory
inflation) classes are caught at authoring time rather than at read time.

Checks
------
1. HTML well-formedness. A void-element-aware tag-stack traversal of the
   file; any unclosed non-void start-tag at EOF or any stray end-tag is
   an error. (Iter-25 ran this manually; iter-26 discovered a void-element
   bug in the iter-25 ad-hoc parser, which is fixed here by using the
   authoritative HTML void-element list.)

2. Anchor integrity. Every `href="#<id>"` resolves to an `id="<id>"`
   elsewhere in the document. Broken anchors are a publication-facing
   regression a reader notices first.

3. Placeholder inventory. Reports the `<span class="placeholder-value">`
   span count and the total bracketed-token count, so that a future
   iteration can diff the counts against a recorded baseline and see
   at-a-glance whether the current pass introduced new placeholders.

4. Placeholder-value-scope linter. The rule committed at iter-27 is:
   `<span class="placeholder-value">` may only appear in body prose.
   It MUST NOT appear inside `<dd>` or `<footer>` (editorial descriptions
   that list placeholders for claim-preservation audit use plain
   `<code>` formatting instead). Violations inflate the inventory count
   without carrying resolution paths.

Exit status: 0 on pass, 1 on any check failure. Counts are printed in
all cases so that an iteration can record the current inventory.

Run
---
    python3 tools/validate_manuscript.py manuscript_html/index.html
"""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

# Authoritative HTML void elements (https://html.spec.whatwg.org/#void-elements).
VOID_ELEMENTS: frozenset[str] = frozenset(
    {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    }
)

# Inline elements allowed in foreign-content contexts where we do not
# enforce well-formedness (SVG uses its own tag set; we trust the authors
# to emit well-formed SVG since the file is served as HTML5).
SVG_ROOT = "svg"


class TagStackParser(HTMLParser):
    """Records unclosed start-tags and orphan end-tags."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, int]] = []  # (tag, line)
        self.errors: list[str] = []
        self._svg_depth = 0

    def handle_starttag(self, tag: str, attrs):  # type: ignore[override]
        if tag == SVG_ROOT:
            self._svg_depth += 1
            self.stack.append((tag, self.getpos()[0]))
            return
        if self._svg_depth > 0:
            # Don't enforce inside SVG; svg is its own language and
            # self-closing shorthand is legal.
            return
        if tag in VOID_ELEMENTS:
            return
        self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag: str):  # type: ignore[override]
        if tag == SVG_ROOT:
            self._svg_depth = max(0, self._svg_depth - 1)
        if self._svg_depth > 0 and tag != SVG_ROOT:
            return
        if tag in VOID_ELEMENTS:
            return
        if not self.stack:
            self.errors.append(
                f"line {self.getpos()[0]}: stray </{tag}> with empty stack"
            )
            return
        # Walk back to the nearest matching open tag; anything skipped is
        # an unclosed-tag error.
        for depth, (open_tag, open_line) in enumerate(reversed(self.stack)):
            if open_tag == tag:
                # Close from top to this depth.
                popped = self.stack[-(depth + 1) :]
                del self.stack[-(depth + 1) :]
                for skipped_tag, skipped_line in popped[:-1]:
                    self.errors.append(
                        f"line {skipped_line}: unclosed <{skipped_tag}> "
                        f"(jumped over by </{tag}> at line {self.getpos()[0]})"
                    )
                return
        # No match found anywhere in stack.
        self.errors.append(
            f"line {self.getpos()[0]}: </{tag}> with no matching open tag"
        )

    def handle_startendtag(self, tag: str, attrs):  # type: ignore[override]
        # <tag/> is always well-formed.
        pass


def check_html_wellformed(text: str) -> tuple[bool, list[str]]:
    parser = TagStackParser()
    parser.feed(text)
    errors = list(parser.errors)
    for tag, line in parser.stack:
        errors.append(f"line {line}: unclosed <{tag}> at EOF")
    return (not errors, errors)


ID_ATTR_RE = re.compile(r'\bid="([^"]+)"')
HREF_HASH_RE = re.compile(r'\bhref="#([^"]+)"')


def check_anchor_integrity(text: str) -> tuple[bool, dict[str, int], list[str]]:
    ids = set(ID_ATTR_RE.findall(text))
    hrefs = HREF_HASH_RE.findall(text)
    missing = sorted({h for h in hrefs if h not in ids})
    stats = {
        "anchors_total": len(hrefs),
        "anchors_unique": len(set(hrefs)),
        "ids_defined": len(ids),
        "broken": len(missing),
    }
    return (len(missing) == 0, stats, missing)


PLACEHOLDER_SPAN_RE = re.compile(
    r'<span[^>]*class="[^"]*\bplaceholder-value\b[^"]*"[^>]*>'
)
BRACKET_TOKEN_RE = re.compile(r"\[[A-Za-z0-9_./:,\-\s]+\]")


def check_placeholder_inventory(text: str) -> dict[str, int]:
    return {
        "placeholder_value_spans": len(PLACEHOLDER_SPAN_RE.findall(text)),
        "bracketed_tokens": len(BRACKET_TOKEN_RE.findall(text)),
    }


# Linter: placeholder-value span inside <dd> or <footer> is a regression.
# Uses a narrow context-tracking HTML parser.
class PlaceholderScopeLinter(HTMLParser):
    FORBIDDEN = frozenset({"dd", "footer"})

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ctx: list[str] = []
        self.violations: list[str] = []

    def handle_starttag(self, tag: str, attrs):  # type: ignore[override]
        if tag in VOID_ELEMENTS:
            if tag == "span":
                pass
            attrs_d = dict(attrs)
            cls = attrs_d.get("class", "") or ""
            if "placeholder-value" in cls.split():
                for ancestor in self.ctx:
                    if ancestor in self.FORBIDDEN:
                        self.violations.append(
                            f"line {self.getpos()[0]}: "
                            f"placeholder-value span inside <{ancestor}>"
                        )
                        break
            return
        self.ctx.append(tag)
        if tag == "span":
            attrs_d = dict(attrs)
            cls = attrs_d.get("class", "") or ""
            if "placeholder-value" in cls.split():
                for ancestor in self.ctx[:-1]:
                    if ancestor in self.FORBIDDEN:
                        self.violations.append(
                            f"line {self.getpos()[0]}: "
                            f"placeholder-value span inside <{ancestor}>"
                        )
                        break

    def handle_endtag(self, tag: str):  # type: ignore[override]
        if tag in VOID_ELEMENTS:
            return
        for i in range(len(self.ctx) - 1, -1, -1):
            if self.ctx[i] == tag:
                del self.ctx[i:]
                return


def check_placeholder_value_scope(text: str) -> tuple[bool, list[str]]:
    linter = PlaceholderScopeLinter()
    linter.feed(text)
    return (not linter.violations, linter.violations)


def run(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    disk_bytes = len(text.encode("utf-8"))
    print(f"== Validating {path} ({disk_bytes} bytes) ==")

    wf_ok, wf_errors = check_html_wellformed(text)
    print(f"[1/4] HTML well-formed: {'PASS' if wf_ok else 'FAIL'} "
          f"(errors={len(wf_errors)})")
    for e in wf_errors[:20]:
        print(f"      {e}")
    if len(wf_errors) > 20:
        print(f"      ... {len(wf_errors) - 20} more")

    ai_ok, ai_stats, ai_missing = check_anchor_integrity(text)
    print(
        f"[2/4] Anchor integrity: {'PASS' if ai_ok else 'FAIL'} "
        f"(total={ai_stats['anchors_total']}, "
        f"unique={ai_stats['anchors_unique']}, "
        f"ids={ai_stats['ids_defined']}, "
        f"broken={ai_stats['broken']})"
    )
    for m in ai_missing[:20]:
        print(f"      broken href=\"#{m}\"")
    if len(ai_missing) > 20:
        print(f"      ... {len(ai_missing) - 20} more")

    inv = check_placeholder_inventory(text)
    print(
        f"[3/4] Placeholder inventory: "
        f"placeholder-value spans={inv['placeholder_value_spans']}, "
        f"bracketed tokens={inv['bracketed_tokens']}"
    )

    sc_ok, sc_violations = check_placeholder_value_scope(text)
    print(
        f"[4/4] Placeholder-value scope: "
        f"{'PASS' if sc_ok else 'FAIL'} "
        f"(violations={len(sc_violations)})"
    )
    for v in sc_violations[:20]:
        print(f"      {v}")
    if len(sc_violations) > 20:
        print(f"      ... {len(sc_violations) - 20} more")

    all_ok = wf_ok and ai_ok and sc_ok
    print(f"== Overall: {'PASS' if all_ok else 'FAIL'} ==")
    return 0 if all_ok else 1


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        default = Path(__file__).parent.parent / "manuscript_html" / "index.html"
        if default.exists():
            return run(default)
        print("usage: validate_manuscript.py <path-to-html>", file=sys.stderr)
        return 2
    return run(Path(argv[1]))


if __name__ == "__main__":
    sys.exit(main(sys.argv))
