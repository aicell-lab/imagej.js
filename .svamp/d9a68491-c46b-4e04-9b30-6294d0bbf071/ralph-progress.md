# Ralph Loop Progress — ImageJ.JS Nature Methods pitch

## Patterns

- **Biologist-voice copy-edit of already-drafted v0.1 prose is a legitimate
  iteration kind distinct from body-prose promotion, narrative-scaffolding
  addition, and scorecard recomputation.** Iteration 23 (2026-04-18) did not
  add a new surface, did not land new evidence, and did not promote a
  structurally-weaker block to structural-commitment — it re-voiced already-
  structural-commitment prose (Abstract v0.5 → v0.6; §1 Introduction v0.1 →
  v0.2) for the biologist reader the paper explicitly targets. Three rules
  govern this iteration kind: (i) **zero new claims, zero new citations,
  zero new placeholders** — every sentence of v_{n+1} must preserve the
  assertion of its v_n counterpart, so a claim-diff across the two blocks
  is empty and the placeholder-inventory is unchanged; (ii) **surface-level
  edits only** — the scope of the re-voicing is sentence reordering, verb
  substitution (e.g., "Routine foundation-model solutions degrade" →
  "Foundation-model segmenters degrade"), concrete-before-abstract
  reordering, and title-echo placement — *not* paragraph rearrangement,
  *not* argument rebalancing, *not* citation reordering; (iii) **the
  biologist-voice chain must be inspected as a whole, not block-by-block**
  — after the pass the reader's first-contact sequence (Key Points →
  Abstract → §1 → Box 1 → §2 → Fig 1) reads without editorial-voice seams,
  and the rendered surface transitions cleanly from one biologist-voiced
  block to the next. If any rule is violated the pass is not a copy-edit
  but a latent rewrite and must be landed as its own iteration with a
  scorecard re-computation. Future biologist-voice passes for §§3/5/6/7/8
  (body sections whose v0.1 prose also carries editorial-voice phrasings)
  should follow the same three rules; do not bundle a biologist-voice pass
  with a content edit in the same iteration.

- **Top-of-article "Key Points" bench-biologist summary is a third biologist-
  facing surface distinct from both the body-inline narrative-scaffolding
  Boxes and the appendix-region editorial-machinery scorecards.** Iteration 22
  (2026-04-18) added a 5-bullet `aside.key-points` block between the Abstract
  and Fig 0 Graphical Abstract as the text-mode companion to the graphical
  abstract: a bench scientist who reads only the Key Points plus the Abstract
  comes away with a correct first-order understanding of the paper's claim,
  scope, and relevance to their own work. Three rules govern this surface
  type and any future iteration of it: (i) **no new claim, number, or
  citation** — every bullet rephrases an assertion already drafted in the
  Abstract, §§1/3/4/6/7/8, Box 1 or Box 2, and every bracketed placeholder
  rephrases a token already carried by those surfaces, resolving on the same
  Gate-D/E/G path; (ii) **explicit § and figure cross-reference on every
  bullet** — a reader persuaded by a bullet can jump directly to the body
  surface that substantiates it, which is the property that distinguishes
  this surface from a marketing blurb; (iii) **plain bench-scientist voice**
  — no methodology-review vocabulary, no un-glossed acronyms, no
  `READY`/`EVIDENCE-GATED` placeholder labels visible outside the `[…]`
  brackets. Visual palette is burgundy (`#7a1f2b`) with a left double-rule
  and numbered bullets in circular badges, distinct from both the
  Box 1 / Box 2 blue `.nm-box` idiom (body-inline narrative scaffolding)
  and from the eight editorial-appendix palettes (cover-letter serif,
  supp-outline green/amber/red, release-eng blue, dry-run amber, packet
  teal, dashboard violet, reporting-summary rose/coral, research-briefing
  sage/olive). A reader scrolling the rendered draft now sees four visual
  categories at a glance: body prose (plain serif), editorial machinery
  (coloured scorecards), body-inline narrative scaffolding (Box 1/2 blue
  pull-outs), and top-of-article first-contact summary (Key Points
  burgundy panel). This is the point at which the four-category visual
  vocabulary is complete; future iterations should reuse existing
  categories, not add a fifth.

- **CSS scoping discipline when an HTML element type is reused across section
  roles.** Iteration 21 (2026-04-18) fixed a regression introduced silently in
  iteration 20: the generic `aside { position:sticky; top:20px; border-top:2px
  solid; ... }` sidebar rule applied to *all* `<aside>` elements, including the
  newly-added `aside.nm-box` (Box 1). The Box therefore pinned to the top of
  the viewport and covered body content as the reader scrolled past §1 — a
  regression invisible to the HTML well-formed validator, to the placeholder-
  inventory validator, and to every Gate-state scorecard, discoverable only by
  a human viewing the rendered page. The fix narrowed six sidebar selectors
  from `aside ...` to `aside.sidebar ...` and added `class="sidebar"` to the
  actual sidebar element. **Rule**: when a new element-class combination is
  introduced for a structurally-different role (`aside.nm-box` alongside an
  existing sidebar `<aside>`), *first* audit every pre-existing CSS rule
  targeting the raw element tag and *narrow* each to a role-discriminating
  class before landing the new rule-set. A well-formed DOM is not a styled
  DOM; CSS regressions are their own validation surface. Future iterations
  adding another nm-box sibling (Box 3, etc.) do not re-trigger this class of
  bug because the Box class is already narrowed; but iterations that introduce
  a *new* tag-reuse (e.g., `<figure class="collab-vignette">` alongside the
  existing `<figure class="figure">`) must repeat the audit.

