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
