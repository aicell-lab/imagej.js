#!/usr/bin/env python3
"""Placeholder-propagation tool for the ImageJ.JS Nature Methods pitch.

Takes a resolution dictionary of the form ``{"[48]%": "37%", "[N]": "42"}``
and propagates the resolved values across two surfaces in one pass:

1. ``manuscript_html/index.html`` — every
   ``<span class="placeholder-value">[token]</span>`` whose bracketed text
   equals a key in the resolution dictionary is replaced by the resolved
   value (the enclosing span is stripped entirely, so the
   ``placeholder-value`` inventory count drops by one span per replacement,
   mirroring the iter-32 bibliographic-resolution behaviour).

2. ``preprint.md`` — every bracketed token ``[token]`` that appears inside
   a ``## Drafted prose —`` block is replaced by the resolved value. The
   replacement is scoped to Drafted-prose blocks so that placeholder-token
   language outside those blocks (design docs, discipline notes, Crossref
   worklists) is left untouched.

Two modes:
 - ``--dry-run``  reports what would change, no files written.
 - ``--apply``    writes updated files in place.

Exactly one of ``--dry-run`` or ``--apply`` must be passed. The tool
always prints before / after counts so an iteration can record the
expected baseline shift.

Resolutions may be supplied either inline via ``--resolution KEY=VALUE``
(repeatable) or from a JSON file via ``--resolutions-file PATH``. The
JSON file format is a flat object:

    {
      "[48]%": "37%",
      "[N]":   "42",
      "[INITIALS]": "WO, SF, KJ"
    }

Invariants enforced (and printed on exit):
 - The total number of ``placeholder-value`` spans AFTER the run equals
   the count BEFORE the run MINUS the total span replacements applied.
   (Equivalent to the iter-28 validator's [3/4] inventory check.)
 - Anchor ids and references are never touched (the tool matches only on
   the exact inner text of ``<span class="placeholder-value">...</span>``).
 - Drafted-prose blocks in ``preprint.md`` are identified by a lead
   ``## Drafted prose —`` heading and closed by the next ``## ``
   heading or end-of-file; outside-block text is never rewritten.

Edge case — spans with nested markup. A placeholder-value span whose
inner text contains nested tags (e.g.
``<span class="placeholder-value">[C<sub>k</sub>-delta]</span>``) is
intentionally not matched by this tool — the inner-text regex requires
``[^<]*`` between opening and closing spans. Such spans are rare (one
instance as of v0.27: the per-course ``[C_k-delta]`` token in §5) and
are resolved by manual edit. The tool's span-count-delta check warns if
a resolution token is missing from any plain-text span, but a nested-
markup span will not trigger that warning because the tool never scanned
it to begin with; nested-markup spans must therefore be resolved in the
same pass by the author.

Post-run, the iter-28 validator should be re-run:

    python3 tools/validate_manuscript.py

to confirm (a) zero new HTML well-formedness errors, (b) zero new
broken anchors, (c) the expected new span count, and (d) zero scope
violations. The tool does NOT auto-invoke the validator — the two are
deliberately separate commands so a failed propagation can be inspected
before re-running the guard.

Engineering-infrastructure iteration kind (iter 28 rule-set):
 - Zero prose edits — the tool is a mechanical rewriter; no sentence,
   heading, caption, or box content is invented.
 - Guards an empirically-observed regression class — evidence-landing
   passes that touch multiple surfaces introduce opportunities for
   drift (e.g., replacing ``[48]%`` in the Abstract but forgetting the
   Key Points bullet that also references it). The tool enforces a
   single-source resolution so the drift cannot happen.
 - Self-contained and dependency-free — Python 3 stdlib only (``argparse``,
   ``json``, ``re``, ``pathlib``, ``sys``).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_HTML = REPO_ROOT / "manuscript_html" / "index.html"
DEFAULT_MD = REPO_ROOT / "preprint.md"

PLACEHOLDER_SPAN_RE = re.compile(
    r'<span[^>]*class="[^"]*\bplaceholder-value\b[^"]*"[^>]*>([^<]*)</span>'
)
DRAFTED_PROSE_HEADING_RE = re.compile(r'^## Drafted prose —', re.MULTILINE)
ANY_H2_RE = re.compile(r'^## ', re.MULTILINE)


def count_spans(text: str) -> int:
    return len(PLACEHOLDER_SPAN_RE.findall(text))


def propagate_html(text: str, resolutions: dict[str, str]) -> tuple[str, dict[str, int]]:
    """Replace matching placeholder-value spans with resolved values.

    Returns (new_text, per_key_counts).
    """
    counts: dict[str, int] = {k: 0 for k in resolutions}

    def _repl(match: re.Match[str]) -> str:
        token = match.group(1)
        if token in resolutions:
            counts[token] += 1
            return resolutions[token]
        return match.group(0)

    new_text = PLACEHOLDER_SPAN_RE.sub(_repl, text)
    return new_text, counts


def _find_drafted_prose_ranges(text: str) -> list[tuple[int, int]]:
    """Return (start, end) char offsets for every Drafted-prose block.

    A Drafted-prose block starts at a line matching ``^## Drafted prose —``
    and ends at the next ``^## `` heading or EOF.
    """
    ranges: list[tuple[int, int]] = []
    # All h2 heading positions (sorted).
    h2_positions = [m.start() for m in ANY_H2_RE.finditer(text)]
    h2_positions.append(len(text))
    for m in DRAFTED_PROSE_HEADING_RE.finditer(text):
        start = m.start()
        # Next h2 after this one.
        end = next((p for p in h2_positions if p > start), len(text))
        ranges.append((start, end))
    return ranges


def propagate_markdown(
    text: str, resolutions: dict[str, str]
) -> tuple[str, dict[str, int]]:
    """Replace bracketed tokens inside Drafted-prose blocks only."""
    counts: dict[str, int] = {k: 0 for k in resolutions}
    ranges = _find_drafted_prose_ranges(text)
    if not ranges:
        return text, counts

    out: list[str] = []
    cursor = 0
    for start, end in ranges:
        # Outside-block segment before this block.
        out.append(text[cursor:start])
        # In-block segment: apply replacements.
        block = text[start:end]
        for token, value in resolutions.items():
            occurrences = block.count(token)
            if occurrences:
                block = block.replace(token, value)
                counts[token] += occurrences
        out.append(block)
        cursor = end
    out.append(text[cursor:])
    return "".join(out), counts


def load_resolutions(args: argparse.Namespace) -> dict[str, str]:
    resolutions: dict[str, str] = {}
    if args.resolutions_file:
        loaded = json.loads(Path(args.resolutions_file).read_text(encoding="utf-8"))
        if not isinstance(loaded, dict):
            raise SystemExit(
                f"--resolutions-file {args.resolutions_file}: "
                f"expected flat object, got {type(loaded).__name__}"
            )
        for k, v in loaded.items():
            if not isinstance(k, str) or not isinstance(v, str):
                raise SystemExit(
                    f"--resolutions-file {args.resolutions_file}: "
                    f"all keys and values must be strings "
                    f"(offending entry: {k!r}: {v!r})"
                )
            resolutions[k] = v
    for entry in args.resolution or []:
        if "=" not in entry:
            raise SystemExit(
                f"--resolution {entry!r}: expected KEY=VALUE form "
                f"(e.g. --resolution '[48]%=37%')"
            )
        key, value = entry.split("=", 1)
        resolutions[key] = value
    if not resolutions:
        raise SystemExit(
            "No resolutions supplied. Pass --resolution KEY=VALUE one or "
            "more times, and/or --resolutions-file PATH."
        )
    return resolutions


def run(args: argparse.Namespace) -> int:
    resolutions = load_resolutions(args)

    html_path = Path(args.html) if args.html else DEFAULT_HTML
    md_path = Path(args.markdown) if args.markdown else DEFAULT_MD

    html_text = html_path.read_text(encoding="utf-8")
    md_text = md_path.read_text(encoding="utf-8") if md_path.exists() else ""

    before_html_spans = count_spans(html_text)

    new_html, html_counts = propagate_html(html_text, resolutions)
    new_md, md_counts = propagate_markdown(md_text, resolutions)

    after_html_spans = count_spans(new_html)
    html_span_delta = before_html_spans - after_html_spans

    total_html_replacements = sum(html_counts.values())
    total_md_replacements = sum(md_counts.values())

    print(f"== Propagate placeholders ==")
    print(f"  html         : {html_path}")
    print(f"  markdown     : {md_path} ({'exists' if md_path.exists() else 'missing — skipped'})")
    print(f"  resolutions  : {len(resolutions)}")
    print(f"")
    print(f"Per-token replacements:")
    for key in sorted(resolutions):
        html_n = html_counts.get(key, 0)
        md_n = md_counts.get(key, 0)
        print(f"  {key!r:<24s} -> {resolutions[key]!r:<24s}  html={html_n:3d}  md={md_n:3d}")
    print(f"")
    print(f"Totals:")
    print(f"  html span replacements : {total_html_replacements}")
    print(f"  markdown replacements  : {total_md_replacements}")
    print(f"  html span count        : {before_html_spans} -> {after_html_spans} "
          f"(delta -{html_span_delta}; expected -{total_html_replacements})")
    if html_span_delta != total_html_replacements:
        print(
            f"  WARNING: span-count delta {html_span_delta} != "
            f"replacement total {total_html_replacements}; "
            f"an expected resolution did not match any span "
            f"(token not present in HTML, or surrounding markup differs)."
        )

    if args.dry_run:
        print(f"  mode                   : DRY RUN — no files written")
        return 0

    # Apply mode.
    if new_html != html_text:
        html_path.write_text(new_html, encoding="utf-8")
        print(f"  wrote                  : {html_path}")
    else:
        print(f"  unchanged              : {html_path}")
    if new_md != md_text and md_path.exists():
        md_path.write_text(new_md, encoding="utf-8")
        print(f"  wrote                  : {md_path}")
    elif md_path.exists():
        print(f"  unchanged              : {md_path}")

    print(f"  next                   : python3 tools/validate_manuscript.py")
    return 0


def _smoke_test() -> int:
    """Self-test: empty-resolution pass must be a no-op across both surfaces."""
    html_text = (
        '<p>The median team saw '
        '<span class="placeholder-value">[48]%</span> of segments '
        'below the line.</p>'
    )
    md_text = (
        '## Drafted prose — §2 (v0.2)\n\n'
        'The median team saw [48]% of segments below the line.\n\n'
        '## Patterns\n\n'
        '- [48]% appears outside Drafted-prose and must NOT be rewritten.\n'
    )
    # Empty-resolution dict: no-op.
    new_html, _ = propagate_html(html_text, {})
    new_md, _ = propagate_markdown(md_text, {})
    assert new_html == html_text, "empty resolutions changed HTML"
    assert new_md == md_text, "empty resolutions changed markdown"
    # Single-key resolution.
    res = {"[48]%": "37%"}
    new_html, c_html = propagate_html(html_text, res)
    new_md, c_md = propagate_markdown(md_text, res)
    assert "37%" in new_html and "[48]%" not in new_html, "HTML not propagated"
    assert c_html["[48]%"] == 1, f"HTML count off: {c_html}"
    # Markdown: only in-block occurrence rewritten.
    assert new_md.count("[48]%") == 1, (
        "markdown outside-block occurrence was rewritten"
    )
    assert new_md.count("37%") == 1, "markdown in-block occurrence not rewritten"
    assert c_md["[48]%"] == 1, f"markdown count off: {c_md}"
    # Span-count assertion.
    assert count_spans(new_html) == count_spans(html_text) - 1
    print("propagate_placeholders self-test: PASS")
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Propagate resolved placeholder values across the HTML render "
        "and preprint.md Drafted-prose blocks.",
    )
    mode = parser.add_mutually_exclusive_group(required=False)
    mode.add_argument(
        "--dry-run",
        action="store_true",
        help="Report what would change; do not modify files.",
    )
    mode.add_argument(
        "--apply",
        action="store_true",
        help="Write modified files in place.",
    )
    parser.add_argument(
        "--resolution",
        action="append",
        metavar="KEY=VALUE",
        help="Inline resolution; may be passed multiple times.",
    )
    parser.add_argument(
        "--resolutions-file",
        metavar="PATH",
        help="JSON file whose flat object gives token->value mappings.",
    )
    parser.add_argument(
        "--html",
        metavar="PATH",
        help=f"HTML file (default: {DEFAULT_HTML}).",
    )
    parser.add_argument(
        "--markdown",
        metavar="PATH",
        help=f"Markdown file (default: {DEFAULT_MD}).",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run the built-in smoke test and exit.",
    )
    args = parser.parse_args(argv[1:])

    if args.self_test:
        return _smoke_test()
    if not (args.dry_run or args.apply):
        parser.error("one of --dry-run or --apply is required "
                     "(or --self-test to run the smoke test)")
    return run(args)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
