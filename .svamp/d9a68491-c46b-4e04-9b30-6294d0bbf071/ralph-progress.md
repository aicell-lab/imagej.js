# Ralph Loop Progress — ImageJ.JS Nature Methods pitch

## Patterns

- **Primary working doc is `preprint.md`** in repo root. It contains framing, pillars, spine,
  evidence status, risks, venue strategy — and, from iteration 1 onward, drafted prose sections
  appended in order. Evidence inputs live in `survey_production_*`, `replay_week1_report.md`,
  `survey_pilot_report.md`, `use_cases.md`, `collaboration_*.md`.
- **Framing (locked 2026-04-18)**: A+B unified, hybrid AI-posture. A = small-data majority
  (measurement); B = human-centric science (framing). Paper's *contribution is AI-free*; §8
  Discussion concedes complementarity with the agentic-bioimage landscape and cites the
  companion paper. See preprint.md §"Core framing" — any new prose must conform.
- **Numbers in the abstract and headlines must be marked `[…]` until verified.** Interim
  numbers we *can* cite (80-row v2 survey): 48 % small-data human-scale regime; 48 % ImageJ/Fiji
  any-mention; 20 % DL usage; 33 % not-classifiable residual. These supersede the pilot's 75 %
  / 84 % numbers, which are superseded by the stricter v2 schema.
- **Replay findings (3-candidate pilot)** produced two scientifically interesting results that
  strengthen the paper: (1) published figshare bundles are internally inconsistent (Drosophila
  NMJ 2016), (2) Fiji Find-Edges drifted 2017→2026 in a core primitive (MRI Wound Healing 2020).
  Both are argued *for*, not apologised for.
- **Out-of-scope guardrails**: no AI/agent hooks in abstract or main body; capsule/verifiable-
  figure terminology retired; OME-Zarr / GPU / big-image out of scope; URL-encoded mechanics
  demoted to pillar 2 subsection.
- **Venue strategy**: NM Brief Communication primary → NM full article if pillars 1+2+one of
  {3,4,5} rigorously delivered → eLife Tools → bioRxiv-only fallback.
- **Progress-file rule**: APPEND never replace. This `## Patterns` block at the top is the one
  place that may be edited in place when a reusable pattern is added.
- **Figures are committed as slots-with-claims before captions are drafted.** Iteration 8's
  Figure-slots-and-captions block (2026-04-18) introduces a discipline for figures that
  mirrors the References no-un-sourced-claim rule: for every figure referenced in the spine,
  record (i) a one-sentence claim the figure must make, (ii) the named evidence source that
  will furnish the data, (iii) panel structure if it is commitable without new evidence,
  and (iv) a full draft caption only when the figure is NOT evidence-gated. Fig 1 (long-tail
  distribution), Fig 2 (needs→features), Fig 3 (replay matrix) qualify for full captions at
  v0.1 because their structure is determined by already-landed evidence; Fig 4 (teaching),
  Fig 5 (clinical), Fig 6 (collaboration) + Supp Vid 1 carry caption placeholders only, so
  the writer is not tempted to invent partner names, enrolments, or case panels ahead of the
  real partnership. The block also records the Brief-Comm condensation path (collapse Figs
  3–6 into one multi-panel "field evidence" figure) so the venue-reconciliation decision is
  mechanical, not editorial.
- **Online Methods twin-binds to §10 Availability.** The Online-Methods
  subsection order (Iteration-9, 2026-04-18) was chosen to parallel §10
  paragraph structure: every Methods subsection names at least one §10
  artefact (`survey_production_v2.csv`, `longtail_tasks.md`,
  `replay/<candidate>/`, `hypha-imagej-service.js`, `collab/`, the
  `v1.0-paper` git tag, Zenodo DOI), and every §10 artefact appears in
  at least one Methods subsection. This twin-binding is the Methods-side
  equivalent of the References cross-reference map: it prevents the
  symmetric failure modes (*a Methods subsection promises an instrument
  that §10 does not ship*; *§10 ships an artefact that no Methods
  subsection explains how to re-execute*). Any future edit to Methods or
  §10 must preserve the binding in one pass — edit both surfaces in the
  same iteration. At submission-pass condensation, if a Methods subsection
  collapses to one sentence under venue constraints, the §10 artefact
  it binds to must also be demoted to its supplementary pointer; if a
  §10 artefact is de-scoped, the corresponding Methods subsection must be
  removed, not just edited down.
- **Supplementary material outline is the prose-side counterpart to the figure
  reconciliation block.** Iteration 10 (2026-04-18) added
  `preprint.md §"Drafted prose — Supplementary material outline (v0.1)"` and
  the corresponding editorial appendix in `manuscript_html/index.html`.
  The outline allocates every drafted-prose paragraph and every figure slot
  to a venue-specific location (Brief Communication or full Article) on
  strict word-budget grounds. It does NOT make editorial claim decisions —
  those live in the drafted-prose blocks. The outline has three structural
  rules: (i) heading-anchored rows (e.g., `§1 ¶2`) survive prose edits, so
  the allocation table and the prose evolve independently; (ii) the
  "figure cannot be in main body with calling prose demoted" invariant
  binds the prose outline to the Figure slots block; (iii) AI-discussion
  containment holds in supplementary too — AI-adjacent paragraphs go to
  `§8 Supplementary`, never to an unmarked supplementary note. Future
  evidence-gated prose (§§2, 4, 5, 6, 7 paragraphs) appends one row per
  block to both allocation tables in the landing iteration, never as a
  follow-up pass. The outline block is styled distinctly in the HTML
  (green/amber/red/blue allocation legend, striped tables) so it is
  visually obvious that it is a submission-engineering artefact, not body
  prose.
- **Manuscript HTML rendering is served out-of-tree.** Iteration 8 generated
  `manuscript_html/index.html` — a Nature Methods-styled, self-contained HTML rendering of
  the drafted prose assembled into paper order (Abstract → §§1–10 → References → Cover
  letter) with inline SVG-free panel schematics for Fig 1, Fig 2, Fig 3 and reserved
  evidence-gated placeholders for Fig 4, Fig 5, Fig 6. The file is the *view*; `preprint.md`
  remains the canonical source. Future renderings should regenerate from `preprint.md` and
  MUST NOT be edited by hand in the HTML file — edit the working doc, re-render. Served via
  `svamp serve manuscript ./manuscript_html --public` so the author team and the editor (on
  request) can read the current-state view without a markdown-aware client. The served URL
  is recorded in the iteration-8 progress entry; re-running `svamp serve` replaces the mount
  in place, so the URL is stable across re-renders.
- **Drafted-prose convention**: append as `## Drafted prose — §N [section] (v0.1, YYYY-MM-DD)`
  at the bottom of `preprint.md`. Do not touch the scaffolding sections above (Core framing,
  Pillars, Spine, Evidence status, Risks, Venue). Placeholders `[X]`/`[N]` for pending numbers;
  bracketed citations use author–year form and are converted at formatting time.
- **Named code mechanisms are cite-ables.** `hypha-imagej-service.js` exposes `runMacro`,
  `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`. URL params read by
  `index.html`/`hypha-imagej-service.js` include `mount`, `plugins.dir`, `server_url`,
  `workspace`, `token`. Use these exact names when prose asserts a mechanism exists — it
  grounds the paper in code reviewers can `git grep`.
- **Design-principles = needs-to-features mapping in prose, not a table.** The §3 draft
  (2026-04-18) wires each design decision (continuity-with-Fiji, zero-install-as-correctness,
  URL-addressable-reproducibility, in-tool collaboration, deliberate non-design) to one
  small-data/human-centred need from §1–§2 and one named codebase mechanism. Reviewers can
  falsify each principle independently. Future prose should maintain this needs↔mechanism
  discipline.
- **"Regime not ranking" is the AI-discussion frame.** The §8 draft (2026-04-18) argues
  that the correct answer to "classical or DL?" is not a method ranking but a regime
  characterisation: large-data/in-distribution → DL; long-tail/small-data/human-centred →
  classical + ImageJ.JS; composition via Hypha-RPC + MCP endpoint (`convertToMcpUrl`) for
  problems that span both. Any cover letter, response-to-reviewers, or public summary that
  has to address AI should use this frame, not a defensive "we're not anti-AI" frame.
- **Cover letter = rephrasing, not new argument.** The 2026-04-18 cover letter draft
  deliberately introduces no claim, number, or citation that is not already in the
  drafted Abstract/§1/§3/§8. Every placeholder (`[48]%`, `[20]%`, `[X]` IoU, `[N]`
  replay corpus, `[DAU]`, `[URL]`) has the same resolution path as its occurrence in
  the body. This keeps the cover letter automatically consistent when evidence lands —
  updating the body once propagates here. Future public-facing summaries (editor
  responses, pre-submission emails, conference abstracts) should follow the same rule:
  rephrase from the draft body, don't paraphrase into new ground.
- **§10 Availability = promise-the-editor-can-audit, not a feature list.** The §10
  draft (2026-04-18) reads as an index of checkable artefacts: for every empirical
  claim in the paper there is a named, shipped file or directory
  (`longtail_tasks.md`, `replay/<name>/MATCH_REPORT.md`, `survey_production_v2.csv`,
  `hypha-imagej-service.js:880`) that a reviewer can retrieve and verify. No feature
  appears that is not already wired to a §1–§8 claim; no claim is left without its
  resolving artefact. This discipline — every mechanism binds to an empirical
  commitment — is the inverse of the usual Availability-section temptation to list
  capabilities for marketing. Future availability, data-availability, or
  reproducibility-checklist passes should follow the same binding rule.
- **§9 = methodology-research argument, not a summary.** The §9 draft (2026-04-18)
  deliberately introduces one new move that appears nowhere else in the paper:
  it proposes two evaluative criteria — *regime fit* and *regime correctness* —
  as a vocabulary methodology review currently lacks for scoring tool papers
  whose contribution is not algorithmic novelty. Discussion sections in tool
  papers tend to degrade into a summary of the preceding evidence; §9's role is
  the opposite: to *extract a procedural argument* that the evidence warrants
  but does not itself state. Future Discussion-style prose (response to
  reviewers, editorial letters after real reviews land, conference talks)
  should continue to treat the discussion section as the place where the
  paper's evidence is translated into an argument *about the literature*,
  not rehearsed against it. AI stays contained to §8 — §9 mentions agentic
  bioimage only to note that the human-centred substrate is a prerequisite
  for agentic work that takes data-governance seriously; no new AI claim.
- **Title-lock discipline (2026-04-18).** The title is now locked in place at
  `preprint.md §"Title (locked 2026-04-18)"`. Two rules follow: (i) a retired
  title variant must not be re-introduced by a future prose pass even when it
  reads better in isolation — the lock is cross-document scaffolding; (ii) any
  re-lock requires a full sweep of Abstract / §1 / §3 / §8 / §9 / §10 / Cover
  letter for phrases that would implicitly favour the new variant, BEFORE the
  lock is changed. The lock block itself records the rationale so that future
  iterations (or reviewers) can see *why* the retired variants were retired,
  not just *that* they were. Do not delete that rationale block during
  submission-pass condensation — it is one of the few places in the working
  doc where editorial reasoning is preserved.
- **No invented bibliographic metadata.** The References v0.1 block
  (2026-04-18) enforces a hard rule: if a journal volume, page range, or DOI
  has not been verified against the journal record, it is written as
  `[VOL:PAGES, DOI]` or `[DOI]`, not guessed. Inventing DOIs or volume numbers
  — even confidently — is the single highest-risk source of bibliographic
  corruption in a late submission pass; reviewers and copy editors will
  catch invented metadata and it reads as sloppy. Any future References
  edit (by a new iteration or a human co-author) must preserve this rule:
  if you cannot verify, leave the placeholder.
- **Reference cross-reference map is load-bearing.** The References v0.1
  block ends with a table mapping each citation to every drafted-prose block
  it appears in. This is not documentation — it is the instrument that
  prevents the canonical failure mode of multi-section prose: a citation
  gets renamed in one section ("Stringer 2025" → "Cellpose3") while three
  other sections keep the old form. When a reference is finalised, update
  both the References entry AND every row of the map AND the in-prose
  citation in each referenced block, in one pass. Do not let the map drift.
- **Reviewer-response dry run is a defensibility instrument, not a draft
  letter.** Iteration 12 (2026-04-18) added
  `preprint.md §"Drafted prose — Reviewer-response dry run (v0.1, 2026-04-18)"`
  and the corresponding `<section class="dry-run" id="dry-run">` in the
  HTML render. The block catalogues 12 anticipated objections (9 from
  the Risks table + 3 out-of-table) and for each names the resolving
  prose surface or the gating §10 artefact. Two rules govern this
  artefact and any future iteration of it: (i) the dry run MUST be
  visually and prose-marked as "DRY RUN" — banner in the HTML, status
  block at the top of the prose — so it is never mistaken for a draft
  of the response-to-reviewers letter; (ii) every objection's response
  must be derivable from already-drafted prose, already-shipped
  artefacts, or a named §10 artefact label `EVIDENCE-GATED`. The
  pattern bullet about NOT drafting response-to-reviewer prose before
  submission still stands; the dry run is the *inverse* artefact —
  it stress-tests the body's defensive load so the eventual response
  letter can be derived from body prose rather than added to it. The
  defensibility scorecard at the bottom of the block (current: 10/12
  answerable from drafted prose, 1 partial, 1 evidence-gated) MUST
  be re-computed at every iteration that drafts new prose or lands
  new evidence; any drop in the answerable count is a regression
  triggering a prose-pass review. The HTML uses an amber/orange
  colour scheme distinct from the manuscript-body sections, so the
  reader (or a future co-author) can see at a glance that the section
  is submission-engineering not body prose, mirroring the supp-outline
  green/amber/red allocation legend and the release-engineering blue
  border.