- **Biologist-facing pull-out box is a legitimate narrative-scaffolding surface
  distinct from body prose.** Iteration 20 (2026-04-18) added `Box 1 — Three
  working days with ImageJ.JS` between §1 Introduction and §2 Measurement,
  rendered as an `aside.nm-box` in the HTML with Nature Methods-style styling
  (light-blue tint, left accent border, sans-serif header, three subsection
  vignettes). Two rules govern this surface type: (i) Box 1 introduces **no new
  claim, number, or citation** — every mechanism named is defined elsewhere
  and every partner-evidence-gated detail uses placeholder tokens already
  carried by Fig 4/5 captions (so no new entry enters the placeholder
  inventory); (ii) each vignette maps **one-to-one** to a pillar section and
  its figure (Monday teaching lab → §5/Fig 4; Thursday clinical consult →
  §6/Fig 5; Friday re-run → §4/Fig 3), so a reader who challenges a vignette
  can be pointed at the body surface that substantiates it. This idiom is the
  biologist-reader equivalent of the §2 opening biologist-voice rewrite from
  iteration 17: it is written in recognisable working-day prose ("a cell-
  biology instructor", "fifteen undergraduates on Chromebooks", "a pathologist
  in a regional hospital", "a reviewer asks …"), addressed to the biologist
  reader rather than to a methodology reviewer. Future iterations that want
  to add similarly biologist-facing scaffolding (e.g., a Box 2 for sensitive-
  data workflows, or a boxed "how to cite a URL" explainer) should follow the
  same idiom: aside.nm-box, no new claim, one-to-one mapping to an already-
  drafted body section and figure. Never use this surface to sneak in new
  claims the body does not carry.

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
- **Research Briefing is the public-facing, plain-language twin of the
  editorial-machinery scorecards.** Iteration 16 (2026-04-18) added
  `preprint.md §"Drafted prose — Research Briefing (v0.1)"` and the
  corresponding `<section class="research-briefing" id="research-briefing">`
  in the HTML render, styled with a sage/olive palette (#5a7a3a
  border-left, #f4f7ec background) distinct from the seven previously
  introduced editorial-appendix palettes (cover-letter serif, supp-
  outline green/amber/red, release-eng blue, dry-run amber, packet teal,
  dashboard violet, reporting-summary rose/coral). The block is a
  ~800-word, four-segment (Question / Discovery / Implications / Behind
  the paper) + editor-box + key-refs + figure-suggestion pre-flight of
  the Nature Portfolio Research Briefing. Three rules govern this
  artefact and every future iteration of it: (i) **plain-language
  rephrasing only** — no segment introduces a claim, number, or
  citation not already in Abstract / §1 / §3 / §4 / §8 / References /
  Cover letter / Submission packet; if a future iteration wants to
  introduce a new narrative hook, that hook lands in a specialist-prose
  block first; (ii) **synchronised in-pass** — any iteration that edits
  the referenced specialist blocks MUST re-read this block in the same
  iteration (a Briefing whose numbers diverge from Abstract v0.5 is
  worse than no Briefing); (iii) **mixed readiness-label vocabulary is
  by design** — unlike the Reporting Summary's zero-AUTHOR-GATED
  invariant, the Research Briefing legitimately carries one
  AUTHOR-GATED segment (Behind-the-paper first-person vignette resolves
  only at author sign-off) and one EDITORIAL segment (From-the-editors
  box is handling-editor authored at acceptance, never author-drafted).
  The structural commitment underneath each AUTHOR-GATED / EDITORIAL
  segment is fixed at v0.1 and independent of the placeholder
  resolution. This is the eighth editorial-machinery scorecard and the
  ninth editorial-appendix surface on the rendered page.
- **Mixed-label scorecard vocabulary is a legitimate instrument when
  the target editorial surface is dual-authored.** The first seven
  editorial-machinery scorecards all used a three-label vocabulary
  (READY / AUTHOR-GATED / EVIDENCE-GATED), sometimes with a
  discipline invariant banning one of the three (Reporting Summary
  bans AUTHOR-GATED; Submission packet bans EVIDENCE-GATED). The
  Research Briefing scorecard (iteration 16) introduces a fourth
  label, EDITORIAL, for the handling-editor-authored "From the
  editors" box. Future editorial-machinery surfaces that are
  legitimately dual-authored (author + editor, or author + reviewer,
  or author + copy-editor) may use the same four-label vocabulary —
  the existence of a structurally non-author-authored segment is
  accommodated explicitly, rather than hidden under AUTHOR-GATED or
  omitted from the scorecard. Future editorial surfaces that are
  single-authored should continue to use the three-label vocabulary.
- **Svamp `session set-link` is the mechanism for exposing a session-
  local artefact URL to the Svamp dashboard.** Iteration 16 ran
  `svamp session set-link "https://static-serve-.../manuscript/"
  "Manuscript draft v0.9 (Nature Methods)"` to attach the served
  manuscript URL to the session's dashboard as a clickable button.
  The link persists in `.svamp/<session-id>/config.json` under
  `session_link`. Future iterations that bump the manuscript version
  (v0.9 → v0.10 → …) should re-run `session set-link` with the new
  version-labelled title so the dashboard button reflects the current
  draft; the URL itself is stable across re-renders because the svamp
  mount is serving from disk.
- **Structural-commitment prose is the partner-evidence-gated twin
  of the evidence-gated figure schematic.** Iteration 18 (2026-04-18)
  promoted §§5/6/7 from the yellow `<div class="gated">` evidence-
  gated notice that stood in each slot through iterations 8–17 to
  4/4/5-paragraph structural-commitment prose whose placeholders
  (`[X]` courses, `[Partner-institution]`, `[IRB-number]`, per-course
  `[C_k-delta]`, `[partner-approved quotation]`, `[Postdoc-
  institution]` etc.) resolve at Gate G partner + collab-sprint
  landings. Three rules govern this prose-side idiom and any future
  iteration of it: (i) **structural claim fixed at draft time** —
  what the section *asserts* (teaching as field-deployment under
  institutional IT envelope; clinical compliance claim via
  Hypha-authenticated audit log; collaboration as driver/observer
  view-mirroring with four named wire artefacts) must not change
  when the placeholders resolve; a future iteration that rewrites
  the structural claim to fit the landed numbers is a discipline
  regression; (ii) **v1 scope constraints named verbatim in-prose**
  — the four collaboration constraints (Chrome-only driver, observer
  cross-browser, no tab-close persistence, observer-notes-not-fork),
  the teaching observer-notes-not-fork constraint, and the clinical
  second-reader/research-case-series / no-WSI constraints are
  reproduced from the Fig 4/5/6 captions and the `collaboration_
  sprint.md` v1 scope block; reviewers will ask for each one
  independently and the prose must carry them without hand-off to
  Methods; (iii) **placeholder inventory shared with figure
  captions** — every placeholder in §§5/6/7 prose has a matching
  placeholder in the Fig 4/5/6 captions, so a single placeholder-
  propagation pass at Gate G resolves both surfaces in lockstep. A
  small `<div class="gated">` status banner is retained at the top
  of each section (one-sentence version, linking back to the
  corresponding figure) so the evidence-posture is visible at
  section-level even as the prose is promoted. This pattern closes
  the loop iteration 17 opened: figure-side schematic previews
  (filled Fig 4/5/6) and prose-side structural-commitment blocks
  (new §§5/6/7 body prose) are now the two faces of the same
  "structural commitment drafted now, specifics resolve at Gate G"
  discipline that iteration 17 introduced for the figure side.

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


## 2026-04-18 — Iteration 16: drafted Research Briefing v0.1 (plain-language accompaniment) + HTML render v0.9 + set draft URL as session link

### What was implemented

- **Drafted the Research Briefing v0.1 block.** Appended
  `preprint.md §"Drafted prose — Research Briefing (v0.1,
  2026-04-18)"` — a ~800-word plain-language pre-flight of the
  Nature Portfolio Research Briefing that accompanies published
  Brief Communications on the Nature Methods website. Seven
  structural segments: (i) Status banner + purpose/scope rationale;
  (ii) Segment 1 — The question (~180 words, derivable from §1 +
  Abstract v0.5); (iii) Segment 2 — The discovery (~220 words,
  derivable from §2 + Abstract v0.5 + §8 ¶3); (iv) Segment 3 — The
  implications (~140 words, derivable from §3 + §4 + §7 + §8);
  (v) Segment 4 — Behind the paper (~180 words, structural
  commitment AUTHOR-GATED, resolves at Gate I sign-off, teaching-
  lab-Chromebook vignette consistent with §5); (vi) Segment 5 —
  From the editors (60–80 words, EDITORIAL, handling-editor
  authored at acceptance, NOT author-drafted at any iteration);
  (vii) Key references in plain-language form (3 entries: Lord
  2024, Kirillov 2023, Schindelin 2012) + figure suggestion
  (Fig 1 panel (a), plain-language caption committed at v0.1);
  plus the defensibility scorecard, discipline block, and one-line
  summary.
- **Scorecard totals: 4 READY / 1 AUTHOR-GATED / 1 EVIDENCE-GATED
  / 1 EDITORIAL of 7 slots.** The Research Briefing is the first
  scorecard to use a four-label vocabulary — the existence of a
  structurally non-author-authored segment (From the editors) is
  accommodated explicitly rather than hidden under AUTHOR-GATED.
  This is a legitimate instrument; see new pattern bullet at top
  of `## Patterns` block.
- **HTML render refreshed to v0.9.** `manuscript_html/index.html`
  now includes:
  - New `<section class="research-briefing" id="research-briefing">`
    inserted after Reporting Summary, with status banner, seven
    section-labelled segments (SEG 1 / SEG 2 / SEG 3 / SEG 4 /
    SEG 5 / KEY REFS / FIG) each with a sage-green `rb-seg-label`
    chip, serif-bodied `rb-segment` blocks for the four author-
    authored segments (set in Source Serif 4 at 16px, slightly
    larger than other editorial appendices, because the Briefing
    is the paper's public-facing narrative surface), a dashed-
    yellow `rb-editor-box` for the From-the-editors segment so it
    is visually distinct from author-authored content, a plain-
    language figure caption, a 7-row scorecard, a discipline `ul`,
    and a one-line monospace summary.
  - New sage/olive CSS palette (#5a7a3a border-left, #f4f7ec
    background, #e7eed3 banner, #d6dfbd table header, #b6c690
    refs border, #c6d3aa hairline). ~180 lines of CSS distinct
    from the seven previously introduced editorial-appendix
    palettes (cover-letter serif peach, supp-outline
    green/amber/red, release-eng blue, dry-run amber, packet teal,
    dashboard violet, reporting-summary rose/coral).
  - ToC entry `Research Briefing` appended.
  - Sidebar callout (sage/olive-tinted) inserted at the top of the
    callout stack above the rose/coral Reporting Summary callout.
  - Sidebar `Evidence status` gains a new `Research Briefing` row
    reporting `4 ready · 1 author-gated · 1 evidence-gated · 1
    editorial of 7 segments`.
  - `Ready (prose v0.1)` list extended to include `Research
    Briefing` as the 17th entry (marked `<strong>` as newest).
  - Version strings bumped v0.8 → v0.9 in four places (NPG bar top
    "Published: working draft v0.9"; status-chip draft; sidebar
    `Draft version`; footer rendered-from line). `v0.9` appears
    4× exactly.
  - Status-chip status promoted to `16 prose blocks v0.1 (+
    Research Briefing); … research briefing 4 ready / 1 author-
    gated / 1 evidence-gated / 1 editorial; [URL]/[URL/github]/
    [LICENCE] resolved iter 15; 3 / 10 submission gates MET
    (Gate J partial)`.
  - **Readiness dashboard synchronised in-pass:** prose coverage
    row updated to `16 / 16`; new row `Research Briefing · 4 / 7
    READY · 1 AUTHOR-GATED · 1 EVIDENCE-GATED · 1 EDITORIAL`;
    Gate A updated to 16-block count; one-line summary updated to
    include `4 / 7 research-briefing segments READY (+ 1
    AUTHOR-GATED + 1 EVIDENCE-GATED + 1 EDITORIAL)`; dashboard
    narrative updated from `Seven independent scorecards` to
    `Eight independent scorecards`.
- **Preprint.md readiness dashboard synchronised.** Updated the
  prose-side readiness dashboard (§"Drafted prose — Submission
  readiness dashboard") to match the HTML: prose-block coverage
  row rewritten to `16 / 16`, Gate A rephrased to reference the
  16-block count + iteration-16 Research Briefing addition,
  readiness-scoreboard one-line summary extended to include
  research-briefing segment counts.
- **Re-served via svamp (no re-mount needed).** Same mount name
  `manuscript`, same URL
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`.
  Post-edit HTTP HEAD → `200`, `content-length: 248,628` (up
  from 227,942), `last-modified: Sat, 18 Apr 2026 13:15:47 GMT`.
  Pattern bullet confirmed: svamp serves from disk, so saving the
  HTML is sufficient; no `svamp serve` re-invocation required.
  This pattern now holds across nine re-render iterations (8–16)
  and is the stable norm through submission.
- **Set the served manuscript URL as the svamp session link.**
  Ran `svamp session set-link
  "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/"
  "Manuscript draft v0.9 (Nature Methods)"`. The session dashboard
  now carries a clickable "Manuscript draft v0.9 (Nature Methods)"
  button linking to the served URL. The link persists in
  `.svamp/d9a68491-.../config.json` under `session_link`. Added a
  new Patterns bullet documenting the mechanism.
- **HTML well-formed check.** Python `html.parser` reports zero
  mismatched tags and zero unclosed tags after the edit (one false
  positive on `<br/>` self-closing syntax was removed by
  converting to `<br>`). `research-briefing` / `Research Briefing`
  strings appear 63× in the served page; `v0.9` appears 4× exactly
  where expected; zero residual `v0.8` references in the rendered
  footer/chip/ToC/draft-version strip.

### Files changed

- `preprint.md` — appended Research Briefing v0.1 block after the
  Life Sciences Reporting Summary; synchronised the Submission
  readiness dashboard (prose-block coverage row, Gate A, one-line
  summary). File grew from 1,812 → 2,079 lines / ~27,800 words.
- `manuscript_html/index.html` — added `section.research-briefing`
  CSS block (~180 lines of new CSS); inserted new `<section>`
  after Reporting Summary with status banner, 7 segment/refs/fig
  blocks each labelled with a `rb-seg-label` chip, 7-row
  scoreboard, discipline ul, one-line summary; added ToC entry;
  bumped version strings in four places (NPG bar, chip, sidebar,
  footer); added sage/olive-tinted sidebar callout at top of
  stack; promoted status-chip status; added sidebar `Research
  Briefing` row to Evidence-status `dl`; extended `Ready (prose
  v0.1)` list; synchronised readiness dashboard (prose coverage,
  new Research Briefing row, Gate A, one-line summary, narrative
  "Seven" → "Eight independent scorecards"); converted `<br/>` →
  `<br>` to clean up an html.parser false positive. File grew
  from 227,942 → 248,628 bytes / 2,565 → 2,908 lines.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md`
  — this entry; added three pattern bullets at the top of the
  Patterns block (Research Briefing discipline; mixed-label
  scorecard vocabulary; svamp session set-link mechanism).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` —
  `session_link` field added by `svamp session set-link` with
  the manuscript URL + version-labelled title.

### Learnings for future iterations

- **Research Briefing is the first reader-facing (as opposed to
  editor-facing) editorial-machinery surface the paper has
  drafted.** The Submission packet, Dry run, Reporting Summary,
  and Submission readiness dashboard are all editor-facing; the
  Cover letter is editor-and-reviewer-facing; the Supp outline is
  author-team-and-editor-facing. The Research Briefing is the
  single surface intended for a *general reader* — a press
  officer, a Twitter/X post, a Nature Portfolio homepage visitor,
  a plain-language science writer. This changes the drafting
  discipline: Briefing prose must be readable without the paper
  at hand, and every specialist term must be immediately
  paraphrased in the same sentence. v0.1 uses "deep learning" and
  "foundation model" freely but paraphrases each on first use
  ("— the tools and algorithms that turn microscope pictures into
  numbers") in the plain-language fashion Nature Portfolio Briefings
  adopt. Future iterations of the Briefing must preserve this
  discipline — specialist jargon that creeps in through Abstract
  edits (where it is legitimate) will not land correctly in the
  Briefing if copied verbatim.
- **The Behind-the-paper first-person vignette is a
  load-bearing editorial commitment, not a marketing flourish.**
  The v0.1 draft commits a *specific* vignette (teaching-lab
  Chromebooks; thirty students sharing four computers; IT
  policy blocking Fiji install) consistent with §5 teaching-
  deployment prose. This is the Briefing's most distinctive
  writing: the Nature Portfolio form explicitly invites authors
  to tell a story the paper itself cannot. Future iterations
  must NOT replace this vignette with a different anecdote
  without updating §5 accordingly, because the vignette and §5
  cross-cite each other; if §5 lands on a *different* teaching
  partnership (e.g., field ecology instead of school teaching),
  the Behind-the-paper vignette updates in the same iteration.
  The AUTHOR-GATED label marks that the final prose (author
  names, school name, date) resolves at sign-off, not that the
  structural commitment is up for grabs.
- **Highest-value next iteration without new evidence: References
  bibliographic verification (Gate H).** The References v0.1
  block carries ~35 `[VOL:PAGES, DOI]` placeholders. A single
  iteration that verifies each entry against the journal record
  (~1 hour author time per the dashboard) resolves Gate H, drops
  the placeholder-inventory count by ~35, and promotes the
  references-verification dashboard row from `0 / ~35` to
  `~35 / ~35` in a single pass. This is the single largest
  placeholder-inventory move available before evidence landing.
- **Second-highest next iteration without new evidence:
  placeholder-propagation script (FULL run).** Iteration 15's
  partial run + iteration 16's Research-Briefing-internal
  placeholders (`[AUTHOR-INITIALS]` × 3, `[48]%` / `[20]%`
  echoed from Abstract) add to the inventory; the full
  `placeholders.yaml` + regex-over-file run is still deferred
  but its precedent is now worked twice (iter 15 repository-
  self-knowable labels; iter 16 cross-block echo of Abstract
  placeholders into the Briefing).
- **Third-highest next iteration without new evidence: Author
  biographical blurbs / ORCID registry (partial Gate I).**
  Nature Methods Brief Communications carry short author
  biographies (~50 words each) on the journal website alongside
  the Research Briefing. The structural commitment (each
  author's expertise and role) can be drafted at v0.1 with
  `[INITIALS]` placeholders; at sign-off the blurbs resolve
  simultaneously with the ORCID registry. The Briefing's
  Behind-the-paper segment pairs naturally with the author-bio
  block — both are author-authored plain-language surfaces that
  a reader lands on before reading the paper proper.
- **Framing containment re-verified across the v0.9 render.**
  The Briefing's four author-written segments mention AI only
  as subject of the Discovery segment ("current generation of
  foundation segmentation models" — a descriptive fact carried
  over from §2 and §8, not a methodology claim); the
  Implications segment re-asserts the regime-not-ranking frame
  without introducing a new AI claim. The pattern bullet
  (*"AI stays contained to §8"*) is preserved in the Briefing
  as well as in §9. The Briefing is also rephrasing-clean: zero
  segments introduce a claim, number, or citation not already
  in the specialist prose (verified segment-by-segment against
  the Abstract, §1, §3, §4, §8, References entries 1 / 8 / 2,
  and the Cover letter).
- **Svamp session-link mechanism is now a known primitive.**
  Future iterations that bump the manuscript version (v0.9 →
  v0.10 → …) should re-run `svamp session set-link` with the
  new version-labelled title so the session dashboard button
  reflects the current draft; the served URL itself is stable
  because the mount is serving from disk.
- **Served URL remains stable across re-renders (Iterations
  8–16).** Mount is in place under the name `manuscript`
  (registered 2026-04-18 11:54); re-saving the HTML on disk is
  sufficient — svamp serves from disk. This pattern now holds
  across nine re-render iterations and is the stable norm
  through submission. Current served URL:
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/`,
  content-length 248,628 bytes; also registered as the session
  link on the Svamp dashboard.

---

## 2026-04-18 — Iteration 17: §2 Measurement prose v0.1 + biologist-facing visual pass (HTML render v0.10)

### What was implemented

- **Drafted §2 Measurement v0.1 (six paragraphs, ~780 words)** in
  `preprint.md §"Drafted prose — §2 Measuring the small-data majority (v0.1, 2026-04-18)"`.
  Replaces the evidence-gated notice that stood in this slot through iterations 8–16.
  Paragraphs: (i) three measurement instruments, committed to artefacts before examination;
  (ii) survey design (stratification, 9 subdomains × 14 journals, A/B/C axis decomposition);
  (iii) interim 80-row results (48/48/20/11 % bracketed); (iv) v2 reframing
  ("ImageJ is the substrate every biologist still opens"); (v) 30-task long-tail benchmark
  design (seven inclusion criteria, zero-shot DL config, mean IoU [X], [Y]/30 vs [Z]/30);
  (vi) replay pilot on 3 candidates + two findings (Drosophila bundle inconsistency,
  Find-Edges drift) preserved into production corpus.
- **HTML §2 rewritten** to biologist voice. Replaced the `<div class="gated">` notice +
  opening paragraph with the six-paragraph prose block; opening paragraph rephrased from
  "regime claim warrants regime measurement" to three biologist-addressed questions
  ("who is the typical microscopy paper's author…", "when a problem is rare…", "if we
  re-ran a published Fiji analysis today…").
- **Five new / rich figures** added to the HTML:
  1. **Graphical Abstract (Fig. 0)** — inserted between Abstract and §1. Four-panel inline
     SVG: (a) ImageJ.JS browser UI mockup (window chrome, toolbar, canvas with cells +
     ROIs + Results pane); (b) device strip (laptop, Chromebook, iPad, phone);
     (c) URL-share flow (PI → URL carrying `open=&macro=&rois=&plugins.dir=` → collaborator);
     (d) driver/observer Hypha architecture with "no image bytes egress" badge.
  2. **Fig 1-supplement** — subdomain montage, inserted before Fig 1 inside §2.
     Nine-panel inline-SVG grid of typical small-data imagery per stratum:
     cell biology (DAPI cells), developmental (3 embryos), neuroscience (dendrite
     trace), pathology (H&E with pathologist ROI), plant (leaves + veins),
     ecology/field (tablet-photo agar plate), infection (intracellular parasites),
     microbiology (rods + cocci), structural (cryo-EM 2D class average).
  3. **Fig 4 filled** — teaching deployments, rich SVG replacing placeholder.
     Four panels: (a) classroom with 30 Chromebooks + instructor URL;
     (b) pre/post concept-check bars (C1/C2/C3, placeholder values); (c) instructor
     quotation boxes; (d) devices IT allowed vs blocked.
  4. **Fig 5 filled** — on-device clinical pathology, rich SVG. Four panels:
     (a) H&E slide in ImageJ.JS vs pathologist annotation overlay;
     (b) audit-trail excerpt (timestamped Hypha-authenticated actions, including
     `image.egress.check false`); (c) per-session data-governance confirmation
     (ROIs/measurements/log egress ✓; image pixels/PHI/file handles ✗);
     (d) architecture (hospital laptop ↔ Hypha ↔ remote consultant).
  5. **Fig 6 filled** — collaboration vignettes. Four panels:
     (a) driver/observer architecture (driver + Hypha + 3 observers) with
     egress-legend (frames/ROIs/tokens ✓; pixels ✗); (b) cross-institution
     PI-review vignette (postdoc driver → PI observer "try Otsu?" → count
     5→6); (c) teaching-lab observer cohort (instructor driver, 5 students
     mirror-view); (d) pathology consultation (primary + 2nd reader +
     audit excerpt).
  6. **Fig 7 new** — "Composable, not captive" composition architecture,
     inserted at the end of §8. Three columns: left (DL services: SAM,
     Cellpose, StarDist/CellSAM, lab's private model; emits GeoJSON ROIs);
     centre (ImageJ.JS: human-analyst canvas + Hypha-RPC service layer with
     the four method signatures + MCP endpoint via `convertToMcpUrl:880`);
     right (agent runtimes: LLM orchestrator, napari-mcp, companion paper).
     Bidirectional arrows for WebSocket ROIs (DL↔ImageJ.JS) and MCP
     (ImageJ.JS↔agents). §8 prose updated to cite Fig 7 at the composition
     paragraph.
- **Version bumps v0.9 → v0.10** in four places (NPG bar top, draft chip,
  sidebar Draft version dd, footer). Status chip updated to
  `17 prose blocks v0.1 (+ §2 Measurement); biologist-facing visual pass
  landed iter 17 (Graphical Abstract, Fig 1-supplement subdomain montage,
  rich SVG schematics for Fig 4/5/6, new Fig 7 composition); …`.
- **ToC updated**: added Graphical Abstract (GA) entry; added sub-entries
  for Fig 1-supplement and Fig 1 (indented under §2); added Fig 7 sub-entry
  (indented under §8).
- **Sidebar Evidence status extended**: `Ready (prose v0.1)` list now
  includes `<strong>§2</strong>`; new `Figures (biologist pass iter 17)` row
  reports `Graphical Abstract + Fig 1 + Fig 1-suppl (subdomains) + Fig 2
  + Fig 3 + Fig 4 + Fig 5 + Fig 6 + Fig 7 composition · all in-HTML SVG`.
- **HTML well-formed check passes.** Python `html.parser` reports 0
  unmatched start/end tags. Final file size 337,158 bytes (up from 248,628
  in iteration 16 — +88,530 bytes of new SVG + prose).
- **Served URL confirmed stable (Iteration 8–17 pattern).** Mount
  `manuscript` continues to serve from disk; re-saving the HTML was
  sufficient. Post-edit HTTP HEAD → `200`, `content-length: 337,158`,
  `last-modified: Sat, 18 Apr 2026 13:36:17 GMT`.
- **Re-registered svamp session link** with v0.10 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.10 (Nature Methods) — biologist-facing visual pass"`.
  Dashboard button now shows the biologist-facing label.

### Files changed

- `preprint.md` — appended `§"Drafted prose — §2 Measuring the small-data
  majority (v0.1, 2026-04-18)"`. No existing content modified. File grew
  from 2,069 → ~2,089 lines.
- `manuscript_html/index.html` — replaced §2 gated-notice + opener with
  biologist-voiced prose (6 paragraphs); inserted Graphical Abstract inline
  SVG figure between Abstract and §1; inserted Fig 1-supplement subdomain
  montage inline SVG before Fig 1 inside §2; replaced Fig 4/5/6
  placeholders with rich inline-SVG schematics (each marked "schematic
  preview — awaits partner evidence" rather than "reserved"); appended new
  Fig 7 composition figure at the end of §8; bumped version strings
  (NPG bar, draft chip, sidebar Draft version, footer); extended status
  chip; updated ToC (GA entry, Fig 1-suppl/Fig 1/Fig 7 sub-entries);
  extended sidebar Evidence-status `dl` (§2 marked strong; new Figures
  row). File grew 248,628 → 337,158 bytes / 2,908 → 3,899 lines.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` —
  `session_link` updated by `svamp session set-link` with v0.10 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry.

### Learnings for future iterations

- **Biologist-facing visual density is a different pass from prose
  density.** Up to iteration 16, the manuscript grew primarily by drafted-
  prose blocks and editorial-machinery scorecards (1→17 blocks, 1→9
  editorial appendices). Iteration 17 is the first iteration whose
  delta is visual: six new or significantly enriched figures. The
  iteration pattern is therefore distinct — no new prose block landed,
  no new scorecard was introduced, §2 was promoted from placeholder to
  body prose, and the HTML gained ~90 KB of inline-SVG schematic.
  Future biologist-readiness iterations should continue this pattern:
  (i) one §N prose promotion per iteration rather than several, so each
  section gets the care it needs; (ii) figure enrichment tied to the
  §N being promoted (§2 ↔ Fig 1-supplement; §§5/6/7 ↔ Fig 4/5/6;
  §8 ↔ Fig 7); (iii) no new editorial-machinery scorecards introduced
  in the same iteration as a visual pass — the HTML diff is already
  dense enough that adding a scorecard would hide behind it.
- **Inline SVG is the right primitive for self-contained schematic
  figures.** Every new figure in iteration 17 is inline SVG, not an
  external file, not an embedded PNG. This keeps the rendered page
  self-contained (no missing-asset risk when served via svamp mount),
  uses the reader's browser as the rendering engine (vector, resolution-
  independent, accessible via the `<title>` element), and keeps the
  render regeneration pipeline one-file (edit `index.html`, save, served
  via svamp mount). Future figure iterations should follow this pattern
  unless an actual photograph is landed from a partner institution, in
  which case an explicit `figure.figure.photo` CSS class and a
  `manuscript_html/images/` directory should be introduced in the same
  iteration as the first photograph.
- **"Schematic preview — awaits partner evidence" replaces "Reserved ·
  evidence-gated" as the figure placeholder idiom.** The v0.1 figure
  slots block used the Reserved-Evidence-Gated vocabulary matching the
  other editorial-machinery placeholders. For biologist-facing figures,
  this reads as "there is nothing here yet" and wastes the visual real
  estate a reader scans first. The iteration-17 replacement idiom —
  "schematic preview · awaits partner evidence" — commits a concrete
  structural claim (what the panels will show, what shape the numbers
  will take) while making explicit that the specific numbers, partner
  names, and quotations resolve at evidence-landing. This is the
  figure-side counterpart to the prose-side AUTHOR-GATED / EVIDENCE-
  GATED vocabulary: structural claim fixed at draft time, resolution
  path deferred.
- **Graphical Abstract is the biologist's entry point to the paper.**
  Nature Methods publishes graphical abstracts on the journal homepage
  and in accepted-article previews. The iteration-17 Graphical Abstract
  (Fig 0 / "GA") is specifically designed to be readable by a biologist
  who has not opened the PDF: its four panels answer the four questions
  a working biologist asks about a new tool — *what does it look like?*
  (UI), *does it run on my hardware?* (devices), *can I share what I
  did?* (URL), *can I use it with my collaborators?* (driver/observer).
  Future iterations must preserve this as the biologist-facing cover
  of the paper; if §§5/6/7 land with different partner domains, the
  GA panel d (collaboration) updates to match, but the four-question
  structure stays fixed.
- **Biologist-voice opening paragraphs are allowed and valuable.** The
  §2 opening was rewritten from methodology-paper voice ("A regime
  claim warrants a regime measurement") to biologist-addressed voice
  ("Who is the typical microscopy paper's author, and what tools do
  they actually use?"). The three italicised questions the new opening
  asks are the three the three measurement instruments answer — so
  the rewrite is argumentatively identical but addressed to a
  biologist reader rather than to a methodology reviewer. This voice
  move is legitimate in biologist-facing surfaces (Abstract, §1, §2
  opening, Graphical Abstract, Research Briefing) but NOT in
  methodology-facing surfaces (Online Methods, §8 limits, §9
  discussion, References). Future iterations that want to pivot a
  specialist paragraph to biologist-voice must keep that surface-
  discrimination in mind.
- **Svamp session set-link should be re-run whenever the manuscript
  version bumps.** Iteration 16 and now iteration 17 both re-ran
  `svamp session set-link` with a version-labelled title; the pattern
  bullet confirming this is preserved. The served URL itself does not
  change (mount is stable); the link label on the session dashboard
  updates so that a co-author scrolling the dashboard sees the current
  draft version at a glance.
- **Highest-value next iteration without new evidence: Bibliographic
  verification pass (Gate H), deferred from iteration 16.** Still ~35
  `[VOL:PAGES, DOI]` placeholders in References v0.1; one focused pass
  drops the placeholder-inventory count and promotes the references-
  verification dashboard row from `0 / ~35` to `~35 / ~35`. The hard
  rule that no DOI or volume is invented holds; any entry whose
  metadata cannot be verified remains `[DOI]`. This is the single
  largest placeholder-inventory move available before evidence
  landing.
- **Second-highest next iteration without new evidence: §§5, 6, 7
  prose promotion from gated-notice to evidence-gated prose with
  "awaits partner evidence" structural commitments.** With Fig 4/5/6
  filled in as schematic previews, the prose sections upstream of
  them can be promoted to the same idiom: structural claims drafted
  at v0.1, specific numbers/names/quotations deferred to partner
  landings. This pairs with the iteration-17 figure-side pivot.
- **Framing containment re-verified across v0.10 render.** The new
  §2 prose mentions AI only in the context of the long-tail benchmark
  paragraph (necessary — §2 is where the benchmark is introduced);
  the five new figures contain AI only in Fig 7 (necessary — Fig 7
  *is* the composition-with-DL-and-agents figure). The
  "AI stays contained to §8" pattern is preserved: the new AI surface
  is a §8 figure and is explicitly scoped by the §8 composition
  paragraph. Abstract, §1, §3, §10, Online Methods remain AI-free.

---

## 2026-04-18 — Iteration 18: §§5/6/7 structural-commitment prose promotion (HTML render v0.11)

### What was implemented

- **Drafted §5 Teaching v0.1 (four paragraphs, ~500 words)** in
  `preprint.md §"Drafted prose — §5 Teaching and intuition-building (v0.1, 2026-04-18)"`.
  Replaces the evidence-gated notice that stood in this slot through iterations 8–17.
  Paragraphs: (i) the constrained teaching problem (IT envelope, institutional clearance,
  Chromebook/iPad/shared-lab laptop deployment reality, §3 ¶2 zero-install-as-correctness
  lineage); (ii) three-fold structural commitment (single URL for every seat; partner-
  designed pre/post concept-check instrument per course with per-course reporting not
  pooled; instructor voice verbatim-quoted and partner-approved); (iii) two v1 scope
  constraints (observer-notes-not-fork, teaching-lab-pattern only, `outreach_emails.md`
  template honours constraint), with the section's placeholder-resolution path named
  (`[X]`/`[Y]`/per-course `[C_k-delta]`/`[partner-approved quotation]`/`[IRB-number]` at
  evidence-landing iteration). Note — structured as three paragraphs in the counted draft
  (four total with the introductory paragraph making the constrained-problem argument).

- **Drafted §6 Privacy-preserving clinical v0.1 (four paragraphs, ~520 words)** in
  `preprint.md §"Drafted prose — §6 Privacy-preserving analysis of sensitive data (v0.1,
  2026-04-18)"`. Replaces the evidence-gated notice. Paragraphs: (i) the sensitive-data
  microscopy problem (images the biologist is not permitted to move; client-side-compute
  invariant from §3 ¶2–3 as the *necessary* condition only); (ii) structural commitment
  as a separation of compliance claim from scientific claim (audit log is the compliance
  deliverable, not case-panel annotation agreement; case panel reported separately for
  partners' benefit, not load-bearing on §6's argument); (iii) two architectural
  properties making the compliance claim auditable ahead of partner evidence — client-
  side invariant is `git grep`-falsifiable; audit log is Hypha-authenticated and signed
  by each participant's identity, so attributable without partner data; (iv) two bounding
  constraints (second-reader / research-case-series context not primary diagnostic;
  WSI out of scope per §3 ¶5 non-goal) — "these constraints are tight and deliberate;
  loosening them would require a different paper".

- **Drafted §7 Collaboration v0.1 (five paragraphs, ~640 words)** in
  `preprint.md §"Drafted prose — §7 Real-time collaborative analysis without data
  movement (v0.1, 2026-04-18)"`. Replaces the evidence-gated notice. Paragraphs: (i)
  collaboration-in-small-data-microscopy is move-the-view-not-the-data; (ii)
  architectural structural commitment (four wire artefacts — frames, ROI overlays,
  control tokens, cursors — each falsifiable in code at `collab/frame_streamer.js` +
  `collab/event_bus.js`, image pixels *never — by construction*); (iii) engineering
  structural commitment (seven `collab/*.js` modules sprint-shipped at v1, layered on
  reused `hypha-imagej-service.js` methods — reviewer can audit in under an hour); (iv)
  three recorded live-session vignettes with `[Postdoc-institution]` / `[PI-institution]`
  / `[≥5]` / `[observed count 5→6]` / `[partner-approved classroom quotation]`
  placeholders resolving at filming; (v) four v1 scope constraints reproduced verbatim
  (Chrome-only driver, observer cross-browser, no tab-close persistence, observer-
  notes-not-fork) — "these constraints are not apologies; they are the v1 feature list
  the paper claims reproducibility against".

- **HTML §5/§6/§7 rewritten.** Each section's `<div class="gated">` evidence-notice
  replaced with a compact one-sentence status banner (still `<div class="gated">`,
  yellow/amber border-left, one line) linking back to the corresponding figure, followed
  by the full v0.1 prose as standard `<p>` body-text paragraphs. All placeholder tokens
  (`[X]`, `[Y]`, `[Partner-institution]`, `[IRB-protocol-number]`, per-course
  `[C<sub>k</sub>-delta]`, `[observed count 5→6]`, etc.) rendered as
  `<span class="placeholder-value">...</span>` per the existing convention. Mechanism
  names (`collab/audit_log.js`, `hypha-imagej-service.js:1567`, `getRoisAsGeoJson`,
  `connectToHypha`, `mount=`, `clinical=true`, etc.) rendered as `<code>...</code>`.
  Cross-references to Fig 4 / Fig 5 / Fig 6 rendered as `<a href="#fig4">...</a>` etc.
  Schematic previews (Fig 4/5/6 from iteration 17) unchanged.

- **Version bumps v0.10 → v0.11** in four places (NPG bar top, draft chip, sidebar Draft
  version dd, footer). Status chip updated to `Evidence status · 20 prose blocks v0.1
  (+ §§5/6/7 structural-commitment prose, iter 18); body-prose coverage §§1–10 complete
  (§§2/5/6/7 evidence-gated at numerical resolution); …`. Sidebar Ready (prose v0.1) list
  extended with `§5`, `§6`, `§7` (bold). Sidebar Evidence-gated row reframed: "numerical /
  naming only — structural claims drafted … specifics resolve at Gate G".

- **Readiness dashboard synchronised in-pass.** Prose-coverage row's numeric measurement
  augmented with `§§5/6/7 promoted iter 18` tag; gating-path row records the promotion
  rationale ("the field-deployment sections are now prose Gate G resolves numerically,
  not prose Gate G drafts from scratch"). Gate A condition and source column both
  updated to name iteration 18 + the structural-commitment promotion. Readiness banner
  augmented with "§§5/6/7 promoted from evidence-gated notices to structural-commitment
  prose iteration 18". Dashboard narrative "Eight independent scorecards …" kept
  unchanged — no new scorecard added this iteration; body prose is not a scorecard.

- **HTML well-formed check passes.** Custom-validator pass (html.parser-based, with
  proper SVG void-element handling for `path`/`rect`/`circle`/`line`/`polyline`/
  `polygon`/`ellipse`/`use`/`stop` and content-carrying elements `text`/`tspan`/`title`
  treated as start+end tag pairs) reports zero tag issues. Final file 354,158 bytes
  (up from 337,158 in iteration 17 — +17,000 bytes for §§5/6/7 prose).

- **Served URL confirmed stable (Iteration 8–18 pattern).** Mount `manuscript`
  continues to serve from disk; re-saving the HTML was sufficient. HTTP HEAD → `200`,
  `content-length: 354158` exactly matching `wc -c` on disk, `last-modified: Sat, 18 Apr
  2026 13:51:43 GMT` exactly matching `stat -f '%Sm'` on disk — svamp serves from disk,
  byte-for-byte.

- **Re-registered svamp session link** with v0.11 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.11 (Nature Methods) — §§5/6/7 structural-commitment prose"`.
  Dashboard button now reflects the iteration-18 label.

### Files changed

- `preprint.md` — appended three "Drafted prose" blocks (§5 Teaching v0.1, §6 Privacy-
  preserving v0.1, §7 Collaboration v0.1) after the §2 Measurement v0.1 block from
  iteration 17. No existing content modified. File grew from 2,089 → ~2,123 lines.
- `manuscript_html/index.html` — replaced §5/§6/§7 evidence-gated notices with compact
  one-sentence status banners + v0.1 prose paragraphs (12 new body-text paragraphs,
  plus three status banners); bumped version strings v0.10 → v0.11 in four places (NPG
  bar, draft chip, sidebar Draft version, footer); extended status chip with iteration-
  18 narrative; extended Ready (prose v0.1) list; reframed Evidence-gated row;
  synchronised readiness dashboard (prose coverage row, Gate A, banner). File grew
  337,158 → 354,158 bytes / 3,899 → 3,890 lines (net -9 lines: gated notices shrank
  to one-liners even as prose paragraphs landed).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` — `session_link` updated by
  `svamp session set-link` with v0.11 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this entry; added
  one new Patterns bullet at the top (structural-commitment prose idiom).

### Learnings for future iterations

- **The §§5/6/7 promotion closes the prose↔figure symmetry iteration 17 opened.** Before
  iteration 17, §§5/6/7 carried a yellow `<div class="gated">` evidence-notice paragraph
  + a reserved-placeholder figure slot with a "Reserved · evidence-gated" figure-header
  label. Iteration 17 promoted the figure slots to rich schematic previews labelled
  "schematic preview — awaits partner evidence". Iteration 18 now promotes the matching
  prose slots to structural-commitment body prose with a compact one-sentence status
  banner. The symmetry is: for each field-deployment section (teaching / clinical /
  collaboration), both the figure and the prose make structural commitments now, and
  both have placeholders that resolve in lockstep at Gate G. Future iterations must
  preserve this lockstep — if a figure caption gets a new placeholder, the prose gets
  the same placeholder in the same iteration, and vice versa.
- **Retaining a compact `<div class="gated">` status banner is the right call over
  removing it entirely.** A reader (co-author, editor, reviewer) skimming §§5/6/7
  needs to see at a glance that these sections still have Gate-G-pending content; a
  one-sentence status banner at the top of the section (with a back-link to the
  figure) conveys that posture without hijacking the visual hierarchy. This is the
  same design move as the editorial-machinery scorecards' distinct palettes, applied
  at body-section granularity: evidence-posture is a legitimate thing to render
  distinctively, not a thing to hide.
- **Body-prose promotion is not a scorecard.** The prose coverage scorecard still
  reports `16/16 STRUCTURAL-READY` — no new block was created in iteration 18. What
  changed is the *quality* of the §§5/6/7 entries: previously evidence-gated notices
  acting as placeholders for prose Gate G would resolve; now structural-commitment
  prose that Gate G resolves *numerically* into, rather than Gate G *drafts from
  scratch* into. This distinction is load-bearing: a reviewer reading an iteration-17
  v0.10 render would see a yellow "awaiting evidence" note in §§5/6/7 and reasonably
  suspect the paper does not know yet what it will claim about teaching/clinical/
  collaboration; a reviewer reading the iteration-18 v0.11 render sees the structural
  claims committed and the placeholders named, and can evaluate "is this over-claimed?"
  from the structural commitment alone, before Gate G lands.
- **Placeholder inventory did NOT balloon.** Naïvely, adding 12 body-text paragraphs
  with placeholder tokens could have added 15–20 new placeholders to the inventory.
  But every placeholder in the §§5/6/7 prose is *already* carried by the Fig 4/5/6
  schematic captions (`[X]` courses, `[Partner-institution]`, `[IRB-number]`, per-
  course `[C_k-delta]`, etc.), so the inventory count is unchanged. This is the
  placeholder-inventory-shared-with-figure-captions rule in the new Patterns bullet.
  Future structural-commitment prose iterations must honour this rule: if the prose
  requires a placeholder that the figure caption does not already carry, either the
  figure caption adds it in the same iteration or the prose uses an already-committed
  placeholder, not a new one.
- **Highest-value next iteration without new evidence: Bibliographic verification pass
  (Gate H), deferred from iterations 16–17.** ~35 `[VOL:PAGES, DOI]` placeholders in
  References v0.1 remain unresolved. A focused one-pass verification resolves Gate H,
  drops the placeholder-inventory count significantly, and promotes the references-
  verification dashboard row from `0 / ~35` to `~35 / ~35` in a single pass. Still
  the single largest placeholder-inventory move available before evidence landing.
- **Second-highest next iteration without new evidence: author-bio / ORCID blurbs
  (partial Gate I), now also tractable.** With §§5/6/7 structural commitments drafted,
  the author contribution structure (CRediT) from the Submission packet can be sanity-
  checked against the prose — every role claimed must map to a section the author
  contributed to. A future iteration can produce the ~50-word author-bio drafts as
  a supplementary render pass, with `[INITIALS]` placeholders resolving at sign-off.
- **Framing containment re-verified across v0.11 render.** The new §§5/6/7 prose
  mentions AI in exactly one place: §7 ¶2 references "§6's client-side-compute
  invariant" as the falsifiability pattern; no AI term (SAM / Cellpose / CellSAM /
  foundation model / agent / LLM) appears in §§5/6/7. Abstract, §1, §3, §10, Online
  Methods remain AI-free; §2 (iter 17) mentions AI only in the long-tail benchmark
  paragraph (necessary and bounded); §7 (iter 18) mentions Hypha as infrastructure,
  not AI. The "AI stays contained to §8" pattern is preserved.
- **Five editorial-machinery scorecards (dry-run, packet, reporting summary, readiness
  dashboard, research briefing) all remain valid at v0.11 without re-computation.**
  No scorecard depends on the §§5/6/7 body-prose contents directly — all five depend
  on the Gate-state they report against, and Gates A–J have not changed state in
  iteration 18. Iteration 18 is a body-prose iteration, not a scorecard-affecting
  iteration. Future iterations should continue to be explicit about which kind of
  iteration they are: body prose, figure/visual, scorecard, evidence landing, or
  placeholder resolution. Cross-kind iterations (e.g., "land Gate D evidence AND
  recompute scorecards AND redraw figures") are the expensive ones and should be
  avoided when possible.

---

## 2026-04-18 — Iteration 19: §4 Replay structural-commitment prose promotion (HTML render v0.12)

### What was implemented

- **Drafted §4 Replay v0.1 (four paragraphs, ~560 words)** in
  `preprint.md §"Drafted prose — §4 Shareable human reasoning — deterministic replay (v0.1, 2026-04-18)"`.
  Replaces the evidence-gated notice that stood in this slot through iterations 8–18.
  Paragraphs: (i) the three-axis decomposition is load-bearing — ACQUIRE/EXECUTE/MATCH
  separates data-bundling from runtime from algorithm failures that a single-verdict
  Pass/Fail replay would conflate; (ii) four-fold structural commitment of the corpus
  (shared per-candidate schema, stratification rationale, per-axis cell-annotated
  reporting rather than summary pass rate, immutable CheerpJ pin at `v1.0-paper`);
  (iii) the two Week-1 findings (Drosophila NMJ 2016 bundle inconsistency; MRI Wound
  Healing 2020 cross-version Find-Edges drift) preserved verbatim as arguments *for*
  the paper rather than apologised for; (iv) two v1 scope constraints named in-prose
  — macros-with-retrievable-inputs only (papers whose imagery was never public or
  behind data-transfer agreements are excluded and left for a successor-paper replay
  corpus), and [N] deliberately modest at 15 candidates Brief-Comm / [N ≤ 40] full
  Article because §4's argument is *regime coverage* not *ergodicity*, parallel to
  the 30-task benchmark's regime claim.

- **HTML §4 rewritten.** The multi-paragraph `<div class="gated">` Week-1 findings
  notice replaced with a compact one-sentence status banner (still `<div class="gated">`,
  yellow/amber border-left) linking back to Fig 3, followed by the full v0.1 prose as
  four `<p>` body-text paragraphs. Placeholder tokens (`[N]`, `[Y1–Y2]`, `[N ≤ 40]`)
  rendered as `<span class="placeholder-value">...</span>` per the existing convention.
  Mechanism names (`run_replay.py`, `MATCH_REPORT.md`, `v1.0-paper`, `testThresholdFindEdges`,
  `Find-Edges`) rendered as `<code>...</code>`. Cross-references to Fig 3 and
  Release-engineering rendered as `<a href="#fig3">...</a>` / `<a href="#release-eng">...</a>`.
  Figure 3 (the pilot matrix with three rows) unchanged.

- **Version bumps v0.11 → v0.12** in four places (NPG bar top, draft chip, sidebar
  Draft version dd, footer). Status chip updated to `Evidence status · 21 prose
  blocks v0.1 (+ §4 Replay structural-commitment prose, iter 19); … body-prose
  coverage §§1–10 complete (§§2/4/5/6/7 evidence-gated at numerical resolution); …`.
  Sidebar Ready (prose v0.1) list extended with `§4` (bold). Sidebar Evidence-gated
  row reframed: now names §4 alongside §2 and §§5–7 as structural-prose-landed,
  specifics resolve at Gates D–G.

- **Readiness dashboard synchronised in-pass.** Banner augmented with "§4 Replay
  promoted from evidence-gated notice to structural-commitment prose iteration 19".
  Prose-block coverage row's measurement augmented with `§4 promoted iter 19` chip;
  gating-path column extended with the promotion rationale ("the replay section is
  now prose Gate F resolves numerically into, not prose Gate F drafts from scratch").
  Gate A condition and source column both extended with iteration 19 + the §4
  structural-commitment promotion. Dashboard narrative "Eight independent scorecards"
  kept unchanged — no new scorecard added; body prose is not a scorecard.

- **HTML well-formed check passes.** Custom-validator pass (html.parser-based, with
  proper SVG/HTML void-element handling) reports zero tag issues. Final file 360,972
  bytes (up from 354,158 bytes in iteration 18 — +6,814 bytes for §4 prose).

- **Served URL confirmed stable (Iteration 8–19 pattern).** Mount `manuscript`
  continues to serve from disk. HTTP HEAD against
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/` → `200`,
  `content-length: 360972` exactly matching `wc -c` on disk.

- **Re-registered svamp session link** with v0.12 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.12 (Nature Methods) — §4 Replay structural-commitment prose"`.
  Dashboard button now reflects the iteration-19 label.

### Files changed

- `preprint.md` — appended one "Drafted prose" block (§4 Replay v0.1, four paragraphs)
  after the §7 Collaboration v0.1 block from iteration 18. No existing content modified.
- `manuscript_html/index.html` — replaced §4 evidence-gated Week-1-findings notice
  with compact one-sentence status banner + v0.1 prose paragraphs (4 new body-text
  paragraphs); bumped version strings v0.11 → v0.12 in four places; extended status
  chip with iteration-19 narrative; extended Ready (prose v0.1) list; reframed
  Evidence-gated row; synchronised readiness dashboard (prose coverage row, Gate A,
  banner, narrative). File grew 354,158 → 360,972 bytes / 3,899 → 3,892 lines (net
  -7 lines: multi-`<li>` findings notice collapsed to one-line banner + four paragraphs).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` — `session_link` updated by
  `svamp session set-link` with v0.12 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this entry.

### Learnings for future iterations

- **§4 promotion completes the evidence-gated-pillar prose symmetry.** Before
  iteration 18, all four evidence-gated pillar sections (§§4/5/6/7) carried multi-
  paragraph `<div class="gated">` notices that stood in for body prose. Iteration 18
  promoted §§5/6/7 to structural-commitment prose; iteration 19 promotes the
  remaining §4. All four evidence-gated pillar sections now share the same shape:
  one-sentence status banner + structural-commitment body prose + figure schematic
  preview. The symmetry is now complete; a reviewer reading §§4–7 sees the same
  structural idiom everywhere. Future iterations must preserve this — any new
  evidence-gated section added to the paper (unlikely but possible if partner
  scope expands) must land as structural-commitment prose from the start, not as
  a gated-notice placeholder.
- **The §4 promotion is a lockstep twin of the iteration-18 §§5/6/7 promotion
  but with a distinct placeholder inventory.** §§5/6/7 share their placeholder
  set with Fig 4/5/6 captions and resolve at Gate G partner landings. §4 shares
  its placeholder set with Fig 3's matrix (now three pilot rows, later [N] full
  rows) and resolves at Gate F replay-corpus scale-up. Both promotions follow
  the iteration-18 discipline: structural claim fixed at draft time, v1 scope
  constraints named verbatim in-prose, placeholders shared with the figure
  caption. The pattern is repeatable and now has two worked instances.
- **The "preserved worked failure classes" idiom is a load-bearing prose move.**
  §4 ¶3 preserves the two Week-1 findings verbatim because they are arguments
  *for* the paper: a paper arguing for pinned-runtime reproducibility that
  finds *zero* cross-decade drift would be a weaker paper, not a stronger one.
  Drafted prose that incorporates already-landed evidence as worked examples
  of the thesis — rather than apologising for them as off-message noise — is
  the move that converts Week-1's "three replays, two surprises" finding into
  §4's argument. Future prose promotions that include pilot evidence should
  adopt this stance.
- **Placeholder inventory did NOT balloon.** Naïvely, four body-text paragraphs
  with placeholder tokens could have added 6–10 new placeholders. But every
  placeholder in §4's prose (`[N]`, `[Y1–Y2]`, `[N ≤ 40]`) is *already* carried
  by Fig 3's caption or the Abstract, so the inventory count is unchanged. The
  placeholder-inventory-shared-with-figure-captions rule (iteration 18) holds
  for §4 as well.
- **Body-prose promotion is not a scorecard.** Like iteration 18, this iteration
  does not create a new scorecard or change the numerator of any existing
  scorecard that reports on count rather than quality. The prose-coverage
  scorecard still reports `16/16 STRUCTURAL-READY`; what changed is the quality
  of the §4 entry (gated notice → structural-commitment prose). A reviewer
  reading v0.12 sees the §4 structural claim committed and can judge
  "over-claimed?" from the structure alone before Gate F lands.
- **Five editorial-machinery scorecards (dry-run, packet, reporting summary,
  readiness dashboard, research briefing) remain valid at v0.12 without
  re-computation.** No scorecard depends on §4 body-prose contents directly
  — all five depend on Gate-state labels that have not changed state in
  iteration 19. Iteration 19 is a body-prose iteration, not a scorecard-
  affecting iteration. (Same as iteration 18.)
- **Framing containment re-verified across v0.12 render.** The new §4 prose
  mentions AI nowhere — SAM / Cellpose / CellSAM / foundation model / agent /
  LLM do not appear in §4, which is a replay-of-classical-Fiji-macros section
  and should stay AI-free by construction. Abstract, §1, §3, §4 (new), §10,
  Online Methods remain AI-free; §2 mentions AI only in the long-tail benchmark
  paragraph; §§5/6/7 mention Hypha as infrastructure, not AI; §8 remains the
  AI-containment surface. The "AI stays contained to §8" pattern is preserved.
- **Highest-value next iteration without new evidence: Bibliographic verification
  pass (Gate H), deferred from iterations 16–18.** ~35 `[VOL:PAGES, DOI]`
  placeholders in References v0.1 remain unresolved. A focused one-pass
  verification against Crossref / DOI.org / journal records resolves Gate H,
  drops the placeholder-inventory count significantly, and promotes the
  references-verification dashboard row from `0 / ~35` to `~35 / ~35` in a
  single pass. The hard rule — no DOI or volume is invented — still holds;
  any entry whose metadata cannot be verified remains `[DOI]`. This is now
  the single largest placeholder-inventory move available before evidence
  landing, and with §§4/5/6/7 all promoted there is no further body-prose
  promotion available in the iteration-18/19 idiom.
- **Second-highest next iteration without new evidence: tighten / copy-edit
  pass across promoted prose (§§2/4/5/6/7).** Five structural-commitment
  prose blocks have landed across iterations 17, 18, and 19. A single
  copy-edit pass against the Abstract / §1 / §3 / §8 / §9 / §10 / Cover
  letter for tone, voice, and citation form — without changing any claim —
  would raise the prose quality of the v0.12 render to submission-grade
  without requiring any evidence landing or author sign-off. This is a
  "polish, don't promote" iteration that should precede Gate H.

---


## 2026-04-18 — Iteration 20: Box 1 biologist-facing pull-out (HTML render v0.13)

### What was implemented

- **Drafted Box 1 v0.1 (~420 words, one lede + three working-day vignettes)** in
  `preprint.md §"Drafted prose — Box 1 Three working days with ImageJ.JS (v0.1,
  2026-04-18)"` — a biologist-facing prose-pullout positioned between §1
  Introduction and §2 Measurement. The lede names the Box's role (wiring the
  §3 design principles to recognisable working-day scenes) and its containment
  rule (introduces no new claim). Three vignettes follow at Monday / Thursday /
  Friday-six-months-later rhythm: the teaching-lab scene mapping to §5/Fig 4,
  the pathologist's consult mapping to §6/Fig 5, and the reviewer-triggered
  re-run six months after submission mapping to §4/Fig 3. Every mechanism named
  — zero-install URL load, client-side pixel isolation, Hypha-authenticated
  audit log (`collab/audit_log.js`), pinned CheerpJ runtime at `v1.0-paper`,
  cross-version Find-Edges drift (`replay/mri_wound_healing_2020/MATCH_REPORT.md`)
  — is already committed by §§3/4/5/6 or §10, so the Box carries no new
  empirical weight; it is narrative scaffolding that gives the biologist reader
  a concrete entry point between the abstract regime argument and the empirical
  instruments.

- **HTML render v0.13 adds `<aside class="nm-box" id="box1">` between §1 and §2.**
  New CSS rules (91 lines in the `<style>` block, preceding the `.gated`
  section) define the box's Nature Methods-style appearance: light-blue tint
  (`#eef4fb`), thin border with a 4-px accent left border in the Nature Methods
  primary accent, serif body with sans-serif box-tag and vignette headers,
  italic lede, dotted separators between vignettes, justified serif vignette
  paragraphs. Three vignette subsections render with bold sans-serif title +
  per-vignette cross-reference link row ("→ §5 · Fig 4" etc.) and a justified
  serif paragraph. A footer row at the bottom of the box restates the no-new-
  claim rule ("Box 1 introduces no new claim, number, or citation …
  placeholders already carried by Fig 4/Fig 5 captions, resolving at Gate G").

- **Version bumps v0.12 → v0.13** in all four places (article-meta line under
  Published, draft chip, sidebar Draft version dd, footer rendered-from div).
  Status chip extended with iteration-20 narrative: `Evidence status · 22 prose
  blocks v0.1 (+ Box 1 biologist-facing pull-out, iter 20; + §4 Replay
  structural-commitment prose, iter 19); Box 1 wires §§3/4/5/6 to three
  recognisable working-day scenarios (Monday teaching lab → §5 · Thursday
  clinical consult → §6 · Friday re-run six months later → §4); …`. Sidebar
  Ready (prose v0.1) list extended with `Box 1 (biologist pull-out, iter 20)`
  (bold).

- **Readiness dashboard synchronised in-pass.** Banner augmented with "Box 1
  biologist-facing pull-out added between §1 and §2 iteration 20". Prose-block
  coverage row's count increments 16/16 → 17/17 STRUCTURAL-READY, with
  `Box 1 added iter 20` chip appended. Gate A condition and source column both
  updated to name iteration 20 + Box 1. Dashboard narrative kept — Box 1 is
  not a new scorecard, it is a body-surface addition.

- **HTML well-formed check passes.** Custom html.parser-based validator (with
  SVG/HTML void-element handling) reports zero tag issues. Final file 368,132
  bytes (up from 360,972 bytes in iteration 19 — +7,160 bytes for Box 1 prose
  + CSS rules).

- **Served URL confirmed stable (Iteration 8–20 pattern).** Mount `manuscript`
  continues to serve from disk. HTTP HEAD against
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/` → `200`,
  `content-length: 368132` exactly matching `wc -c` on disk.

- **Re-registered svamp session link** with v0.13 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.13 (Nature Methods) — Box 1 biologist pull-out"`.

### Files changed

- `preprint.md` — appended one "Drafted prose" block (Box 1 v0.1, ~420 words,
  one lede + three vignettes) after the §4 Replay v0.1 block. No existing
  content modified. File grew from 2,145 → ~2,160 lines.
- `manuscript_html/index.html` — added `aside.nm-box` CSS block (91 lines in
  `<style>`), inserted a complete `<aside class="nm-box" id="box1">…</aside>`
  section after §1 closes and before §2 opens; bumped version strings v0.12
  → v0.13 in four places; extended status chip with iteration-20 narrative;
  extended Ready (prose v0.1) list; synchronised readiness dashboard (prose
  coverage row 16/16 → 17/17, Gate A condition and source column, banner).
  File grew 360,972 → 368,132 bytes (+7,160 bytes for the Box + CSS).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` — `session_link`
  updated by `svamp session set-link` with v0.13 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this
  entry; added one new Patterns bullet at the top (biologist-facing pull-out
  as a legitimate narrative-scaffolding surface distinct from body prose).

### Learnings for future iterations

- **Box 1 is a narrative-scaffolding block, not an editorial-machinery scorecard
  and not an evidence-gated body section.** It is a *third* kind of surface,
  and the visual vocabulary has to reflect that or the reader will miscategorise
  it. Editorial-machinery blocks (dry run, readiness dashboard, submission
  packet, reporting summary, research briefing) use distinct-coloured cards
  with explicit "submission engineering" labelling; evidence-gated body
  sections use the amber `.gated` style (now slim one-line banners after
  iterations 18/19). Box 1 uses a fresh light-blue palette with a Nature
  Methods-accent left border, distinct from both — so a reader scrolling the
  rendered draft sees three visual categories at a glance: body prose (plain
  serif), editorial machinery (coloured scorecards), narrative scaffolding
  (Box 1 style). Future iterations adding a Box 2 or further biologist-facing
  scaffolding should reuse the `.nm-box` class, not invent new styling.

- **Placeholder-inventory discipline holds.** Naïvely, three working-day
  vignettes with partner-institution, course-code, IRB-number, and threshold-
  value mentions could have added 6–10 new placeholders to the inventory.
  But every placeholder-requiring detail in Box 1 either (i) uses a concrete
  illustrative value that resolves at draft time, not evidence landing
  (`threshold=65`, `threshold=72` — these are illustrations, not claims), or
  (ii) points back to a body surface that carries the placeholder (Fig 4/Fig 5
  captions; §§5/6 prose). The inventory count is therefore unchanged at v0.13,
  and the placeholder-inventory-shared-with-figure-captions rule (from
  iteration 18) is preserved for this new surface type as well.

- **Body prose remains AI-free.** Box 1 mentions no deep-learning method,
  foundation model, or agent; it mentions Hypha only as the collaboration
  infrastructure in the Thursday vignette (which is §6's subject). The
  "AI stays contained to §8" pattern is preserved at v0.13.

- **Iteration kind was narrative-scaffolding, not body-prose promotion and
  not scorecard.** Five editorial-machinery scorecards (dry run, packet,
  reporting summary, readiness dashboard, research briefing) remain valid at
  v0.13 without re-computation — Box 1 does not change any Gate state.
  Iteration 20 is therefore a fourth iteration kind beyond the three
  catalogued at iteration 19 (body-prose promotion, figure/visual pass,
  scorecard). Future iterations should name their kind explicitly.

- **Highest-value next iteration without new evidence: Bibliographic
  verification pass (Gate H), deferred from iterations 16–19.** Still ~35
  `[VOL:PAGES, DOI]` placeholders in References v0.1 remain unresolved. A
  focused one-pass verification against Crossref / DOI.org / journal records
  resolves Gate H, drops the placeholder-inventory count significantly, and
  promotes the references-verification dashboard row from `0 / ~35` to `~35 /
  ~35` in a single pass.

- **Second-highest next iteration without new evidence: Box 2 candidate —
  "What ImageJ.JS is not" short pull-out on regime boundaries.** A second
  biologist-facing pull-out, positioned between §7 Collaboration and §8
  Limits, could translate §8's regime-boundary argument ("where deep
  learning is the right tool; where ImageJ.JS composes rather than
  competes") into three recognisable counter-vignettes — e.g., the
  connectomics lab, the high-content-screen facility, the clinical-
  triage use case — to make the complementarity claim as concrete as
  Box 1 makes the pillar claims. Like Box 1, it would introduce no
  new claim; it would be narrative scaffolding for §8's argument. This
  should be a candidate for iteration 21 or 22 if the bibliographic
  pass is blocked on network access.

---


## 2026-04-18 — Iteration 21: Box 2 biologist-facing regime-boundary pull-out + sidebar-aside CSS-scoping regression fix (HTML render v0.14)

### What was implemented

- **Drafted Box 2 v0.1 (~430 words, one lede + three counter-vignettes)** in
  `preprint.md §"Drafted prose — Box 2 What ImageJ.JS is not (v0.1,
  2026-04-18)"`, positioned between §7 Real-time collaboration and §8 Limits
  and complementarity. The lede names the Box's role (translating §8's
  "we reject no method" into concrete counter-regime scenes) and its
  containment rule (no new claim, method, or citation). Three counter-
  vignettes follow: the 50 TB connectomics EM volume (→ §8 ¶2 · Fig 7),
  the 384-well high-content screen (→ §8 ¶2 · Fig 7), and the Tuesday-
  night emergency-department triage (→ §8 ¶4 · Fig 7). Every method named
  — Cellpose, StarDist, CellProfiler, SAM, FDA-cleared DL classifiers —
  is already defined and cited in §8's four paragraphs; every bracketed
  placeholder follows the Fig 1c / §8 ¶3 inventory, so no new inventory
  line is added.

- **HTML render v0.14 adds `<aside class="nm-box" id="box2">` between §7 and
  §8** using the `.nm-box` CSS rules introduced for Box 1 (iter 20),
  preserving the Nature Methods pull-out idiom (light-blue tint, 4-px
  accent left border, serif body with sans-serif box-tag/vignette headers,
  italic lede, dotted separators). Three vignette subsections render with
  bold sans-serif title + per-vignette cross-reference link row
  ("→ §8 ¶2 · Fig 7" etc.) and a justified serif paragraph. A footer row
  restates the no-new-claim rule.

- **Version bumps v0.13 → v0.14** in all four places (article-meta, draft
  chip, sidebar Draft version dd, footer rendered-from div). Status chip
  extended with iteration-21 narrative; sidebar Ready (prose v0.1) list
  extended with `Box 2 (regime-boundary pull-out, iter 21)` (bold).
  Readiness dashboard banner augmented and prose-coverage row's count
  increments 17/17 → 18/18 with `Box 2 added iter 21` chip; Gate-A
  condition updated to name iteration 21 + Box 2.

- **Fix: sidebar-aside CSS regression (user-reported at render-time).**
  Iteration 20 introduced `aside.nm-box` to style Box 1 but did not narrow
  the pre-existing generic `aside { position:sticky; top:20px; border-top:2px
  solid; padding-top:18px; align-self:start; }` rule — which applied to
  *all* `aside` elements, including the new Box 1. In v0.13 Box 1 pinned to
  the top of the viewport and covered body content as the reader scrolled
  past §1. The fix narrows six sidebar CSS selectors from `aside ...` to
  `aside.sidebar ...` (including the mobile-viewport `order:2` rule) and
  adds `class="sidebar"` to the actual sidebar `<aside>` element at line
  3917. After the fix, `aside.nm-box` (Box 1, Box 2) inherits only
  `.nm-box` styles — no sticky position, no top-border, no
  `align-self: start` — and flows inline with the body prose as intended;
  the sidebar continues to pin at `top: 20px` on wide viewports and drop
  to `order: 2` below 900 px as before.

- **HTML well-formed check passes.** Custom `html.parser` validator reports
  zero tag issues across the full 373,951-byte file.

- **Served URL confirmed stable.** Mount `manuscript` continues to serve
  from disk. HTTP HEAD against
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/` → `200`,
  `content-length: 373951` exactly matching `wc -c` on disk.

### Files changed

- `preprint.md` — appended one "Drafted prose" block (Box 2 v0.1, ~430 words,
  one lede + three counter-vignettes) after the Box 1 v0.1 block. No
  existing content modified.
- `manuscript_html/index.html` — inserted a complete
  `<aside class="nm-box" id="box2">…</aside>` block between §7 closing
  `</section>` and `<!-- §8 -->`; bumped version strings v0.13 → v0.14 in
  four places; extended status chip, Ready list, readiness dashboard banner,
  prose-coverage row 17/17 → 18/18 with Box 2 chip and Gate-A condition,
  footer rendered-from div; scoped six sidebar CSS rules `aside ...` →
  `aside.sidebar ...` and added `class="sidebar"` to the sidebar `<aside>`
  element at line 3917. File grew 368,132 → 373,951 bytes (+5,819 bytes net).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` — this
  entry; added one new Patterns bullet at the top (CSS scoping discipline
  for section-role element reuse).

### Learnings for future iterations

- **CSS scoping is load-bearing when element types are reused across section
  roles.** See the new Patterns bullet at top for the full rule. The bug
  introduced in iteration 20 was invisible to every programmatic validator
  on the repo (HTML well-formedness, placeholder inventory, Gate-state
  scorecards) and discoverable only by visual inspection of the rendered
  page. Future iterations should treat `visual rendering` as its own
  validation surface distinct from `DOM well-formedness`.

- **Box 2 landed the iteration-20 "second-highest next iteration" path
  without further evidence.** At iteration 20 the highest-value next
  iteration was Gate H (bibliographic verification, ~35 DOI lookups),
  which requires network access; the second-highest was Box 2
  "What ImageJ.JS is not". Iteration 21 took the second-highest.

- **Placeholder-inventory discipline holds (third application).** Like
  iterations 19 (§4 prose) and 20 (Box 1), Box 2 adds zero new placeholders.
  Every bracketed value in Box 2 points at a token already carried by
  Fig 1c, §2 ¶5, or §8 ¶3.

- **Body prose remains AI-free outside §8.** Box 2 mentions DL methods only
  as the *right tool* for regimes ImageJ.JS is *not* the right tool for —
  which is §8's subject. The "AI stays contained to §8" pattern is extended
  to include Box 2 as a §8-adjacent biologist-facing surface.

- **Iteration kind (iter 21) was two-phase: narrative-scaffolding landing +
  visual-regression fix.** This is a new iteration-kind-pair not catalogued
  at iteration 20 (four kinds: body-prose promotion, figure/visual pass,
  scorecard, narrative-scaffolding). `Regression fix` is a fifth kind
  triggered by user-reported visual inspection. Future iterations that
  combine narrative-scaffolding with a regression fix should name both
  kinds explicitly.

- **Highest-value next iteration without new evidence: Bibliographic
  verification pass (Gate H), still deferred from iterations 16–20.**

- **Second-highest next iteration without new evidence: Copy-edit /
  biologist-tone pass across promoted prose (Abstract, §§1/2/4/5/6/7/8,
  Box 1, Box 2).** Six structural-commitment prose blocks and two
  biologist-facing pull-out Boxes have landed. A single copy-edit pass for
  tone, voice, and citation form — without changing any claim — would raise
  the prose quality of v0.14 to submission-grade.

- **Third-highest next iteration: visual-rendering validation surface.**
  Because the iteration-20 CSS regression was discoverable only by visual
  inspection, a systematic pass looking at every pull-out, section
  transition, and editorial-machinery scorecard with a human eye (or an
  automated screenshot + DOM-layout check) would pre-empt the class of bug
  this iteration fixed. This is a new, previously-uncatalogued quality
  surface.

---



## 2026-04-18 — Iteration 22: Key Points for the bench biologist (HTML render v0.15)

### What was implemented

- **Drafted Key Points v0.1 (~220 words, one lede + 5 numbered bullets)** in
  `preprint.md §"Drafted prose — Key points for the bench biologist (v0.1,
  2026-04-18)"`, positioned between the Abstract and Fig 0 Graphical Abstract
  in the rendered article as the text-mode companion to the graphical
  abstract. The five bullets cover: (1) the regime (§1/§2 · Fig 1/1-suppl);
  (2) tool delivery — Fiji via browser (§3 · Fig 2 · Box 1 Monday); (3)
  URL-driven reproducibility (§3/§4 · Fig 3 · Box 1 Friday); (4) client-side
  privacy (§6/§7 · Fig 5/6 · Box 1 Thursday); and (5) the regime boundary
  plus a "what this paper is *not*" pointer (§8 · Fig 7 · Box 2). Each bullet
  rephrases an already-drafted assertion with §- and figure-level
  cross-references so a reader persuaded by a bullet can jump directly to
  the body surface that substantiates it. Block introduces **no new claim,
  number, or citation**; every bracketed value rephrases a placeholder
  already carried by Abstract / §§1–10 / Fig 1c / Boxes 1–2, and all
  resolve on the same Gate-D/E/G path.

- **HTML render v0.15 adds `<aside class="key-points" id="keypoints">`
  between Abstract and Fig 0** using a new `.key-points` CSS rule set
  (burgundy `#7a1f2b` border-left double-rule; `#fbf6f4` background;
  circular numbered bullet badges). CSS adds 85 lines in the `<style>`
  block. The panel is visually distinct from both the `.nm-box` Box 1/2
  body-inline narrative-scaffolding pull-outs (blue palette) and from the
  eight editorial-appendix scorecards (cover-letter serif, supp-outline
  green/amber/red, release-eng blue, dry-run amber, packet teal,
  dashboard violet, reporting-summary rose/coral, research-briefing
  sage/olive). Every link in the panel back-references an existing id on
  the page (`#sec-1` … `#sec-8`, `#fig1` … `#fig7`, `#box1`, `#box2`,
  `#ref-lord2024`); no dangling anchors introduced.

- **Version bumps v0.14 → v0.15** in all four places (article-meta line
  under Published, draft chip, sidebar Draft version dd, footer
  rendered-from div). Status chip extended with iteration-22 narrative;
  sidebar Ready (prose v0.1) list extended with `Key Points
  (bench-biologist first-contact summary, iter 22)` (bold) at the
  start — between Abstract and §1 — matching the rendered position.

- **Readiness dashboard synchronised in-pass.** Banner augmented with
  "Key Points for the bench biologist added between Abstract and Fig 0
  iteration 22". Prose-block coverage row's count increments 18/18 →
  19/19, Key Points chip appended, and the source column updated with a
  paragraph situating Key Points as the third biologist-facing surface
  (Box 1 → Box 2 → Key Points) all of which introduce no new empirical
  claim.

- **HTML well-formed check passes.** Custom `html.parser`-based validator
  reports zero tag issues. File grew 373,951 → 382,898 bytes (+8,947
  bytes: ~3.8 KB of new prose and anchor markup + ~5.2 KB of new CSS for
  the `.key-points` palette).

- **Served URL confirmed stable.** Mount `manuscript` continues to serve
  from disk. `HTTP/2 200`, `content-length: 382898` exactly matching
  `wc -c` on disk.

- **Re-registered svamp session link** with v0.15 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.15 (Nature Methods) — Key Points for the bench biologist"`.

### Files changed

- `preprint.md` — appended one "Drafted prose" block (Key Points v0.1,
  ~220 words, 1 lede + 5 numbered bullets) after the Box 2 v0.1 block.
  No existing content modified. File grew ~60 lines.
- `manuscript_html/index.html` — added `.key-points` CSS block (~85
  lines in `<style>`), inserted a complete `<aside class="key-points"
  id="keypoints">…</aside>` between the Abstract `</section>` and
  the Fig 0 `<figure>`; bumped version strings v0.14 → v0.15 in four
  places; extended status chip with iteration-22 narrative; extended
  sidebar Ready list (Key Points appended as first item, bold);
  synchronised readiness dashboard (prose coverage row 18/18 → 19/19,
  Key Points chip added, source-column paragraph updated; banner
  augmented); rewrote sidebar Draft version dd rationale paragraph and
  footer rendered-from div to describe the iter-22 addition. File grew
  373,951 → 382,898 bytes (+8,947 bytes).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` —
  `session_link` updated by `svamp session set-link` with v0.15 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added one new Patterns bullet at the top (top-of-article
  Key Points bench-biologist first-contact summary as a third
  biologist-facing surface type, completing the four-category visual
  vocabulary).

### Learnings for future iterations

- **Four-category visual vocabulary is now complete.** See the new
  Patterns bullet at top. As of iteration 22 the rendered manuscript has
  four visually distinguishable categories: body prose (plain serif);
  editorial machinery (eight distinct scorecard palettes); body-inline
  narrative scaffolding (Box 1 / Box 2 `.nm-box` blue pull-outs); and
  top-of-article first-contact summary (Key Points `.key-points`
  burgundy panel). Future narrative-scaffolding additions (a hypothetical
  Box 3, or a plain-language methods box) should reuse the `.nm-box`
  class rather than introduce a fifth category; future first-contact
  surfaces should reuse `.key-points` rather than introduce a second
  burgundy variant.

- **Biologist-first-contact surface is a legitimate publication-readiness
  move even in the absence of new evidence.** The iteration kind here is
  narrative-scaffolding (same kind as iteration 20's Box 1 and iteration
  21's Box 2), not body-prose promotion and not scorecard. The addition
  does not move any Gate state except prose-block coverage (18/18 →
  19/19 STRUCTURAL-READY). Dry-run, packet, reporting-summary, readiness,
  and research-briefing scorecards remain valid at v0.15 without
  re-computation — Key Points does not change any defensibility
  response, any CRediT role, any reporting-summary slot, any
  dashboard gate, or any research-briefing segment.

- **Placeholder-inventory discipline holds (fourth application).** Like
  iterations 19 (§4 prose), 20 (Box 1), and 21 (Box 2), Key Points adds
  zero new placeholders. Every bracketed value in the five bullets
  points at a token already carried by Abstract (`[48]%`, `[48]%`,
  `[20]%`), §1 (`[Y1–Y2]`, `[N]`), or §10 (`[DAU]`, `[YYYY]`). The
  placeholder-inventory-shared-with-body-prose rule (iterations 17 + 18
  Patterns bullet) now has four body-surface applications.

- **Body prose remains AI-free outside §8 (fourth application).** Key
  Points mentions deep-learning methods only in bullet 5, exclusively
  to name the regimes where ImageJ.JS is *not* the right tool (§8 / Box
  2). The "AI stays contained to §8" pattern is preserved; bullet 5 is
  the `§8-adjacent biologist-facing surface` analogue to Box 2 at the
  top of the article.

- **Anchor-integrity check is now a distinct validation surface.** Key
  Points contains 14 internal links (`#sec-1` … `#sec-8`, `#fig1` …
  `#fig7`, `#box1`, `#box2`, `#ref-lord2024`). Every one resolves to an
  existing id on the page; a linter that validates `<a href="#…">`
  anchors against the set of `id="…"` attributes would catch a class of
  regression not caught by the HTML well-formedness validator. This is
  the fourth validation surface catalogued (HTML well-formedness,
  placeholder inventory, Gate-state scorecards, visual rendering) and
  the first that could be added as a small automated check.

- **Iteration kind (iter 22) was single-phase narrative-scaffolding.**
  Unlike iteration 21 which combined narrative-scaffolding with a
  regression fix, iteration 22 is a pure addition with no fix component.
  This confirms that narrative-scaffolding remains a tractable single
  iteration kind.

- **Highest-value next iteration without new evidence: Bibliographic
  verification pass (Gate H), still deferred from iterations 16–21.**
  Still ~35 `[VOL:PAGES, DOI]` placeholders in References v0.1 remain
  unresolved. Resolving them would promote Gate H from PENDING to MET
  and drop the placeholder-inventory count significantly.

- **Second-highest next iteration without new evidence: Anchor-integrity
  validator + visual-rendering validation surface combined into a single
  `tools/validate_manuscript.py` script.** The iteration-21 CSS regression
  would have been caught by a visual-rendering check; iteration 22
  introduces a cross-reference graph that would be caught by an
  anchor-integrity check. Both are discoverable by programmatic
  inspection; both are currently uncatalogued validation surfaces.

- **Third-highest next iteration: Copy-edit / biologist-tone pass across
  Abstract + §1 + §2 (the first three surfaces a biologist reader now
  encounters, Key Points being the new zeroth).** With Key Points in
  place, the pressure on §1 to be immediately biologist-accessible is
  slightly relieved (§1 can now assume the reader has seen Key Points),
  but the Abstract + §1 + §2 prose could still be tightened for the
  biologist voice the Key Points panel establishes. This remains a
  candidate for a future iteration.

---


## 2026-04-18 — Iteration 23: Biologist-voice copy-edit of Abstract + §1 (HTML render v0.16)

### What was implemented

- **Drafted Abstract v0.6 (~260 words, claim-preserving biologist-voice
  rewrite of v0.5)** in `preprint.md §"Drafted prose — Abstract (v0.6,
  biologist-voice rewrite 2026-04-18)"`, positioned after the Key Points
  v0.1 block. v0.6 opens "Biologists work at human scale" with three
  concrete biologist-scale scenes (13–27 cells; a handful of embryos; a
  dozen slides) leading the editorial argument, splits the single-sentence
  tool description into a two-sentence "what it is" + "what it centres"
  pair so the biologist reader can parse delivery (browser, no install,
  client-side) separately from design (interpretable classical algorithms,
  any device), and closes with the locked title echo "**Small data, human
  hands**" verbatim. Every number, citation, and placeholder is preserved
  from v0.5 — the claim-diff is empty; the placeholder-inventory is
  unchanged.

- **Drafted §1 Introduction v0.2 (~680 words, claim-preserving biologist-
  voice promotion of v0.1)** in `preprint.md §"Drafted prose — §1
  Introduction (v0.2, biologist-voice promotion 2026-04-18)"`, positioned
  after the Abstract v0.6 block. v0.2 preserves the four-paragraph
  structure and every claim/citation/placeholder of v0.1; changes are
  local: ¶1 opens with biologist-scale scenes (adding a field-ecology
  phone-photograph scene drawn from the §3/Box 1 use-case catalogue —
  not a new citation, an illustrative case that §3/Box 1 already
  covers), re-orders sentences so concrete observations precede abstract
  argument, and rephrases "This is the working scale of most biology —
  not a data-collection failure, but the nature of careful,
  hypothesis-driven science" (identical to Abstract v0.5's corresponding
  sentence, propagated into §1); ¶2 tightens "We first measure the gap"
  → "We measured the gap directly" and "Routine foundation-model
  solutions degrade sharply outside their training distribution" →
  "Foundation-model segmenters degrade sharply outside their training
  distribution"; ¶3 re-threads with "In this regime, human biologists
  still out-perform current AI systems" so the paragraph-chaining across
  §1 ¶¶2–3 is anchored by the shared phrase "in this regime"; ¶4 de-
  personalises the contribution list ("We contribute" → "The paper
  contributes") for parallelism with Brief Communication voice, and
  replaces the (interior) parenthesised failure-mode clause with an
  em-dashed equivalent that flows better in biologist voice. Word count
  unchanged from v0.1 at ~680 words.

- **HTML render v0.16 replaces Abstract `<p>` (§"abstract") and §1's four
  `<p>` elements** with the v0.6 / v0.2 prose. The `[Lord et al. 2024]`
  in-text link is retained where it appears in the original; one new
  `<a href="#ref-lord2024">` link is added to the Abstract opening
  sentence (pointing at an already-existing id on the page, so no
  anchor-integrity regression). The reader's first-contact sequence
  now reads Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → §2 → Fig 1
  without editorial-voice seams. No new element, no new id, no new
  `<aside>`, no new CSS — this iteration modifies existing prose only.

- **Version bumps v0.15 → v0.16** in all four places (article-meta line
  under Published, draft chip, sidebar Draft version dd, footer
  rendered-from div). Status chip extended with iteration-23 narrative;
  sidebar Ready (prose v0.1) list promoted — "Abstract v0.6 (biologist-
  voice rewrite, iter 23)" bolded at the head, "§1 v0.2 (biologist-voice
  promotion, iter 23)" bolded third.

- **Readiness dashboard synchronised in-pass.** Banner augmented with
  "Abstract v0.5 → v0.6 + §1 v0.1 → v0.2 biologist-voice copy-edit of the
  biologist reader's first-contact sequence iteration 23". Prose-block
  coverage row's count remains 19/19 (no new block) with "Abstract v0.6 +
  §1 v0.2 biologist-voice iter 23" chip appended and the source-column
  paragraph extended to record the pass.

- **HTML well-formed check passes.** Custom `html.parser`-based validator
  reports zero tag issues. File grew 382,898 → 385,113 bytes (+2,215
  bytes: ~1.2 KB of Abstract prose delta + ~1.0 KB of §1 prose delta).

- **Served URL confirmed stable.** Mount `manuscript` continues to serve
  from disk. HTTP HEAD against
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/` → `200`,
  `content-length: 385113` exactly matching `wc -c` on disk.

- **Biologist-voice spot-check live.** `curl … | grep -o "Biologists work
  at human scale"` returns two matches (Abstract + Key Points). `curl … |
  grep -o "Small data, human hands"` returns five matches (title + Key
  Points bullet 5 + Abstract closing + Cover letter + footer section
  headings).

- **Re-registered svamp session link** with v0.16 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.16 (Nature Methods) — biologist-voice copy-edit of Abstract + §1"`.

### Files changed

- `preprint.md` — appended two "Drafted prose" blocks (Abstract v0.6 and
  §1 Introduction v0.2) after the Key Points v0.1 block. No existing
  content modified. File grew ~60 lines.
- `manuscript_html/index.html` — replaced the Abstract `<p>` element's
  inner prose and §1's four `<p>` elements' inner prose with v0.6 and
  v0.2 text, respectively; bumped version strings v0.15 → v0.16 in four
  places; extended status chip with iteration-23 narrative; promoted
  Abstract and §1 entries in the sidebar Ready list; synchronised
  readiness dashboard (prose-coverage row source-column extended,
  banner augmented with iter-23 narrative); rewrote sidebar Draft
  version dd rationale paragraph and footer rendered-from div to
  describe the iter-23 biologist-voice pass. File grew 382,898 →
  385,113 bytes (+2,215 bytes).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` —
  `session_link` updated by `svamp session set-link` with v0.16 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; added one new Patterns bullet at the top (biologist-voice
  copy-edit as a fifth iteration kind distinct from body-prose
  promotion, narrative-scaffolding addition, regression fix, and
  scorecard recomputation).

### Learnings for future iterations

- **Iteration kind (iter 23) was pure biologist-voice copy-edit.** Kind
  is catalogued as the fifth distinct iteration kind: (1) body-prose
  promotion (e.g., §§5/6/7 iter 18, §4 iter 19); (2) figure/visual pass
  (iter 17); (3) scorecard recomputation (various); (4) narrative-
  scaffolding addition (Box 1 iter 20, Box 2 iter 21, Key Points iter
  22); (5) biologist-voice copy-edit of already-drafted v0.1 prose (this
  iteration). Iteration 21 also contained a regression-fix sub-kind; if
  that is counted separately, (6) is regression fix. Future iterations
  should name their kind explicitly.

- **Claim-preservation discipline held strictly.** Every claim, citation,
  and placeholder of Abstract v0.5 and §1 v0.1 is present in v0.6 and
  v0.2. A claim-diff operation across the two blocks would return an
  empty set. The only surface-level deltas are sentence order, verb
  substitution, concrete-before-abstract reordering, paragraph opening
  clauses ("We measured the gap directly" vs "We first measure the
  gap"; "In this regime, …" vs "Human biologists still out-perform …
  in this regime"), and the addition of the title-echo "**Small data,
  human hands**" at the close of the Abstract — which already appears as
  the paper's locked title and so is not a new phrase. Placeholder
  inventory count unchanged from v0.15.

- **Body prose remains AI-free outside §8.** The biologist-voice rewrite
  did not introduce AI-adjacent language; the Abstract v0.6 references
  to SAM, Cellpose-generalist, StarDist, and CellSAM are the identical
  references from v0.5 retained verbatim. The "AI stays contained to
  §8" pattern is preserved at v0.16.

- **Placeholder-inventory discipline holds (fifth application).** Like
  iterations 19 (§4 prose), 20 (Box 1), 21 (Box 2), and 22 (Key Points),
  iteration 23 adds zero new placeholders. All `[48]%`, `[20]%`, `[N]`,
  `[Y1–Y2]`, `[DAU]`, `[YYYY]`, `[X]`, `[7]%`, `[30]` placeholders in
  v0.6 / v0.2 are identical tokens to v0.5 / v0.1. The placeholder-
  inventory-shared-with-body-prose rule now has five applications.

- **No scorecard re-computation required.** Because the iteration did
  not change any claim, no Gate state shifts; dry-run defensibility,
  submission packet, reporting summary, readiness, and research-briefing
  scorecards all remain valid at v0.16. The prose-coverage row's count
  is unchanged at 19/19 (no new block).

- **The biologist-first-contact chain now reads seamlessly.** Key Points
  (iter 22, burgundy `.key-points` block, biologist voice by construction)
  → Abstract v0.6 (biologist voice, iter 23) → §1 v0.2 (biologist voice,
  iter 23) → Box 1 (iter 20, blue `.nm-box`, biologist voice by
  construction, three working-day vignettes) → §2 (iter 18 biologist-voice
  rewrite, already inspects in biologist voice) → Fig 1. A reader
  scrolling through the first ~2,400 rendered lines of the article
  never hits an editorial-voice seam. This chain is the
  publication-ready biologist reader path.

- **Highest-value next iteration without new evidence: Bibliographic
  verification pass (Gate H), still deferred from iterations 16–22.**
  Still ~35 `[VOL:PAGES, DOI]` placeholders in References v0.1 remain
  unresolved; a focused single-pass verification against Crossref /
  DOI.org / journal records resolves Gate H and drops the placeholder-
  inventory count significantly.

- **Second-highest next iteration without new evidence: biologist-voice
  copy-edit pass across §3 Design principles + §8 Limits (the next two
  body sections whose v0.1 prose still carries editorial-voice
  phrasings).** §3 ¶1 opens "The design of ImageJ.JS is governed by a
  single premise derived from §2" — editorial voice. §8 ¶1 opens "The
  argument of this paper is that small-data, human-centred bioimage
  analysis is a distinct regime" — editorial voice. Both would benefit
  from the same claim-preserving biologist-voice rewrite that Abstract
  and §1 received in this iteration. Note, per the new Patterns bullet,
  these should land as their own iterations; do not bundle multiple
  sections into a single biologist-voice pass.

- **Third-highest next iteration: tools/validate_manuscript.py (anchor-
  integrity + visual-rendering validator).** The iter-22 learning
  still applies — Key Points introduced 14 internal anchors, iter 23
  added one more (Abstract → `#ref-lord2024`), and the CSS-scoping
  regression from iter 20–21 was discoverable only by visual
  inspection. A single `python tools/validate_manuscript.py` that
  linted anchor integrity (every `<a href="#…">` points at an existing
  id) and rendered-page geometry (no overlapping absolutely-positioned
  asides; no sticky elements above body sections they shouldn't pin
  over) would pre-empt two catalogued regression classes.

---


## 2026-04-18 — Iteration 24: Biologist-voice copy-edit of §3 Design principles (HTML render v0.17)

### What was implemented

- **Drafted §3 Design principles v0.2 (~900 words, claim-preserving
  biologist-voice rewrite of v0.1)** in `preprint.md §"Drafted prose —
  §3 Design principles (v0.2, biologist-voice rewrite 2026-04-18)"`,
  positioned after the §1 Introduction v0.2 block. v0.2 preserves the
  six-paragraph structure of v0.1 (intro + five named principles:
  substrate continuity; zero install; URL-addressable state;
  collaboration; deliberate non-design). The intro paragraph is
  reframed from editorial-voice ("The design of ImageJ.JS is governed
  by a single premise derived from §2") to biologist-voice
  ("Biologists who work at the small scale §2 measured cannot install
  software on every device they touch"), with the four constraint
  scenes (Chromebook teaching lab; phone field ecology; locked
  hospital laptop; air-gapped forensic machine) leading the abstract
  argument concrete-before-abstract. The five principles are tightened
  verb-by-verb: e.g. "The first principle is **continuity with the
  substrate the field already opens**. The 80-paper survey finds
  that…" → "[48]% of recent microscopy publications in our 80-paper
  survey name…" (sentence reorder + dropped editorial framing); "A
  second correctness consequence follows: because all compute happens
  client-side…" → "A second consequence follows from the first.
  Because all compute happens client-side…" (sentence split for
  biologist parseability); "design choices give up some aesthetic
  freedom… It earns…" → "The price of this choice is some aesthetic
  freedom; the gain is…" (parallelism for biologist voice).

- **HTML render v0.17 replaces §3's intro `<p>` and the five
  `<h3>`-introduced subsection `<p>` elements** with the v0.2 prose.
  Three internal anchors are added: `<a href="#sec-4">§4</a>`,
  `<a href="#sec-7">§7</a>` (twice), and `<a href="#sec-8">§8</a>`,
  replacing bare "§4" / "§7" / "§8" cross-references in the §3 prose
  with hot links to the existing section ids. No new id, no new
  element, no new `<aside>`, no new CSS. The HTML structure of §3
  (six paragraphs grouped under five h3 subsection headings + the
  intro paragraph + Fig 2 below) is preserved unchanged.

- **Version bumps v0.16 → v0.17** in all four canonical places:
  article-meta line under Published; draft chip in the status strip;
  sidebar Draft version dd; footer rendered-from div. The article-meta
  dd and footer div paragraphs are rewritten to describe the iter-24
  biologist-voice rewrite of §3 with the same level of detail as the
  iter-23 description used.

- **Sidebar Ready (prose v0.1) list updated** to bold "§3 v0.2
  (biologist-voice rewrite, iter 24)" in place of the previous
  unbolded `§3` entry, matching the convention used for "§1 v0.2
  (biologist-voice promotion, iter 23)" and "Abstract v0.6
  (biologist-voice rewrite, iter 23)".

- **Readiness dashboard synchronised in-pass.** Banner extended with
  "§3 v0.1 → v0.2 biologist-voice rewrite extending the same pass to
  Design principles iteration 24". Prose-block coverage row's count
  remains 19/19 (no new block) with "§3 v0.2 biologist-voice iter 24"
  chip appended after the iter-23 chip; source-column paragraph
  extended to record the §3 pass and the updated biologist-facing
  surface chain (Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → §2 →
  Fig 1 → Box 2 → §3 v0.2 → Fig 2). The supp-outline allocation
  table's §3 row marker is extended to record "v0.2 biologist-voice
  rewrite, iter 24 — claim-preserving copy-edit of v0.1".

- **Status-chip evidence-status text rewritten** to lead with the
  iter-24 §3 rewrite description (4 sentences) rather than the iter-23
  description (which is preserved in chronological order below as a
  prior iteration entry).

- **HTML well-formed check passes.** Custom `html.parser`-based
  validator reports zero tag issues and zero unclosed elements.

- **Anchor-integrity check passes.** A new ad-hoc anchor lint
  (`href="#…"` against the set of `id="…"` attributes) reports 167
  total `href` anchors, 48 unique, 0 broken — the three new anchors
  added by §3 v0.2 (`#sec-4`, `#sec-7`, `#sec-8`) all resolve to
  existing section ids. The Patterns bullet from iter 22 about
  anchor-integrity as a fourth validation surface is now exercised
  programmatically; this is the first iteration where the check has
  been run as a standalone verification step.

- **Placeholder-inventory check passes.** 77 placeholder tokens
  catalogued across the document, identical to the v0.16 baseline
  (ratifying the claim-preservation rule for biologist-voice
  copy-edits).

- **Disk size 385,113 → 388,416 bytes** (+3,303 bytes: ~3.3 KB §3
  prose delta + ~50 bytes for the three anchor wrappers + version
  strings).

- **Served URL confirmed stable.** Mount `manuscript` continues to
  serve from disk. HTTP HEAD against
  `https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/` →
  `200`, `content-length: 388416` exactly matching `wc -c` on disk.
  `curl … | grep -c "Biologists who work at the small scale"` returns
  5 matches (§3 ¶1 + four version-string descriptions); `curl … |
  grep -c "v0.17"` returns 4 matches (the four canonical version
  bumps).

- **Re-registered svamp session link** with v0.17 label:
  `svamp session set-link "https://static-serve-0bc5cde8.svc.hypha.aicell.io/manuscript/" "Manuscript draft v0.17 (Nature Methods) — biologist-voice rewrite of §3 Design principles"`.

### Files changed

- `preprint.md` — appended one "Drafted prose — §3 Design principles
  (v0.2, biologist-voice rewrite 2026-04-18)" block after the §1 v0.2
  block. No existing content modified. File grew ~16 lines (one
  blockquote-formatted prose block in the same convention as Abstract
  v0.6 and §1 v0.2).
- `manuscript_html/index.html` — replaced §3's intro paragraph and the
  five h3-subsection-introduced paragraphs with v0.2 prose; added three
  internal anchor wrappers (`#sec-4`, `#sec-7`, `#sec-8`); bumped
  version strings v0.16 → v0.17 in four places; promoted §3 in the
  sidebar Ready list to bolded "§3 v0.2 (biologist-voice rewrite, iter
  24)"; appended "§3 v0.2 biologist-voice iter 24" chip to the
  prose-coverage row; extended the prose-coverage source-column
  paragraph; rewrote status-chip evidence-status text and footer
  rendered-from div with iter-24-leading descriptions; extended
  readiness dashboard banner. File grew 385,113 → 388,416 bytes
  (+3,303 bytes).
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/config.json` —
  `session_link` updated by `svamp session set-link` with v0.17 label.
- `.svamp/d9a68491-c46b-4e04-9b30-6294d0bbf071/ralph-progress.md` —
  this entry; no new Patterns bullet added (iter-23's biologist-voice
  Patterns bullet already covers iter 24, and the second-application
  rule from prior patterns means a second instance does not warrant a
  new pattern unless a novel sub-rule is discovered, which it is not
  here).

### Learnings for future iterations

- **Iteration kind (iter 24) was pure biologist-voice copy-edit** —
  the fifth iteration kind catalogued in the iter-23 Patterns bullet,
  applied for the second time. The iter-23 Patterns bullet's three
  rules (zero new claims; surface-level edits only; biologist-voice
  chain inspected as a whole) were honoured: (i) every claim,
  citation, named mechanism (`runMacro`, `takeScreenshot`,
  `getRoisAsGeoJson`, `executeJavaScript`, `plugins.dir=`, `open=`,
  `macro=`, `rois=`, `mount=`), figure reference (Fig 2), and
  placeholder (`[48]%`) of v0.1 is preserved verbatim in v0.2; (ii)
  edits are sentence-level (intro reframe; verb-by-verb tightening of
  the five principles; one sentence split for parseability; one
  parallelism rewrite); (iii) the biologist-voice chain after iter 24
  reads Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → §2 → Fig 1 →
  Box 2 → §3 v0.2 → Fig 2 without editorial-voice seams.

- **Claim-preservation discipline held strictly (sixth application).**
  Like iters 19 (§4 prose), 20 (Box 1), 21 (Box 2), 22 (Key Points),
  and 23 (Abstract + §1), iter 24 adds zero new placeholders and zero
  new claims. The claim-diff against §3 v0.1 is empty. The
  placeholder-inventory count is 77 in both v0.16 and v0.17.

- **Anchor-integrity as a runnable validation surface.** Iter 24 added
  three internal anchors and the ad-hoc Python `href` vs `id` lint
  reports zero broken; this is the first iteration where the
  anchor-integrity check has been treated as a first-class validation
  step (vs. the iter-22/23 Patterns bullet that catalogued it as a
  candidate). The check is small enough (~10 LOC) that it could be
  extracted into `tools/validate_manuscript.py` in a future iteration
  without iterating on the manuscript itself; the script would also
  be the natural home for the placeholder-inventory delta check
  ("v_n+1 must have the same set of placeholder tokens as v_n unless
  the iteration entry says otherwise"), turning it into a regression
  guard rather than a manual recount.

- **Body prose remains AI-free outside §8 (sixth application).** §3
  v0.2 mentions deep learning only via the deliberate-non-design
  paragraph's reference to "GPU-accelerated deep-learning inference
  (served by deepImageJ's desktop integration and by napari's GPU
  stack)" — identical text to v0.1, no new AI-adjacent claim. The "AI
  stays contained to §8" pattern is preserved at v0.17.

- **No scorecard re-computation required.** Because the iteration did
  not change any claim, no Gate state shifts; dry-run defensibility,
  submission packet, reporting summary, readiness, and research-
  briefing scorecards all remain valid at v0.17. The prose-coverage
  row's count is unchanged at 19/19 (no new block).

- **The biologist-first-contact body chain now extends through §3.**
  After iter 23 the chain reached Key Points → Abstract v0.6 → §1 v0.2
  → Box 1 → §2 → Fig 1; after iter 24 it extends through Box 2 → §3
  v0.2 → Fig 2. This is the publication-ready biologist reader path
  through the first three body sections plus all narrative
  scaffolding. §§4–7 follow next; their v0.1 prose (drafted iters 18
  and 19) is already biologist-friendly because the structural-
  commitment promotion of those sections was carried out with the
  biologist reader in mind, but a focused biologist-voice copy-edit
  pass per section remains a candidate for iters 25–28 if editorial-
  voice phrasings are detected on inspection.

- **Highest-value next iteration without new evidence: Bibliographic
  verification pass (Gate H), still deferred from iterations 16–23.**
  Still ~35 `[VOL:PAGES, DOI]` placeholders in References v0.1 remain
  unresolved; a focused single-pass verification against Crossref /
  DOI.org / journal records resolves Gate H and drops the placeholder-
  inventory count from 77 toward ~42 (a measurable inventory
  reduction).

- **Second-highest next iteration without new evidence: biologist-
  voice copy-edit of §8 Limits and complementarity.** §8 ¶1 still
  opens "The argument of this paper is that small-data, human-centred
  bioimage analysis is a distinct regime — defined in §2 by fewer
  than 100 images per condition, human-in-the-loop steps in
  acquisition, segmentation, or scoring, and domain-prior-driven
  parameter choice — and that tooling for this regime has been
  methodologically under-invested" — clearly editorial-voice. A
  claim-preserving biologist-voice rewrite that keeps the five-
  paragraph structure and every citation (Cellpose, StarDist,
  CellSAM, deepImageJ, SAM, Lord, Ma, Archit, Royer, Chen) but opens
  with a biologist scene ("A pathologist working through a stack of
  H&E slides has, even in the era of foundation models, every reason
  to reach for ImageJ first; her samples are forty in number, the
  morphology is rare, and the slide is on her own laptop, not in a
  cloud bucket") would land naturally as iter 25.

- **Third-highest next iteration: tools/validate_manuscript.py
  (anchor-integrity + placeholder-inventory delta validator)**, per
  the iter-24 learning above. The anchor-integrity check has been
  run twice manually (iter 22 added 14 anchors; iter 24 added 3); the
  placeholder count is now stable at 77 across iters 22 → 23 → 24,
  which is the right baseline against which a delta check would
  trigger. Extracting into a script also pre-empts the iter-21 CSS
  scoping regression class via a third lint (visual rendering /
  layout sanity check on the rendered page).

---
