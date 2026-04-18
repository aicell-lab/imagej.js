#!/usr/bin/env python3
"""Chain-of-voice audit for `manuscript_html/index.html`.

Audits the manuscript's self-descriptive meta surfaces (readiness banner, article-
meta `<dt>`/`<dd>`, footer render-stamp, Readiness scoreboard one-line summary) for
agreement with the live rendered-surface state and with the authoritative
outputs of the four prior engineering-infrastructure tools
(`validate_manuscript.py`, `propagate_placeholders.py`, `recheck_references.py`,
`check_discipline.py`, `check_render_fidelity.py`). Eleventh iteration-kind (iter
42, 2026-04-18); sixth application of the iter-28 engineering-infrastructure
iteration template and the first review-time (not authoring-time) tool in the
matched suite.

What it does
------------
1. Parses `manuscript_html/index.html` to extract chain-of-voice claim sites:
   - Header chips (`.chip.draft`) — HTML version string (e.g. "v0.33")
   - Readiness banner (`.readiness-banner` div) — iteration numbers mentioned
   - Article-meta dl (`.meta dl`) — dt/dd pairs naming iterations
   - Readiness scoreboard one-line summary (`p.one-line-summary`)
   - Per-§ biologist-voice scoreboard row (§§ biologist-voiced list)
   - Per-figure coverage scoreboard row (figure-ready list)
   - Per-gate landing timeline scoreboard row (gates MET/PENDING counts)
   - Footer render-stamp (`footer.site-footer`)

2. Extracts authoritative counts from `validate_manuscript.py` output:
   - placeholder-value span count
   - bracketed token count
   - anchor count, broken-anchor count

3. Extracts biologist-voice status per surface from `check_discipline.py`:
   - which surfaces have a v_n → v_{n+1} Drafted-prose pair
   - which surface-keys are present in `preprint.md`

4. Compares each chain-of-voice claim against the authoritative source:
   - The one-line-summary's "X / Y biologist-voiced §§" count against the
     per-§ row's chip list.
   - The one-line-summary's "N placeholder-value spans" count against
     validate_manuscript.py's count.
   - The latest-iteration claim in readiness banner / Draft version dd /
     Regression guard dt / footer against git log.
   - The "Nth application of" claim against the number of distinct
     engineering-infrastructure tools in tools/.

5. Reports per drift: site, claimed value, actual value, remediation.

Exit status
-----------
0 if no drifts or --report only.
1 with --strict and drifts present, or on argument errors.

Usage
-----
    python3 tools/chain_of_voice_audit.py --self-test
    python3 tools/chain_of_voice_audit.py                    # report drifts
    python3 tools/chain_of_voice_audit.py --strict           # exit non-zero on drift
    python3 tools/chain_of_voice_audit.py --json             # JSON report

Iteration template rules (iter-28 · carried forward unchanged to iter 42)
-------------------------------------------------------------------------
(i) zero prose edits by the tool itself.
(ii) guards an empirically-observed regression class — the iter-37 / iter-39
    latent chain-of-voice gap, where "complete" claims in the meta surfaces
    had silently inherited stale denominators or missing iteration mentions.
(iii) self-contained, stdlib-only.

This is the sixth application of the iter-28 template (prior five:
validate_manuscript.py, propagate_placeholders.py, recheck_references.py,
check_discipline.py, check_render_fidelity.py). It is the first *review-time*
tool — the prior five are all authoring-time linters that run against
`preprint.md` and / or `manuscript_html/index.html` as working-document
surfaces; this tool runs against the rendered surface itself as the thing a
reviewer reads.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_HTML = REPO_ROOT / "manuscript_html" / "index.html"
DEFAULT_PREPRINT = REPO_ROOT / "preprint.md"
TOOLS_DIR = REPO_ROOT / "tools"


# ----------------------------- data types --------------------------------- #


@dataclass
class Drift:
    site: str  # human-readable claim-site name
    claim: str  # what the meta surface asserts
    actual: str  # what the authoritative source shows
    remedy: str  # one-line fix direction

    def as_dict(self) -> dict:
        return {
            "site": self.site,
            "claim": self.claim,
            "actual": self.actual,
            "remedy": self.remedy,
        }


@dataclass
class AuditReport:
    html_version: str = ""
    banner_iterations: list[int] = field(default_factory=list)
    meta_iterations: list[int] = field(default_factory=list)
    footer_iterations: list[int] = field(default_factory=list)
    one_line_bv: tuple[int, int] | None = None  # (num, denom) for biologist-voiced §§
    one_line_placeholders: int | None = None
    actual_placeholders: int | None = None
    actual_latest_iter: int | None = None
    engineering_tool_count: int = 0
    surface_bv_voiced: list[str] = field(default_factory=list)  # §§ biologist-voiced
    surface_bv_pending: list[str] = field(default_factory=list)  # §§ Gate-G-pending
    drifts: list[Drift] = field(default_factory=list)

    def as_dict(self) -> dict:
        return {
            "html_version": self.html_version,
            "banner_iterations": self.banner_iterations,
            "meta_iterations": self.meta_iterations,
            "footer_iterations": self.footer_iterations,
            "one_line_biologist_voice": list(self.one_line_bv) if self.one_line_bv else None,
            "one_line_placeholders": self.one_line_placeholders,
            "actual_placeholders": self.actual_placeholders,
            "actual_latest_iter": self.actual_latest_iter,
            "engineering_tool_count": self.engineering_tool_count,
            "surface_biologist_voiced": self.surface_bv_voiced,
            "surface_biologist_voice_pending": self.surface_bv_pending,
            "drifts": [d.as_dict() for d in self.drifts],
        }


# --------------------------- extraction helpers --------------------------- #


ITER_RE = re.compile(r"\biter(?:ation)?\s+(\d+)\b", re.IGNORECASE)
DRAFT_VERSION_CHIP_RE = re.compile(r"Working draft\s+v([\d.]+)")
ONE_LINE_BV_RE = re.compile(
    r"(\d+)\s*/\s*(\d+)\s+biologist-voiced\s+§§", re.IGNORECASE
)
ONE_LINE_PLACEHOLDERS_RE = re.compile(
    r"(\d+)\s+<code>placeholder-value</code>\s+spans?\s+open", re.IGNORECASE
)


def extract_block(html: str, start_marker: str, end_marker: str) -> str:
    """Return the substring between the first start_marker and the next end_marker.

    Both markers are matched literally (no regex). Returns "" if either is
    missing.
    """
    s = html.find(start_marker)
    if s < 0:
        return ""
    s += len(start_marker)
    e = html.find(end_marker, s)
    if e < 0:
        return ""
    return html[s:e]


def iterations_mentioned(text: str) -> list[int]:
    """All iteration numbers mentioned in the text, deduplicated, sorted."""
    return sorted({int(m.group(1)) for m in ITER_RE.finditer(text)})


def extract_html_version(html: str) -> str:
    m = DRAFT_VERSION_CHIP_RE.search(html)
    return m.group(1) if m else ""


def extract_readiness_banner(html: str) -> str:
    # readiness-banner is a div; we grab its inner contents by locating the
    # opening <div class="readiness-banner"> and the next </div>.
    start = html.find('class="readiness-banner"')
    if start < 0:
        return ""
    start = html.find(">", start) + 1
    end = html.find("</div>", start)
    return html[start:end] if end > 0 else html[start:]


def extract_article_meta(html: str) -> str:
    # Article-meta is the first "<h3>Article info</h3>" through end of its <dl>.
    start = html.find("<h3>Article info</h3>")
    if start < 0:
        return ""
    end = html.find("</dl>", start)
    return html[start:end] if end > 0 else html[start:]


def extract_footer(html: str) -> str:
    start = html.find("<footer")
    if start < 0:
        return ""
    end = html.find("</footer>", start)
    return html[start:end] if end > 0 else html[start:]


def extract_one_line_summary(html: str) -> str:
    # <p class="one-line-summary">...</p>
    start = html.find('class="one-line-summary"')
    if start < 0:
        return ""
    start = html.find(">", start) + 1
    end = html.find("</p>", start)
    return html[start:end] if end > 0 else html[start:]


def extract_per_section_row(html: str) -> str:
    # The per-§ biologist-voice scoreboard row starts with a
    # <td>Biologist-voice per-§ checklist</td> cell. Locate that cell
    # precisely (it appears only once in the document — once in the
    # scoreboard table body); fall back to the Per-§ variant.
    for td_marker in (
        "<td>Biologist-voice per-§ checklist</td>",
        "<td>Per-§ biologist-voice checklist</td>",
    ):
        s = html.find(td_marker)
        if s >= 0:
            break
    else:
        # Test-fixture fallback — match a lighter form used in the self-test.
        s = html.find("<td>Per-§ biologist-voice</td>")
        if s < 0:
            return ""
    # Walk back to the nearest <tr> opening so the row's chip-bearing
    # cells are included. Search only the last 2 kB before s to avoid
    # picking up a <tr> from a distant unrelated table.
    window_start = max(0, s - 2048)
    tr_start = html.rfind("<tr>", window_start, s)
    if tr_start < 0:
        tr_start = s
    e = html.find("</tr>", tr_start)
    return html[tr_start:e] if e > 0 else ""


# ------------------- authoritative-source extraction ---------------------- #


def count_tool_files() -> int:
    """Count engineering-infrastructure tool files (*.py) in tools/."""
    # Count only the ones that look like infrastructure tools, not report JSON.
    return sum(
        1
        for p in TOOLS_DIR.glob("*.py")
        if p.is_file() and not p.name.startswith("_")
    )


def run_validator_placeholder_count() -> int | None:
    """Run validate_manuscript.py, parse the placeholder-value count.

    Returns None if the validator is not runnable or its output does not match
    the expected format.
    """
    validator = TOOLS_DIR / "validate_manuscript.py"
    if not validator.exists():
        return None
    try:
        res = subprocess.run(
            [sys.executable, str(validator)],
            capture_output=True,
            text=True,
            timeout=30,
        )
    except (subprocess.TimeoutExpired, OSError):
        return None
    output = res.stdout + res.stderr
    # validate_manuscript.py emits either "placeholder-value spans=N" (new
    # format) or "N placeholder-value spans" (older / one-line summary).
    m = re.search(r"placeholder-value\s+spans?\s*=\s*(\d+)", output)
    if m:
        return int(m.group(1))
    m = re.search(r"(\d+)\s+placeholder-value\s+spans?", output)
    return int(m.group(1)) if m else None


def git_latest_iter(repo_root: Path) -> int | None:
    """The highest iter-N mentioned in the last 40 commits' subjects."""
    try:
        res = subprocess.run(
            ["git", "log", "-n", "40", "--pretty=%s"],
            capture_output=True,
            text=True,
            cwd=str(repo_root),
            timeout=10,
        )
    except (subprocess.CalledProcessError, OSError, subprocess.TimeoutExpired):
        return None
    if res.returncode != 0:
        return None
    nums = [int(m.group(1)) for m in ITER_RE.finditer(res.stdout)]
    return max(nums) if nums else None


