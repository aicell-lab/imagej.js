#!/usr/bin/env python3
"""Render-fidelity checker: preprint.md latest-version prose vs manuscript HTML.

Fifth application of the iter-28 engineering-infrastructure iteration kind
(see `ralph-progress.md` Patterns section). Guards the iter-40 regression
class: silent prose drops between `preprint.md` and the `manuscript_html/
index.html` render (the missing "Week-1 three-candidate pilot" sentence
surfaced at iter 40 was invisible to the four existing tools).

Rules (from iter-28 / iter-40):
- Zero prose edits by the tool itself.
- Guards an empirically observed regression class.
- Self-contained stdlib-only Python 3.

Method
------
1. Parse `preprint.md` into `## Drafted prose — <title> (v<n.m>, ...)` blocks.
2. Group by surface key (title before `(v`).
3. Pick the latest version block per surface (highest v<major>.<minor>).
4. Extract publication prose from that block (skip italic editorial notes
   + skip author-voiced claim-preservation audit paragraphs like
   `**Cover letter v0.1 → v0.2 claim-preservation audit.** ...`).
5. Split prose into sentences; normalize each (strip markdown, lowercase,
   alphanumeric + spaces only, collapse whitespace).
6. Map surface → (HTML section id, render mode) via a small hardcoded dict.
   Render modes: `"verbatim"` (body prose rendered 1:1, e.g. §§1–10) vs
   `"summary"` (block restructured in HTML, e.g. Reporting Summary,
   Supplementary outline, Submission packet). Summary blocks are listed
   but not sentence-compared.
7. Extract HTML section text; strip tags; apply the same normalization.
8. For every sentence in the preprint latest block that is at least
   MIN_SENTENCE_CHARS normalized chars long, check via difflib ratio
   whether a matching window of comparable length exists in the HTML
   section's normalized text. If the best match ratio is below
   FUZZY_MATCH_THRESHOLD, report as a candidate drop. Fuzzy matching
   tolerates minor post-render corrections (e.g. the iter-32 "Lord et al.
   2024" → "Lord et al. 2020" year correction that preprint.md's
   pre-correction drafts still carry).

Exit status: 0 on pass, 1 on any drop.

Run
---
    python3 tools/check_render_fidelity.py

Or with explicit paths:

    python3 tools/check_render_fidelity.py preprint.md manuscript_html/index.html
"""

from __future__ import annotations

import difflib
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

MIN_SENTENCE_CHARS = 80  # normalized length below which a sentence is too
                         # short to distinguish from incidental overlap.
FUZZY_MATCH_THRESHOLD = 0.82  # longest-match / sentence-length ratio above
                              # which a sentence is considered rendered.

# Surface-key -> (HTML id, render mode). Mode "verbatim" means sentence-
# level comparison. Mode "summary" means the HTML version restructures or
# paraphrases — listed for coverage but not sentence-compared.
SURFACE_MAP: dict[str, tuple[str, str]] = {
    # Body argumentative spine — verbatim-rendered.
    "Abstract": ("abstract", "verbatim"),
    "§1 Introduction": ("sec-1", "verbatim"),
    "§2 Measuring the small-data majority": ("sec-2", "verbatim"),
    "§3 Design principles": ("sec-3", "verbatim"),
    "§4 Shareable human reasoning — deterministic replay": ("sec-4", "verbatim"),
    "§5 Teaching and intuition-building": ("sec-5", "verbatim"),
    "§6 Privacy-preserving analysis of sensitive data": ("sec-6", "verbatim"),
    "§7 Real-time collaborative analysis without data movement": ("sec-7", "verbatim"),
    "§8 Limits and complementarity": ("sec-8", "verbatim"),
    "§9 Discussion implications": ("sec-9", "verbatim"),
    "§10 Availability": ("sec-10", "verbatim"),
    # Editor-facing + first-contact surfaces — verbatim.
    "Cover letter to Nature Methods": ("cover-letter", "verbatim"),
    "Research Briefing": ("research-briefing", "verbatim"),
    "Key points for the bench biologist": ("keypoints", "verbatim"),
    "Box 1 Three working days with ImageJ.JS": ("box1", "verbatim"),
    "Box 2 What ImageJ.JS is not": ("box2", "verbatim"),
    # Structured / summarised surfaces — HTML restructures; listed only.
    "Online Methods": ("methods", "summary"),
    "References": ("references", "summary"),
    "Supplementary material outline": ("supp-outline", "summary"),
    "Reviewer-response dry run": ("dry-run", "summary"),
    "Submission packet": ("submission-packet", "summary"),
    "Life Sciences Reporting Summary": ("reporting-summary", "summary"),
    "Release engineering": ("release-eng", "summary"),
    "Submission readiness dashboard": ("readiness", "summary"),
}


