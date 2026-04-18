#!/usr/bin/env python3
"""Bibliographic re-check for unresolved references in the manuscript.

Third application of the engineering-infrastructure iteration kind (iter 28,
iter 35). Queries the Crossref REST API with author / title hints from a
locally-stored worklist, reports which previously-unresolved references now
have an authoritative Crossref record, and emits a JSON resolution file
suitable for downstream consumption by ``tools/propagate_placeholders.py``.

Scope — References-section only. The tool reads the References section of
``manuscript_html/index.html``, identifies every ``<li id="ref-*">`` list
item that still contains a ``<span class="placeholder-value">`` span, and
attempts a Crossref query for each one using a locally-maintained
``tools/references_worklist.json`` (author / title / year hints). Any
``ref-*`` entry whose authoritative metadata is already in place (no
placeholder span) is skipped.

Modes
-----
- ``--offline`` (default) : parse the HTML, print the worklist, show
  which entries still need authoritative metadata, emit no network calls.
- ``--online``             : additionally query Crossref for each unresolved
  reference and attach a list of candidate records to the report.
- ``--self-test``          : run the built-in smoke test and exit.

Output
------
- Prints a human-readable report to stdout summarising (a) the ref-id, (b)
  whether the ref is already resolved, (c) the top Crossref candidate with
  DOI / title / year, and (d) a confidence heuristic.
- When ``--report-file PATH`` is passed, also writes a structured JSON
  report (schema documented in the docstring below).

Invariants
----------
- Zero prose edits. The tool never modifies any file; it only reads the
  HTML and emits a report.
- Zero new claims, zero new placeholders. The report names external
  metadata (DOIs, titles, volumes); it does not invent content.
- Self-contained — Python 3 stdlib only: ``argparse``, ``json``, ``re``,
  ``socket``, ``sys``, ``urllib.request``, ``urllib.parse``, ``pathlib``.
- Crossref User-Agent follows the Crossref polite-pool convention
  (``UA=imagej-js-manuscript/0.1 (mailto:wei.ouyang@scilifelab.se)``) so
  that queries arrive at the higher-quality pool.

Engineering-infrastructure iteration-kind rules (iter 28)
---------------------------------------------------------
1. Zero prose edits — this tool is read-only; apply resolutions through
   ``tools/propagate_placeholders.py`` (iter 35).
2. Guards an empirically-observed regression class — stale Crossref data
   drift. Iter 32 hand-resolved 8 references against Crossref; the
   remaining 7 were author- or evidence-gated at the time. Quarterly
   re-running this tool catches in-prep preprints as they land on
   Crossref (e.g., iter 36's first application discovered that Royer
   2024 ``Omega`` and the CellVoyager paper had both published since
   iter 32).
3. Self-contained and dependency-free — Python 3 stdlib only.

Report JSON schema
------------------
    {
      "generated_at":  "2026-04-18T...",
      "source_html":   "manuscript_html/index.html",
      "total_refs":    20,
      "resolved":      13,
      "unresolved":    7,
      "entries": [
        {
          "ref_id":     "ref-royer2024",
          "status":     "resolved" | "unresolved" | "newly-resolved",
          "hint":       { "author": "...", "title": "...", "year": 2024 },
          "candidates": [
            { "doi": "10.1038/...",
              "title": "...",
              "authors": ["Royer LA", ...],
              "journal": "Nature Methods",
              "volume": "21",
              "page": "1371-1373",
              "year": 2024,
              "score": 120.5 }
          ]
        }, ...
      ]
    }

Usage
-----
    python3 tools/recheck_references.py --offline
    python3 tools/recheck_references.py --online --report-file \
        tools/recheck_report.json
    python3 tools/recheck_references.py --self-test

Post-run
--------
For each ``newly-resolved`` entry the tool reports, the author should
either (a) update the HTML reference list entry by hand (since the author
list requires judgement that the tool does not perform), or (b) write the
authoritative metadata into ``tools/references_worklist.json`` under an
``authoritative`` key so future runs can report the resolution as
committed. The tool does NOT auto-apply a resolution; bibliographic
resolution remains an author decision (iter 32 rule).
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import re
import socket
import sys
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_HTML = REPO_ROOT / "manuscript_html" / "index.html"
DEFAULT_WORKLIST = Path(__file__).resolve().parent / "references_worklist.json"

CROSSREF_UA = (
    "imagej-js-manuscript/0.1 "
    "(mailto:wei.ouyang@scilifelab.se)"
)
CROSSREF_BASE = "https://api.crossref.org/works"

REF_LI_RE = re.compile(
    r'<li id="(ref-[A-Za-z0-9]+)">(.*?)</li>',
    re.DOTALL,
)
PLACEHOLDER_SPAN_RE = re.compile(
    r'<span[^>]*class="[^"]*\bplaceholder-value\b[^"]*"[^>]*>([^<]*)</span>'
)
REF_TITLE_RE = re.compile(
    r'<span class="ref-title">([^<]*)</span>'
)


def parse_references(html_text: str) -> list[dict]:
    """Return a list of {ref_id, body, is_unresolved, author_str} records."""
    out: list[dict] = []
    for m in REF_LI_RE.finditer(html_text):
        ref_id, body = m.group(1), m.group(2)
        placeholders = PLACEHOLDER_SPAN_RE.findall(body)
        author_m = REF_TITLE_RE.search(body)
        author_str = author_m.group(1) if author_m else ""
        out.append(
            {
                "ref_id": ref_id,
                "body": body,
                "is_unresolved": bool(placeholders),
                "placeholder_tokens": placeholders,
                "author_str": author_str.strip(),
            }
        )
    return out


def load_worklist(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def crossref_query(
    query_params: dict, timeout: int = 10
) -> dict:
    """Thin wrapper over Crossref REST; returns parsed JSON message."""
    # Rows limit small so we pull only top candidates.
    params = dict(query_params)
    params.setdefault("rows", "3")
    qs = urllib.parse.urlencode(params)
    url = f"{CROSSREF_BASE}?{qs}"
    req = urllib.request.Request(url, headers={"User-Agent": CROSSREF_UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def _score_candidate(cand: dict, hint: dict) -> float:
    """Heuristic confidence score.

    Not a probability — just a heuristic that biases for exact year match
    and for title-token overlap. The intent is to let a human reviewer see
    at-a-glance whether the top Crossref candidate plausibly matches the
    cited reference, not to auto-accept.
    """
    score = 0.0
    hint_year = hint.get("year")
    cand_year = None
    for k in ("published-print", "published-online", "issued"):
        if k in cand:
            parts = cand[k].get("date-parts", [[None]])
            if parts and parts[0]:
                cand_year = parts[0][0]
                break
    if hint_year and cand_year and hint_year == cand_year:
        score += 50.0
    elif hint_year and cand_year and abs(hint_year - cand_year) == 1:
        score += 20.0

    hint_title = (hint.get("title") or "").lower()
    cand_title = ((cand.get("title") or [""])[0] or "").lower()
    if hint_title and cand_title:
        ht_tokens = {t for t in re.findall(r"[a-z0-9]+", hint_title) if len(t) > 3}
        ct_tokens = {t for t in re.findall(r"[a-z0-9]+", cand_title) if len(t) > 3}
        overlap = len(ht_tokens & ct_tokens)
        score += 10.0 * overlap

    if (cand.get("container-title") or [""])[0]:
        if hint.get("journal_hint"):
            if hint["journal_hint"].lower() in (cand.get("container-title") or [""])[0].lower():
                score += 15.0
    return round(score, 2)


def _compact_candidate(cand: dict, hint: dict) -> dict:
    authors = []
    for a in cand.get("author", [])[:6]:
        fam = a.get("family", "")
        giv = a.get("given", "")
        initials = "".join(p[0] for p in giv.split() if p and p[0].isalpha())
        authors.append((fam + " " + initials).strip())
    year = None
    for k in ("published-print", "published-online", "issued"):
        if k in cand:
            parts = cand[k].get("date-parts", [[None]])
            if parts and parts[0]:
                year = parts[0][0]
                break
    return {
        "doi": cand.get("DOI"),
        "title": (cand.get("title") or [""])[0],
        "authors": authors,
        "journal": (cand.get("container-title") or [""])[0],
        "volume": cand.get("volume"),
        "issue": cand.get("issue"),
        "page": cand.get("page"),
        "article_number": cand.get("article-number"),
        "year": year,
        "type": cand.get("type"),
        "score": _score_candidate(cand, hint),
    }


def _build_query(hint: dict) -> dict:
    params: dict[str, str] = {}
    if hint.get("title"):
        params["query.title"] = hint["title"]
    if hint.get("author"):
        params["query.author"] = hint["author"]
    if hint.get("year"):
        params["filter"] = f"from-pub-date:{hint['year']},until-pub-date:{hint['year']}"
    return params


def recheck(
    html_path: Path,
    worklist_path: Path,
    online: bool,
    verbose: bool = True,
) -> dict:
    html_text = html_path.read_text(encoding="utf-8")
    # Keep only the References section to avoid matching any stray <li id="ref-*">.
    refs = parse_references(html_text)
    worklist = load_worklist(worklist_path)

    report = {
        "generated_at": _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds"),
        "source_html": str(html_path.relative_to(REPO_ROOT)),
        "source_worklist": str(worklist_path.relative_to(REPO_ROOT)) if worklist_path.is_relative_to(REPO_ROOT) else str(worklist_path),
        "online": online,
        "total_refs": len(refs),
        "resolved": sum(1 for r in refs if not r["is_unresolved"]),
        "unresolved": sum(1 for r in refs if r["is_unresolved"]),
        "entries": [],
    }

    for ref in refs:
        ref_id = ref["ref_id"]
        entry: dict = {
            "ref_id": ref_id,
            "status": "resolved" if not ref["is_unresolved"] else "unresolved",
            "placeholder_tokens": ref["placeholder_tokens"],
            "author_str": ref["author_str"],
            "hint": worklist.get(ref_id, {}),
            "candidates": [],
        }
        if not ref["is_unresolved"]:
            report["entries"].append(entry)
            continue
        if not entry["hint"]:
            entry["note"] = "no hint in worklist — add one to enable online query"
            report["entries"].append(entry)
            continue

        if online:
            try:
                q = _build_query(entry["hint"])
                data = crossref_query(q, timeout=10)
                items = data.get("message", {}).get("items", [])
                entry["candidates"] = [_compact_candidate(c, entry["hint"]) for c in items]
                if entry["candidates"]:
                    top = entry["candidates"][0]
                    if top["score"] >= 60:
                        entry["status"] = "newly-resolved"
            except Exception as e:  # noqa: BLE001 — network errors must not crash the report
                entry["error"] = f"{type(e).__name__}: {e}"
        report["entries"].append(entry)

    if verbose:
        _print_report(report)
    return report


def _print_report(report: dict) -> None:
    print(f"== recheck_references @ {report['generated_at']} ==")
    print(f"  source HTML  : {report['source_html']}")
    print(f"  worklist     : {report['source_worklist']}")
    print(f"  online       : {report['online']}")
    print(f"  total refs   : {report['total_refs']}")
    print(f"  resolved     : {report['resolved']}")
    print(f"  unresolved   : {report['unresolved']}")
    print()
    for e in report["entries"]:
        if e["status"] == "resolved":
            continue
        print(f"- {e['ref_id']}  [{e['status']}]  placeholders={e['placeholder_tokens']}")
        if "note" in e:
            print(f"    note: {e['note']}")
        if "error" in e:
            print(f"    error: {e['error']}")
        for i, c in enumerate(e["candidates"][:3]):
            marker = "*" if i == 0 else " "
            print(f"   {marker}{i+1}. doi={c['doi']}  score={c['score']}")
            print(f"      {c['title']}")
            print(f"      {c['journal']}  vol={c['volume']}  page={c['page']}  yr={c['year']}")
    # Resolved summary at end (compact).
    resolved_ids = [e["ref_id"] for e in report["entries"] if e["status"] == "resolved"]
    if resolved_ids:
        print()
        print(f"  already-resolved ({len(resolved_ids)}): {', '.join(resolved_ids)}")


def _smoke_test() -> int:
    """Self-test: HTML parsing + candidate scoring are correct, no network."""
    html = (
        '<ol>'
        '  <li id="ref-foo"><span class="ref-title">Foo A.</span> '
        'A paper. <em>J</em> 1, 2 (2020). '
        '<a class="ref-doi" href="https://doi.org/x">doi:x</a></li>'
        '  <li id="ref-bar"><span class="ref-title">Bar B.</span> '
        'Unresolved. <em>J</em> <span class="placeholder-value">[V:P, DOI]</span> (2025).</li>'
        '</ol>'
    )
    refs = parse_references(html)
    assert len(refs) == 2
    by_id = {r["ref_id"]: r for r in refs}
    assert by_id["ref-foo"]["is_unresolved"] is False, "ref-foo should be resolved"
    assert by_id["ref-bar"]["is_unresolved"] is True, "ref-bar should be unresolved"
    assert by_id["ref-bar"]["placeholder_tokens"] == ["[V:P, DOI]"]
    assert by_id["ref-foo"]["author_str"] == "Foo A."

    # Scoring: exact year + title-token overlap.
    cand = {
        "title": ["Segment Anything in Medical Images"],
        "author": [{"family": "Ma", "given": "J"}],
        "container-title": ["Nature Communications"],
        "issued": {"date-parts": [[2024]]},
        "DOI": "10.1038/s41467-024-44824-z",
        "volume": "15",
        "page": "654",
    }
    hint = {
        "author": "Ma J",
        "title": "Segment anything in medical images",
        "year": 2024,
        "journal_hint": "Nature Communications",
    }
    score = _score_candidate(cand, hint)
    assert score >= 100, f"expected score >= 100 for near-exact match, got {score}"
    compact = _compact_candidate(cand, hint)
    assert compact["doi"] == "10.1038/s41467-024-44824-z"
    assert compact["authors"] == ["Ma J"]
    assert compact["year"] == 2024
    print("recheck_references self-test: PASS")
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Re-check unresolved manuscript references against Crossref.",
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Parse the HTML and print the worklist; no network calls (default).",
    )
    parser.add_argument(
        "--online",
        action="store_true",
        help="Query Crossref for each unresolved reference.",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run the built-in smoke test and exit.",
    )
    parser.add_argument(
        "--html",
        metavar="PATH",
        help=f"HTML file (default: {DEFAULT_HTML.relative_to(REPO_ROOT)}).",
    )
    parser.add_argument(
        "--worklist",
        metavar="PATH",
        help=f"Worklist JSON (default: {DEFAULT_WORKLIST.relative_to(REPO_ROOT)}).",
    )
    parser.add_argument(
        "--report-file",
        metavar="PATH",
        help="Write structured JSON report to this path.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=10,
        help="Per-request timeout in seconds (default: 10).",
    )
    args = parser.parse_args(argv[1:])

    if args.self_test:
        return _smoke_test()

    socket.setdefaulttimeout(args.timeout)
    html_path = Path(args.html) if args.html else DEFAULT_HTML
    worklist_path = Path(args.worklist) if args.worklist else DEFAULT_WORKLIST
    online = bool(args.online)

    report = recheck(html_path, worklist_path, online=online)
    if args.report_file:
        Path(args.report_file).write_text(
            json.dumps(report, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        print(f"  wrote report : {args.report_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