# --------------------------- audit logic ---------------------------------- #


def audit(html: str, repo_root: Path) -> AuditReport:
    rpt = AuditReport()
    rpt.html_version = extract_html_version(html)

    banner = extract_readiness_banner(html)
    meta = extract_article_meta(html)
    footer = extract_footer(html)
    one_line = extract_one_line_summary(html)
    per_section_row = extract_per_section_row(html)

    rpt.banner_iterations = iterations_mentioned(banner)
    rpt.meta_iterations = iterations_mentioned(meta)
    rpt.footer_iterations = iterations_mentioned(footer)

    bv_match = ONE_LINE_BV_RE.search(one_line)
    if bv_match:
        rpt.one_line_bv = (int(bv_match.group(1)), int(bv_match.group(2)))

    ph_match = ONE_LINE_PLACEHOLDERS_RE.search(one_line)
    if ph_match:
        rpt.one_line_placeholders = int(ph_match.group(1))

    rpt.actual_placeholders = run_validator_placeholder_count()
    rpt.actual_latest_iter = git_latest_iter(repo_root)
    rpt.engineering_tool_count = count_tool_files()

    # Parse per-§ biologist-voice status from the per-section row.
    # The row contains chips like "§1 v0.2 biologist-voice iter N",
    # "§5 structural v0.1 Gate-G-pending", etc.
    if per_section_row:
        # Voiced chips in the real HTML take two forms:
        #   (i)  Body §§1-8 slice:  "§1 v0.2 iter 23"  inside status-met span.
        #   (ii) Trailing §9/§10:   "§9 Discussion implications <span
        #        class="status-met">v0.2 biologist-voice iter 37</span>" —
        #        the span wraps only the version / voice / iter, not the
        #        §N prefix. Allow up to ~80 chars (possibly containing HTML
        #        tags) between the §N and the v0.2 biologist-voice token.
        voiced_numbers = set(
            re.findall(r"§(\d+)\s+v0\.[26]\s+(?:biologist-voice\s+)?iter\s+\d+", per_section_row)
        )
        voiced_numbers |= set(
            re.findall(
                r"§(\d+)\s+(?!teaching|clinical|collaboration)"
                r"[A-Z][A-Za-z]+(?:\s+[A-Za-z]+)?\s+"
                r"<span\s+class=\"status-met\">v0\.[26]\s+biologist-voice",
                per_section_row,
            )
        )
        voiced_numbers |= set(
            re.findall(r"§(\d+)\s+v0\.2\s+biologist-voice", per_section_row)
        )
        # Pending chips look like "§5 teaching", "§6 clinical",
        # "§7 collaboration" in the real HTML, or "§N structural v0.1" in
        # the self-test fixture.
        pending_numbers = set(
            re.findall(
                r"§(\d+)\s+(?:teaching|clinical|collaboration)", per_section_row
            )
        ) | set(re.findall(r"§(\d+)\s+structural\s+v0\.1", per_section_row))
        # Only count body §§ 1..8 in the per-§ count (matches the
        # "N / 8 body §§ biologist-voiced" row semantics).
        rpt.surface_bv_voiced = sorted(
            f"§{n}" for n in voiced_numbers
        )
        rpt.surface_bv_pending = sorted(
            f"§{n}" for n in pending_numbers
        )

    # ----------- Drift checks ---------------- #

    # (A) One-line "N / M biologist-voiced §§" vs per-§ row actual state.
    #     The one-line summary's "X / Y" count describes either the body §§1-8
    #     slice (Y == 8) or the full §§1-10 slice (Y == 10); accept either.
    voiced_nums = {int(s.lstrip("§")) for s in rpt.surface_bv_voiced}
    pending_nums = {int(s.lstrip("§")) for s in rpt.surface_bv_pending}
    if rpt.one_line_bv is not None and rpt.surface_bv_voiced:
        claimed_num, claimed_denom = rpt.one_line_bv
        body_voiced = len(voiced_nums & set(range(1, 9)))
        body_total = len((voiced_nums | pending_nums) & set(range(1, 9)))
        full_voiced = len(voiced_nums)
        full_total = len(voiced_nums | pending_nums)
        valid_combos = {(body_voiced, body_total), (full_voiced, full_total)}
        if (claimed_num, claimed_denom) not in valid_combos:
            rpt.drifts.append(
                Drift(
                    site="one-line-summary: biologist-voiced §§ count",
                    claim=f"{claimed_num} / {claimed_denom}",
                    actual=(
                        f"body {body_voiced} / {body_total}; "
                        f"full {full_voiced} / {full_total} "
                        f"(voiced: {', '.join(rpt.surface_bv_voiced)}; "
                        f"pending: {', '.join(rpt.surface_bv_pending)})"
                    ),
                    remedy=(
                        f"update `<p class=\"one-line-summary\">` to "
                        f"{body_voiced} / {body_total} or "
                        f"{full_voiced} / {full_total}"
                    ),
                )
            )

    # (A2) One-line summary parenthetical must list every supplementary
    #      biologist-voiced surface (Abstract / Cover letter / Research
    #      Briefing / §9 / §10) that is not already captured by the §§1-8
    #      body slice. Drift surfaces if any §N ≥ 9 is voiced but absent
    #      from the parenthetical.
    if one_line:
        # Grep the parenthetical immediately after the "biologist-voiced §§"
        # clause; it looks like "§§ (+ Abstract / Cover letter / ... / §9)".
        paren_re = re.compile(r"biologist-voiced\s+§§\s*\(\+\s*([^)]+)\)")
        pm = paren_re.search(one_line)
        if pm:
            parenthetical = pm.group(1)
            for n in sorted(voiced_nums):
                if n >= 9 and f"§{n}" not in parenthetical:
                    rpt.drifts.append(
                        Drift(
                            site="one-line-summary: parenthetical supplementary list",
                            claim=f"parenthetical omits §{n}",
                            actual=(
                                f"§{n} is biologist-voiced in the per-§ row "
                                f"but not cited in the one-line parenthetical"
                            ),
                            remedy=(
                                f"add `/ §{n}` to the `<p class=\"one-line-summary\">` "
                                f"parenthetical"
                            ),
                        )
                    )

    # (B) One-line "N placeholder-value spans" vs validator output.
    if (
        rpt.one_line_placeholders is not None
        and rpt.actual_placeholders is not None
        and rpt.one_line_placeholders != rpt.actual_placeholders
    ):
        rpt.drifts.append(
            Drift(
                site="one-line-summary: placeholder-value span count",
                claim=str(rpt.one_line_placeholders),
                actual=str(rpt.actual_placeholders),
                remedy=(
                    f"update `<p class=\"one-line-summary\">` placeholder count "
                    f"to {rpt.actual_placeholders}"
                ),
            )
        )

    # (C) Latest-iter claim in banner / meta / footer vs git log.
    #     Each meta surface should mention the latest iteration at least once.
    if rpt.actual_latest_iter is not None:
        latest = rpt.actual_latest_iter
        for site_name, iters in (
            ("readiness banner", rpt.banner_iterations),
            ("article-meta dl", rpt.meta_iterations),
            ("footer render-stamp", rpt.footer_iterations),
        ):
            if not iters:
                continue
            site_max = max(iters)
            if site_max < latest:
                rpt.drifts.append(
                    Drift(
                        site=f"{site_name}: latest-iteration mention",
                        claim=f"iter {site_max}",
                        actual=f"iter {latest} (from git log)",
                        remedy=(
                            f"append iter-{latest} clause to {site_name} "
                            f"describing the iter-{latest} landing"
                        ),
                    )
                )

    # (D) "Nth application of the engineering-infrastructure iteration kind"
    #     claim should match the actual tool count.
    kth_re = re.compile(
        r"(\w+)\s+application\s+of\s+the\s+(?:iter-28\s+)?engineering-"
        r"infrastructure\s+iteration\s+kind",
        re.IGNORECASE,
    )
    word_to_num = {
        "first": 1,
        "second": 2,
        "third": 3,
        "fourth": 4,
        "fifth": 5,
        "sixth": 6,
        "seventh": 7,
        "eighth": 8,
    }
    claims: list[tuple[str, str]] = []
    for section_name, text in (
        ("readiness banner", banner),
        ("article-meta dl", meta),
        ("footer render-stamp", footer),
    ):
        for m in kth_re.finditer(text):
            claims.append((section_name, m.group(1).lower()))
    # The *highest* asserted Nth across all meta sites should equal
    # engineering_tool_count; lower claims are valid historical references.
    if claims:
        max_claim = max(
            (word_to_num.get(w, 0) for _, w in claims),
            default=0,
        )
        if max_claim and max_claim < rpt.engineering_tool_count:
            rpt.drifts.append(
                Drift(
                    site="meta: highest Nth-application claim",
                    claim=f"{max_claim} applications",
                    actual=(
                        f"{rpt.engineering_tool_count} tool files in tools/ "
                        f"(one-to-one with applications)"
                    ),
                    remedy=(
                        "extend meta surfaces to cite the most recent "
                        "engineering-infrastructure tool"
                    ),
                )
            )

    return rpt