# --- block parsing -----------------------------------------------------------

BLOCK_HEADER_RE = re.compile(r"^## Drafted prose — (.+)$")
VERSION_RE = re.compile(r"\(v(\d+)\.(\d+)")


def parse_blocks(md: str) -> list[dict]:
    """Return list of {surface_key, version, header_line, body_lines}."""
    lines = md.splitlines()
    blocks: list[dict] = []
    i = 0
    while i < len(lines):
        m = BLOCK_HEADER_RE.match(lines[i])
        if not m:
            i += 1
            continue
        title_rest = m.group(1).strip()
        v = VERSION_RE.search(title_rest)
        version = (int(v.group(1)), int(v.group(2))) if v else (0, 0)
        if "(v" in title_rest:
            surface_key = title_rest.split("(v", 1)[0].rstrip(" —-")
        elif "(" in title_rest:
            surface_key = title_rest.split("(", 1)[0].rstrip(" —-")
        else:
            surface_key = title_rest
        start = i + 1
        j = i + 1
        while j < len(lines) and not lines[j].startswith("## "):
            j += 1
        blocks.append({
            "surface_key": surface_key.strip(),
            "version": version,
            "header_line": i + 1,
            "body_lines": lines[start:j],
        })
        i = j
    return blocks


# --- prose extraction --------------------------------------------------------

# Patterns that identify an author-voice editorial note that lives inside
# the prose block but is NOT publication content (claim-preservation audits
# that land as trailing meta-paragraphs; iter-log footers).
EDITORIAL_NOTE_PATTERNS = [
    re.compile(r"\*\*[A-Z][^*]*?v\d+\.\d+\s*(?:→|->)\s*v\d+\.\d+.*?\*\*"),
    re.compile(r"\bclaim[- ]preservation audit\b", re.IGNORECASE),
    re.compile(r"\bclaim-diff\b", re.IGNORECASE),
    re.compile(r"\bplaceholder[- ]inventory\b", re.IGNORECASE),
    re.compile(r"\b(?:i|I)ter[- ]?\d+ (?:landed|iteration)\b"),
    # Biologist-voice programme status / completion / extension notes
    # (author-voice editorial footers in §2 v0.2, §4 v0.2, Research
    # Briefing v0.2, Cover letter v0.2 that describe the chain state).
    re.compile(r"\*\*biologist-voice programme[^*]*\*\*", re.IGNORECASE),
    re.compile(r"biologist-voice chain now reads", re.IGNORECASE),
]


def is_editorial_paragraph(text: str) -> bool:
    """Return True if a paragraph is an author-voice editorial note."""
    stripped = text.strip()
    if not stripped:
        return True
    # Whole-paragraph italic wrap (typical opening rationale note).
    joined = stripped
    if joined.startswith("*") and joined.endswith("*") and not joined.startswith("**"):
        return True
    # Pattern-based: starts with **Surface v0.x → v0.y ...** or contains
    # any of the editorial-vocabulary keywords.
    for pat in EDITORIAL_NOTE_PATTERNS:
        if pat.search(stripped):
            return True
    return False


# ### subsection headings that mark the start of a trailing editorial audit
# region; everything from the header through the end of the block is skipped.
AUDIT_HEADING_RE = re.compile(
    r"^###\s+.*?(?:claim[- ]preservation audit|per-segment diff|per-paragraph diff|"
    r"v\d+\.\d+\s*(?:→|->)\s*v\d+\.\d+ audit|biologist-voice programme — |"
    r"preserved verbatim from v\d+\.\d+)",
    re.IGNORECASE,
)


