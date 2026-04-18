#!/usr/bin/env python3
"""Claim-preservation discipline linter for `preprint.md`.

Guards the iter-23 discipline: a biologist-voice copy-edit that promotes a
Drafted-prose block from v_n to v_{n+1} must preserve every claim, citation,
named mechanism, figure reference, section reference, URL, and placeholder
of v_n verbatim. Changes that re-voice for the biologist reader are allowed;
silent additions are not.

Fourth application of the engineering-infrastructure iteration kind (iter 28).
Stdlib-only, self-contained, --self-test driven.

What it does
------------
1. Parses `preprint.md` into `## Drafted prose — ...` blocks.
2. Groups blocks by their surface key — the part of the heading after
   "Drafted prose — " with the "(v...)" suffix stripped. Blocks that share
   a surface key and differ in version are version-pairs.
3. For every version-pair, extracts claim-tokens from the prose (not the
   metadata paragraph) and diffs tokens.
4. Reports per-pair: tokens added in v_{n+1}, tokens removed.
   A silent addition of a claim-token (number, citation, placeholder, URL,
   DOI, named mechanism) between versions is a discipline violation.

Claim-tokens extracted
----------------------
- Bracketed tokens: [N], [48]%, [Lord et al. 2024], [URL], [TBC], ...
- Numeric values with optional % / unit: 13, 27, 200, 48%, 2020, 2025
- URLs: https://ij.aicell.io, etc.
- DOIs: 10.1038/s41592-024-02310-w
- Figure refs: Fig 1, Fig 2a, Figure 3, Fig. 7
- Section refs: §1, §§5/6/7
- Named mechanisms: SAM, Cellpose, StarDist, CellSAM, CheerpJ, Hypha,
  ImageJ, Fiji, MATLAB, WebAssembly, URL-encoded, runMacro, takeScreenshot,
  getRoisAsGeoJson, executeJavaScript (allow-listed proper-noun vocabulary)

Usage
-----
    python3 tools/check_discipline.py --self-test
    python3 tools/check_discipline.py                    # audit preprint.md
    python3 tools/check_discipline.py --surface Abstract # only Abstract pairs
    python3 tools/check_discipline.py --strict           # non-zero exit on adds
    python3 tools/check_discipline.py --json             # JSON report

Exit status: 0 on pass OR when no pairs found. 1 if --strict and violations
exist, or on argument errors.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PREPRINT = REPO_ROOT / "preprint.md"

BLOCK_HEAD_RE = re.compile(r"^## Drafted prose — (?P<rest>.+)$")
VERSION_RE = re.compile(r"\(v(?P<ver>\d+(?:\.\d+)*)[^)]*\)")
HR_RE = re.compile(r"^---+\s*$")

TOKEN_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("bracket", re.compile(r"\[[^\[\]]{1,80}\]")),
    ("doi", re.compile(r"\b10\.\d{4,9}/[^\s\]\)]+")),
    ("url", re.compile(r"https?://[^\s\)\]`]+")),
    ("figure", re.compile(r"\bFig(?:ure|\.)?\s*\d+[a-z]?(?:-supplement)?\b", re.IGNORECASE)),
    ("section", re.compile(r"§+\s*\d+(?:[/,\s\-–]\s*\d+)*")),
    ("percent", re.compile(r"\b\d+(?:\.\d+)?%")),
    ("year", re.compile(r"\b(?:19|20)\d{2}\b")),
    ("number", re.compile(r"\b\d{1,5}(?:[.,]\d+)?\b")),
]

NAMED_MECHANISMS = frozenset(
    {
        "SAM",
        "Cellpose",
        "Cellpose-generalist",
        "StarDist",
        "StarDist-versatile",
        "CellSAM",
        "CheerpJ",
        "Hypha",
        "Hypha-RPC",
        "ImageJ",
        "ImageJ.JS",
        "Fiji",
        "MATLAB",
        "WebAssembly",
        "runMacro",
        "takeScreenshot",
        "getRoisAsGeoJson",
        "executeJavaScript",
        "MCP",
        "napari",
        "napari-mcp",
        "Chromebook",
        "Find Edges",
    }
)
MECHANISM_RE = re.compile(
    r"\b(?:" + "|".join(re.escape(m) for m in sorted(NAMED_MECHANISMS, key=len, reverse=True)) + r")\b"
)


@dataclass
class Block:
    """A Drafted-prose block."""

    heading: str
    surface_key: str
    version: str
    start_line: int
    body: str = ""

    def tokens(self) -> set[tuple[str, str]]:
        return extract_tokens(strip_metadata(self.body))


@dataclass
class PairReport:
    """A diff report for one version-pair of the same surface."""

    surface_key: str
    earlier_version: str
    later_version: str
    added: list[tuple[str, str]] = field(default_factory=list)
    removed: list[tuple[str, str]] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.added

    def to_dict(self) -> dict:
        return {
            "surface": self.surface_key,
            "earlier": self.earlier_version,
            "later": self.later_version,
            "added": [list(t) for t in self.added],
            "removed": [list(t) for t in self.removed],
            "ok": self.ok,
        }


def strip_metadata(body: str) -> str:
    """Strip the leading italicised metadata paragraph from a Drafted-prose block.

    The metadata paragraph opens with `*` and gives the version rationale; it
    often names tokens in a rephrasing sense that is not a scientific claim.
    The linter diffs only the prose that follows it.
    """
    lines = body.splitlines()
    out: list[str] = []
    in_metadata = False
    metadata_done = False
    for line in lines:
        stripped = line.strip()
        if not metadata_done:
            if not in_metadata and stripped.startswith("*") and not stripped.startswith("**"):
                in_metadata = True
                if stripped.endswith("*") and len(stripped) > 1:
                    in_metadata = False
                    metadata_done = True
                continue
            if in_metadata:
                if stripped.endswith("*"):
                    in_metadata = False
                    metadata_done = True
                continue
            if stripped == "":
                continue
            metadata_done = True
        out.append(line)
    return "\n".join(out)


def extract_tokens(prose: str) -> set[tuple[str, str]]:
    """Extract the set of claim-tokens from prose as (kind, text) tuples."""
    tokens: set[tuple[str, str]] = set()
    for kind, pat in TOKEN_PATTERNS:
        for match in pat.finditer(prose):
            text = match.group(0)
            if kind == "number":
                if re.fullmatch(r"\d+", text) and int(text) < 2:
                    continue
            tokens.add((kind, text))
    for match in MECHANISM_RE.finditer(prose):
        tokens.add(("mechanism", match.group(0)))
    return tokens


def parse_blocks(source: str) -> list[Block]:
    """Parse a Markdown source string into Drafted-prose blocks."""
    lines = source.splitlines()
    blocks: list[Block] = []
    current: Block | None = None
    body_lines: list[str] = []
    for idx, line in enumerate(lines, start=1):
        head_match = BLOCK_HEAD_RE.match(line)
        if head_match:
            if current is not None:
                current.body = "\n".join(body_lines).strip()
                blocks.append(current)
            rest = head_match.group("rest")
            ver_match = VERSION_RE.search(rest)
            if ver_match:
                version = ver_match.group("ver")
                surface_key = VERSION_RE.sub("", rest).strip(" —·,—").strip()
            else:
                version = "0"
                surface_key = rest.strip()
            surface_key = normalise_surface(surface_key)
            current = Block(
                heading=line.strip(),
                surface_key=surface_key,
                version=version,
                start_line=idx,
            )
            body_lines = []
            continue
        if current is None:
            continue
        if line.startswith("## ") and not head_match:
            current.body = "\n".join(body_lines).strip()
            blocks.append(current)
            current = None
            body_lines = []
            continue
        body_lines.append(line)
    if current is not None:
        current.body = "\n".join(body_lines).strip()
        blocks.append(current)
    return blocks


def normalise_surface(raw: str) -> str:
    """Collapse surface-heading variants to a canonical key for grouping.

    e.g. "§3 Design principles" and "§3 Design principles" → "§3 Design
    principles"; "Figure slots and captions" and "Figure slots and captions"
    stay aligned even when the parenthetical differs. Trailing punctuation
    is trimmed.
    """
    key = raw.strip().strip("—–·,.")
    key = re.sub(r"\s+", " ", key)
    return key


def diff_version_pairs(blocks: list[Block]) -> list[PairReport]:
    """Group blocks by surface; for each group of ≥2 versions emit diffs for
    every consecutive version-pair (sorted by numeric version ascending)."""
    grouped: dict[str, list[Block]] = {}
    for b in blocks:
        grouped.setdefault(b.surface_key, []).append(b)
    reports: list[PairReport] = []
    for key, group in grouped.items():
        if len(group) < 2:
            continue
        try:
            group_sorted = sorted(group, key=lambda b: _version_tuple(b.version))
        except ValueError:
            group_sorted = group
        for earlier, later in zip(group_sorted, group_sorted[1:]):
            earlier_tokens = earlier.tokens()
            later_tokens = later.tokens()
            added = sorted(later_tokens - earlier_tokens)
            removed = sorted(earlier_tokens - later_tokens)
            reports.append(
                PairReport(
                    surface_key=key,
                    earlier_version=earlier.version,
                    later_version=later.version,
                    added=added,
                    removed=removed,
                )
            )
    return reports


def _version_tuple(ver: str) -> tuple[int, ...]:
    parts = ver.split(".")
    return tuple(int(p) for p in parts if p.isdigit())


def render_report(reports: list[PairReport], surface_filter: str | None) -> str:
    lines: list[str] = []
    filtered = [r for r in reports if surface_filter is None or surface_filter.lower() in r.surface_key.lower()]
    if not filtered:
        lines.append("No version-pairs found.")
        return "\n".join(lines)
    total_adds = sum(len(r.added) for r in filtered)
    total_rms = sum(len(r.removed) for r in filtered)
    violators = [r for r in filtered if not r.ok]
    lines.append(f"== check_discipline report ({len(filtered)} pair{'s' if len(filtered) != 1 else ''}) ==")
    for r in filtered:
        flag = "OK" if r.ok else "VIOLATION"
        lines.append(f"- {r.surface_key}  v{r.earlier_version} → v{r.later_version}  [{flag}]")
        if r.added:
            lines.append(f"    added ({len(r.added)}):")
            for kind, text in r.added:
                lines.append(f"      + [{kind}] {text}")
        if r.removed:
            lines.append(f"    removed ({len(r.removed)}):")
            for kind, text in r.removed:
                lines.append(f"      - [{kind}] {text}")
    lines.append("")
    lines.append(f"Total tokens added: {total_adds}")
    lines.append(f"Total tokens removed: {total_rms}")
    lines.append(f"Pairs with additions: {len(violators)} / {len(filtered)}")
    return "\n".join(lines)


def _self_test() -> bool:
    """Two synthetic Drafted-prose blocks: v0.1 vs v0.2 copy-edit.

    v0.2 preserves every claim of v0.1; a second synthetic v0.3 silently adds
    a new percentage and a new citation. The linter must flag the v0.2→v0.3
    additions and not the v0.1→v0.2 ones.
    """
    src = """# Title