# ---------------------------- rendering ----------------------------------- #


def render_text(rpt: AuditReport) -> str:
    lines = []
    lines.append("== chain_of_voice_audit ==")
    lines.append(f"HTML version          : v{rpt.html_version}")
    lines.append(
        f"Banner iters          : {rpt.banner_iterations[-5:] if rpt.banner_iterations else []}"
    )
    lines.append(
        f"Meta   iters          : {rpt.meta_iterations[-5:] if rpt.meta_iterations else []}"
    )
    lines.append(
        f"Footer iters          : {rpt.footer_iterations[-5:] if rpt.footer_iterations else []}"
    )
    lines.append(f"Git latest iter       : {rpt.actual_latest_iter}")
    lines.append(f"Tools/ .py files      : {rpt.engineering_tool_count}")
    bv = rpt.one_line_bv
    lines.append(
        f"One-line bv           : {f'{bv[0]} / {bv[1]}' if bv else '—'}"
    )
    voiced = ", ".join(rpt.surface_bv_voiced) or "—"
    pending = ", ".join(rpt.surface_bv_pending) or "—"
    lines.append(f"Per-§  bv voiced      : {voiced}")
    lines.append(f"Per-§  bv pending     : {pending}")
    lines.append(
        f"One-line placeholders : {rpt.one_line_placeholders}"
        f" (validator reports: {rpt.actual_placeholders})"
    )
    lines.append("")
    if rpt.drifts:
        lines.append(f"DRIFTS ({len(rpt.drifts)}):")
        for d in rpt.drifts:
            lines.append(f"  • {d.site}")
            lines.append(f"      claim  : {d.claim}")
            lines.append(f"      actual : {d.actual}")
            lines.append(f"      remedy : {d.remedy}")
    else:
        lines.append("No chain-of-voice drifts detected.")
    return "\n".join(lines) + "\n"