def extract_publication_prose(body_lines: list[str]) -> str:
    """Return concatenated publication prose, editorial notes removed.

    Filters:
    - blank-line-separated paragraphs whose content is an editorial note
      (whole-line italic wrap or editorial-vocabulary keyword match);
    - everything from a trailing `### ... claim-preservation audit` header
      (or similar audit-section heading) to the end of the block.
    """
    # Truncate at audit heading if any.
    trimmed: list[str] = []
    for ln in body_lines:
        if AUDIT_HEADING_RE.match(ln):
            break
        trimmed.append(ln)
    paragraphs: list[str] = []
    cur: list[str] = []
    for ln in trimmed:
        if ln.strip() == "":
            if cur:
                paragraphs.append("\n".join(cur))
                cur = []
        else:
            cur.append(ln)
    if cur:
        paragraphs.append("\n".join(cur))
    kept: list[str] = []
    for par in paragraphs:
        if is_editorial_paragraph(par):
            continue
        kept.append(par)
    return "\n\n".join(kept)


# --- sentence splitting + normalization --------------------------------------

MD_STRIP_RULES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"`([^`]*)`"), r"\1"),
    (re.compile(r"\*\*([^*]+)\*\*"), r"\1"),
    (re.compile(r"\*([^*\n]+)\*"), r"\1"),
    # _italic_ / __bold__ with word-boundary context only (do NOT eat
    # intra-identifier underscores like `run_replay.py`, `MATCH_REPORT.md`).
    (re.compile(r"(?<!\w)__([^_\n]+)__(?!\w)"), r"\1"),
    (re.compile(r"(?<!\w)_([^_\n]+)_(?!\w)"), r"\1"),
    (re.compile(r"\[([^\]]+)\]\(([^)]+)\)"), r"\1"),
    (re.compile(r"^\s*>\s*", re.MULTILINE), ""),
    (re.compile(r"^\s*\d+\.\s+", re.MULTILINE), ""),
    (re.compile(r"^\s*[-*]\s+", re.MULTILINE), ""),
    (re.compile(r"^\s*#+\s+", re.MULTILINE), ""),
    # Per-paragraph `¶N — heading:` or `¶N (metadata):` prefixes used in
    # preprint-side blockquoted body prose (§2 v0.2). HTML renders each
    # paragraph without the `¶N` marker, so strip to align normalization.
    (re.compile(r"(?m)^¶\d+[^\n:]*:\s*"), ""),
]

SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z(\"“'—*])")


def strip_markdown(text: str) -> str:
    for pat, repl in MD_STRIP_RULES:
        text = pat.sub(repl, text)
    return text


NON_ALNUM_RE = re.compile(r"[^a-z0-9\s]+")
WS_RUN_RE = re.compile(r"\s+")


def normalize(text: str) -> str:
    text = text.lower()
    text = NON_ALNUM_RE.sub(" ", text)
    text = WS_RUN_RE.sub(" ", text)
    return text.strip()


def split_sentences(prose: str) -> list[str]:
    prose = strip_markdown(prose)
    flat = WS_RUN_RE.sub(" ", prose).strip()
    parts = SENTENCE_SPLIT_RE.split(flat)
    return [p.strip() for p in parts if p.strip()]


# --- HTML text extraction ----------------------------------------------------

class SectionTextExtractor(HTMLParser):
    """Extract concatenated text of a single <section>/<aside> by id."""

    def __init__(self, target_id: str) -> None:
        super().__init__(convert_charrefs=True)
        self.target_id = target_id
        self.in_target = 0
        self.buf: list[str] = []

    def handle_starttag(self, tag: str, attrs):  # type: ignore[override]
        attrs_d = dict(attrs)
        if self.in_target:
            self.in_target += 1
            return
        if tag in ("section", "aside") and attrs_d.get("id") == self.target_id:
            self.in_target = 1

    def handle_endtag(self, tag: str):  # type: ignore[override]
        if not self.in_target:
            return
        self.in_target -= 1

    def handle_data(self, data: str):  # type: ignore[override]
        if self.in_target:
            self.buf.append(data)

    @property
    def text(self) -> str:
        return " ".join(self.buf)


def extract_html_section_text(html_text: str, section_id: str) -> str:
    ex = SectionTextExtractor(section_id)
    ex.feed(html_text)
    return ex.text


# --- fuzzy sentence matching -------------------------------------------------

def sentence_is_rendered(norm_sentence: str, norm_html: str) -> tuple[bool, float]:
    """Return (is_rendered, best_ratio). A sentence counts as rendered if
    its normalized form appears in the HTML normalized text with a
    longest-common-substring ratio >= FUZZY_MATCH_THRESHOLD.
    """
    if norm_sentence in norm_html:
        return True, 1.0
    sm = difflib.SequenceMatcher(None, norm_sentence, norm_html, autojunk=False)
    match = sm.find_longest_match(0, len(norm_sentence), 0, len(norm_html))
    ratio = match.size / max(1, len(norm_sentence))
    return ratio >= FUZZY_MATCH_THRESHOLD, ratio