## Drafted prose — §X Synthetic (v0.1, 2026-04-18)

*Metadata paragraph for v0.1 — documents original version.*

> A typical paper analysed 13–27 cells per condition [Lord et al. 2024]. The survey of 200 papers found [48]% small-data. Foundation models like SAM and Cellpose-generalist underperform. See Fig 1 and §2.

---

## Drafted prose — §X Synthetic (v0.2, biologist-voice rewrite 2026-04-18)

*Metadata paragraph describing the biologist-voice copy-edit. All claims preserved.*

> A typical paper analysed 13–27 cells per condition across three replicates [Lord et al. 2024]. Our survey of 200 papers found [48]% small-data. Foundation models like SAM and Cellpose-generalist underperform on the long tail. See Fig 1 and §2.

---

## Drafted prose — §X Synthetic (v0.3, SILENT ADDITION 2026-04-18)

*Metadata for v0.3.*

> A typical paper analysed 13–27 cells per condition across three replicates [Lord et al. 2024]. Our survey of 200 papers found [48]% small-data and [72]% human-scale. Foundation models like SAM, Cellpose-generalist, and StarDist underperform [Smith et al. 2099]. See Fig 1 and §2.

---
"""
    blocks = parse_blocks(src)
    if len(blocks) != 3:
        print(f"self-test FAIL: expected 3 blocks, got {len(blocks)}")
        return False
    reports = diff_version_pairs(blocks)
    if len(reports) != 2:
        print(f"self-test FAIL: expected 2 pair-reports, got {len(reports)}")
        return False
    r12, r23 = reports
    if not r12.ok:
        print("self-test FAIL: v0.1→v0.2 must have no additions (biologist-voice copy-edit)")
        print(render_report([r12], None))
        return False
    if r23.ok:
        print("self-test FAIL: v0.2→v0.3 must flag the silent additions")
        return False
    added_texts = {t for _, t in r23.added}
    if "[72]" not in added_texts:
        print(f"self-test FAIL: expected [72] in additions; got {added_texts}")
        return False
    if "[Smith et al. 2099]" not in added_texts:
        print(f"self-test FAIL: expected [Smith et al. 2099] in additions; got {added_texts}")
        return False
    if not any(t == "StarDist" for _, t in r23.added):
        print(f"self-test FAIL: expected StarDist in additions; got {added_texts}")
        return False
    print("check_discipline self-test: PASS")
    return True


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", nargs="?", default=str(DEFAULT_PREPRINT), help="Path to preprint.md")
    parser.add_argument("--surface", default=None, help="Filter pairs whose surface-key contains this substring (case-insensitive)")
    parser.add_argument("--strict", action="store_true", help="Exit non-zero if any pair has token additions")
    parser.add_argument("--json", dest="emit_json", action="store_true", help="Emit JSON instead of text")
    parser.add_argument("--self-test", dest="self_test", action="store_true", help="Run built-in smoke test and exit")
    args = parser.parse_args(argv)

    if args.self_test:
        return 0 if _self_test() else 1

    source_path = Path(args.source)
    if not source_path.exists():
        print(f"ERROR: source not found: {source_path}", file=sys.stderr)
        return 1

    text = source_path.read_text(encoding="utf-8")
    blocks = parse_blocks(text)
    reports = diff_version_pairs(blocks)

    if args.emit_json:
        out = {
            "source": str(source_path),
            "total_blocks": len(blocks),
            "total_pairs": len(reports),
            "pairs": [r.to_dict() for r in reports if args.surface is None or args.surface.lower() in r.surface_key.lower()],
        }
        print(json.dumps(out, indent=2, ensure_ascii=False))
    else:
        print(render_report(reports, args.surface))

    if args.strict:
        filtered = [r for r in reports if args.surface is None or args.surface.lower() in r.surface_key.lower()]
        if any(not r.ok for r in filtered):
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