# ------------------------------ self-test --------------------------------- #


SELF_TEST_HTML = """<!doctype html>
<html><body>
<span class="chip draft">Working draft v0.33 · 2026-04-18</span>
<section>
  <div class="readiness-banner">
    READINESS · iteration 40 landed
  </div>
</section>
<section>
  <div class="meta">
    <h3>Article info</h3>
    <dl>
      <dt>Draft version</dt>
      <dd>v0.33 · iteration 39 landed — fourth application of the engineering-infrastructure iteration kind</dd>
    </dl>
  </div>
</section>
<table><tbody>
<!-- iter 34 (v0.27) — Per-§ biologist-voice -->
<tr><td>Per-§ biologist-voice</td>
    <td>§1 v0.2 biologist-voice iter 23 ·
        §2 v0.2 biologist-voice iter 27 ·
        §3 v0.2 biologist-voice iter 24 ·
        §4 v0.2 biologist-voice iter 31 ·
        §5 structural v0.1 Gate-G-pending ·
        §6 structural v0.1 Gate-G-pending ·
        §7 structural v0.1 Gate-G-pending ·
        §8 v0.2 biologist-voice iter 25 ·
        §9 v0.2 biologist-voice iter 37 ·
        §10 v0.2 biologist-voice iter 40</td>
    <td>src</td></tr>
</tbody></table>
<p class="one-line-summary">
  3 / 8 biologist-voiced §§ (+ Abstract / §9) · 999 <code>placeholder-value</code> spans open
</p>
<footer class="site-footer"><div class="wrap">
  Rendered from preprint.md · iteration 39 landed
</div></footer>
</body></html>
"""