# --- main checking logic -----------------------------------------------------

def check_surface(
    preprint_prose: str,
    html_norm: str,
) -> list[dict]:
    drops: list[dict] = []
    for sentence in split_sentences(preprint_prose):
        norm = normalize(sentence)
        if len(norm) < MIN_SENTENCE_CHARS:
            continue
        rendered, ratio = sentence_is_rendered(norm, html_norm)
        if rendered:
            continue
        drops.append({
            "sentence_preview": sentence[:140] + ("…" if len(sentence) > 140 else ""),
            "match_ratio": round(ratio, 3),
        })
    return drops


def run(preprint_path: Path, html_path: Path) -> int:
    md = preprint_path.read_text(encoding="utf-8")
    html_text = html_path.read_text(encoding="utf-8")

    blocks = parse_blocks(md)
    by_surface: dict[str, dict] = {}
    for b in blocks:
        key = b["surface_key"]
        if key not in by_surface or b["version"] > by_surface[key]["version"]:
            by_surface[key] = b

    print(f"== Render-fidelity check ==")
    print(f"   preprint: {preprint_path} ({len(md.encode('utf-8'))} bytes)")
    print(f"   html:     {html_path} ({len(html_text.encode('utf-8'))} bytes)")
    print(f"   surfaces found: {len(by_surface)}")
    print(f"   min sentence chars: {MIN_SENTENCE_CHARS}  fuzzy threshold: {FUZZY_MATCH_THRESHOLD}")

    total_drops = 0
    verbatim_surfaces = 0
    summary_surfaces = 0
    unmapped: list[str] = []

    for surface_key, block in sorted(by_surface.items()):
        entry = SURFACE_MAP.get(surface_key)
        if entry is None:
            unmapped.append(f"{surface_key} (v{block['version'][0]}.{block['version'][1]})")
            continue
        html_id, mode = entry

        if mode == "summary":
            summary_surfaces += 1
            print(
                f"   [SUMMARY] surface={surface_key!r} "
                f"v{block['version'][0]}.{block['version'][1]} "
                f"-> #{html_id}  (HTML restructures; not sentence-compared)"
            )
            continue

        verbatim_surfaces += 1
        prose = extract_publication_prose(block["body_lines"])
        section_text = extract_html_section_text(html_text, html_id)
        if not section_text.strip():
            print(f"   [MISSING] surface={surface_key!r} html_id=#{html_id} — section not found in HTML")
            total_drops += 1
            continue
        html_norm = normalize(section_text)

        drops = check_surface(prose, html_norm)
        total_drops += len(drops)
        status = "OK" if not drops else f"DROPS={len(drops)}"
        print(
            f"   [{status}] surface={surface_key!r} "
            f"v{block['version'][0]}.{block['version'][1]} "
            f"-> #{html_id} "
            f"(preprint@L{block['header_line']})"
        )
        for d in drops:
            print(f"      - drop (ratio={d['match_ratio']}): \"{d['sentence_preview']}\"")

    print()
    print(f"== Verbatim surfaces checked: {verbatim_surfaces} ==")
    print(f"== Summary surfaces skipped: {summary_surfaces} ==")
    if unmapped:
        print(f"== Unmapped surfaces (informational, {len(unmapped)}): ==")
        for u in unmapped:
            print(f"   - {u}")
    print(f"== Total candidate drops in verbatim surfaces: {total_drops} ==")
    print(f"== Overall: {'PASS' if total_drops == 0 else 'FAIL'} ==")
    return 0 if total_drops == 0 else 1


def main(argv: list[str]) -> int:
    if len(argv) >= 3:
        pp = Path(argv[1])
        hp = Path(argv[2])
    else:
        base = Path(__file__).resolve().parent.parent
        pp = base / "preprint.md"
        hp = base / "manuscript_html" / "index.html"
    if not pp.exists():
        print(f"preprint.md not found: {pp}", file=sys.stderr)
        return 2
    if not hp.exists():
        print(f"manuscript HTML not found: {hp}", file=sys.stderr)
        return 2
    return run(pp, hp)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