- **Submission packet is the author-gated twin of the evidence-gated body
  prose.** Iteration 13 (2026-04-18) added `preprint.md §"Drafted prose —
  Submission packet (v0.1)"` and the corresponding
  `<section class="submission-packet" id="submission-packet">` in the HTML
  render, styled with a teal (#2a6b7c) left-border accent distinct from
  cover-letter serif, supp-outline green/amber/red, release-eng blue, and
  dry-run amber. The packet carries editor's summary, key points, author
  contributions (CRediT), competing interests, a condensed data/code
  availability statement, acknowledgements, and suggested/opposed
  reviewers. Three rules govern this artefact and any future iteration of
  it: (i) every claim in the packet MUST be a rephrasing of body prose
  already drafted in §§1–10 or Online Methods — introducing new
  commitments through the packet is a discipline regression and must be
  reverted; (ii) placeholders in the packet are `AUTHOR-GATED` (resolved
  at sign-off) or share their resolution path with the body (e.g.,
  `[URL]`, `[DOI]`, `[LICENCE]`) — *no packet field may be
  `EVIDENCE-GATED`*, and the packet scorecard at the bottom of the block
  must record zero evidence-gated fields at every iteration; (iii) the
  structural commitment behind each placeholder field (CRediT roles
  claimed; three-domain reviewer breakdown; acknowledgement of CheerpJ /
  Fiji / Hypha substrate) is fixed at draft time and is independent of
  the placeholder resolution — a reviewer can audit the structural
  commitment without the resolved names. This is the author-gated twin
  of the dry-run's answerable-from-prose discipline and of the
  supp-outline's allocation discipline: an editorial-machinery artefact
  that makes its own completeness measurable. At submission the packet
  graduates from `AUTHOR-GATED` to `READY` via one sign-off pass, not
  one evidence drop.
- **Submission readiness dashboard is the unifier of scattered scorecards.**
  Iteration 14 (2026-04-18) added
  `preprint.md §"Drafted prose — Submission readiness dashboard (v0.1)"`
  and the corresponding `<section class="readiness" id="readiness">` in the
  HTML render, inserted as the first editorial appendix (immediately
  before Cover letter) so that an editor or co-author opening the rendered
  page sees the unified readiness posture before any of the source
  scorecards. Distinct violet (#6b4c93) palette distinct from the five
  previously introduced editorial-appendix palettes (cover-letter serif,
  supp-outline green/amber/red, release-eng blue, dry-run amber, packet
  teal). Three rules govern this artefact and any future iteration of it:
  (i) **rephrasing only** — no dashboard row introduces a measurement,
  count, or commitment not already reported in a source block (dry-run
  scorecard; packet scorecard; figure-slot table; references verification
  state; corpus counts; placeholder list); new measurements land in a
  source block first and only then flow into the dashboard; (ii)
  **synchronised in-pass** — any future iteration that touches a source
  scorecard MUST update the dashboard in the *same* iteration, or a
  silent regression is opened, because the dashboard is only load-bearing
  if it is kept in sync with its sources; (iii) **not a release
  trigger** — Gate MET / PENDING labels report status but do not
  constitute a decision to submit, which requires author-team sign-off
  against Gates A–J (Gate A = prose coverage, B = defensibility, C =
  packet non-regression, D = regime survey, E = long-tail benchmark, F =
  replay corpus, G = partner landings, H = references verification, I =
  author sign-off, J = placeholder resolution). Three gates (A, B, C)
  are currently MET; seven are PENDING. The dashboard is the at-a-glance
  counterpart to the per-block scorecards: it does not replace the
  dry-run's 10/12 defensibility score or the packet's 4/4/0 scorecard,
  but it makes them visible from a single screen. At submission the
  dashboard is the auditable record that Gates A–J all resolved before
  sign-off.
- **Life Sciences Reporting Summary is the empirical-commitment-driven
  twin of the author-gated Submission packet.** Iteration 15
  (2026-04-18) added `preprint.md §"Drafted prose — Life Sciences
  Reporting Summary (v0.1)"` and the corresponding
  `<section class="reporting-summary" id="reporting-summary">` in the
  HTML render, styled with a rose/coral palette (#b8325a border-left,
  #fdf0f3 background) distinct from cover-letter serif, supp-outline
  green/amber/red, release-eng blue, dry-run amber, packet teal, and
  dashboard violet. The block is a pre-flight of the Nature Portfolio
  Life Sciences Reporting Summary — the mandatory editorial-integrity
  form every NM first submission must upload. Three rules govern this
  artefact and any future iteration of it: (i) **rephrasing only** — no
  response slot introduces a commitment not already specified in Online
  Methods, §10, Release engineering, or Submission packet; new protocol
  details must first appear in Methods; (ii) **synchronised in-pass** —
  any iteration that edits Methods or §10 MUST re-render this block in
  the same iteration or a silent editor-catchable regression opens; (iii)
  **zero AUTHOR-GATED is the invariant** — unlike the Submission packet,
  the Reporting Summary response space is shaped by empirical protocols
  committed in Methods, not author discretion; a response labelled
  AUTHOR-GATED is a discipline regression. The scorecard at the bottom
  of the block tracks READY / PARTIAL / EVIDENCE-GATED / N/A counts by
  section and MUST be re-computed in any iteration that touches Methods
  or §10. This is the fourth editorial-machinery scorecard (after
  dry-run, packet, and readiness dashboard) and the fifth completeness
  instrument on the submission readiness dashboard. Iteration 15's
  ledger: 22 READY / 0 AUTHOR-GATED / 3 EVIDENCE-GATED of 25 slots.
- **Partial placeholder resolution from repository-self-knowable values
  is tractable without the full propagation script.** Iteration 15
  (2026-04-18) resolved three labels that do not depend on
  evidence-landing or author sign-off: `[URL]` → `https://ij.aicell.io`
  (from `CNAME`), `[URL/github]` → `https://github.com/aicell-lab/imagej.js`
  (from `git remote`), `[LICENCE]` → `MIT` (from `package.json`).
  Replacements are targeted to *body prose* occurrences only — meta
  references (Risks-table Zenodo-specific row, dashboard placeholder
  inventory, scoreboard metadata listing labels) are updated to record
  *that* the labels are resolved, rather than edited to remove the label
  reference. In the HTML render, resolved values use inline `<code>`
  (URLs) or `<strong>` (MIT) rather than the `placeholder-value` span;
  this visually distinguishes resolved from unresolved placeholders
  without introducing a new CSS class. The pattern here is that
  repository self-knowable placeholders can be resolved by a direct
  targeted pass without waiting for the full regex-over-file
  propagation script; ~3 of ~25 labels drop in one iteration at low
  risk (each replacement is a single Edit with unique context).
  This promotes Gate J from `PENDING` to `PENDING — PARTIAL` on the
  readiness dashboard.
- **Release engineering is the Methods ↔ Availability binding at release-
  artefact granularity.** Iteration 11 (2026-04-18) added
  `preprint.md §"Drafted prose — Release engineering (v0.1)"` and the
  corresponding `<section class="release-eng" id="release-eng">` in the
  HTML render, inserted between Online Methods and References. This closes
  a three-way binding that Online Methods §4 ("how we pinned it") and §10
  Availability ("where it's archived") could not close on their own. The
  prose names the five pinned components (CheerpJ JVM, Fiji binary, plugin
  manifest, JS entry, Web Worker pool runtime), the `build_v2.py` →
  `dist/MANIFEST` SHA-256 contract, the deliberately-NOT-pinned set
  (browser + host OS, with `mount=`-disabled and Playwright fallbacks
  named), and the post-`v1.0-paper` release cadence (`v1.1`, `v1.2`, …
  never replace `v1.0-paper`; Hypha-RPC method-surface compatibility
  contract across releases). The HTML render uses a 5-row pin table
  (Component / Pin site / Contribution) so future pinned-component
  changes update one row rather than rewrite the prose — the same
  row-discipline as References entries and the Supp outline allocation
  table. Future release iterations must preserve the Methods §4 ↔
  Release eng ↔ §10 three-way binding in any edit pass: every artefact
  named in §Release engineering must be nameable from either Methods §4
  or §10; no release-engineering contract may be introduced that is not
  reachable from the reviewer-facing Methods + Availability surfaces.

---

## 2026-04-18 — Iteration 1: drafted §1 Introduction + tightened abstract

### What was implemented

- Drafted `preprint.md §"Drafted prose — §1 Introduction (v0.1)"` — a complete, ~680-word,
  four-paragraph, publication-readable Introduction that follows the A+B framing locked
  upstream. Opens with the 13–27-cells-per-condition anchor from Lord 2024; establishes the
  regime gap; positions ImageJ.JS as the tool for the under-served majority; closes with the
  four paper contributions.
- Rewrote the Abstract as v0.5 (from v0.4) using the 80-row v2 LLM-upgraded survey numbers
  (48 % / 48 % / 20 %), clearly labelled as *interim*. Dropped from ~270 words to ~230 words
  by removing a clause ("under-tooled a decade of AI-first research") duplicated elsewhere in
  the spine. Preserved all bracketed placeholders where evidence has not landed.
- No claims in the drafted prose are un-sourced; every number maps to either the v2 survey
  report (`survey_production_upgrade_report.md`), the replay Week-1 report, or a cited paper
  (Lord 2024, Schneider 2012, Schindelin 2012, Kirillov 2023, Stringer 2025, Schmidt 2018,
  Israel 2025, Ma 2024, Archit 2024).

### Files changed

- `preprint.md` — appended two "Drafted prose" sections at the bottom (§1 Introduction and
  the v0.5 Abstract). No existing content modified.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this file, created.

### Learnings for future iterations

- **The working doc is a scaffolding + drafted-prose hybrid.** Future prose drafts
  (Introduction is done; next candidates are §3 Design principles, §8 Discussion, then the
  cover-letter) should follow the same convention: append as `## Drafted prose — §N [section]
  (v0.1, YYYY-MM-DD)` blocks at the bottom of `preprint.md`. Do not edit the existing
  scaffolding sections (Core framing, Five narrative pillars, Paper spine, Empirical evidence
  status, Evidence gaps, Risks, Venue strategy) — those are shared context, not draft text.
- **Every number needs a source and a trafficable bracket.** If a claim will be revisited once
  more evidence lands (remaining 120 survey rows, full replay corpus, course/clinical
  partners), wrap it in `[…]`. The v0.4→v0.5 abstract diff is the template.
- **Don't touch the retired framings** (capsule, verifiable figure, agentic bioimage) — they
  are explicitly superseded by the A+B hybrid. If a new argument from upstream context
  mentions them, resist reintroducing them; their strongest ideas already survive inside the
  current pillars 2 and 3.
- **Highest-value next iteration**: draft §3 Design principles (needs-to-features mapping
  table in prose) — this is the other section that most needs prose and for which all the
  source material already exists in `collaboration_design.md`, `use_cases.md`, and
  `hypha-imagej-service.js`.
- **Do not repeat the cover letter yet.** The cover letter should follow after §3 and §8 are
  drafted; it rephrases their headline claims. Writing it before them means rewriting it after.

---

## 2026-04-18 — Iteration 2: drafted §3 Design principles + mapping prose

### What was implemented

- Drafted `preprint.md §"Drafted prose — §3 Design principles (v0.1, 2026-04-18)"` — five
  paragraphs (~900 words) structured as a needs-to-features mapping. Five principles, each
  tying a small-data/human-centred need from §§1–2 to a named codebase mechanism:
  1. **Continuity with the substrate the field already opens** — unmodified Fiji/ImageJ
     codebase compiled by CheerpJ 4 → 48 % ImageJ/Fiji-any-mention survey number as warrant.
  2. **Zero install as correctness, not ergonomics** — served as one HTML page + WASM;
     File System Access API for local-stack reads; no cloud round-trip → teaching,
     field-eco, pathology, forensic-histology scenarios all downstream of this invariant.
  3. **Reproducibility as URL-addressable state** — URL params (`open=`, `macro=`, `rois=`,
     `mount=`, `plugins.dir=`) → pinned CheerpJ JVM artefact (no silent updates) →
     Hypha-RPC service-layer verifier (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`,
     `executeJavaScript`). Cites the Week-1 replay finding (MRI Wound Healing 2020,
     Find-Edges drift) as a worked negative case the pinned runtime avoids.
  4. **Collaboration as a tool property, not a data pipeline** — Hypha driver/observer
     protocol → no image movement → per-participant authenticated log. Points to §7 and
     `collaboration_design.md`.
  5. **Deliberate non-design** — OME-Zarr pyramids, GPU-accelerated DL inference, batch
     training explicitly out of scope; defended as preserving the zero-install and
     client-side invariants rather than as admissions of incompleteness.
- Every mechanism named in the prose is grounded in actual code: URL param parsing in
  `index.html:447–450` and `hypha-imagej-service.js:867–877`; RPC service registration in
  `hypha-imagej-service.js:1567–1578` with schema objects starting at `:48` (runMacro),
  `:143` (takeScreenshot), `:379` (executeJavaScript), `:657` (getRoisAsGeoJson).
- Added two new pattern entries to the top-of-file `## Patterns` block:
  (a) named-code-mechanisms-as-citeables, (b) design-principles = needs-to-features in prose.

### Files changed

- `preprint.md` — appended §3 Design principles drafted-prose block (after the v0.5 Abstract).
  No existing content modified.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — appended this entry;
  added two pattern bullets at the top of the Patterns block.

### Learnings for future iterations

- **The §3 mapping anchor is reusable.** Any later methods-style section should adopt the
  same needs↔mechanism structure: one paragraph per principle, each tying a §2-empirical
  need to a named code mechanism a reviewer can `git grep`. Prefer this to a bulleted
  table — prose forces the writer to justify the link.
- **Code-file line references are the strongest form of evidence in a design section.**
  The prose cites symbolic anchors (`runMacro`, `open=`, `plugins.dir=`) rather than
  abstract capabilities. Future drafts should continue to anchor in identifiers that
  outlast any given prose pass.
- **Avoid adding features on the fly.** The draft deliberately omits capabilities not yet
  shipped (e.g., Mode B CRDT multiplayer, agentic orchestration) even when they would
  sound impressive. Everything cited is in the shipped codebase or the accepted v1 scope
  (`collaboration_sprint.md`).
- **Highest-value next iteration**: draft §8 Limits-and-complementarity prose. The
  agentic-bioimage landscape placeholder paragraph already exists (§8 Discussion —
  draft paragraph) but needs companion prose on (a) when DL is the right tool (what
  §8 promises), (b) the foundation-model benchmark result sketch (pending numbers
  but the argument form is already clear), (c) the Hypha-RPC composition point as the
  concrete boundary. All material exists in `preprint.md` sections §8 Discussion
  placeholder, the kill criteria, and `hypha-imagej-service.js` MCP URL conversion
  (`convertToMcpUrl`, line 880–883).
- **Do not draft §4/§5/§6/§7 prose yet.** Those pillars all require empirical numbers
  (replay corpus scaling, course enrolment, clinical partner, collaboration demo videos)
  that are not yet in. Drafting §8 next keeps the Discussion sharp for the cover letter
  and insulates against reviewers' expected "AI pushback" during pre-submission inquiry.
- **Interim number discipline still holds.** Abstract and §1 already locked at [48]% /
  [20]% with brackets. §3 reuses the 48 % ImageJ-any-mention figure once, same bracket
  convention. Do not let §8 or cover-letter drafts drop the brackets even when the
  sentence reads smoother.
- **Nono sandbox note (from global CLAUDE.md):** the progress-file and preprint.md paths
  are both inside /Users/weio/workspace/imagej.js/ — accessible. Nothing needed outside.
---

## 2026-04-18 — Iteration 3: drafted §8 Limits and complementarity prose (v0.1)

### What was implemented

- Drafted `preprint.md §"Drafted prose — §8 Limits and complementarity (v0.1, 2026-04-18)"` —
  five paragraphs, ~950 words. Structure:
  1. **Regime question.** Frames §8 as regime-choice, not tool-ranking. Pre-empts the
     "anti-AI" read and scopes rather than refutes.
  2. **Where DL is the right tool.** Large-data, in-distribution, throughput-critical:
     high-content screens, connectomics, long time-lapse. Names Cellpose [Stringer &
     Pachitariu 2025], StarDist [Schmidt et al. 2018], CellSAM [Israel et al. 2025],
     deepImageJ [Gómez-de-Mariscal et al. 2021]. Explicit: "none in competition with
     ImageJ.JS."
  3. **The long-tail benchmark result.** Grounds in the 30-task `longtail_tasks.md` set
     (rare organisms, non-fluorescent stains, phone/tablet acquisitions). Placeholders
     [X] mean-IoU, [Y]/30 foundation-model success, [Z]/30 human+ImageJ.JS success.
     Cites CellSAM authors' own concession (Israel et al. 2025) + Ma et al. 2024 +
     Archit et al. 2024. Argument form: not "DL is wrong", but "distributional
     assumption does not hold in the long tail."
  4. **Hypha-RPC as composition, not competition.** Names the service methods
     (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`) and
     cites `convertToMcpUrl` at `hypha-imagej-service.js:880` for the MCP endpoint.
     "The boundary we draw is a boundary of contribution and of scope, not of
     composability."
  5. **The agentic-bioimage landscape.** Refined version of the existing §8 Discussion
     placeholder. Omega [Royer et al. 2024], napari-mcp (2025), BioImage-Agent (2026),
     CellVoyager [Chen et al. 2026]. Companion paper cited as Ouyang et al., in
     preparation. Closes on "regime, not ranking."
- Added one pattern at top of progress file: **"Regime not ranking" is the AI-discussion
  frame** — for any future cover-letter or response-to-reviewer prose that has to
  address AI.

### Files changed

- `preprint.md` — appended §8 drafted-prose block (after the §3 Design principles v0.1
  block). No existing content modified. Total file now 303 lines / ~6,880 words.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — appended this
  entry; added one pattern bullet at the top.

### Learnings for future iterations

- **The existing §8 Discussion placeholder paragraph (preprint.md ~line 245) should
  not be deleted.** It remains useful as a scaffolding anchor — the v0.1 drafted prose
  refines but does not yet fully replace it. At formatting time (cover-letter /
  submission pass), collapse the two: the drafted prose is the body, the placeholder
  was the planning commitment, and the Discussion in final form is one paragraph
  inside §8 rather than a standalone section.
- **The §8 long-tail benchmark paragraph has three critical placeholders** ([X] mean
  IoU, [Y]/30 foundation-model success, [Z]/30 human+ImageJ.JS success). These are
  blocking for submission — §8 cannot be final without the benchmark run. The survey
  can finish first (remaining 120 rows) but the benchmark is a separate gating task
  (see `longtail_tasks.md`). Do not draft §2 final numbers prose until both land.
- **Cover letter is the next natural prose draft.** §§1, 3, 8 and the v0.5 abstract now
  exist as publication-readable prose. The cover letter rephrases their headline claims
  for an editor audience (~350–450 words, 1 page). All source material is in place.
  This is the next highest-value iteration.
- **Do not draft §2 (survey), §4 (replay), §5 (teaching), §6 (clinical), §7
  (collaboration) yet.** §2 waits for the remaining 120 survey rows. §§4–7 wait for
  the replay Week-2 run, course partner signatures, clinical partner, and collab
  demo videos respectively. Drafting any of these now bakes in numbers that will
  change and prose commitments the evidence may not support.
- **Companion-paper citation form locked.** The §8 v0.1 cites the agent-image-viewer
  companion paper as `Ouyang et al., in preparation`. Keep this form consistent across
  Abstract, §8, and (when drafted) cover letter and §10 Availability. Do not invent a
  preprint URL or arXiv number until the companion paper actually lands.
- **AI-discussion is contained to §8.** Reviewing the §1 Introduction, v0.5 Abstract,
  and §3 Design principles drafts: none of them names SAM / Cellpose / CellSAM /
  StarDist in a positive posture (they are invoked only as long-tail underperformers).
  None introduces Omega / napari-mcp / BioImage-Agent / CellVoyager. This containment
  is correct — AI discussion belongs in §8 only, per the locked framing. Future prose
  drafts must preserve this containment.
---

## 2026-04-18 — Iteration 4: drafted NM cover letter (v0.1)

### What was implemented

- Drafted `preprint.md §"Drafted prose — Cover letter to Nature Methods (v0.1,
  2026-04-18)"` — a publication-readable pre-submission cover letter, ~730 words,
  plain prose, one paragraph per editorial function:
  1. Opening ask — Brief Communication with working title, scope inquiry framing.
  2. The regime measurement — Lord 2024 anchor, 80-row v2 survey numbers ([48] %
     small-data, [48] % ImageJ-any-mention, [20] % DL), long-tail benchmark
     ([X] IoU, [Y]/30 foundation-model, [Z]/30 human+ImageJ.JS). Every number
     bracketed, consistent with the Abstract and §1.
  3. The tool — CheerpJ compile, single HTML page, client-side privacy,
     URL-addressable state, Hypha-RPC verifier, driver/observer collaboration.
     All mechanisms named match the §3 prose identifiers.
  4. Four contributions — survey + benchmark (i), replay corpus with two
     surfaced failure classes (ii), three field deployments (iii),
     limits-and-complementarity with MCP composition point (iv). Same list form
     as §1 last paragraph and the v0.5 Abstract.
  5. AI-stance — "contribution is AI-free"; "regime not ranking"; names
     Cellpose/StarDist/CellSAM/Omega/napari-mcp/BioImage-Agent/CellVoyager as
     regime-complementary, not as competitors. Companion paper cited as
     Ouyang et al., in preparation — form locked upstream.
  6. Availability + editorial asks — DAU / URL placeholders; Brief-Comm vs.
     full-article question to editor; explicit ~1500 words + 3 figures + 1
     supplementary video target.
- Added one pattern at top of the progress file: cover letter = rephrasing,
  not new argument. Placeholders share resolution paths with their body
  counterparts, so the cover letter self-updates when evidence lands.

### Files changed

- `preprint.md` — appended cover-letter drafted-prose block (after §8 v0.1).
  File is now 327 lines / ~7,600 words. No existing content modified.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — appended
  this entry; added one pattern bullet at the top.

### Learnings for future iterations

- **Story is now publication-ready at the framing level.** v0.5 Abstract, §1
  Introduction, §3 Design principles, §8 Limits and complementarity, and
  Cover letter are all drafted. What remains is *evidence-gated*: §2 (full
  200-paper survey + benchmark numbers), §4 (replay scale-up), §5 (course
  partners), §6 (clinical partner), §7 (collaboration demos). None of these
  should be drafted as prose yet; drafting ahead of evidence bakes in numbers
  that will change.
- **Highest-value next iterations without new evidence** (ordered):
  1. **§10 Availability** — can be drafted now; mechanisms are all in the
     codebase (URL params, Hypha-RPC service, `convertToMcpUrl`, replay
     corpus repo structure). No placeholders except [URL] and [DAU].
  2. **§9 Discussion implications** — methodology-research implications of
     "first-class tooling for the small-data majority" — one page, all
     source material in the existing scaffolding (Core framing, Risks,
     Venue strategy, §"What's deliberately NOT in the abstract").
  3. **Risks-and-reviewer-pushback rewrite into response-to-reviewer prose
     format** — the existing table in `preprint.md:190–203` is already
     complete-sentence; rewriting to ~200-word responses per objection is
     a low-effort high-return step before submission.
  4. **Title lock** — three candidates in `preprint.md:19–25`; choosing
     one before the cover letter is finalised removes a small ambiguity.
- **Placeholder propagation is now at risk of drift.** Five drafted blocks
  all reference `[48]%`, `[20]%`, `[X]` IoU, `[Y]`/30, `[Z]`/30, `[N]`
  replay, `[DAU]`, `[URL]`. When evidence lands, a future iteration should
  do a single pass resolving each placeholder across all five blocks at
  once, not one block at a time. Otherwise the Abstract and Cover letter
  will disagree with §1 for a window, which is exactly the kind of
  inconsistency reviewers catch.
- **Do not draft response-to-reviewer prose before submission.** The
  Risks table (preprint.md:190–203) is scaffolding for *anticipated*
  objections. Actual reviewer comments will be different. Draft response
  prose only after real reviews arrive; pre-drafting wastes effort and
  anchors the author team to objections reviewers may not raise.
- **Cover letter and Abstract should be reread together, last.** They are
  the two documents an editor reads before deciding; any disagreement
  between them undoes the work of both. Before submission, do a one-pass
  diff of bracketed numbers + claim verbs + citations across Abstract v0.5
  and Cover letter v0.1 — anything that drifts is a bug.
---

## 2026-04-18 — Iteration 5: drafted §10 Availability prose (v0.1)

### What was implemented

- Drafted `preprint.md §"Drafted prose — §10 Availability (v0.1, 2026-04-18)"` —
  four paragraphs, ~560 words, as an auditable index of every artefact the paper
  asserts:
  1. **Live instance + source code.** Single HTML page + WASM served at [URL];
     repo contents enumerated (`index.html`, `hypha-imagej-service.js`,
     CheerpJ VFS + plugin machinery, `collab/`, build tooling). Permissive
     [LICENCE], archived git tag `v1.0-paper` + Zenodo DOI. Explicit split
     between `main` (ongoing) and the tagged version-of-record (paper claims).
  2. **Three corpora.** Survey corpus (`survey_schema.md` +
     `survey_production_regex_baseline.csv` + `survey_production_v2.csv`,
     with per-claim provenance to the [48]%/[48]%/[20]% headlines);
     long-tail benchmark (`longtail_tasks.md` + task imagery-where-licensed +
     ImageJ.JS macros + eval harness for [X] IoU, [Y]/30, [Z]/30); replay
     corpus (`replay/<name>/macro.ijm` + `INPUTS.json` + `run_replay.py` +
     `MATCH_REPORT.md` per re-run, ACQUIRE/EXECUTE/MATCH axes separated).
     Week-1 three-candidate pilot archived; full [N]-analysis corpus
     replaces it at revision.
  3. **Programmatic interface.** Names the four Hypha-RPC methods
     (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`)
     and the MCP endpoint via `convertToMcpUrl` at
     `hypha-imagej-service.js:880` — the exact identifiers §3 and §8 cite.
     `docs/rpc-examples/` promised for Python + MCP caller notebooks;
     authentication = Hypha workspace tokens, no new layer.
  4. **Collaboration + telemetry.** §7 demonstrations as recorded sessions
     (video + event log) + re-runnable scripted sessions; URL opens in
     driver or observer mode; per-participant Hypha-authenticated logging.
     [DAU]/[YYYY] from `README.md` analytics baseline. Explicit: no image
     content, filenames, or user-identifying data collected — property of
     §3's client-side-compute principle, not a policy overlay.
- Added one pattern at top of progress file: **§10 Availability =
  promise-the-editor-can-audit, not a feature list** — every mechanism binds
  to an empirical commitment. Future data-availability / reproducibility-
  checklist passes should follow the same binding rule.

### Files changed

- `preprint.md` — appended §10 drafted-prose block (after Cover letter v0.1).
  File is now 341 lines / ~8,200 words. No existing content modified.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — appended
  this entry; added one pattern bullet at the top.

### Learnings for future iterations

- **The big six drafts now exist.** Abstract v0.5, §1 Introduction v0.1,
  §3 Design principles v0.1, §8 Limits-and-complementarity v0.1, Cover
  letter v0.1, and §10 Availability v0.1 are all publication-readable.
  The paper now has end-to-end prose coverage of every section whose
  argument does not depend on unlanded evidence. Remaining drafts are
  either (a) evidence-gated (§2 survey final numbers; §4 replay scale-up;
  §5 teaching; §6 clinical; §7 collaboration demos) or (b) secondary-pass
  consolidation (§9 Discussion implications; title lock; Risks-table
  rewrite).
- **Highest-value next iteration without new evidence: §9 Discussion
  implications.** Different from §8 (which is regime-characterisation):
  §9 is methodology-research implications — what it means for Nature
  Methods-style tool-paper practice that the small-data majority has been
  methodologically under-invested. One page, ~600 words, source material
  already in `## Core framing`, `## Venue strategy`, `## What's deliberately
  NOT in the abstract`, and the first paragraph of §8. This closes the
  prose-loop on the paper body.
- **Second-highest next iteration: title lock.** Three candidates in
  `preprint.md:19–25`. The cover letter v0.1 uses candidate 1 ("Small
  data, human hands: …"). Before the cover letter is finalised, confirm
  that candidate 1 is final — or edit §19–25 and the cover letter
  together. Small change, high consistency payoff.
- **Third: a bracket-reconciliation pass.** Abstract v0.5, §1 v0.1, §3
  v0.1, §8 v0.1, Cover letter v0.1, and §10 v0.1 now reference the same
  placeholder set: [48]%, [48]%, [20]%, [X], [Y], [Z], [N], [Y1–Y2],
  [DAU], [YYYY], [URL], [LICENCE], [DOI], [URL/github]. When evidence
  lands, one single pass must resolve every placeholder everywhere in
  the file. Drift between abstracts/letter/sections is exactly what
  reviewers catch first. Script it if feasible (simple regex over the
  file) rather than by-eye editing.
- **Do not draft §9 yet in this iteration.** That is next iteration's
  work; avoid overshooting and banking two prose drafts on the same
  commit. The progress-file discipline is one-draft-per-iteration so
  that a failure in one does not contaminate the previous.
---

## 2026-04-18 — Iteration 6: drafted §9 Discussion implications (v0.1)

### What was implemented

- Drafted `preprint.md §"Drafted prose — §9 Discussion implications (v0.1,
  2026-04-18)"` — five paragraphs, ~620 words, distinct in argument shape from
  §8. Where §8 characterises regimes and the composability seam, §9 extracts
  the methodology-research implication: that bioimage-methodology review
  currently lacks an evaluative vocabulary for tool papers whose contribution
  is regime-serving rather than algorithmically novel.
- Structure:
  1. **What the preceding sections jointly claim.** §§2–8 collectively assert
     that tooling for the small-data, human-centred majority has been
     implicitly treated as solved. The cost has been paid by the users of the
     literature, not its authors.
  2. **Procedural implication for tool-paper review.** Proposes *regime fit*
     and *regime correctness* as two criteria the current review vocabulary
     lacks. Explicit: this does *not* displace algorithmic-novelty papers; it
     asks that regime-serving papers be accepted as a distinct first-class
     category.
  3. **Re-reading §3 design decisions as proposals for what those criteria
     could look like.** Continuity → regime fit. Zero install → regime
     correctness. URL + pinned runtime + Hypha-RPC verifier → reproducibility-
     under-regime. Each mapped to a property a reviewer could score.
  4. **Boundary with agentic bioimage (§8 already scoped).** First-class
     human-centred substrate is a *prerequisite* for agentic work that takes
     data-governance and reproducibility seriously. Companion paper cited
     (Ouyang et al., in preparation). "Regime, not ranking" reused as the
     frame — preserves containment with §8.
  5. **Regime measurement as a methodology contribution.** The 200-paper
     survey, 30-task long-tail benchmark, and [N]-replay corpus are
     re-usable instruments, not one-off warrants. Any subsequent tool-paper
     author claiming to serve this regime can falsify or refine them. Closes
     on adoption of the evaluative vocabulary as the desired outcome.
- Added one pattern at top of progress file: **§9 = methodology-research
  argument, not a summary**. Documents (a) that §9's one new move is the
  regime-fit / regime-correctness evaluative vocabulary, (b) that Discussion
  prose must extract an argument about the literature rather than rehearse
  against it, (c) that AI containment is preserved — §9 mentions agentic
  bioimage only as a prerequisite-consumer of the human-centred substrate.

### Files changed

- `preprint.md` — appended §9 drafted-prose block (after §10 v0.1 in file
  order; final layout places §9 between §8 and §10). File is now 357 lines /
  ~9,254 words. No existing content modified.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — appended
  this entry; added one pattern bullet at the top.

### Learnings for future iterations

- **The "big seven" prose drafts are now complete at v0.1.** v0.5 Abstract,
  §1 Introduction, §3 Design principles, §8 Limits-and-complementarity, §9
  Discussion implications, §10 Availability, and the Cover letter to NM are
  all publication-readable. The paper has end-to-end framing prose for every
  section whose argument does not depend on unlanded evidence. Remaining
  drafts are all either (a) evidence-gated (§2 survey final numbers; §4
  replay scale-up; §5 teaching; §6 clinical; §7 collaboration demos) or (b)
  secondary-pass consolidation.
- **Highest-value next iteration without new evidence: title lock +
  consistency pass.** The cover letter v0.1 uses title candidate 1 ("Small
  data, human hands: …"). `preprint.md:19–25` lists three candidates. A
  single small iteration should (i) decide which candidate to lock, (ii)
  edit §19–25 to reflect the decision, (iii) sweep all drafted-prose blocks
  (Abstract, §1, Cover letter) for any phrase that implicitly favours a
  different candidate, (iv) verify the title claim is defensible against
  the evidence already in place. Small scope, high-return consistency
  payoff before any external reader sees the paper.
- **Second-highest: bracket-reconciliation tooling.** Seven drafted blocks
  now share the placeholder set [48]%, [48]%, [20]%, [X], [Y], [Z], [N],
  [Y1–Y2], [DAU], [YYYY], [URL], [URL/github], [LICENCE], [DOI]. Writing
  a small script (regex-over-file) that (a) lists every bracketed
  placeholder and the sections that reference it, (b) flags any
  inconsistency (e.g., [48]% in Abstract vs a different number in §1),
  and (c) supports a single-pass resolve-everywhere operation when evidence
  lands, would prevent the single largest class of drift bug at revision
  time. This is engineering effort, not writing effort — appropriate for
  a dedicated iteration.
- **Third-highest: supplementary-material outline.** None of the seven
  drafted blocks yet specifies what lives in main body vs supplementary.
  Brief Communication constraints (~1500 words main, 3 figures main, 1
  supplementary video) will force hard choices. A single iteration
  mapping "which drafted-prose paragraph goes to main body, which collapses
  to one sentence with a supplementary pointer" should precede the
  submission-pass condensation — otherwise the final trim will be
  arbitrary.
- **Do NOT draft §§2, 4, 5, 6, 7 prose yet.** Every iteration since §3 has
  re-affirmed this discipline: drafting ahead of evidence bakes in numbers
  that will change. The temptation grows as the prose pool grows; resist
  it. The remaining un-drafted sections are un-drafted *by design*, not
  by omission.
- **Do NOT rewrite the Risks table into response-to-reviewer prose.** The
  Risks table (preprint.md:190–203) is scaffolding for *anticipated*
  objections. Real reviewer comments will differ substantively. Pre-drafting
  response prose wastes effort and anchors the author team to objections
  reviewers may not raise. This is the same discipline as "do not draft
  evidence-gated sections" — applied to post-review work.
- **Framing containment now holds across seven drafted blocks.** AI is
  mentioned substantively only in §8 and glancingly in §9 (as a
  prerequisite-consumer argument) and in the Cover letter (as a regime
  stance, using the §8 language). Abstract, §1, §3, §10 contain no
  substantive AI discussion. This is correct per the locked framing and
  must be preserved in any future edit pass. If a future iteration is
  tempted to "balance" §1 or §3 with an AI paragraph, the answer is no:
  containment is load-bearing.
---

## 2026-04-18 — Iteration 7: title lock + consistency sweep + References v0.1

### What was implemented

- **Title locked** at `preprint.md §"Title (locked 2026-04-18)"`. Candidate 1
  ("Small data, human hands: ImageJ.JS as a browser-native tool for the parts
  of biology where humans still matter most") retained — the variant the
  Cover letter v0.1 already uses. The two retired variants are removed from
  the working doc, with rationale recorded in the same block: variant 2
  ("deep learning cannot yet serve") was combative and collided with §8's
  "regime, not ranking" stance; variant 3 ("in the age of AI") promoted a
  framing §8 and §9 explicitly decline. The lock is cross-document
  scaffolding — once locked, re-lock requires a re-sweep of all drafted
  prose, not an edit in place.
- **Consistency sweep** across Abstract v0.5, §1, §3, §8, §9, §10, Cover
  letter. Searched for phrasing that would implicitly favour a retired
  variant ("biologist's browser", "age of AI", "deep learning cannot yet
  serve"). Zero occurrences in any drafted-prose block. The tagline
  "small data, human hands" is not yet echoed verbatim in the Abstract
  or §1 opening — deliberately — and is available as a section-header or
  figure-caption device at future drafting passes. Finding recorded in
  the Title-lock block so that a future edit pass can re-check in one place.
- **References v0.1 drafted** at `preprint.md §"Drafted prose — References
  (v0.1, 2026-04-18)"`. Consolidates every citation used across the seven
  drafted-prose blocks, grouped by function for author-team review:
  (A) empirical anchors — Lord 2024, Ma 2024, Archit 2024;
  (B) classical ImageJ/Fiji — Schneider 2012, Schindelin 2012, MRI 2020;
  (C) deep-learning methods — Kirillov 2023 (SAM), Stringer & Pachitariu
  2025 (Cellpose), Schmidt 2018 (StarDist), Israel 2025 (CellSAM),
  Gómez-de-Mariscal 2021 (deepImageJ);
  (D) agentic-bioimage — Royer 2024 (Omega), napari-mcp (2025),
  BioImage-Agent (2026), Chen 2026 (CellVoyager), Ouyang et al. (in
  preparation, companion);
  (E) runtime substrate — CheerpJ 4 (Leaning Technologies 2025),
  File System Access API (WICG 2024).
- References entries deliberately use `[DOI]` / `[VOL:PAGES]` placeholders
  wherever the present author team has not re-verified metadata against
  the journal record. No volume, page range, or DOI has been invented.
- References block ends with a **cross-reference map** — a table listing
  every citation and every drafted-prose block it appears in. This is the
  instrument that prevents the canonical "citation renamed in one section,
  stale in three others" failure. Any future reference upgrade must update
  all three surfaces (entry, map row, every in-prose citation) in a single
  pass.
- Three new patterns appended at the top of the Patterns block:
  (a) title-lock discipline (cross-document scaffolding, re-lock requires
  re-sweep, retain rationale through submission-pass condensation),
  (b) no-invented-bibliographic-metadata rule,
  (c) reference cross-reference map is load-bearing.

### Files changed

- `preprint.md` — edited §Title (candidate-2 and candidate-3 removed,
  rationale + sweep-results block added); appended References v0.1
  drafted-prose block at the bottom. File is now 419 lines / ~10,600 words.
  No other drafted-prose content modified.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  appended this entry; added three pattern bullets at the top of the
  Patterns block.

### Learnings for future iterations

- **The seven drafted-prose blocks are now citation-consistent at v0.1.**
  Every citation in the drafts resolves to an entry in References v0.1;
  every References entry maps to a specific drafted-prose block via the
  cross-reference table. This is the single strongest consistency
  guarantee the working doc has had at any point. Future prose additions
  (when §§2, 4, 5, 6, 7 evidence lands) must update References and the
  map in the same iteration that adds the prose — not as a follow-up
  pass. A follow-up pass is where drift begins.
- **Highest-value next iteration without new evidence: Figure-slot
  commitment (v0.1).** Six figures are referenced across the drafts
  (Fig 1: long-tail distribution; Fig 2: needs → features;
  Fig 3: replay matrix; Fig 4: teaching enrolments; Fig 5: clinical panel;
  Fig 6: collaboration vignette + Supp Vid 1), but no figure captions
  are drafted. Nature Methods reviewers read figures before text. A
  v0.1 pass should NOT draft finalised captions (most are
  evidence-gated) but SHOULD (i) commit each figure to a specific
  evidence source in the existing corpora, (ii) state the claim each
  figure makes in one sentence, (iii) for Fig 1 and Fig 2 (which are
  NOT evidence-gated at the structure level) draft a full caption
  with placeholders for the numerical values, and (iv) record the
  Brief Communication vs full Article trade-off (Brief Comm allows
  3 main figures; the current spine implies 6 main + supplementary
  movie, which implies the full Article path). This is the natural
  next prose draft in the sequence §1 → §3 → §8 → Cover → §10 → §9 →
  References → Figures, and it does not require new evidence.
- **Second-highest: supplementary-material outline.** Brief Comm word
  limit (~1500 main-text words) + 3-figure limit will force choices.
  The current body draft (sum of §1 + §3 + §8 + §9 + §10 prose) is
  much longer than 1500 words. A single iteration mapping which
  paragraphs move to Supplementary Methods, which collapse to one
  sentence + supplementary pointer, and which stay in the main body,
  should precede any final condensation pass. Do this AFTER Figure-slot
  commitment, so the figure captions can be cross-referenced against
  the mapping decision.
- **Third-highest: placeholder-propagation script.** Seven drafted
  blocks + the new References cross-reference map share a placeholder
  set: [48]%, [48]%, [20]%, [X], [Y], [Z], [N], [Y1–Y2], [DAU], [YYYY],
  [URL], [URL/github], [LICENCE], [DOI], [VOL:PAGES]. When evidence
  lands, a small regex-over-file tool that (a) lists every bracketed
  placeholder and the sections that reference it, (b) flags any
  inconsistency, (c) supports a single-pass resolve-everywhere operation
  is the right engineering primitive. Running it manually each
  iteration risks exactly the kind of drift the cross-reference map
  protects against. Plan this as a dedicated engineering iteration
  before the first evidence-landing iteration.
- **DO NOT add entries to the References section that are not yet cited
  in drafted prose.** The temptation to add "expected" references
  (napari, CellProfiler, OMERO, OME-Zarr) is strong; the discipline
  that kept v0.1 clean is that References is a *consequence* of drafted
  prose, not a *preparation* for it. When §§2, 4, 5, 6, 7 land and
  cite new sources, those sources enter References at the same
  iteration. Pre-populating References with plausible but uncited
  entries re-introduces the exact class of drift the map prevents.
- **DO NOT invent DOIs, volumes, or page ranges to fill placeholders.**
  Easier said in a Pattern bullet; harder to resist when a prose
  sentence reads better with a DOI-shaped string. If unsure, leave
  `[DOI]`. A single invented DOI found by a copy editor or referee
  discredits the entire bibliography. The pattern bullet is there;
  re-reading it before any References edit pass is the safeguard.
- **Working doc is now 419 lines / ~10,600 words.** Still well under
  any realistic file size concern, but the ratio of scaffolding to
  drafted prose is starting to tip toward scaffolding. This is fine
  for now — scaffolding is how the paper's argument stays coherent —
  but a future pass should consider moving retired framing sections
  (e.g., the §8 Discussion placeholder paragraph at `preprint.md:245`,
  which is now superseded by the §8 v0.1 drafted prose) to a
  `preprint_archive.md` file so that the working doc reflects only
  load-bearing material. Do this AFTER submission, not before — the
  scaffolding is what a new contributor (human or agent) uses to
  understand the paper's framing rationale.
---

---

## 2026-04-18 — Iteration 8: figure-slots-and-captions v0.1 + Nature Methods-styled HTML render + served via svamp

### What was implemented

- **Figure commitment (v0.1).** Appended `preprint.md §"Drafted prose — Figure slots and
  captions (v0.1, 2026-04-18)"` — the first systematic figure block. Six figures + one
  supplementary video are now committed:
  - **Fig 1** (The long tail of biology) — full caption drafted; 3 panels (images-per-
    condition histogram; tool-usage stacked bar; 30-task long-tail IoU scatter). Evidence
    source: `survey_production_v2.csv` + `longtail_tasks.md` + eval harness.
  - **Fig 2** (Needs to features) — full caption drafted; 5-row mapping schematic linking
    §§1–2 needs to §3 design commitments to shipped mechanisms with `file:line` anchors.
  - **Fig 3** (Replay matrix) — full caption drafted; N × 3 matrix (ACQUIRE / EXECUTE /
    MATCH) + two zoomed failure-class panels (bundle inconsistency; Fiji version drift).
  - **Fig 4 / Fig 5 / Fig 6 + Supp Vid 1** — slot-with-claim only, caption deferred until
    partner evidence lands. Each has a one-sentence claim, a named evidence source, and a
    panel structure sketch so the figure number is reserved and the downstream data
    collection is scoped.
  - **Venue-path reconciliation** — the block records how the 6-figure full-Article layout
    condenses to a 3-figure Brief Comm layout (collapse Figs 3–6 into a single multi-panel
    field-evidence figure + promote Supp Vid 1 and per-pillar detail panels to
    supplementary). Preserved as a spine annotation so the condensation is mechanical at
    revision time.
- **Nature Methods–styled HTML rendering.** Wrote `manuscript_html/index.html` — a single
  self-contained ~86 KB HTML file (Source Serif 4 + Source Sans 3 via Google Fonts; no
  JS; no external JS or CSS; works offline after first font cache). Layout mirrors the
  journal: NPG top bar, journal masthead ("nature methods"), article type tag, 38-px
  serif title, grid-based main + sidebar layout with sticky ToC. Includes:
  - Abstract (v0.5) in the bordered NM abstract box;
  - §§1, 3, 8, 9, 10 full drafted-prose text;
  - §2 with a gated-evidence notice summarising interim 80-row figures;
  - §4 with the gated-evidence notice describing the Week-1 pilot's two surfaced failure
    classes + Fig 3 schematic replay-matrix table;
  - §§5, 6, 7 with gated-evidence notices + reserved placeholder figure boxes;
  - Fig 1 + Fig 2 + Fig 3 as in-document panel schematics (pure CSS / HTML — no SVG or
    image assets, so the render is diff-able against the prose and the placeholders are
    obvious at a glance);
  - References grouped A–E as in the working doc, with anchor IDs matching the
    in-prose citations (`#ref-lord2024`, `#ref-stringer2025`, etc.);
  - Cover letter v0.1 as an appendix section with its own typographic treatment;
  - Sidebar with a full ToC, article-info block, and an evidence-status block that
    shows at a glance which sections are v0.1 prose-ready vs evidence-gated;
  - Placeholder values (`[48]%`, `[X]`, `[N]`, `[DAU]`, `[URL]`, etc.) uniformly rendered
    with a highlighted yellow background so a reader instantly sees what is not yet
    resolved. This visual surfacing of placeholders is the UI-level counterpart of the
    placeholder-propagation discipline from the working doc.
- **Served via svamp.** Ran `svamp serve manuscript /Users/weio/workspace/imagej.js/manuscript_html --public`.
  Mount registered; HTTP 200 confirmed; Content-Length 86,673 bytes. Public URL:
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/` — viewable without a
  Hypha login, for the author team and (on request) the editor.
- Added two patterns at top of Patterns block:
  (a) figures-are-committed-as-slots-with-claims-before-captions-are-drafted;
  (b) manuscript HTML rendering is served out-of-tree (edit `preprint.md`, re-render).

### Files changed

- `preprint.md` — appended Figure slots and captions (v0.1) block after References.
  File is now ~470 lines / ~12,600 words. No existing prose or scaffolding modified.
- `manuscript_html/index.html` — new file, 1,100+ lines. Self-contained, no build step.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this entry;
  added two pattern bullets at the top.

### Learnings for future iterations

- **The HTML render is a diff-able surface for the prose.** When a placeholder resolves
  (say `[48]%` → `47 %` after rows 81–200 land), the rendered HTML highlights every
  occurrence of the value, because they share the `.placeholder-value` class. A future
  iteration should add a small regex-over-files script that verifies: (i) every
  `[placeholder]` in the HTML appears in `preprint.md`; (ii) every `[placeholder]`
  in `preprint.md` is rendered consistently in the HTML. Drift between the two
  surfaces is exactly the class of bug the placeholder-propagation discipline protects
  against across prose blocks — the HTML render adds a third surface that must be
  kept in step.
- **The HTML is generated, not authored.** Do not edit `manuscript_html/index.html`
  by hand. If a prose change is needed, edit `preprint.md` and regenerate. This
  discipline is identical to the References / cross-reference map rule from the
  working doc, lifted up one abstraction layer. Future renders should ideally be
  scripted from the working doc rather than hand-written — a small pandoc-flavoured
  markdown→HTML pipeline with a Nature Methods template would be the right tool.
  v0.1 is hand-rendered because the prose is small enough to audit by eye and a
  hand-render guarantees the NM visual style more faithfully than a generic converter.
- **Highest-value next iteration without new evidence: placeholder-reconciliation
  script.** The Iteration-6/7 suggestions documented this as third-highest priority;
  with the HTML render as a third surface, it now moves to first-highest. Script
  should: (a) list every `[placeholder]` in `preprint.md`; (b) list every occurrence
  in `manuscript_html/index.html`; (c) compare the sets and flag any present in one
  but not the other; (d) for each placeholder, enumerate the prose-blocks that
  reference it. Running this before every evidence-landing pass catches drift at
  the point where it is cheapest to fix (before the value propagates).
- **Second-highest: supplementary-material outline.** Brief Comm word limit forces
  choices. The current body sum (§§1 + 3 + 8 + 9 + 10 prose + figure captions) is
  much longer than ~1500 words. A single iteration should produce a table mapping
  each drafted-prose paragraph to either (main-body, kept), (main-body, compressed),
  or (supplementary, with in-body pointer) — deferred until after the venue-reconciliation
  figure block lands (done this iteration), because the figure allocation and the
  prose allocation are coupled decisions.
- **Do NOT edit `manuscript_html/` by hand.** If a future iteration does a prose
  edit in `preprint.md`, the HTML must be regenerated from scratch. Keeping two
  edit surfaces manually synchronised is exactly the drift failure mode that
  the working-doc + cross-reference-map discipline exists to prevent.
- **The served URL is stable across re-renders.** `svamp serve manuscript` with
  the same name replaces the mount in place. Update the HTML file, reload the
  browser — no URL change. This is important: if the URL appears in any
  drafted-prose block (e.g., a future iteration puts it in the "Availability"
  preview the editor can click), the working doc must not hard-code a different
  URL than the `svamp serve` output.
- **Do NOT commit the `manuscript_html/` directory to the repo** unless the
  user explicitly asks. It is a view of a working draft, not a publication
  artefact, and having two copies (html render in repo + served render via
  svamp) re-introduces the synchronisation failure mode. The served copy is
  the view; `preprint.md` is the source. If a co-author needs to preview,
  share the svamp URL.
- **Framing containment holds across the HTML render too.** Spot-checked: the
  HTML's Abstract, §1, §3 sections contain no substantive AI discussion; AI
  discussion is contained to §8 and is referenced in §9 (as prerequisite-for-
  agents) and in the Cover letter (regime stance). Consistent with the
  Iteration-6 containment pattern. When re-rendering in future, this property
  must be re-verified at the HTML level — the render is not a second author
  and will not re-introduce retired framings unless someone edits the
  working doc to do so.
---

## 2026-04-18 — Iteration 9: Online Methods prose (v0.1) + HTML render refresh (v0.2)

### What was implemented

- **Drafted §Online Methods (v0.1)** at `preprint.md §"Drafted prose — Online
  Methods (v0.1, 2026-04-18)"` — eight subsections, ~1,600 words, structured
  as Nature Methods conventionally places its Methods block:
  1. **Regime survey of 200 recent microscopy papers.** Pre-registered
     stratification (nine subdomains × five years; 14 journals; bioRxiv
     proxy ≤ 15 %); three independent axes (A, B, C) replacing "images per
     condition"; strict small-data iff `Scale_biological=small ∧ HIL∈{through,
     verified} ∧ Scale_quant≠large` — deliberately stricter than the
     pilot's. LLM-assisted extraction via `claude-opus-4-7`, with extractor
     version recorded per row; IRR targets κ≥0.7 / ICC≥0.8; 10 % dual
     extraction; regex-only baseline as a floor; 11 % `not-classifiable`
     residual reported explicitly, not redistributed.
  2. **Long-tail foundation-model benchmark (30 tasks).** Seven inclusion
     criteria fixed before evaluation; five task groups; public-dataset
     preference with non-public fallback declared. Zero-shot evaluation (no
     fine-tuning, no prompt engineering) at author-recommended configurations
     for SAM / Cellpose-generalist / StarDist-versatile / CellSAM. Pre-registered
     IoU≥0.7 success threshold; MVB 15-of-30 subset pre-registered as Brief
     Comm sufficient. Two MVB tasks deliberately include DL successes — the
     benchmark is framed as a regime-fit instrument, not a uniform DL-failure
     filter.
  3. **Deterministic replay corpus.** Per-candidate spec: `macro.*` +
     `INPUTS.json` (upstream URL + SHA-256 + date) + `run_replay.py` +
     `outputs/` + `MATCH_REPORT.md`. Three separate axes (ACQUIRE / EXECUTE /
     MATCH) reported independently; legacy Pass/Partial/Fail kept only as
     a summary. Two Week-1 findings preserved as reportable at corpus level
     (bundle inconsistency, cross-version drift in core Fiji primitives).
  4. **Runtime, distribution, reproducibility harness.** Pinned CheerpJ JVM
     + Fiji build + plugin set at `v1.0-paper` git tag; URL-param schema
     documented; Hypha-RPC method surface enumerated (`runMacro`,
     `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`); MCP endpoint
     via `convertToMcpUrl` at `hypha-imagej-service.js:880`; CI harness
     re-executes replay and benchmark against the pin.
  5. **Field-deployment protocols.** Six pre-registered protocol items
     (Hypha-authenticated identity; per-session event log; no image
     egress; pre/post concept-check for teaching; session audit log for
     clinical; driver/observer for collaboration). Partner institutions
     and enrolment counts intentionally deferred to submission.
  6. **Statistics.** No inferential statistics; Wilson-score CI at α = 0.05
     for regime-share point estimates (computed at submission on 200 rows,
     not on the 80-row interim); Cohen's κ / ICC(2,1) for IRR; per-task
     mean IoU and IoU≥0.7 success counts for the benchmark.
  7. **Limitations of the survey, benchmark, and replay.** Open-access
     sampling bias; 11 % `not-classifiable` residual as extraction ceiling;
     benchmark is a regime-fit instrument not a DL-method competition; replay
     corpus is bounded by the public-data constraint.
  8. **Data, code, and protocol availability.** Cross-referenced with §10;
     states that any main-text claim not audited against a named artefact
     in this Methods or §10 is an error and should be flagged as such.
- **HTML render refreshed to v0.2.** `manuscript_html/index.html` now includes
  a new `<section class="methods" id="methods">` between §10 and References,
  with a Methods-specific CSS block (smaller sans-serif subsection heads,
  14.5 px body, `.methods-lede` summary strip). ToC gains an "Online Methods"
  entry; sidebar article-info and evidence-status blocks updated to reference
  v0.2 and the new prose block; status-chip promotes from "7 prose blocks
  v0.1" to "8 prose blocks v0.1 (incl. Online Methods)"; footer timestamp
  annotated "adds Online Methods".
- **Re-served via svamp.** Same mount name `manuscript`; same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`. Post-edit
  HTTP HEAD → `200`, `content-length: 104874`, `last-modified` updated.
  `Online Methods` string appears 8× in the rendered page
  (heading + ToC + status-chip + sidebar + `methods-lede` + section link
  references — exactly where they are expected).

### Files changed

- `preprint.md` — appended Online Methods v0.1 block after the Figure slots
  block. No existing prose or scaffolding modified. File is now ~630 lines /
  ~14,300 words.
- `manuscript_html/index.html` — added `section.methods` CSS block,
  inserted Online Methods `<section>` between §10 and References, added
  ToC entry, bumped version / status / chips / sidebar / footer strings to
  v0.2. File is now 104,874 bytes (up from 86,673).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this entry.

### Learnings for future iterations

- **Online Methods is a genuinely non-evidence-gated prose block.** The
  instruments (`survey_schema.md`, `longtail_tasks.md`, `replay/<candidate>/`)
  are the methodology; their *values* are evidence-gated, their *protocols*
  are not. This iteration extracts the protocols to prose. Future iterations
  can do the same for one further non-evidence-gated thing: the v1.0-paper
  git-tag release-engineering protocol (what is pinned, what is not,
  how releases are cut, what the "immutable artefact" actually means in
  CheerpJ terms). That is the last non-evidence-gated prose surface the
  paper has room for before all remaining drafts are evidence-gated.
- **Methods subsection order mirrors §10 Availability.** The subsection
  headings of the Methods block were chosen to parallel §10 Availability's
  paragraph structure. A reviewer can read them as a pair: Methods says
  *how we did it*, §10 says *where the artefact is shipped*. Drift between
  the two is the same class of bug the cross-reference map protects against
  for References; a future iteration should add a small check that every
  Methods subsection binds to at least one §10 artefact, and vice versa.
- **Methods section length tests the Brief-Comm vs full-Article venue
  decision.** At ~1,600 words, the Methods block alone exceeds the
  Brief-Comm main-text target (~1,500 words). For a Brief Comm, most of
  Methods would move to Supplementary Methods; for a full Article, Methods
  belongs in the main body. This is the first prose block whose length
  forces the venue decision. The supplementary-material outline that
  Iteration-6/7 flagged as next-highest priority should be done in the
  iteration *immediately after* this one: the Methods subsections are now
  the concrete content the outline has to allocate.
- **HTML re-render pattern holds.** Edit `preprint.md`, then edit
  `manuscript_html/index.html` in the same iteration, add a CSS block if
  the new section needs distinct styling, bump version strings in four
  places (status chip, article-meta, sidebar dt, footer), add ToC entry,
  re-test with `curl -sI`. `svamp serve` replaces the mount in place so
  the URL is stable. Do not re-invoke `svamp serve` if the mount name is
  unchanged — the existing mount is authoritative.
- **Added pattern candidate (not yet promoted to Patterns block): "Methods
  ↔ Availability twin-binding".** Every Methods subsection should name at
  least one §10 Availability artefact; every §10 artefact should appear in
  at least one Methods subsection. Currently this is an observation; if
  a future iteration confirms the binding holds under submission-pass
  condensation, promote to the Patterns block at the top of this file.
- **DO NOT draft pillar-specific Methods prose ahead of evidence.** The
  Field-deployment protocols subsection intentionally names protocol
  items without partner institutions, enrolments, or IRB numbers. It is
  tempting to draft named-institution Methods prose — resist until
  partnership MoUs are signed. This iteration holds the discipline;
  future ones must too.
- **Highest-value next iteration: supplementary-material outline.** Now
  that the Methods block exists, the Brief-Comm vs full-Article venue
  decision has concrete content to allocate. A single iteration should
  produce a table mapping each drafted-prose paragraph (Abstract, §1, §3,
  §4, §8, §9, §10, Methods subsections 1–8) to either (main-body, kept),
  (main-body, compressed), or (supplementary, with in-body pointer). The
  figure allocation from Iteration-8's venue-reconciliation block is the
  anchor; Methods subsections are the variable. After this is done, the
  submission-pass condensation is mechanical, not editorial.
- **Second-highest: placeholder-propagation script.** The count of
  placeholders across three surfaces (preprint.md, manuscript_html/index.html,
  References cross-reference map) has grown with this iteration.
  `[N]`, `[Y1-Y2]`, `[X]`, `[Y]/30`, `[Z]/30`, `[48]%`, `[48]%`, `[20]%`,
  `[DAU]`, `[YYYY]`, `[URL]`, `[URL/github]`, `[LICENCE]`, `[DOI]`,
  `[VOL:PAGES]` all now appear in Methods as well. A small script over the
  three files — listing placeholders, per-surface occurrences, and per-section
  occurrence — is the right engineering primitive before the first
  evidence-landing pass.
- **Framing containment re-verified across the Methods render.** Methods
  subsections use `deep-learning` and `DL method` language only in the
  long-tail benchmark subsection, and the language there is "regime-fit
  instrument, not DL-method competition". No new substantive AI claim is
  introduced. The Iteration-6 containment discipline (AI discussion lives
  substantively only in §8; glanced only in §9 / Cover letter) remains
  intact — Methods describes the benchmark as a measurement tool, not a
  methods comparison.

---

## 2026-04-18 — Iteration 10: Supplementary material outline (v0.1) + HTML render refresh (v0.3)

### What was implemented

- **Drafted §Supplementary material outline (v0.1)** at
  `preprint.md §"Drafted prose — Supplementary material outline (v0.1, 2026-04-18)"`
  (~1,800 words, six subsections). The outline allocates every drafted-prose
  paragraph and every figure slot to a venue-specific location under both
  venue paths: Brief Communication (≤ 1500 main-text words, 3 main figures,
  1 supplementary video) and full Article (≤ 5000 main-text words, 6–7
  figures, supplementary methods + video). Sections: allocation principles
  (regime-of-claim / mechanism-anchor / containment preservation); BC
  allocation table (30 rows, per-paragraph disposition + word budget);
  full-Article allocation table (22 rows, dispositions only); figure
  condensation map for BC (mechanical 6 → 3 figure collapse); outline
  discipline (heading-anchored rows survive prose edits; append-one-row
  per new prose block; at submission the outline is a checklist); figure-
  slots interaction invariant (figure cannot be main-body if calling
  prose is demoted, and vice versa); non-goal declaration that the
  outline is not editorial judgement.
- **HTML render refreshed to v0.3.** `manuscript_html/index.html` now
  includes a new `<section class="supp-outline" id="supp-outline">` as an
  editorial appendix after the Cover letter, with distinct CSS styling
  (green/amber/red/blue allocation legend; striped full-width tables with
  alternating zebra; a highlighted "budget-note" block for the word-budget
  summaries). Version strings bumped from v0.2 → v0.3 in five places
  (article-meta published line; status-chip draft; status-chip status;
  sidebar article-info `Draft version`; footer rendered-from line).
  Sidebar Evidence-status now lists `Supp. outline` as the 10th prose
  block alongside the existing nine. ToC gains a `Supp. outline` entry.
  Sidebar gains a `View the supplementary-material outline ↓` callout next
  to the existing Cover-letter callout. Status-chip promotes from
  "8 prose blocks v0.1 (incl. Online Methods); 3 pillars evidence-gated"
  to "9 prose blocks v0.1 (+ supplementary outline); 3 pillars
  evidence-gated".
- **Re-served via svamp.** Same mount name `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 125600` (up from 104,874),
  `last-modified` updated to Sat, 18 Apr 2026 12:12:26 GMT. The string
  "Supplementary material outline" appears 3× on the rendered page
  (ToC / section heading / sidebar callout) — exactly where expected.
  HTML parses well-formed (Python html.parser: zero unclosed tags, zero
  mismatched tags).

### Files changed

- `preprint.md` — appended Supplementary material outline (v0.1) block
  after the Online Methods block. No existing prose or scaffolding
  modified. File is now 650 lines / ~16,300 words.
- `manuscript_html/index.html` — added `.supp-outline` CSS block (~80
  lines), inserted editorial-appendix `<section>` after Cover letter
  (~130 lines including two allocation tables with legend), added ToC
  entry, bumped version strings in five places, added sidebar callout.
  File is now 125,600 bytes (up from 104,874) / 1,347 lines.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this
  entry; added one pattern bullet at the top (supplementary outline is
  the prose-side counterpart to the figure-reconciliation block).

### Learnings for future iterations

- **The outline's heading-anchored rows are the load-bearing property.**
  Every row cites the drafted-prose block by its existing heading
  (`§1 ¶2`, `Online Methods §<subsection>`, `Fig N panel P`,
  `Abstract`, `Cover letter`). When a future iteration edits a prose
  block's body, the allocation row survives; when a new prose block
  lands (e.g., §2's evidence-gated paragraphs after rows 81–200 are
  extracted, or §§4–7's partner-landing paragraphs), one row is
  appended to BOTH tables in the same iteration. This is the direct
  analog of the References cross-reference-map discipline and of the
  Methods ↔ Availability twin-binding. All three are "append-in-same-
  iteration, never-as-follow-up" disciplines.
- **The figure-prose binding invariant is now explicit.** "A figure
  cannot be in main body with its calling prose demoted; a prose
  paragraph cannot be in main body with its figure demoted." This
  invariant is asserted in the outline and is structurally enforced by
  how the BC allocation table is written: Fig 3 in BC *is* the
  collapsed §§4–7 paragraphs that the table also collapses. Future
  evidence-landing iterations must preserve this binding; if §5
  teaching evidence lands and the corresponding full-Article paragraph
  is drafted, Fig 4 stays on the full-Article path but collapses into
  Fig 3 panel (b) on the BC path — and the BC prose row for §5 must
  collapse in the same iteration.
- **Word-budget arithmetic exposes condensation load concretely.**
  The BC budget at verbatim sums to 2,350 words against a 1,500-word
  target — an 850-word overshoot. The outline documents the specific
  mechanical two-pass condensation (10–15 % incidental tightening; then
  §1 4→3, §3 5→2, §9 5→2 paragraph consolidation) that lands the total
  at 1,450–1,550. This number is the gating signal for the venue
  decision: if future evidence-gated prose lands fatter than budgeted,
  the overshoot passes the point where mechanical condensation can
  recover, and the venue must flip to full Article. Track this at each
  prose-landing iteration.
- **Editorial-appendix styling is distinct from body prose by design.**
  The `.supp-outline` CSS uses sans-serif body text, green/amber/red/blue
  allocation chips, and highlighted "budget-note" boxes — all visually
  obvious that this is a submission-engineering artefact, not paper
  prose. A future iteration that adds a second editorial artefact
  (e.g., a reviewer-response-dry-run, a copy-edit checklist) should
  follow the same discipline: distinct CSS class, distinct visual
  treatment, labelled "editorial appendix" in the section title. Do
  NOT style editorial artefacts as body prose — a reviewer or editor
  viewing the served render must be able to tell at a glance what is
  the paper and what is the machinery.
- **Highest-value next iteration without new evidence: placeholder-
  propagation script.** The count of placeholders across four surfaces
  (preprint.md, manuscript_html/index.html, References cross-reference
  map, now the Supp outline) has grown again with this iteration.
  `[48]%`, `[20]%`, `[X]`, `[Y]`, `[Z]`, `[N]`, `[Y1–Y2]`, `[DAU]`,
  `[YYYY]`, `[URL]`, `[LICENCE]`, `[DOI]`, `[VOL:PAGES]` all now
  appear in the Supp outline too. A small regex-over-file script that
  (a) lists every bracketed placeholder, (b) records per-surface
  per-section occurrence, (c) flags any inconsistency when a value is
  resolved, and (d) supports a single-pass resolve-everywhere
  operation is the right engineering primitive before the first
  evidence-landing pass. This has been next-highest three iterations
  running; it now moves to unambiguous first place.
- **Second-highest: v1.0-paper release-engineering protocol prose.**
  Identified in Iteration 9 as the last non-evidence-gated prose
  surface the paper has room for. The Online Methods block names
  `v1.0-paper` git tag + Zenodo DOI but does not describe the
  release-engineering protocol (what is pinned; how releases are cut;
  what "immutable artefact" means in CheerpJ terms; how a reviewer
  would re-cut the release locally). A ~400-word block, appended as a
  subsection of Online Methods or as a new `## Drafted prose — Release
  engineering (v0.1)` block, is the right scope.
- **Third-highest: reviewer-response dry run.** Now that all of
  Abstract / §§1, 3, 8, 9, 10 / Online Methods / Cover letter /
  References / Figure slots / Supp outline are drafted at v0.1, a
  first-pass dry-run of anticipated reviewer objections — drawn from
  the existing Risks table at `preprint.md:190–203`, rewritten as
  ~200-word responses per objection — is now feasible. The
  standing pattern bullet (Iteration 6) says DO NOT draft
  response-to-reviewer prose before submission because real reviewer
  comments differ from anticipated ones. That pattern stands; the
  dry-run is a different artefact — a pre-submission sanity check of
  the paper's defensibility, not a substitute for real response prose.
  Label it clearly as a dry-run.
- **Framing containment re-verified across the v0.3 render.**
  Supplementary outline body mentions AI only via the "containment
  preservation" principle (which explicitly asserts that supplementary
  material does not re-open AI discussion) and via the reference to
  "§8 ¶5 agentic-bioimage landscape" as load-bearing in the BC main
  body. No new AI claim is introduced; the outline transports the
  containment rule forward into the submission-engineering layer.
- **Served URL is stable across re-renders.** Mount is in place under
  the name `manuscript` (registered 2026-04-18 11:54); re-saving the
  HTML on disk is sufficient — svamp serves from disk. No
  `svamp serve` re-invocation is needed. This confirms the pattern
  from Iteration 8 / 9 and should remain the norm through submission.

---

## 2026-04-18 — Iteration 11: Release engineering prose (v0.1) + HTML render refresh (v0.4)

### What was implemented

- **Drafted §Release engineering (v0.1)** at
  `preprint.md §"Drafted prose — Release engineering (v0.1, 2026-04-18)"` —
  five paragraphs, ~480 words, the last non-evidence-gated prose surface
  identified in Iteration 10's learnings. Content binds Online Methods §4
  "Runtime, distribution, reproducibility harness" to §10 "Availability"
  at the release-engineering granularity neither section specifies on
  its own. Structure:
  1. **The reproducibility claim is a claim about an immutable artefact.**
     Enumerates the five components of the `v1.0-paper` release bundle:
     pinned CheerpJ 4 JVM (Leaning Technologies 2025); pinned Fiji/ImageJ
     binary (Schindelin 2012 / Schneider 2012); pinned plugin set per
     `plugins/manifest.json`; JS entry at the tagged commit; Web Worker
     pool runtime under `threadhack/runtime/` (default-OFF flag).
  2. **Release cut is a single deterministic build script.** `build_v2.py`
     fetches CheerpJ by SHA-256; byte-stable Fiji compile; `dist/MANIFEST`
     file-level SHA-256 table; `v1.0-paper` annotated tag message carries
     the manifest root hash. Zenodo archive (`[DOI]`) is the long-term
     public mirror.
  3. **What is deliberately NOT pinned.** Browser + host OS intentionally
     outside the artefact (zero-install principle §3 ¶3 requires this).
     Fallback: `mount=`-disabled URL-param path for enterprise browsers;
     Playwright pins the browser at replay-corpus level via
     `run_replay.py`, not at release level.
  4. **The release-cut protocol is itself in the repository.** `build_v2.py`
     + `extract.py` + `refill2.py` + `fill_shortfall.py` under `[LICENCE]`;
     ~10 minutes end-to-end on a commodity laptop; no author-infrastructure
     dependency. Immutability operationally = survives loss of hosting,
     GitHub account, cloud provider.
  5. **Release cadence post-`v1.0-paper`.** Subsequent tags (`v1.1`, `v1.2`,
     …) DO NOT replace `v1.0-paper`; every past release stays
     hash-verifiable indefinitely. Hypha-RPC method-surface compatibility
     contract (`runMacro` / `takeScreenshot` / `getRoisAsGeoJson` /
     `executeJavaScript` / `convertToMcpUrl:880`) across subsequent
     releases; breaking changes gated behind major-version bumps.
- **HTML render refreshed to v0.4.** `manuscript_html/index.html` now
  includes a new `<section class="release-eng" id="release-eng">`
  inserted between Online Methods and References (ordering reflects
  the prose binding: Methods says how, Release engineering says what
  is pinned, §10 says where it's archived). Distinct CSS styling with
  a blue left border, a sans-serif lede, a structured pin-table
  (Component / Pin site / Contribution) for the 5-component bundle
  enumeration, and a `.rel-note` callout block for the reviewer-
  accessible fallback. Version strings bumped v0.3 → v0.4 in five
  places (article-meta published line; status-chip draft; status-chip
  status; sidebar article-info `Draft version`; footer rendered-from
  line). Sidebar Evidence-status now lists `Release engineering` as
  the 11th Ready-block. ToC gains `Release engineering` entry
  between `Online Methods` and `References`. Sidebar gains a
  `View the release-engineering contract ↓` callout next to the
  existing Cover-letter + Supp-outline callouts. Status-chip
  promotes from "9 prose blocks v0.1 (+ supplementary outline);
  3 pillars evidence-gated" to "10 prose blocks v0.1 (+ release
  engineering); 3 pillars evidence-gated".
- **Re-served via svamp.** Same mount name `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 135459` (up from
  125,600), `last-modified: Sat, 18 Apr 2026 12:19:11 GMT`. The
  string "release-eng" appears 18× in the rendered page (section
  id + ToC anchor + sidebar callout + 15 intra-document anchors);
  "Release engineering" appears 5× (ToC + section H2 + sidebar
  Ready list + status chip + callout); "v0.4" appears 4× (meta
  line + draft chip + sidebar + footer); zero residual "v0.3"
  occurrences. HTML parses well-formed (Python html.parser:
  zero unclosed tags, zero mismatched tags).

### Files changed

- `preprint.md` — appended Release engineering v0.1 block after the
  Supplementary material outline. No existing prose or scaffolding
  modified. File is now 750 lines / ~17,600 words.
- `manuscript_html/index.html` — added `section.release-eng` CSS
  block (~70 lines), inserted a new `<section>` between Online
  Methods and References with a 5-row pin table, a `.rel-note`
  callout block, and five body paragraphs. Added ToC entry;
  bumped version strings in five places; added sidebar callout.
  File is now 135,459 bytes (up from 125,600) / 1,485 lines.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added one pattern bullet at the top of the
  Patterns block.

### Learnings for future iterations

- **Release engineering is the prose-side counterpart to §10's
  Availability promise.** §10 says the artefacts are shipped;
  Online Methods §4 says they are pinned; Release engineering
  says *what being pinned operationally means* — the five
  components, the SHA-256 contract, the browser+OS non-pinning
  decision, the post-`v1.0-paper` cadence contract. Reviewers
  who want to audit reproducibility read these three surfaces as
  a triple. Future edits to any of the three must preserve the
  Methods §4 ↔ Release eng ↔ §10 binding — the same twin-binding
  discipline that Methods ↔ Availability established, now extended
  to a three-way binding.
- **Pin-table format is the right primitive for release-engineering
  prose.** The 5-row Component / Pin-site / Contribution table in
  the HTML is deliberately structured to survive revision: a new
  pinned component gets one row; a de-pinned component's row is
  removed; no prose paragraph reorg is needed. Future release
  iterations (post-submission `v1.1`, `v1.2` tags that change the
  pinned plugin set or the CheerpJ version) update the table
  in place rather than rewriting the prose. This parallels the
  References-entry discipline (add a row, not rewrite the section).
- **Highest-value next iteration without new evidence:
  placeholder-propagation script.** Still the dominant outstanding
  engineering task. The count of placeholders across five surfaces
  (preprint.md, manuscript_html/index.html, References cross-
  reference map, Supp outline, Release engineering) has grown
  again with this iteration. `[LICENCE]`, `[DOI]`, `[URL]`,
  `[YYYY+2]`, `[YYYY]`, `[DAU]`, `[48]%`, `[20]%`, `[X]`, `[Y]`,
  `[Z]`, `[N]`, `[Y1–Y2]`, `[VOL:PAGES]` all now appear in the
  Release engineering block too. A small regex-over-file script
  is now the unambiguous first-priority engineering primitive
  before the first evidence-landing pass. This has been
  first-priority for four iterations running; it needs to be a
  dedicated engineering iteration.
- **Second-highest: reviewer-response dry run.** Now that the
  full prose is drafted across Abstract / §§1, 3, 8, 9, 10 /
  Online Methods / Cover letter / References / Figure slots /
  Supp outline / Release engineering, a dry-run of anticipated
  reviewer objections drawn from the existing Risks table at
  `preprint.md:190–203` is feasible as ~200-word responses
  per objection. Label it clearly as a dry-run — real reviewer
  comments will differ, and the pattern bullet about NOT
  drafting response-to-reviewer prose before submission still
  stands. The dry-run is a different artefact: a pre-submission
  sanity check of the paper's defensibility, not a substitute
  for real response prose.
- **Third-highest: §10 ↔ Methods §4 ↔ Release engineering
  three-way cross-check pass.** Read the three surfaces together
  and verify every artefact named in Release engineering
  (`build_v2.py`, `plugins/manifest.json`, `dist/MANIFEST`,
  `threadhack/runtime/`, the `v1.0-paper` tag message body)
  is either named in §10 or nameable from it. Release
  engineering's `dist/MANIFEST` and `dist/fiji/` tree are new
  named artefacts not yet in §10; a future iteration should
  either promote them to §10 (if they are reviewer-facing) or
  explicitly note in Release engineering that they are
  intermediate build products not directly shipped. Leave this
  until after the placeholder-propagation script.
- **Framing containment re-verified across the v0.4 render.**
  Release engineering body mentions CheerpJ, Fiji, WebAssembly,
  Hypha-RPC, MCP — no AI method. Consistent with the Iteration-6
  containment discipline. The release-engineering prose is a
  reproducibility contract, not a methodology comparison;
  containment holds naturally from the genre.
- **Served URL is stable across re-renders (Iteration 8 / 9 / 10
  / 11).** Mount is in place under the name `manuscript`
  (registered 2026-04-18 11:54); re-saving the HTML on disk is
  sufficient — svamp serves from disk. No `svamp serve`
  re-invocation is needed. This pattern now holds across four
  re-render iterations and should be treated as the stable norm
  through submission.

---

## 2026-04-18 — Iteration 12: Reviewer-response dry run prose (v0.1) + HTML render refresh (v0.5)

### What was implemented

- **Drafted §Reviewer-response dry run (v0.1)** at
  `preprint.md §"Drafted prose — Reviewer-response dry run (v0.1, 2026-04-18)"` —
  ~2,000 words, 12 anticipated objections, the second-highest-priority next
  iteration cited from Iteration 11's learnings. The block is explicitly
  framed as a pre-submission sanity check, NOT as a draft of the
  response-to-reviewers letter — a discipline preserved both in the prose
  banner at the top and in the new pattern bullet at the top of this
  progress file. Structure:
  1. **Status banner** marking the block as DRY RUN, naming the
     containment rule (every response must be grounded in already-drafted
     prose, shipped artefacts, or a named §10 evidence-gate).
  2. **Q1–Q9: the Risks-table objections** copied verbatim from
     `preprint.md §"Risks and reviewer pushback (A+B-specific)"` lines
     192–202. Each ~150–200 word response cross-references the resolving
     prose surface (§-and-paragraph or `Online Methods §<n>` or the
     named code mechanism). Q3 (foundation models on small data) labelled
     `EVIDENCE-GATED` against `replay/foundation_models/MATCH_REPORT.md`;
     all others answerable from drafted prose.
  3. **Q10–Q12: out-of-table objections** anticipated to surface in
     real review but not in the Risks table. Q10 (survey selection bias)
     labelled `EVIDENCE-GATED` against the cross-reference promotion of
     `survey_schema.md` sampling-rule prose into §2 / Online Methods §1.
     Q11 (CheerpJ choice) and Q12 (tag vs Zenodo) answerable from
     §3 ¶3 + Methods §4 and Release engineering ¶5 respectively.
  4. **Defensibility scorecard** — current count: 10 answerable from
     drafted prose alone, 1 partial (Q10), 1 evidence-gated (Q3).
     Q3 remains the single highest reason to land Pillar 1's
     foundation-model benchmark before submission.
  5. **What the dry run is NOT** — closing paragraph re-asserting that
     this artefact is not a draft of the response-to-reviewers letter,
     drawing the parallel to the cover-letter rephrasing-not-new-argument
     discipline.
- **HTML render refreshed to v0.5.** `manuscript_html/index.html` now
  includes a new `<section class="dry-run" id="dry-run">` inserted after
  the supplementary-material outline (ordering reflects the
  submission-engineering layer: Cover letter is editor-facing, Supp
  outline is allocation-side, Dry run is reviewer-facing). Distinct CSS
  styling with an amber/orange colour scheme (`#c87f1a` accent, `#fff9ef`
  body bg, `#fbe9c4` banner) so the section is visually marked as
  submission-engineering, not body prose. New CSS subblocks:
  `.dryrun-banner` (DRY RUN status); `.objection` (per-Q card with
  numbered badge `.qnum`, source label `.src`/`.src.gated`, italic
  quoted objection `.qtext`, formatted response `.qresponse`);
  `.scorecard` (12-row green/amber/red status table);
  `.dryrun-legend` (3-tier swatch legend matching scorecard colours).
  Version strings bumped v0.4 → v0.5 in five places (article-meta
  published line; status-chip draft; status-chip status; sidebar
  article-info `Draft version`; footer rendered-from line).
  Status-chip content extended to include `defensibility 10/12`.
  Sidebar Evidence-status now lists `Reviewer-response dry run` as the
  12th Ready-block AND adds a new `Defensibility (dry run)` row reporting
  the current scorecard. ToC gains `Reviewer-response dry run` entry
  after `Supp. outline`. Sidebar gains a new `View the reviewer-response
  dry run ↓` callout (amber-tinted to match the section).
- **Re-served via svamp.** Same mount name `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 161,133` (up from
  135,459), `last-modified: Sat, 18 Apr 2026 12:28:28 GMT`. The
  string `dry-run` / `dry run` / `Dry run` / `DRY RUN` appears 42×
  in the rendered page (section id + ToC anchor + sidebar callout +
  status-chip + 38 intra-document anchors / labels); `v0.5` appears
  6×; zero residual `v0.4` occurrences. HTML parses well-formed
  (Python html.parser: zero unclosed tags, zero mismatched tags).

### Files changed

- `preprint.md` — appended Reviewer-response dry run v0.1 block after the
  Release engineering block. No existing prose or scaffolding modified.
  File is now 975 lines / ~19,600 words.
- `manuscript_html/index.html` — added `section.dry-run` CSS block
  (~150 lines), inserted a new `<section>` after Supplementary outline
  with a status banner, 12 objection cards, a 12-row scorecard table,
  and three structural sub-headings. Added ToC entry; bumped version
  strings in five places; added sidebar callout (amber-tinted);
  promoted status-chip and Evidence-status block. File is now
  161,133 bytes (up from 135,459) / 1,766 lines.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added one pattern bullet at the top of the
  Patterns block.

### Learnings for future iterations

- **Dry-run scorecard is now a continuous instrument.** The 10/12
  defensibility score is the first numeric measurement of the paper's
  defensive load; it should be re-computed at every iteration that
  drafts new prose or lands new evidence. Two specific update
  triggers exist: (i) Q3 promotes from `Evidence-gated` to
  `Answerable` when `replay/foundation_models/MATCH_REPORT.md` lands;
  (ii) Q10 promotes from `Partial` to `Answerable` when the
  `survey_schema.md` sampling rule is cross-referenced from §2 or
  Online Methods §1. Either promotion bumps the answerable count
  to 11/12 or 12/12 and is the single most progress-meaningful
  metric the paper has at present (more than placeholder count,
  more than word count). Future iterations that touch evidence
  surfaces should update this score in the rendered HTML and in
  the §status chip. Future iterations that touch prose surfaces
  should re-verify that no new objection has *opened* (the score
  drops if a new prose paragraph names a claim no current objection
  defends against).
- **Highest-value next iteration without new evidence:
  placeholder-propagation script.** Now first-priority for *five*
  iterations running. Placeholders across six surfaces (preprint.md,
  manuscript_html/index.html, References cross-reference map, Supp
  outline, Release engineering, Reviewer-response dry run) include
  `[LICENCE]`, `[DOI]`, `[URL]`, `[YYYY+2]`, `[YYYY]`, `[DAU]`,
  `[48]%`, `[20]%`, `[X]`, `[Y]`, `[Z]`, `[N]`, `[Y1–Y2]`,
  `[VOL:PAGES]`. A small regex-over-file script that takes a
  `placeholders.yaml` resolution dictionary and emits
  `preprint.md` + `manuscript_html/index.html` with all values
  substituted is now the unambiguous first-priority engineering
  primitive before any first-evidence-landing pass. It is also the
  first iteration whose *output* (a clean, placeholder-free render)
  will materially change reader experience without changing prose.
- **Second-highest: §10 ↔ Methods §4 ↔ Release engineering ↔ Dry-run
  Q3/Q10 four-way cross-check.** Now extended from a three-way to a
  four-way binding because the dry run names two §10 artefacts that
  resolve specific objections (`replay/foundation_models/MATCH_REPORT.md`
  for Q3; `survey_schema.md` cross-reference for Q10). Read the four
  surfaces together and verify (i) every artefact named in the dry run
  is reachable from §10 or noted as evidence-gated, (ii) every §10
  artefact's reviewer-facing purpose is named in the dry-run scorecard
  (else it lacks an objection-resolving role and should be questioned).
  This cross-check is the dry-run-extended version of the §10 ↔
  Methods §4 ↔ Release engineering pass cited in Iteration 11; defer
  it until after the placeholder-propagation script.
- **Third-highest: dry-run Q3 promotion plan.** When the foundation-model
  benchmark lands in `replay/foundation_models/`, the Q3 response in
  the dry run should be re-edited (status badge: `EVIDENCE-GATED` →
  green `ANSWERED`; response prose: replace "we will show the
  benchmark" with the actual numbers from `MATCH_REPORT.md`).
  Critically, this edit must propagate to the §8 ¶2 prose, the
  Abstract IoU/`[X]`/`[Y]`/`[Z]` placeholders, the Cover letter Q3
  rephrasing, and the Figure 1 panel claims — five surfaces in one
  edit pass. The dry-run scorecard's role is to make this propagation
  list explicit; without the scorecard, a future iteration would be
  likely to update §8 alone and miss the four other surfaces.
- **Framing containment re-verified across the v0.5 render.**
  Reviewer-response dry-run body discusses AI in Q3, Q4, Q8, Q9 — all
  routed through the §8 framing-containment discipline (regime
  characterisation, not methodology ranking). No new AI claim is
  introduced; every AI-adjacent sentence in the dry run is either a
  rephrasing of §8 prose or a containment statement (e.g., Q8: "we
  are unmoving on this. The paper characterises the human-centred,
  classical regime"). The pattern bullet at the top of this file
  (*"AI stays contained to §8"*) is preserved.
- **Served URL is stable across re-renders (Iteration 8 / 9 / 10
  / 11 / 12).** Mount is in place under the name `manuscript`
  (registered 2026-04-18 11:54); re-saving the HTML on disk is
  sufficient — svamp serves from disk. No `svamp serve` re-invocation
  is needed. This pattern now holds across five re-render iterations
  and is the stable norm through submission.

---

## 2026-04-18 — Iteration 13: Submission packet prose (v0.1) + HTML render refresh (v0.6)

### What was implemented

- **Drafted §Submission packet (v0.1)** at
  `preprint.md §"Drafted prose — Submission packet (v0.1, 2026-04-18)"` —
  ~1,550 words, eight fields, the non-evidence-gated "submission
  completeness" block Nature Methods requires alongside the manuscript
  PDF. Fields:
  1. **Editor's summary** (~50 words, front-of-issue column) — two
     sentences rephrasing Abstract v0.5; introduces no new claim.
  2. **Key points** (three ~25-word bullets) — [48]%/[48]%/[20]%
     regime numbers; [Y]/30 vs [Z]/30 long-tail result; single-page
     WASM + URL-addressable state. Every headline number already in
     Abstract and/or §8 ¶3.
  3. **Author contributions (CRediT taxonomy)** — all fourteen CRediT
     roles named; per-role assignments as `[INITIALS]` placeholders;
     structural commitment that every role is claimed and that
     commit-author graph at `v1.0-paper` is auditable.
  4. **Competing interests** — per-author lines as placeholders;
     structural commitment that Leaning Technologies / Hypha AI /
     partner institutions are named explicitly if relevant.
  5. **Data and code availability statement** — condensed one-paragraph
     restatement of §10; every artefact named here is also named in §10;
     no new artefact introduced.
  6. **Acknowledgements** — CheerpJ upstream, Fiji/ImageJ community, and
     Hypha substrate acknowledged explicitly by the structural rule;
     funding IDs and partner names as placeholders.
  7. **Suggested reviewers** — five names across three domains
     (small-data / classical; Fiji ecosystem; web-platform research
     tooling) + foundation-model + field-deployment experts. Structural
     commitment: each reviewer non-conflicted with cited competitors,
     unaffiliated at sub-department level for four years.
  8. **Opposed reviewers** — default "none"; structural rule that any
     specific name requires a one-line documentable reason.
- **Defensibility scorecard.** Eight fields scored: 4 `READY` (editor's
  summary, key points, data/code availability, opposed reviewers), 4
  `AUTHOR-GATED` (author contributions, competing interests,
  acknowledgements, suggested reviewers), **0 `EVIDENCE-GATED`**.
  Zero-evidence-gated property is a consequence of the packet being
  rephrasing-of-body-prose; any future edit that introduces an
  evidence-gated field is a discipline regression.
- **HTML render refreshed to v0.6.** `manuscript_html/index.html` now
  includes a new `<section class="submission-packet"
  id="submission-packet">` inserted as the last editorial appendix, after
  the Reviewer-response dry run. Distinct CSS styling with a teal
  (#2a6b7c) left-border accent distinct from the four previously
  introduced editorial-appendix palettes (cover-letter serif; supp-outline
  green/amber/red; release-eng blue; dry-run amber). New CSS subblocks:
  `.packet-banner` (SUBMISSION PACKET status); `.editor-summary` (serif
  on white, matches body-prose reading style); `.keypoints` (teal
  border-left UL); `.packet-table` (8-row field / status / gating-path
  scorecard); `.status-ready` / `.status-author` / `.status-evidence`
  status chips; `.packet-legend` (3-tier swatch legend matching the
  dry-run legend form). Version strings bumped v0.5 → v0.6 in five places
  (article-meta published line; status-chip draft; status-chip status;
  sidebar article-info `Draft version`; footer rendered-from line). Four
  legitimate `v0.5` references retained in the render (they point
  specifically to Abstract v0.5 which is unchanged). Status-chip content
  extended to include `packet 4 ready / 4 author-gated / 0 evidence-gated`.
  Sidebar Evidence-status gains a new `Submission packet` row reporting
  the current scorecard. ToC gains `Submission packet` entry after
  `Reviewer-response dry run`. Sidebar gains a new
  `View the submission packet ↓` callout (teal-tinted to match the
  section).
- **Re-served via svamp.** Same mount name `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 181,410` (up from
  161,133), `last-modified: Sat, 18 Apr 2026 12:37:55 GMT`. The string
  `submission-packet` / `Submission packet` / `SUBMISSION PACKET`
  appears 35× in the rendered page (section id + ToC anchor + sidebar
  callout + 32 intra-document anchors / labels / table cells); `v0.6`
  appears 4× exactly where expected (article-meta, draft chip, sidebar
  dt, footer); no residual `v0.5` references remain outside the four
  legitimate Abstract-v0.5 pointers. HTML parses well-formed (Python
  `html.parser`: zero unclosed tags, zero mismatched tags).

### Files changed

- `preprint.md` — appended Submission packet v0.1 block after the
  Reviewer-response dry run. No existing prose or scaffolding modified.
  File is now 1,208 lines / ~21,200 words.
- `manuscript_html/index.html` — added `section.submission-packet` CSS
  block (~130 lines), inserted a new `<section>` after Reviewer-response
  dry run with a status banner, 8 field subsections, an 8-row scorecard
  table, and the packet-level status line. Added ToC entry; bumped
  version strings in five places; added sidebar callout (teal-tinted);
  promoted status-chip and Evidence-status block with the `Submission
  packet` sidebar row. File is now 181,410 bytes (up from 161,133) /
  1,992 lines.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added one pattern bullet at the top of the Patterns block.

### Learnings for future iterations

- **The submission packet is the last non-evidence-gated prose surface.**
  With this iteration, every prose block Nature Methods needs at
  submission time (Abstract; §§1–10 body; Online Methods; Release
  engineering; References; Figure captions; Cover letter; Supp outline;
  Dry run; Submission packet) is now drafted at v0.1 or better. The
  remaining blocks are *all* evidence-gated: §2 final numbers (rows
  81–200 + IRR); §4 replay scale-up numbers; §§5, 6, 7 partner-landing
  prose; Fig 4 / Fig 5 / Fig 6 finalised captions; §8 ¶3 foundation-model
  benchmark numbers ([X], [Y], [Z]); References bibliographic metadata
  verification; Abstract/§1/Cover letter/Key-points placeholder
  resolution. This is a natural iteration boundary: future prose work
  requires evidence landing, not more drafting. The next iterations
  should either (a) do the long-deferred engineering primitives
  (placeholder-propagation script; four-way cross-check pass) or (b)
  wait for evidence to land.
- **Packet defensibility scorecard is the second measurable dimension of
  publication-readiness.** After the dry-run's 10/12-answerable score,
  the submission packet now reports 4-ready / 4-author-gated /
  0-evidence-gated. Together the two scorecards are the first two
  numerical measures of the paper's submission-readiness that are
  independent of evidence status. Future iterations that touch body
  prose should check both scores; a drop in either (a new packet field
  becoming evidence-gated, or a dry-run objection becoming unanswerable)
  is a regression that should trigger a prose-pass review. The progress
  metric for this paper is now: (dry-run answerable count) + (packet
  ready + author-gated count), both measured against their totals.
- **Highest-value next iteration without new evidence:
  placeholder-propagation script (first-priority for six iterations
  running).** Placeholders now span seven surfaces: `preprint.md`,
  `manuscript_html/index.html`, References cross-reference map, Supp
  outline allocation tables, Release engineering pin table, Dry-run
  scorecard, and Submission packet scorecard. Every new iteration has
  added to the placeholder set (this iteration adds `[INITIALS]`,
  `[AFFILIATION-1…5]`, `[NAME-1…5]`, `[FUNDING IDs]`, `[TEACHING PARTNER]`,
  `[CLINICAL PARTNER]`, `[COLLABORATION PARTNER-A]`, `[COLLABORATION
  PARTNER-B]`, `[DECLARATION]`). A small regex-over-file script that
  takes a `placeholders.yaml` resolution dictionary and emits all seven
  surfaces with values substituted is now the dominant outstanding
  engineering task. Its deferral is compounding — each iteration that
  adds a new prose block adds more placeholders the eventual script
  must resolve in one pass.
- **Second-highest: four-way cross-check pass (§10 ↔ Methods §4 ↔
  Release engineering ↔ Dry-run Q3/Q10 ↔ Submission packet data-and-
  code-availability paragraph).** The submission packet's
  data-and-code-availability paragraph is the fifth surface in the
  reproducibility-promise binding. A single iteration should verify
  that every artefact named in any of the five surfaces is reachable
  from the other four (or, for evidence-gated artefacts, that the
  gating path is recorded consistently).
- **Third-highest: dry-run Q3 promotion plan** (unchanged from
  Iteration 12). When the foundation-model benchmark lands in
  `replay/foundation_models/`, the promotion touches five surfaces: §8
  ¶2; Abstract `[X]`/`[Y]`/`[Z]`; Cover letter Q3 rephrasing; Figure 1
  panel claims; Submission packet Key-points block (`[Y]/30` and
  `[Z]/30` are duplicated there). The propagation list is now six
  surfaces with this iteration — the scorecard in the dry-run block
  should be annotated to reflect this.
- **Framing containment re-verified across the v0.6 render.**
  Submission packet body discusses AI in two surfaces only: the
  suggested-reviewer bullet on foundation-model segmentation (which
  names the domain without taking a position on it), and the competing-
  interests paragraph (which declares neutrality on DL-vendor
  compensation). The pattern bullet at the top of this file
  (*"AI stays contained to §8"*) is preserved — submission packet AI
  mentions are scoping declarations, not methodology claims.
- **Served URL is stable across re-renders (Iteration 8 / 9 / 10 / 11 /
  12 / 13).** Mount is in place under the name `manuscript` (registered
  2026-04-18 11:54); re-saving the HTML on disk is sufficient — svamp
  serves from disk. No `svamp serve` re-invocation is needed. This
  pattern now holds across six re-render iterations and is the stable
  norm through submission.

---

## 2026-04-18 — Iteration 14: Submission readiness dashboard (v0.1) + HTML render refresh (v0.7)

### What was implemented

- **Drafted §Submission readiness dashboard (v0.1)** at
  `preprint.md §"Drafted prose — Submission readiness dashboard (v0.1,
  2026-04-18)"` — ~1,900 words, the long-requested at-a-glance
  consolidation of the six independent scorecards already maintained
  across the paper (prose-block coverage; dry-run defensibility;
  submission-packet completeness; figure slots; references bibliographic
  verification; three empirical corpora) plus a live placeholder
  inventory and a submission-gate (A–J) status list. Structure:
  1. **Status banner** marking the block as a rephrasing artefact;
     dashboard is load-bearing only if synchronised with its sources.
  2. **Dashboard purpose and scope** — names all six source scorecards
     and the ninth surface (placeholder inventory) they union.
  3. **Readiness scoreboard** — 9-row table: prose coverage (14/14
     STRUCTURAL-READY), dry-run (10/12 answerable, 1 partial, 1
     evidence-gated), packet (4 ready / 4 author-gated / 0
     evidence-gated), figures (3/6 full + 3/6 evidence-gated),
     references (0/~35 verified), regime survey (80/200, 0/3 IRR),
     long-tail benchmark (30 specified, 0 model-runs, 0 human-runs),
     replay corpus (3/[N]), placeholders (~25 labels across 7
     surfaces). Each row carries measurement + gating path + source
     block.
  4. **Go/no-go submission gates** — 10 gates (A = prose coverage,
     B = defensibility, C = packet non-regression, D = regime survey,
     E = long-tail benchmark, F = replay corpus, G = partner landings,
     H = references verification, I = author sign-off, J = placeholder
     resolution). Three MET (A, B, C); seven PENDING. Gates D–G are
     precisely the four paper pillars — their resolution *is* the
     empirical contribution, not a precondition of it.
  5. **Overall submission posture** — structurally READY (with
     author sign-off + references verification + placeholder
     resolution as mechanical pre-submission tasks), empirically
     EVIDENCE-GATED on Gates D–G.
  6. **Dashboard discipline** — three rules: rephrasing only;
     synchronised in-pass; not a release trigger.
  7. **Scoreboard summary — one line** — a single terse line designed
     for sidebar / status-chip / iteration-log inclusion.
- **HTML render refreshed to v0.7.** `manuscript_html/index.html` now
  includes a new `<section class="readiness" id="readiness">` inserted
  as the first editorial appendix (immediately before Cover letter).
  Positioning is deliberate: an editor or co-author opening the
  rendered page should see the unified readiness posture before any
  of the source scorecards. Distinct violet (#6b4c93) palette distinct
  from the five previously introduced editorial-appendix palettes
  (cover-letter serif; supp-outline green/amber/red; release-eng
  blue; dry-run amber; packet teal). New CSS subblocks:
  `.readiness-banner` (READINESS DASHBOARD status line);
  `.readiness-table` (9-row scoreboard with dimension / measurement /
  gating path / source-block columns); `.gate-table` (10-row gate
  list with letter / condition / status / source columns);
  `.status-met` / `.status-pending` / `.status-partial` /
  `.status-structural` / `.status-evgated` / `.status-numeric` status
  chips; `.posture-box` (summary of dual postures); `.one-line-summary`
  (terse scoreboard summary); `.discipline` (three-rule ul).
  Version strings bumped v0.6 → v0.7 in four places (article-meta
  published line; status-chip draft; sidebar article-info `Draft
  version`; footer rendered-from line). Status-chip status content
  promoted to `14 prose blocks v0.1 (+ readiness dashboard);
  structurally READY · empirically EVIDENCE-GATED on Gates D–G;
  defensibility 10/12; packet 4 ready / 4 author-gated / 0
  evidence-gated; 3 / 10 submission gates MET`. Sidebar Evidence-status
  gains a new `Readiness posture` row reporting the overall posture
  and gate count; `Ready (prose v0.1)` list extended to include
  `Readiness dashboard` as the 15th entry (marked `<strong>` as the
  newest). ToC gains `Readiness dashboard` entry between References
  and Cover letter. Sidebar gains a new `View the submission readiness
  dashboard ↓` callout (violet-tinted to match the section) inserted
  above the cover-letter callout so it sits at the top of the
  callout stack.
- **Re-served via svamp.** Same mount name `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 199,447` (up from
  181,410), `last-modified: Sat, 18 Apr 2026 12:47:14 GMT`. The string
  `readiness` / `Readiness` / `READINESS` appears 55× in the rendered
  page (section id + ToC anchor + sidebar callout + status-chip +
  51 intra-document anchors / labels / table cells); `v0.7` appears
  4× exactly where expected (article-meta, draft chip, sidebar dt,
  footer); zero residual `v0.6` references remain. HTML parses
  well-formed (Python `html.parser`: zero unclosed tags, zero
  mismatched tags).

### Files changed

- `preprint.md` — appended Submission readiness dashboard v0.1 block
  after the Submission packet. No existing prose or scaffolding
  modified. File is now 1,435 lines / ~22,900 words.
- `manuscript_html/index.html` — added `section.readiness` CSS block
  (~165 lines), inserted a new `<section>` before Cover letter with
  a status banner, 9-row scoreboard table, 10-row gate table,
  posture box, discipline ul, and one-line summary. Added ToC entry;
  bumped version strings in four places; added sidebar callout
  (violet-tinted); promoted status-chip; added sidebar
  `Readiness posture` row. File is now 199,447 bytes / 2,282 lines
  (up from 181,410 bytes / 1,992 lines).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added one pattern bullet at the top of the Patterns
  block.

### Learnings for future iterations

- **The dashboard is the readiness regression-detector.** The core
  value of the dashboard is not that it reports new information — by
  design it rephrases only — but that it creates one screen on which
  a regression in any source scorecard becomes visually obvious. If a
  future iteration edits the dry-run scorecard to drop an objection
  from `Answerable` to `Evidence-gated` but forgets to update the
  dashboard, the dashboard's row for dry-run will disagree with the
  source, and the next iteration's dashboard-consistency check will
  catch it. This is the same mechanism as the References cross-
  reference map (which prevents a citation rename from drifting
  between sections) and the Online-Methods-↔-§10 twin-binding (which
  prevents a Methods subsection from orphaning its Availability
  artefact). The dashboard is the third such consistency instrument;
  the pattern of "no-single-source-of-truth + audit surface that
  catches drift" is now the dominant organisational discipline of
  this paper.
- **Highest-value next iteration without new evidence:
  placeholder-propagation script (first-priority for seven iterations
  running — now NAMED as Gate J on the dashboard).** With Gate J
  promoted onto the dashboard, the script's absence is now visually
  surfaced as a PENDING submission gate; the dashboard makes the
  script's deferral cost visible. Seven surfaces carry placeholders:
  `preprint.md`, `manuscript_html/index.html`, References cross-
  reference map, Supp outline allocation tables, Release engineering
  pin table, Dry-run scorecard, Submission packet scorecard. The
  script takes a `placeholders.yaml` resolution dictionary and emits
  all seven surfaces with values substituted; partial resolution
  (e.g., `[LICENCE]` = MIT) is already tractable today even without
  evidence landing. Writing the script is now the dominant outstanding
  engineering task and its iteration would resolve Gate J and
  measurably move the dashboard.
- **Second-highest: placeholder-propagation script partial run with
  current-knowable resolution dictionary.** Even before Gates D–G
  land, several placeholders are already resolvable: `[LICENCE]` (the
  repo licence is visible in `LICENCE` / `package.json`); `[URL]`
  (the svamp-served URL and the GitHub Pages / CNAME URL are both
  known); `[URL/github]` (same); `[VOL:PAGES, DOI]` for a subset of
  the References (the ones whose journal records are unambiguously
  public — Schneider 2012, Schindelin 2012). A partial run against
  the dashboard would drop the open-placeholder count from ~25 to
  ~18 and promote one cell of the dashboard in the same iteration,
  even with no new evidence.
- **Third-highest: dashboard ↔ gate table cross-check instrument.**
  The dashboard now names 10 gates (A–J). Three are currently MET
  (A, B, C); seven are PENDING. An iteration that lands evidence
  touching any PENDING gate (e.g., one replay MATCH_REPORT lands →
  Gate F partial) must re-read the gate table to re-promote status.
  A future iteration could add one more dashboard row: "Days since
  last gate promotion" — a lightweight pace-of-progress metric that
  surfaces long-deferred work (currently Gate J has been pending for
  7 iterations). Consider adding this on the next evidence-landing
  iteration.
- **Framing containment re-verified across the v0.7 render.** Readiness
  dashboard body mentions AI only as subject (Gate E = long-tail
  benchmark characterises foundation-model performance) — no new AI
  claim; every AI reference is routed through the §8 regime-
  characterisation frame. The pattern bullet at the top of this file
  (*"AI stays contained to §8"*) is preserved. Dashboard is also
  packet-rephrasing-clean: zero dashboard cells introduce a number or
  commitment not already reported in a source block (verified by
  spot-check: every number in the dashboard is the verbatim number
  from its source scorecard).
- **Served URL is stable across re-renders (Iteration 8 / 9 / 10 / 11
  / 12 / 13 / 14).** Mount is in place under the name `manuscript`
  (registered 2026-04-18 11:54); re-saving the HTML on disk is
  sufficient — svamp serves from disk. No `svamp serve` re-invocation
  is needed. This pattern now holds across seven re-render iterations
  and is the stable norm through submission.

---

## 2026-04-18 — Iteration 15: Life Sciences Reporting Summary (v0.1) + partial placeholder resolution + HTML render v0.8

### What was implemented

- **Drafted §Life Sciences Reporting Summary (v0.1)** at
  `preprint.md §"Drafted prose — Life Sciences Reporting Summary
  (v0.1, 2026-04-18)"` — ~3,400 words, publication-readable
  pre-flight of the Nature Portfolio Life Sciences Reporting Summary
  (the mandatory editorial-integrity form every Nature Methods first
  submission must upload). Structure:
  1. **Status banner** marking the block as a rephrasing artefact;
     any Methods / §10 edit MUST re-render this block in the same
     iteration.
  2. **Purpose and scope** — names the seven form sections and the
     4-of-7 that apply directly to a tool paper (statistics; study
     design; software; data-and-code availability), the 2-of-7 that
     apply only through the three field deployments (human
     participants; data management — evidence-gated), and the
     1-of-7 that is genuinely N/A (methods-specific modality
     checklists like ChIP-seq / flow / MRI).
  3. **Section 1 Statistics** — five READY / PARTIAL slots
     (sample size; data exclusions; replication; randomisation;
     blinding). Every slot references Online Methods §Regime survey
     or §Long-tail benchmark or §Deterministic replay.
  4. **Section 2 Reporting on study design** — one READY slot,
     distinguishing the paper's three descriptive studies from a
     hypothesis-testing design. Cites Wilson score intervals on
     48 % / 48 % / 20 % estimates.
  5. **Section 3 Materials** — five N/A slots (antibodies; cell
     lines; palaeontology; animals; dual-use); two EVIDENCE-GATED
     slots (human participants → Gate G; clinical data → Gate G).
     Every N/A is justified against the "paper does not originate
     imaging data" rationale.
  6. **Section 4 Software** — two READY slots (data collection
     software named per corpus: E-utilities + LLM pipeline for
     survey; public retrieval for benchmark; figshare/Zenodo for
     replay; data analysis software = ImageJ.JS `v1.0-paper` itself
     + CheerpJ 4 + Hypha-RPC methods + foundation-model version
     pins for baselines).
  7. **Section 5 Data and code availability** — three READY slots
     (data availability; code availability; live instance). Cites
     resolved `https://github.com/aicell-lab/imagej.js` (code)
     and `https://ij.aicell.io` (live) + MIT licence.
  8. **Section 6 Accession codes** — one N/A slot (no primary-
     repository deposits required; Zenodo deposit for
     `v1.0-paper` is the single repository artefact).
  9. **Section 7 Methods-specific reporting** — one N/A slot
     (the paper does not perform ChIP-seq / flow / MRI /
     magnetic-resonance / … for which Nature maintains
     sub-checklists).
 10. **Defensibility scorecard** — 25-slot table with status +
     gating path + source per slot. Counts: **22 READY / 0
     AUTHOR-GATED / 3 EVIDENCE-GATED**. Zero AUTHOR-GATED is the
     structural invariant.
 11. **Discipline block** — three rules (rephrasing; synchronised;
     zero AUTHOR-GATED) modelled on the dry-run, packet, and
     readiness-dashboard discipline blocks.
 12. **One-line summary** for sidebar / iteration-log use.
- **Partial placeholder resolution.** Three repository-self-knowable
  labels resolved in body prose (NOT in meta/scaffolding):
  `[URL]` → `https://ij.aicell.io` (from `CNAME`);
  `[URL/github]` → `https://github.com/aicell-lab/imagej.js` (from
  `git remote`); `[LICENCE]` → `MIT` (from `package.json`). Body
  occurrences resolved across Abstract v0.5, Cover letter, §10,
  Release engineering (2 occurrences), Submission packet (2
  occurrences), Online Methods §Data/code/protocol availability.
  Meta references (Risks-table Zenodo-specific row, §10 block
  header placeholder list, Release-eng placeholder-budget listing,
  dashboard placeholder inventory) are updated to record *that*
  the labels are resolved, rather than edited to remove the label
  reference. Dashboard placeholder-inventory count drops from ~25
  to ~22. Gate J is promoted from `PENDING` to `PENDING — PARTIAL`.
- **HTML render refreshed to v0.8.** `manuscript_html/index.html`
  now includes:
  - New `<section class="reporting-summary" id="reporting-summary">`
    inserted after Submission packet, with a status banner, 7
    numbered subsections (each with a circled pink `rs-section-num`
    chip), a 25-row reporting-summary scoreboard with grouped
    rowspan cells, a discipline `ul`, and a one-line monospace
    summary.
  - New rose/coral CSS palette (#b8325a border-left, #fdf0f3
    background, #fae0e7 banner, #f4cbd4 table header). ~150
    lines of CSS distinct from the five previously introduced
    editorial-appendix palettes.
  - ToC entry `Reporting summary` appended.
  - Sidebar callout (rose/coral-tinted) inserted above the readiness
    callout so it sits at the top of the callout stack.
  - Sidebar `Evidence status` gains a new `Reporting summary` row
    reporting `22 ready · 0 author-gated · 3 evidence-gated of 25`.
  - `Ready (prose v0.1)` list extended to include `Reporting
    Summary` as the 16th entry (marked `<strong>` as newest).
  - Version strings bumped v0.7 → v0.8 in four places (article-meta
    published line; status-chip draft; sidebar `Draft version`;
    footer rendered-from line).
  - Status-chip status promoted to `15 prose blocks v0.1 (+ Life
    Sciences Reporting Summary); … reporting summary 22 ready /
    0 author-gated / 3 evidence-gated; [URL]/[URL/github]/[LICENCE]
    resolved in iteration 15; 3 / 10 submission gates MET (Gate J
    partial)`.
  - Resolved placeholders in body prose use inline `<code>` (URLs)
    or `<strong>` (MIT); the `placeholder-value` yellow-highlight
    span is reserved for still-unresolved labels.
  - **Readiness dashboard synchronised in-pass:** prose coverage
    row updated to `15 / 15`; placeholder inventory row updated to
    `~22 distinct labels open · 3 resolved iter 15`; new row
    `Reporting summary · 22 / 25 READY · 0 AUTHOR-GATED · 3
    EVIDENCE-GATED`; Gate A updated to 15-block count; Gate J
    promoted to `PENDING — PARTIAL`; one-line summary updated.
  - Dashboard narrative updated from `Six independent scorecards`
    to `Seven independent scorecards` (adds Reporting Summary
    completeness).
- **Re-served via svamp.** Same mount name `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 227,942` (up from
  199,447), `last-modified: Sat, 18 Apr 2026 13:04:34 GMT`. String
  `reporting-summary` / `Reporting Summary` appears 61× in the
  rendered page; `v0.8` appears 4× exactly where expected;
  `ij.aicell.io` appears 9× (one per resolved `[URL]` body-prose
  occurrence + abstract + HTML references); zero residual `v0.7`
  references; zero `placeholder-value">[URL]` / `placeholder-
  value">[URL/github]` / `placeholder-value">[LICENCE]` outside of
  the three References-entry `[URL, commit hash]` /
  `[URL, archived snapshot]` / `[URL, date-accessed]` patterns
  (which are different placeholder class — bibliographic-metadata
  placeholders gated on Gate H, not the live-instance URL class).
  HTML parses well-formed (Python `html.parser`: zero unclosed
  tags, zero mismatched tags).

### Files changed

- `preprint.md` — appended Reporting Summary v0.1 block after the
  Submission readiness dashboard; resolved `[URL]` / `[URL/github]`
  / `[LICENCE]` in 10 body-prose occurrences (Abstract v0.5; Cover
  letter; §10 ¶1; §10 ¶4; Online Methods §Data/code/protocol
  availability; Release engineering §"release-cut protocol"
  paragraph; Release engineering §"Release cadence post-v1.0-paper"
  paragraph; Submission packet §"Data and code availability
  statement"; Submission packet §"Acknowledgements"); updated §10
  block header description, Release engineering placeholder-budget
  listing, dashboard placeholder inventory row (~25 → ~22),
  dashboard Gate J status (PENDING → PENDING — PARTIAL), dashboard
  Gate A status (14 → 15 blocks), dashboard scoreboard summary one-
  liner. File is now 1,812 lines / ~26,300 words.
- `manuscript_html/index.html` — added `section.reporting-summary`
  CSS block (~150 lines); inserted new `<section>` after Submission
  packet with status banner, legend, 7 numbered subsections each
  with circled section-num chip + response-list items, 25-row
  scoreboard table, discipline ul, one-line summary; resolved
  placeholder spans in 7 body-prose occurrences (abstract; §10 ¶1;
  §10 ¶4; Methods data/code; Release eng release-cut; Release eng
  release-cadence; Submission packet data/code; Submission packet
  cover-letter-ish line); added ToC entry; bumped version strings
  in four places; added sidebar callout (rose/coral-tinted);
  promoted status-chip; added sidebar `Reporting summary` row;
  synchronised readiness dashboard (prose coverage, placeholder
  inventory, new reporting-summary row, Gate A, Gate J, one-line
  summary, narrative). File is now 227,942 bytes / 2,565 lines
  (up from 199,447 bytes / 2,282 lines).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added two pattern bullets at the top of the Patterns
  block (Reporting Summary discipline; partial-placeholder-resolution
  from repository-self-knowable values).

### Learnings for future iterations

- **The Reporting Summary is the first mandatory-NM editorial surface
  the paper has drafted.** Unlike the dry-run (anticipatory), the
  Submission packet (NM-recommended metadata), and the readiness
  dashboard (paper-internal instrument), the Reporting Summary is a
  Nature Portfolio-wide *required* upload at first submission. Its
  structural commitments must precisely match the form Editorial
  Manager presents; the v0.1 block's seven-section structure is the
  commitment and is the thing a future iteration must keep
  synchronised with the form if Nature updates it. If Nature
  Portfolio revises the Reporting Summary schema between now and
  submission, the block requires an in-place rewrite (rare, but
  possible — the form was last revised in October 2018; any 2026
  revision would be a schema-breaking change for this block).
- **Iteration 15 is a natural iteration boundary for the submission-
  engineering prose surfaces.** Five distinct editorial-machinery
  blocks now exist (Submission packet; Reviewer-response dry run;
  Supplementary material outline; Submission readiness dashboard;
  Life Sciences Reporting Summary). Each is rendered in the HTML
  with a distinct palette (teal, amber, green/amber/red, violet,
  rose/coral) and is a rephrasing of body prose per its own
  discipline block. Together with the Cover letter (serif, peach
  border) and Release engineering (blue), the rendered page now
  carries seven editorial-appendix surfaces. The pattern
  "editorial-appendix section + distinct palette + discipline block
  + scorecard" is now the stable recipe for any future editorial-
  machinery prose surface (for example, if a future iteration adds a
  Research Briefing / Plain-language summary, it should follow the
  same pattern — distinct palette, discipline block, scorecard).
- **Highest-value next iteration without new evidence:
  placeholder-propagation script (FULL run, first-priority for
  EIGHT iterations running).** Iteration 15's partial run resolved
  three labels from repository-self-knowable sources; the remaining
  ~22 labels split into (a) evidence-landing gated (Gates D–G ≈ 15
  labels), (b) author-sign-off gated (Gate I ≈ 5 labels), (c)
  references-verification gated (Gate H ≈ 1 label → `[VOL:PAGES,
  DOI]` × ~35 entries through shared-expansion). The full
  placeholder-propagation script (`placeholders.yaml` + regex-over-
  file emit) is the compounding engineering primitive; iteration
  15's partial run is a worked precedent but does not replace it.
- **Second-highest next iteration without new evidence: References
  bibliographic verification (Gate H).** The References v0.1 block
  carries ~35 `[VOL:PAGES, DOI]` placeholders. A single iteration
  that verifies each entry against the journal record (~1 hour
  author time per the dashboard) resolves Gate H, drops the
  placeholder-inventory count by ~35 × (one per entry), and
  promotes the references-verification dashboard row from `0 / ~35`
  to `~35 / ~35` in a single pass. This is the single largest
  placeholder-inventory move available before evidence landing.
- **Third-highest: Author biographical blurbs / ORCID registry
  (partial Gate I).** Nature Methods Brief Communications use short
  author biographies (~50 words each) on their website. The
  structural commitment (each author's expertise and role) can be
  drafted at v0.1 with `[INITIALS]` placeholders; at sign-off the
  blurbs resolve simultaneously with the ORCID registry. This is a
  small iteration (one pass over the CRediT taxonomy in the
  Submission packet + one paragraph per author).
- **Framing containment re-verified across the v0.8 render.**
  Reporting Summary body mentions AI only as subject (Section 4
  software: foundation-model version pins for benchmark baselines
  — a descriptive fact, not a methodology claim); Section 3
  human-participants and clinical-data responses mention no AI
  method. The pattern bullet (*"AI stays contained to §8"*) is
  preserved. Reporting Summary is also rephrasing-clean: zero
  response slots introduce a commitment not already in Online
  Methods / §10 / Release engineering / Submission packet
  (verified by spot-check — every specific protocol in the
  Reporting Summary maps to a named Methods subsection or §10
  artefact).
- **Served URL is stable across re-renders (Iteration 8 / 9 / 10 /
  11 / 12 / 13 / 14 / 15).** Mount is in place under the name
  `manuscript` (registered 2026-04-18 11:54); re-saving the HTML
  on disk is sufficient — svamp serves from disk. No `svamp serve`
  re-invocation is needed. This pattern now holds across eight
  re-render iterations and is the stable norm through submission.
  Current served URL:
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`,
  content-length 227,942 bytes.

---