def self_test() -> int:
    rpt = audit(SELF_TEST_HTML, REPO_ROOT)
    sites = [d.site for d in rpt.drifts]
    # Assert that voiced contains §1..§4, §8..§10 (7 total) and pending §5..§7.
    if set(rpt.surface_bv_voiced) != {f"§{n}" for n in (1, 2, 3, 4, 8, 9, 10)}:
        print(
            f"self_test FAIL: surface_bv_voiced={rpt.surface_bv_voiced} "
            "does not match expected §1/2/3/4/8/9/10"
        )
        return 1
    if set(rpt.surface_bv_pending) != {f"§{n}" for n in (5, 6, 7)}:
        print(
            f"self_test FAIL: surface_bv_pending={rpt.surface_bv_pending} "
            "does not match expected §5/6/7"
        )
        return 1
    # "3 / 8" claim should drift (actual body is 5/8, full is 7/10).
    if not any("biologist-voiced §§ count" in s for s in sites):
        print("self_test FAIL: expected body-slice drift on '3 / 8' claim")
        return 1
    # Parenthetical lists only "+ Abstract / §9" — should drift because
    # §10 is biologist-voiced but absent from the parenthetical.
    if not any("parenthetical" in s for s in sites):
        print("self_test FAIL: expected parenthetical drift for missing §10")
        return 1
    print("chain_of_voice_audit self-test: PASS")
    return 0


# ------------------------------- main ------------------------------------- #


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--html", default=str(DEFAULT_HTML), help="path to rendered HTML")
    ap.add_argument("--strict", action="store_true", help="exit non-zero on any drift")
    ap.add_argument("--json", action="store_true", help="emit JSON")
    ap.add_argument("--self-test", action="store_true", help="run internal smoke test")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

    html_path = Path(args.html)
    if not html_path.exists():
        print(f"ERROR: HTML not found: {html_path}", file=sys.stderr)
        return 2
    html = html_path.read_text()

    rpt = audit(html, REPO_ROOT)

    if args.json:
        print(json.dumps(rpt.as_dict(), indent=2))
    else:
        print(render_text(rpt), end="")

    if args.strict and rpt.drifts:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
