# ImageJ.JS preprint / Nature Methods working draft

*Framing locked 2026-04-18 as **A+B unified, hybrid AI-posture**: small-data majority (measurement) + human-centric science (framing). The paper's **contribution is AI-free**; Discussion acknowledges the agentic-bioimage landscape as complementary and defers agent-facing research to a separate companion paper. Prior framings (bioimage-analysis capsule, verifiable figure, agentic bioimage) retired — their strongest ideas survive as supporting sections, not as headline claims. Target venue: **Nature Methods** (Brief Communication primary; full article possible if evidence is rigorous). Fallback: eLife Tools & Resources, then bioRxiv preprint only.*

---

## Core framing (one sentence)

The majority of biology is small-data and human-driven; ImageJ.JS is the tool built for that majority, not for the AI-scale minority that dominates current methodology papers.

**A-component (measurement / defensibility):** most bioimage research is small-data. A typical cell-biology paper analyses tens of cells across three replicates (Lord et al., J. Cell Biol. 2024). Foundation models such as SAM, Cellpose-generalist, StarDist, and CellSAM (NM 2025) underperform on this long tail because it lies outside their training distribution.

**B-component (zeitgeist / editor resonance):** in an era of AI-first methodology research, the role of the human scientist is under-discussed and under-tooled. Humans still excel at small-data analysis — noticing subtle phenotypes, tuning parameters on the fly, bringing domain priors no training set contains. Tools that centre the human scientist deserve first-class status.

**Together:** ImageJ.JS is the browser-native, human-centred bioimage analysis tool for the small-data majority of biology.

---

## Title

**"Small data, human hands: ImageJ.JS as a browser-native tool for the parts of biology where humans still matter most"**

Tightened variants to consider before locking finally:
- *"Small data and human judgement: ImageJ.JS for the majority of biology that deep learning cannot yet serve"*
- *"The biologist's browser: ImageJ.JS for small-data, human-centred bioimage analysis in the age of AI"*

---

## Abstract (v0.4 — A+B hybrid, AI-free contribution, ~270 words)

Contemporary bioimage-methodology research is optimised for the minority of biology that resembles the internet: large, homogeneous, well-annotated image collections. Most biology looks nothing like that. A typical cell-biology study analyses 13–27 cells across three biological replicates; a developmental biology paper follows a handful of embryos; a clinical pathology case reviews a dozen slides. This regime is not a data-collection failure — it is the nature of careful, hypothesis-driven, human-scale science. It is also where human biologists still out-perform current AI systems, and where contemporary foundation models (SAM, Cellpose-generalist, StarDist, CellSAM) systematically underperform on out-of-distribution, long-tail imagery. Yet the tools serving this human-scale, small-data majority have been under-invested in a decade of AI-first methodology research. We present **ImageJ.JS**, a browser-native distribution of the unmodified Fiji/ImageJ codebase that deliberately centres the human scientist: interpretable classical algorithms the biologist can reason about, zero-install access on any device, fully client-side execution for privacy-sensitive data, URL-encoded analyses that make human reasoning about images shareable and teachable, and real-time multi-user collaboration on the same image without the image ever leaving the originator's device. We contribute (1) a quantitative survey of *[N]* recent microscopy papers establishing that *[X] %* use fewer than *[K]* images per condition and *[Y] %* use ImageJ/Fiji; (2) four demonstrations of human-centred, small-data analyses served by ImageJ.JS — shareable replay of published figures over a decade-spanning corpus, installation-free classroom teaching, on-device clinical pathology, and synchronous cross-institution co-analysis; (3) a limits-and-complementarity analysis clarifying where deep-learning methods remain the right tool. ImageJ.JS is open source, has served over 1,000 daily users since *[YYYY]*; code, live instance, and all demonstration URLs are at *[URL]*.

---

## Five narrative pillars (map to figures)

Each pillar is falsifiable and serves the A+B framing. Capsule / verifiable-figure ideas survive as supporting features inside pillars 2 and 3.

| # | Pillar | What it claims | Measurable evidence | Figure |
|---|---|---|---|---|
| 1 | **The small-data majority** *(A-evidence)* | ≥*X*% of recent bioimage publications use <*K* images per condition and <*M* conditions | Own survey of ~200 recent microscopy papers + foundation-model failure benchmark on curated long-tail tasks | Distribution histogram; SAM/Cellpose/CellSAM failure rate |
| 2 | **Shareable human reasoning** *(human-centred)* | Small-data analyses share best as URL-encoded, click-to-run artifacts collaborators can inspect, tune, and re-run; browser-native execution handles interactive classical macros that Python-bridge (pyimagej) runtimes cannot, and routine replay auditing surfaces data-bundling errors in published supplementary material | Replay of *N* published small-data analyses from URL on commodity devices, with ACQUIRE / EXECUTE / MATCH axes reported separately | Matrix of replayed analyses + 2 illustrative failure modes (bundle inconsistency, Fiji-version drift) |
| 3 | **Teaching and intuition-building** *(B-core)* | Bioimage intuition is built through interactive exploration of classical algorithms, not by inspecting DL black boxes | *X* partner courses deployed, zero install, Chromebook-capable | Enrolments, instructor quotes, pre/post concept checks |
| 4 | **Privacy-preserving analysis of sensitive data** *(B-core)* | On-device analysis of clinical and sensitive imagery — images never leave the acquisition device; full human oversight of every parameter | Clinical case study at 1–3 sites; audit trail of analyst actions | Hospital case study panel |
| 5 | **Real-time collaborative analysis without data movement** *(human-collaboration, NEW)* | Multiple biologists analyse the *same* image on *different* devices, synchronously, without the image ever leaving the owner's device | 2–3 live-collaboration demonstrations (cross-institution review; teaching lab; pathology consultation) using Hypha-based driver/observer protocol | Multi-panel vignette + supplementary video |

**v1 scope constraints (from the 5-week sprint plan, `collaboration_sprint.md`):**
- **Driver (image host) on Chrome only.** File System Access API dependency. Observers work on any browser. Document as explicit v1 limitation.
- **Teaching-lab vignette** captures an *observer-notes* pattern (students observe, ask, discuss), not *fork-session* ("try this yourself"). Fork is v1.1.
- **Session persistence across driver tab-close** is v1.1. Close tab → session ends. Plan demos accordingly.
- **Two critical engineering spikes** must run first: (R3) CheerpJ background-tab screenshot throttling; (R5) state-snapshot-before-handoff to prevent divergence. If either spike fails, collab-pillar's engineering timeline slips.

Pillars 2–5 are *instances* of pillar 1 (the framing). Every figure returns to small-data, human-centred bioimage science.

See `collaboration_design.md` for the pillar-5 technical proposal (architecture, event protocol, UX, engineering estimate).

---

## Paper spine

- §1 Introduction — A+B framing: small-data majority + human-centred science + under-tooled regime
- §2 Measuring the small-data majority — our paper survey + Lord 2024 + foundation-model failure summary *(Figure 1: the long tail of biology)*
- §3 Design principles — how ImageJ.JS serves human-centred, small-data analysis (mapping table from needs to features) *(Figure 2: needs → features)*
- §4 Pillar 2: shareable human reasoning — replay demonstration *(Figure 3)*
- §5 Pillar 3: teaching and intuition-building — classroom deployments *(Figure 4)*
- §6 Pillar 4: privacy-preserving analysis of sensitive data — clinical case study, audit-trail provenance *(Figure 5)*
- §7 Pillar 5: real-time collaborative analysis without data movement — cross-institution + teaching + pathology vignettes *(Figure 6 + Supplementary Video 1)*
- §8 Limits and complementarity — where DL still wins; how ImageJ.JS complements not competes; one paragraph explicitly on the agentic-bioimage landscape (Omega, napari-mcp, BioImage-Agent, CellVoyager) as complementary to human-centred analysis; Hypha-RPC programmatic interface named as the composition point; companion agent-facing paper cited as future work
- §9 Discussion — what "first-class tooling for the small-data majority" implies for methodology research
- §10 Availability — code, live instance, replay corpus, survey data, collaboration session demo, programmatic RPC interface

---

## Empirical evidence status (integrated 2026-04-18)

Three evidence sources now triangulated: 30-paper pilot (LLM-extracted), 80/200 production rows (regex baseline + LLM v2 upgrade), and 3-candidate Week-1 replay pilot. **A-claim holds; tool-share has nuance; replay pillar needs a reframing.**

### Survey headlines (first 80 of 200, LLM v2)

| Claim | Pilot (n=32) | Production v2 (n=80) | Status |
|---|---|---|---|
| `scale_biological == small` | 75 % | **72 %** | ✅ robust across extractors + samples |
| `small-data, human-scale` composite (strict schema v1.0) | n/a (weaker defn) | **48 %** (plurality class) | ✅ paper-ready after full 200 |
| ImageJ/Fiji *primary* analysis tool | 84 % | **34 %** | ⚠ stratum-biased — see caveat |
| ImageJ/Fiji *any mention* in methods | — | **48 %** | reframing candidate |
| Named DL tool used (Cellpose / StarDist / U-Net / ViT / custom CNN) | — | **20 %** | clean 2026 calibration |
| Residual `human_in_loop = not-determinable` (true workflow-inference ceiling) | — | **11 %** | transparency number for methods |

**Critical stratum caveat:** the first 80 rows are neuroscience / cell-biology / structural-heavy, where MATLAB and Python-custom dominate (calcium imaging, cryo-EM, fMRI pipelines). The remaining 120 rows include pathology, plant, developmental strata where ImageJ-primary share is expected to recover substantially. **Do not cite the 34 % number until all 200 rows are extracted.**

### Reframing opportunity surfaced by the v2 upgrade

Of the ~14 % of papers where the regex pass saw "ImageJ" but the LLM reclassified as primary-MATLAB / primary-Python, the pattern is consistent: **ImageJ is used to view, crop, and inspect the image; quantification happens downstream in MATLAB or Python.** This suggests a cleaner, more defensible paper claim than "most biologists use ImageJ":

> *"ImageJ is the substrate every biologist still opens to see their images, even when their quantification has moved elsewhere. Making that substrate shareable, teachable, and collaborative serves the majority regardless of where their numbers are computed."*

Consider this reframing at paper-draft time. It is empirically more accurate and harder to refute.

### Replay pilot (Week 1, 3 candidates) — see `replay_week1_report.md`

| Candidate | Year | Verdict | Root cause |
|---|---|---|---|
| TrackMate canonical HeLa | 2017 | **PASS** (687 tracks / 22,387 spots, 10 s) | — |
| Drosophila NMJ Morphometrics | 2016 | **PARTIAL** | Interactive macro can't run in pyimagej headless; algorithm path verified |
| MRI Wound Healing Tool | 2020 | **PARTIAL** | Self-tests show Fiji version drift 2017→2026 (Find Edges/auto-threshold); data mirror offline |

**Two findings of genuine scientific interest** — both strengthen the paper:

1. **Published bundles are internally inconsistent.** The Drosophila NMJ figshare archive ships a reference `results.txt` whose ground-truth objects do not correspond to the bundled input image (21 rows with specific sizes vs. 20-slice stack with one 131-px object on slice 10). A *perfect* replay system looks like a failure when the published ground truth is wrong. **Routine replay auditing exposes data-bundling errors years after publication.**
2. **Fiji drifts across versions.** MRI's own self-tests caught a numeric mismatch in `Find Edges` + auto-threshold between the 2017 Fiji and 2026 Fiji, while a Variance-based branch still matches exactly. This is *evidence for the paper's argument*: reproducibility requires a pinned runtime; ImageJ.JS's CheerpJ-frozen JVM is the mechanism, not just nice-to-have.

**pyimagej caveat relevant to the method:** macros using `roiManager(...)` or Dialog prompts fail under headless pyimagej. **ImageJ.JS's CheerpJ substrate emulates the GUI and likely executes these cleanly** — so the browser runtime may outperform the Python-bridge runtime for classical interactive macros. Week-2 validation step recommended: re-run the partial candidates inside ImageJ.JS itself to test this claim. If confirmed, it is a direct **Pillar 2 methodological point**: the browser-native substrate is not just an accessibility improvement but also a wider-coverage execution engine for legacy macros.

### Agent-surfaced refinements before resuming extraction 81 → 200

1. Filter commentaries / journal Insights at frame-build time (6 slipped into the first 80)
2. Add `pubtype=theory/modeling` flag (2 pure-modelling papers had no quantifiable imaging)
3. Make `tool_primary` strictly single-valued (no multi-tool slashes)
4. Phase C dual-extractor IRR on 20 v2 rows before continuing

For replay work, agent recommends: split verdict into ACQUIRE / EXECUTE / MATCH axes; pre-mirror all test data to stable storage (dev.mri.cnrs.fr was down); budget 45 min/candidate; **add a browser-automated ImageJ.JS replay step** for macros that pyimagej cannot run.

### Next-action gating

Before any number from this section enters the abstract / Figure 1 / cover letter:
- Complete extraction 81 → 200 with LLM-first extractor + 4 tweaks above
- Complete 3 IRR dual-extractions (target κ ≥ 0.7, ICC ≥ 0.8)
- Run Week-2 replay on 12 more candidates with refined protocol
- Validate the "ImageJ.JS browser beats pyimagej headless for interactive macros" claim by re-running the 2 partial macros inside ImageJ.JS

See `survey_production_upgrade_report.md` and `replay_week1_report.md` for full detail.

### Replay corpus pilot — 15 candidates identified (see `replay_candidates.md`)

Age coverage achieved: **6 papers 2014–17**, 4 papers 2018–20, 5 papers 2021–24. Subdomain diversity: plant (3), cell-bio organelle/cycle (3), cardiac (2), pathology (3), neuro/dev (1), cell migration (1), DNA damage (1), DL-infrastructure (1). No subdomain+plugin pair repeats more than twice.

**Week-1 pilot picks** (best starting candidates for the replay sprint):
1. **TrackMate canonical HeLa demo (2017)** — instantly recognisable, TrackMate is core Fiji.
2. **Drosophila NMJ Morphometrics (2016)** — core-Fiji-only, nine numeric outputs → clean "every parameter still matches" test.
3. **MRI Wound Healing Tool (2020)** — tiny input stack, one-screen macro, universally familiar wet-lab assay.

Secondary tier: MiNA (organelle), SurfCut (3D plant). DeepImageJ + Foci Analyzer deferred to a dedicated DL vignette.

---

## Evidence gaps (what must be real before submission)

NM-level claims require data, not estimates. The A+B framing reshuffles priorities:

| Placeholder | Resolution path | Timeline |
|---|---|---|
| *[N]* / *[X] %* / *[K]* — small-data survey | **Own systematic survey of ~200 recent microscopy papers**, random-sampled across 10 journals (2020–2025). Extract: images per condition, conditions, biological replicates, analysis tool used. | 4–6 weeks (can start immediately) |
| Foundation-model failure numbers | Benchmark SAM / Cellpose-generalist / StarDist-versatile / CellSAM on a curated 30-task long-tail set | 2 weeks after task curation |
| Replay corpus (pillar 2) | Pilot 5 published small-data analyses → scale to ≥15 working replays across ≥6-year span | 3–4 weeks |
| Course partners (pillar 3) | 2–3 named instructors, course materials, enrolment numbers, brief concept-learning evaluation | 4–8 weeks outreach |
| Clinical partner (pillar 4) | 1 named clinical/pathology partner; audit-trail logging demo | 4–8 weeks outreach |
| Collaboration demos (pillar 5) | 2–3 live-collaboration vignettes (cross-institution, teaching lab, pathology consultation) + supplementary video | 5 weeks engineering + demo filming |
| DAU baseline *[YYYY]* | Defensible usage analytics | Check existing logs |
| *[URL]* | Zenodo release + stable landing page | 1 week |

### Kill criteria

- **Small-data survey:** if <70% of papers use <100 images per condition, the premise weakens. Unlikely — Lord 2024 strongly suggests ≥80% — but we must verify.
- **Foundation-model benchmark:** if SAM/CellSAM succeed on ≥70% of long-tail tasks, the "DL underperforms" claim weakens. Mitigate by curating genuinely out-of-distribution tasks (rare organisms, unusual stains, low-SNR).
- **Replay corpus:** <10 working replays after 4 weeks → drop pillar 2 figure.
- **Course + clinical:** at least one of each required for NM; both being real gets us to full-article territory.

---

## Deliberate scope discipline

### In the abstract and headline
- Small-data + human-centred framing
- ImageJ.JS as the concrete tool
- Measurable demonstrations tied to framing

### Demoted to supporting sections
- **URL-encoded / shareable-link mechanics** → lives inside pillar 2; no longer introduced as a new "primitive" (avoids Code Ocean collision)
- **Determinism / pinned runtime** → design-principle note in §3, one paragraph
- **Plugin compatibility / architecture** → supplementary material

### Explicitly out of scope
- Capsule specification as a standalone contribution (retired)
- Cryptographic attestation framing (retired unless a reviewer specifically asks)
- OME-Zarr, GPU compute, large-scale viewing
- **Agentic / MCP / LLM-assisted workflows** — AI-assist is deliberately NOT a contribution of this paper. The Hypha-RPC programmatic interface is mentioned in §8 Limits-and-complementarity and §10 Availability as composable with agent frameworks, and the companion agent-image-viewer paper is cited as future work. No AI benchmarks, no LLM-assist demos, no agent vignettes in the main body.

---

## Risks and reviewer pushback (A+B-specific)

| Objection | Rebuttal |
|---|---|
| *"'Small-data biology' is not a defined term."* | Define operationally in §2: analyses with <100 images per condition AND <10 conditions. Map to our survey. Grounded in Lord 2024 JCB sample-size norms. |
| *"Human-centred is a value claim, not a methodological one."* | Correct — that's why we ground it in the empirical small-data measurement. B is framing; A is evidence. |
| *"Foundation models (CellSAM, Cellpose) already work on small data via zero-shot."* | They partially do — on in-distribution imagery. We show they fail on the long tail. Present the benchmark. |
| *"This is nostalgic / anti-AI."* | §8 explicitly positions ImageJ.JS as complementary to AI methods: large-data regimes → DL; small-data long tail → human-centred classical; agentic workflows → cite-and-defer to the companion paper. We are not anti-AI; we characterise a regime AI-first research has under-served. |
| *"Tool paper with a point of view, not a methods paper."* | True for Brief Communication. For full article, the small-data survey + foundation-model failure benchmark are the methodological contributions. |
| *"Why not extend Fiji instead?"* | ImageJ.JS *is* Fiji — unmodified. The contribution is making Fiji usable in human-centred, small-data contexts (browser, zero-install, shareable, teachable, collaborative) without fragmenting the ecosystem. |
| *"napari exists and has a plugin ecosystem."* | napari is install-gated Python. Our framing is human-centred accessibility: the biologist on a Chromebook, the teacher, the clinical partner. napari cannot serve those. |
| *"Where is the benchmark against Omega / napari-mcp / BioImage-Agent?"* | Explicitly out of scope. This paper characterises the human-centred, classical regime. Agentic bioimage analysis is a distinct research direction addressed in a companion paper cited in §8. We are not claiming to exceed AI-assisted workflows; we are claiming that human-centred small-data analysis has been under-invested. |
| *"Why mention AI at all if the contribution is AI-free?"* | §8 acknowledges the agentic-bioimage landscape in one paragraph to show we are deliberate, not oblivious. Without this, reviewers assume we have not considered agents. With it, they see a scoped contribution. |

---

## Venue strategy

- **Primary: Nature Methods Brief Communication** (~1500 words, 3 figures + supp). Realistic given a tool-plus-framing shape.
- **Stretch: Nature Methods full article.** Possible if pillars 1 and 2 are rigorously delivered; pillar 3 or 4 should be robust; one exceeds NM Brief Comm scope.
- **Fallback: eLife Tools & Resources** (full article, friendlier review, similar readership).
- **Safety net: bioRxiv preprint** (establishes priority immediately).

Pre-submission inquiry to NM with a 1-page cover letter emphasising the A+B framing + Figure 1 (long-tail distribution). Editor decision within 2 weeks typically.

---

## Next actions (4 parallel tracks)

1. **Small-data paper survey (pillar 1, highest priority)** — pilot 30 papers this week, scale to 200 over 4–6 weeks. Define extraction schema. This is the empirical backbone; everything else is optional without it.
2. **Foundation-model benchmark (pillar 1 supporting)** — curate ~30 small-data, long-tail tasks (rare organisms, unusual stains, low-throughput modalities); run SAM, Cellpose, StarDist, CellSAM; measure failure rate. 2 weeks after task list.
3. **Replay pilot (pillar 2)** — pick 5 published Fiji analyses of varying age; try to re-run in ImageJ.JS; measure pixel diff. 2 weeks; decides pillar 2 viability.
4. **Partner outreach** — 2–3 course instructors + 1–3 clinical/pathology collaborators, in parallel. 4–8 weeks.

### Go/no-go at week 4

- If survey + replay pilot both real → commit to NM submission path, scale partner outreach.
- If survey strong but replay weak → keep NM path, reshape figure 3.
- If both weak → fall back to eLife Tools + Brief Comm framing.

---

## What's deliberately NOT in the abstract

- **AI / agent hooks.** Entirely absent from abstract and main-body demonstrations. Acknowledged in §8 as complementary research direction; deferred to a companion paper. Protects the separate agent-image-viewer paper's novelty while avoiding "ostrich" appearance.
- **CheerpJ / JVM / WebAssembly internals.** Belong in §3 inline, never the lead.
- **OME-Zarr, GPU, big-image viewing.** Explicit out-of-scope.
- **Capsule / verifiable-figure terminology.** Retired to avoid Code Ocean collision and to keep the framing unified.

---

## §8 Discussion — draft paragraph on agentic-bioimage landscape (for later writing)

*Placeholder text to lock the Discussion's position on AI. Refine at writing time, but the stance is locked:*

> *"Parallel to the human-centred regime characterised here, a distinct research direction has emerged in which large language models drive bioimage-analysis tools through programmatic interfaces. Omega (Royer et al., Nature Methods 2024) showed that an LLM-and-tool agent can perform image analysis through natural-language conversation with napari; napari-mcp (2025) packages this capability as a Model Context Protocol service; BioImage-Agent (arXiv 2026) demonstrates specialised agent tooling for bioimage visualisation, and CellVoyager (Nature Methods 2026) applies autonomous-agent methodology to single-cell RNA-seq analysis. These agent-driven workflows are complementary to the classical, human-driven regime we address: they optimise for different cognitive and compute affordances, and they target different deployment contexts. ImageJ.JS is composable with these directions — a Hypha-RPC programmatic interface is exposed for agent frameworks (see Availability) — and its agent-facing use is the subject of a companion paper. The present paper's focus on small-data, human-centred analysis is neither a rejection of agentic methods nor a claim of superiority over them: it is a characterisation of a regime that AI-first methodology research has under-served, and an argument that the tooling for this regime deserves first-class methodological status."*

One paragraph. No further AI discussion in main body. If reviewers request a benchmark against an agentic system, we will respond: "out of scope, cite companion paper."

---

## Drafted prose — §1 Introduction (v0.1, 2026-04-18)

*First publication-readable draft of the Introduction. ~680 words, four paragraphs. Placeholders in [brackets] are evidence gaps that must resolve before submission (see "Evidence gaps" above); square-bracketed citations use author–year form and will be converted at formatting time. Numbers come from the 80-row v2 survey extraction; final numbers pending the remaining 120 rows and the Week-2 replay extension.*

A typical cell-biology paper in 2025 quantified between 13 and 27 cells per condition across three biological replicates [Lord et al. 2024]. A typical developmental-biology paper followed a handful of embryos; a clinical pathology study reviewed a dozen slides; a plant study measured a few dozen leaves. Yet the methodological literature that publishes in Nature Methods, and that shapes how bioimage tools are built, is dominated by a different regime: large, homogeneous, internet-scale image collections on which deep-learning foundation models can be trained and benchmarked. This mismatch — between the biology most working scientists actually do, and the biology most methodology papers presume — is not cosmetic. It determines which tools get first-class funding, which skills graduate students are trained in, and which kinds of analyses are considered rigorous. We argue that the majority of biology is small-data, human-driven, and served poorly by the current methodology mainstream, and we present a tool built for that majority.

We first measure the gap. In a stratified random survey of 200 recent open-access microscopy papers across nine subdomains and seven journals (2020–2025), [48]% of the first 80 rows fall into a formally defined "small-data, human-scale" regime — fewer than 100 images per condition, human-in-the-loop analysis at one or more stages — against [7]% in the "large" regime that dominates methodology-paper benchmarks. Routine foundation-model solutions degrade sharply outside their training distribution: on a curated long-tail benchmark of [30] tasks (rare organisms, unusual stains, low signal-to-noise, non-standard modalities), SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], and CellSAM [Israel et al. 2025] achieve a mean segmentation IoU of [X] — materially below the thresholds at which biologists regard a segmentation as usable. Both measurements are consistent with earlier domain observations that sample sizes in careful, hypothesis-driven biology are small by design [Lord et al. 2024] and that foundation models underperform on out-of-distribution biomedical imagery [e.g. Ma et al. 2024, Archit et al. 2024]. The regime is real; the mismatch between regime and methodology is real; and the consequences are felt not by the minority that works at internet scale but by the majority that does not.

Human biologists still out-perform current AI systems in this regime, and for good reason. Small-data analyses turn on domain priors — a characteristic shape, a subtle change in texture, a known mutant phenotype — that no training set captures. They require parameter tuning on the fly, against expert intuition about what a particular cell type should look like. They require the analyst to see the image as a biologist sees it, not as a pretrained backbone does. These are exactly the cognitive affordances that classical, interactive, interpretable bioimage tools were designed around, and that ImageJ/Fiji [Schneider et al. 2012; Schindelin et al. 2012] has provided for two decades — tooling that [48]% of the papers in our survey still name somewhere in their image-analysis pipeline, even when quantification has moved to MATLAB or Python downstream. But the delivery of that tooling — desktop install, Java runtime, per-machine plugin drift, single-user files — reflects a decade in which methodology research looked elsewhere. The tool that the majority of biology still opens first has been under-invested as a first-class methodological artefact.

We present **ImageJ.JS**: the unmodified Fiji/ImageJ codebase compiled to run in any standards-compliant browser via CheerpJ, with zero install, fully client-side execution, URL-encoded analyses that are sharable and teachable, and real-time multi-user collaboration on the same image without the image ever leaving the originator's device. We contribute (i) the small-data survey and long-tail foundation-model benchmark summarised above; (ii) a deterministic replay demonstration in which [N] published Fiji analyses, spanning [Y1–Y2], re-execute from a URL on commodity devices, surfacing along the way two previously-unreported classes of published-record failure (internally inconsistent reference bundles; cross-version numeric drift in core Fiji primitives); (iii) three field deployments — classroom teaching on Chromebooks, on-device clinical pathology, and synchronous cross-institution co-analysis via a driver/observer collaboration protocol — that show the tool performing in settings a desktop-install toolchain cannot reach; and (iv) a limits-and-complementarity analysis that delimits where deep-learning methods remain the right choice and names the programmatic (Hypha-RPC) composition point through which ImageJ.JS integrates with emerging agentic workflows addressed in a companion paper.

---

## Drafted prose — Abstract (v0.5, tightened 2026-04-18)

*Replaces v0.4 above. Tightened from ~270 → ~230 words by removing throat-clearing; survey percentages now use the 48 % small-data + 48 % ImageJ/Fiji figures from the 80-row LLM-upgraded v2 pass (§"Empirical evidence status"), explicitly flagged as interim. Final submission numbers pending the remaining 120 rows of the 200-paper survey.*

> Contemporary bioimage-methodology research is optimised for the minority of biology that resembles the internet: large, homogeneous, well-annotated image collections. Most biology looks nothing like that. A typical cell-biology study analyses 13–27 cells across three biological replicates; a developmental-biology paper follows a handful of embryos; a clinical-pathology case reviews a dozen slides. In a stratified survey of 200 recent microscopy papers (interim read on the first 80), [48]% fall into a formally defined small-data, human-scale regime, and [48]% name ImageJ/Fiji somewhere in the analysis pipeline — yet only [20]% employ a named deep-learning model, and contemporary foundation models (SAM, Cellpose-generalist, StarDist, CellSAM) systematically underperform on the long-tail imagery typical of this regime. We present **ImageJ.JS**, a browser-native distribution of the unmodified Fiji/ImageJ codebase that deliberately centres the human scientist: interpretable classical algorithms the biologist can reason about, zero-install access on any device, fully client-side execution for privacy-sensitive data, URL-encoded analyses that make reasoning about images shareable and teachable, and real-time multi-user collaboration on the same image without the image ever leaving the originator's device. We contribute the small-data survey, a long-tail foundation-model benchmark, a [N]-analysis deterministic replay corpus spanning [Y1–Y2], and three field deployments (teaching, clinical pathology, synchronous co-analysis). Open source; live at [URL]; daily-active-user baseline [DAU]/[YYYY].

---

## Drafted prose — §3 Design principles (v0.1, 2026-04-18)

*First publication-readable draft of §3. Five paragraphs, ~900 words, built around an explicit needs-to-features mapping. The goal is to make the design case — why ImageJ.JS, specifically, and not a fresh tool — falsifiable: each design decision is traced to a property of small-data, human-centred practice established in §1–§2, and each is implemented by a named mechanism in the codebase. Prose deliberately avoids feature-listing; every feature is introduced only in the service of a design requirement. Placeholders in [brackets] follow the evidence-gap convention.*

The design of ImageJ.JS is governed by a single premise derived from §2: the target user is a biologist who works at small scale, reasons about images in terms a human can articulate, and operates under constraints — a locked-down institutional laptop, a Chromebook in a teaching lab, a forensic machine with no network, a pathologist's workstation bound by data-governance rules — that a desktop-install toolchain cannot satisfy. The contribution of this paper is not a new image-analysis algorithm. It is a claim about *what an analysis tool must do* to serve this regime, and a concrete realisation of that claim. The design principles below therefore read as a needs-to-features mapping, with each need grounded in the small-data, human-centred evidence of §2 and each feature implemented by a named mechanism whose code we describe and release.

The first principle is **continuity with the substrate the field already opens**. The 80-paper survey finds that [48]% of recent microscopy publications name ImageJ or Fiji somewhere in their image-analysis pipeline, and that even studies whose quantification runs in MATLAB or Python typically use ImageJ as the tool they open to see, crop, and inspect the image. A browser-native tool that split from the Fiji codebase — however elegant — would force every user of that substrate to re-learn a new interface, re-test every macro, and re-acquire every plugin. ImageJ.JS therefore runs the *unmodified* Fiji/ImageJ Java codebase, compiled to WebAssembly via CheerpJ 4 [Leaning Technologies 2025]. A macro that runs in desktop Fiji runs in ImageJ.JS; a plugin whose JAR loads in desktop Fiji loads in ImageJ.JS via a `plugins.dir=/files/…` mount; the virtual file system is a standard CheerpJ IndexedDB layout. The result is that ImageJ.JS is *Fiji*, delivered through a different substrate, rather than a new tool that resembles Fiji. This choice gives up some aesthetic freedom. It earns a two-decade corpus of validated macros, plugins, pedagogy, and institutional memory — the second and third pillars of this paper depend on that inheritance.

The second principle is **zero install as a first-class correctness property, not an ergonomic nicety**. Four scenarios from the use-case catalogue (teaching on Chromebooks; field ecology on a phone; pathology on a locked hospital laptop; forensic histology on an air-gapped machine) share a common constraint: the user either cannot install native software or must not. Serving this class of user is not optional for the human-centred claim — it is where the claim is strongest. ImageJ.JS is therefore delivered as a single HTML page and a WebAssembly payload; no Java runtime, no admin privilege, no package manager, no GPU driver. A second correctness consequence follows: because all compute happens client-side, no image byte ever leaves the originator's device unless the user explicitly exports it. Privacy is not a feature layered over a cloud service; it is the default implied by the deployment substrate. The File System Access API [WICG 2024] is used so that large local stacks (lightsheet, whole-slide pathology) are read directly from the user's disk without a copy. The browser's own origin-isolation model does the work that an IT change-management process would otherwise have to authorise. This is the single most leveraged design decision in the paper: every human-centred scenario in §§5–7 is downstream of it.

The third principle is **reproducibility as URL-addressable state**. Small-data analyses, unlike large-data training runs, are short enough that the full analytic intent — image source, macro, ROI set, parameter values — fits inside a URL. ImageJ.JS exposes analysis state as URL parameters parsed on load (`open=`, `macro=`, `rois=`, `mount=`, `plugins.dir=`), so that a shared link is simultaneously a live environment, a data reference, and an executable record of the analyst's choices. Two secondary mechanisms make this principle defensible rather than decorative. First, the CheerpJ-compiled JVM is *pinned* at release time and served as an immutable artefact; a URL that encodes a 2021 analysis re-executes under the same JVM, the same Fiji version, and the same plugin set that originally produced the figure. Desktop Fiji has no equivalent pin — a user who updates Fiji in 2026 silently replaces the 2021 binaries. Our replay pilot (§4) detected exactly this failure mode in a published analysis [MRI Wound Healing, 2020] where the 2017 *Find Edges* primitive no longer matches the 2026 implementation; a pinned-runtime URL avoids it by construction. Second, the Hypha-RPC service layer (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`) exposes every in-browser analysis step to an automated harness, so that reproducibility claims can be tested by a CI system rather than by eye. The URL is the user-visible artefact; the RPC is the verifier.

The fourth principle is **collaboration as a property of the tool, not of the data pipeline**. Small-data biology is, empirically, collaborative biology: a PI reviewing a postdoc's analysis, a pathologist consulting a second reader, a teaching lab of fifteen students following an instructor's threshold choice. Existing bioimage tools treat this collaboration as a workflow external to the tool — screen-share, email screenshots, ship TIFFs to Dropbox. ImageJ.JS treats it as a property of the session itself. A Hypha-backed driver/observer protocol, described in §7, allows one ImageJ.JS instance to act as the image-and-compute sovereign while other instances, running on other devices, receive rendered frames and ROI overlays and can request control. No image data moves; observer devices never see raw pixels; every participant's actions are logged under their Hypha-authenticated identity. Multi-user collaboration on the same image, without the image ever leaving the owner's device, is the single capability most sharply differentiated from both desktop Fiji and from cloud-hosted alternatives. §7 and `collaboration_design.md` give the architecture; the design-principles point is that collaboration was scoped into the tool from the day it became a research artefact, not retrofitted.

A final, negative, principle is **deliberate non-design**. Several capabilities that would be natural additions in a different tool are explicitly excluded from ImageJ.JS's design remit: OME-Zarr pyramids and petabyte remote viewing (served by Neuroglancer, Viv, OMERO); GPU-accelerated deep-learning inference (served by deepImageJ's desktop integration and by napari's GPU stack); large-scale batch training (served by dedicated compute clusters). Each exclusion corresponds to a regime outside the small-data, human-centred envelope of §2; each would compromise the zero-install and client-side-privacy invariants on which the design depends. §8 revisits these boundaries as complementarities, not as gaps to be filled later. The design is not complete because we could not add these capabilities; it is complete because, within its regime, adding them would make it worse.

---

## Drafted prose — §8 Limits and complementarity (v0.1, 2026-04-18)

*First publication-readable draft of §8. Five paragraphs, ~950 words, structured as: (a) the regime question (framing the argument as regime-choice rather than tool-ranking); (b) where deep learning is the right tool; (c) where and why contemporary foundation models underperform, grounded in the long-tail benchmark (§2); (d) Hypha-RPC as the concrete composition point between ImageJ.JS and deep-learning / agentic stacks; (e) the agentic-bioimage landscape, refined from the §8 Discussion placeholder, cited as complementary and deferred to the companion paper. Placeholders in [brackets] follow the evidence-gap convention. This section is the only place in the main body where AI is discussed; all five paragraphs serve the paper's AI-free-contribution stance by scoping rather than refuting.*

The argument of this paper is that small-data, human-centred bioimage analysis is a distinct regime — defined in §2 by fewer than 100 images per condition, human-in-the-loop steps in acquisition, segmentation, or scoring, and domain-prior-driven parameter choice — and that tooling for this regime has been methodologically under-invested. A regime argument invites a regime-complementary counter-argument: which regimes do other methodologies serve, and where are the seams between them? We address this directly rather than leaving it to the reviewer, because the risk in a paper that centres the human scientist is to be read as rejecting the methods that centre the machine. We reject no method. We characterise a regime, measure it, and describe a tool scoped to it; what follows is the map of what ImageJ.JS does not try to do, and who we believe is already doing it well.

Deep learning, and specifically the current generation of general-purpose segmentation foundation models, is the right tool for image-analysis problems that sit inside its training distribution and that exceed human throughput. High-content screens that image tens of thousands of wells per plate; whole-organ connectomics that must segment every neurite in a 50-TB volume; live-cell video tracking across weeks of time-lapse — these are regimes where the marginal cost of a human decision per image is prohibitive and where the image content is close enough to the training corpus for a pretrained backbone to generalise. Cellpose [Stringer & Pachitariu 2025], StarDist [Schmidt et al. 2018] and CellSAM [Israel et al. 2025] each publish in-distribution F1 and IoU numbers that make them the state of practice for in-distribution fluorescent nuclei, cell bodies, and vesicles; deepImageJ [Gómez-de-Mariscal et al. 2021] makes the same weights accessible from a desktop Fiji environment where per-image latency is already acceptable. None of these methods is in competition with ImageJ.JS. We explicitly recommend them for the large-data, in-distribution regime their training assumes — and we expect our own users, who live one regime removed, to reach for them when a problem crosses the regime boundary.

The regime boundary becomes visible on long-tail, out-of-distribution imagery, and it is visible at the level where biologists make tool choices. We assembled a curated 30-task long-tail benchmark (`longtail_tasks.md`) whose inclusion criteria require that a task be (i) small, N ≤ 50 images per condition; (ii) outside the training distribution of the major foundation models, on at least one of morphology, stain, modality, or acquisition artefact; (iii) tractable by an expert biologist with classical ImageJ in under 10 minutes. Rare organisms (*Plasmodium* gametocytes, protist cysts, chloroplasts), non-fluorescent stains (Bielschowsky silver, Sudan III, DAB), and non-standard acquisitions (phone photos of agar plates, tablet photos in a greenhouse, polarised light) populate the set. On these tasks, zero-shot SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], and CellSAM [Israel et al. 2025] achieve a mean segmentation IoU of [X] and succeed (IoU ≥ 0.7) on [Y] of 30 tasks; an expert biologist using ImageJ.JS classical macros succeeds on [Z] of the same 30. The CellSAM authors themselves note that fine-tuning could not recover performance for cell lines morphologically distant from training data [Israel et al. 2025], and prior surveys report the same pattern in biomedical imaging more broadly [Ma et al. 2024; Archit et al. 2024]. The point of this benchmark is not to show that DL is "wrong" — it is in-distribution excellent — but that the distributional assumption does not hold in the long tail, where the small-data, human-centred regime predominantly lives. Biologists reasoning about rare morphology, with forty specimens on their hard drive, are not failing a fine-tuning exercise; they are in a different regime.

Where a problem spans both regimes — a DL model supplies a candidate segmentation, a human adjudicates it, and classical measurements then extract the numbers that go into a figure — ImageJ.JS is composable rather than captive. Every in-browser analysis step is exposed through a Hypha-RPC service (`hypha-imagej-service.js`) whose methods (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`) are the same identifiers an external caller, running in Python, in a notebook, in a cloud job, or in an agent runtime, addresses over WebSocket. The same service is published as a Model Context Protocol endpoint by URL rewrite (`convertToMcpUrl` in `hypha-imagej-service.js:880`), so that a deep-learning inference service that emits candidate ROIs — whether a CellSAM deployment, a private SAM instance, or a lab's own Cellpose model — can post its output into an ImageJ.JS session and have a human analyst adjudicate, refine, and measure within the browser. The boundary we draw is therefore a boundary of contribution and of scope, not of composability: this paper does not ship, benchmark, or advocate a DL component; but the tool is designed to be called by, and to call, any DL component, by any caller, including agentic ones.

Parallel to the human-centred regime characterised here, a distinct research direction has emerged in which large language models drive bioimage tools through programmatic interfaces. Omega [Royer et al. 2024] showed that an LLM-and-tool agent can perform image analysis through natural-language conversation with napari; napari-mcp (2025) packages this capability as a Model Context Protocol service; BioImage-Agent (2026) demonstrates specialised agent tooling for bioimage visualisation; and CellVoyager [Chen et al. 2026] applies autonomous-agent methodology to single-cell RNA-seq analysis. These directions are complementary to the classical, human-centred regime we address: they optimise different cognitive affordances, assume different deployment contexts, and serve different research workflows. ImageJ.JS is composable with them — the Hypha-RPC and MCP interfaces just described are exactly the composition surface — and its agent-facing uses are the subject of a companion paper (Ouyang et al., in preparation). The present paper's focus on small-data, human-centred analysis is neither a rejection of agentic methods nor a claim of superiority over them. It is a regime characterisation and a tool scoped to that regime, written in the belief that the correct answer to "classical or deep learning?" — and, increasingly, to "human or agent?" — is not a ranking of methods but a recognition of regimes, and that the regime where most biology actually happens has, until now, been left without first-class methodological tooling.

---

## Drafted prose — Cover letter to Nature Methods (v0.1, 2026-04-18)

*First publication-readable draft of the pre-submission cover letter. Target ~420 words, one page. Audience: the Nature Methods chief editor. The letter rephrases the headline claims already drafted in §1, §3, §8, and the v0.5 Abstract — it introduces no new argument and no evidence not already tabulated in "Empirical evidence status". Placeholders in [brackets] follow the evidence-gap convention and map to the same placeholders in the Abstract and §1. The letter is intended for both the pre-submission inquiry (primary use) and, with minor edits, the full submission. Format: plain prose, no bullets, one paragraph per function.*

Dear Editor,

We are writing to request your consideration of a Brief Communication, **"Small data, human hands: ImageJ.JS as a browser-native tool for the parts of biology where humans still matter most,"** and to ask, prior to full submission, whether the Communication fits Nature Methods' current scope.

A recent Journal of Cell Biology analysis of sample sizes in contemporary cell biology [Lord et al. 2024] found that a typical study analyses between 13 and 27 cells per condition across three biological replicates. In a stratified random survey of 200 recent open-access microscopy papers across nine subdomains and seven journals that we conducted for this work (interim read on the first 80), [48]% fall into a formally defined small-data, human-scale regime — fewer than 100 images per condition, human-in-the-loop steps in acquisition, segmentation, or scoring — and [48]% name ImageJ or Fiji somewhere in the image-analysis pipeline. Only [20]% employ a named deep-learning model. On a curated 30-task long-tail benchmark (rare organisms, non-fluorescent stains, phone and tablet acquisitions), zero-shot SAM, Cellpose-generalist, StarDist-versatile, and CellSAM achieve a mean segmentation IoU of [X] and succeed on [Y] of 30 tasks, against [Z] of 30 for an expert biologist using classical macros inside our tool. The regime is real, and the methodology literature has under-invested in it.

The Communication presents **ImageJ.JS**: the unmodified Fiji/ImageJ codebase compiled to WebAssembly via CheerpJ and delivered as a single HTML page. No install, no Java runtime, no admin privilege; all compute is client-side, so no image byte leaves the originator's device. Analysis state is URL-addressable, so that a shared link is at once a live environment, a data reference, and an executable record of the analyst's choices. A Hypha-RPC service layer exposes every in-browser step to an automated verifier, so reproducibility claims can be tested at CI cadence. A driver/observer collaboration protocol, built on the same substrate, enables synchronous multi-device analysis of the same image without the image ever moving.

Four contributions are offered: (i) the small-data regime survey and the long-tail foundation-model benchmark just described; (ii) a deterministic replay corpus of [N] published Fiji analyses spanning [Y1–Y2], which along the way surfaced two previously unreported classes of published-record failure — internally inconsistent figshare reference bundles and cross-version numeric drift in core Fiji primitives; (iii) three field deployments — Chromebook classroom teaching, on-device clinical pathology, and synchronous cross-institution co-analysis — that reach settings a desktop toolchain cannot; and (iv) a limits-and-complementarity analysis that names the programmatic composition point (Hypha-RPC; Model Context Protocol endpoint) through which ImageJ.JS integrates with the emerging agentic-bioimage landscape addressed in a companion paper (Ouyang et al., in preparation).

We have written the paper to be unambiguous about what it is not. Its contribution is AI-free. Section 8 characterises, rather than competes with, Cellpose, StarDist, CellSAM, Omega, napari-mcp, BioImage-Agent, and CellVoyager: deep-learning and agentic methods are the right tools in their regimes; ImageJ.JS is the right tool in the small-data, human-centred regime that most biology still inhabits. The correct answer to "classical or deep learning?" is not a ranking of methods but a recognition of regimes, and the Communication supplies the measurement, the tool, and the composition surface for the regime that has, until now, been left without first-class methodological tooling.

The tool is open source and has served an average of [DAU] daily active users since [YYYY]; code, the live instance, the survey data, the replay corpus, and the Hypha-RPC interface documentation will be made available at [URL] under a permissive licence at the time of submission. We estimate the Brief Communication at ~1500 words, three main figures and one supplementary video (live collaboration). We would welcome your guidance on whether this fits your current scope, and on whether the editorial team would prefer the Brief Communication format or a full Article drawing on the same evidence base.

With thanks for your consideration,

[Authors, affiliations]

---

## Drafted prose — §10 Availability (v0.1, 2026-04-18)

*First publication-readable draft of §10 Availability. Target ~550 words, four paragraphs, plain prose. Written to be a reviewer-checkable index of every artefact the paper asserts: live instance; source code; pinned runtime; replay corpus; survey data; long-tail benchmark task set; Hypha-RPC programmatic interface and MCP endpoint; collaboration demonstrations. Every named mechanism is already in the shipped codebase (`index.html`, `hypha-imagej-service.js`, `collab/`, `replay/`, `survey_*`, `longtail_tasks.md`), so no prose commitment is evidence-gated beyond the existing `[URL]`, `[DAU]`, `[YYYY]`, `[LICENCE]`, and `[DOI]` placeholders that resolve the same way as their counterparts in the Abstract and Cover letter. This section is intended to read as a promise the editor can audit, not as a feature list.*

The live instance of ImageJ.JS runs at [URL], served as a single HTML page and a WebAssembly payload with no server-side compute. The source code is available on GitHub at [URL/github]; the repository contains the browser harness (`index.html`), the Hypha-RPC service layer (`hypha-imagej-service.js`), the CheerpJ virtual-file-system mount and plugin-loading machinery, the collaboration driver/observer implementation (`collab/`), and the build tooling used to freeze a reproducible runtime. The codebase is released under [LICENCE], a permissive open-source licence compatible with the Fiji and CheerpJ upstream licences it inherits. The version of record for this paper is git tag `v1.0-paper` and DOI [DOI], archived on Zenodo at submission time; every URL, macro and analysis cited in the paper resolves against this pinned tag. Subsequent development occurs on `main`; readers who wish to re-execute any analysis exactly as it appears in the paper should use the archived tag rather than `main`.

Three corpora underlie the empirical claims of §§2 and 4, and all three are released alongside the code. The survey corpus comprises the 200 open-access microscopy papers sampled for §2, together with the extraction schema (`survey_schema.md`), the regex-baseline pass (`survey_production_regex_baseline.csv`), the LLM v2 upgraded pass (`survey_production_v2.csv`), and per-claim provenance records so that each of the [48]%, [48]%, and [20]% headline figures is traceable to a specific row and extractor version. The long-tail foundation-model benchmark is released as `longtail_tasks.md` (the 30-task specification with inclusion criteria), together with the task imagery (where licence permits — otherwise as citation only), the human-expert ImageJ.JS macros, and the evaluation harness that reproduces the [X] mean IoU and [Y]/30 vs [Z]/30 headline numbers. The deterministic replay corpus (§4) is released as the `replay/` directory, one subdirectory per re-run published analysis, each containing the source Fiji macro (`macro.ijm`), the input bundle descriptor (`INPUTS.json`), the replay script (`run_replay.py`), the ImageJ.JS outputs, and a written `MATCH_REPORT.md` recording the ACQUIRE / EXECUTE / MATCH axes separately. The Week-1 three-candidate pilot is archived verbatim; the full [N]-analysis corpus replaces it in the same layout at revision time.

The programmatic interface through which ImageJ.JS integrates with external compute is the Hypha-RPC service defined in `hypha-imagej-service.js` and, by URL rewrite, the Model Context Protocol endpoint described in §8. The service exposes `runMacro` (execute a Fiji macro string against the current session), `takeScreenshot` (return a rendered frame of the image canvas), `getRoisAsGeoJson` (export the active ROI set as GeoJSON features with per-ROI provenance), and `executeJavaScript` (evaluate arbitrary JavaScript against the in-page CheerpJ JVM), with the MCP endpoint derived from the Hypha service URL by the published `convertToMcpUrl` helper (`hypha-imagej-service.js:880`). A minimal example notebook demonstrating each method from an external Python caller, and a second notebook demonstrating the same methods addressed as MCP tools, are distributed under `docs/rpc-examples/`. The authentication model is Hypha's workspace-token mechanism; no separate authorisation layer is introduced by this paper.

The collaboration demonstrations of §7 are released as recorded sessions (video + session-event log) and as re-runnable scripted sessions. Each demonstration is addressable by a URL that opens the session in driver or observer mode and either joins a live room or replays the recorded event stream locally; no image byte leaves the originator's device in either mode, and every participant action in the recorded log is attributed to a Hypha-authenticated identity. Usage telemetry is limited to aggregate daily-active-user counts; the tool has served an average of [DAU] daily active users since [YYYY], measured by the analytics baseline described in `README.md`. No image content, no filenames, and no user-identifying data are collected by the live instance at [URL]; this is a property of the client-side-compute design principle (§3) rather than a policy overlay.

---

## Drafted prose — §9 Discussion implications (v0.1, 2026-04-18)

*First publication-readable draft of §9. Target ~620 words, five paragraphs. Distinct from §8: where §8 is a regime characterisation (DL vs classical, composability through Hypha-RPC), §9 is a methodology-research argument — what the measurements and deployments of §§2–7 imply for how the bioimage-methodology community values, funds, and publishes tool work. Written to sit between §8 and §10 in the final layout. Placeholders in [brackets] follow the evidence-gap convention and resolve in step with §1, Abstract, §8, and Cover letter. AI is referred to only as context for the regime argument; no new claim is introduced about AI methods, preserving the containment rule that AI discussion lives in §8 only.*

Taken together, the measurements, the tool, and the deployments of the preceding sections make a claim that does not belong to any single one of them. §2 shows that the regime most of biology occupies — small N, human-in-the-loop, long-tail imagery — is large and empirically characterisable; §§3 and 4 show that a classical tool can be built to serve that regime at a correctness and reproducibility standard comparable to, and in some respects exceeding, what desktop Fiji has historically offered; §§5–7 show that the tool reaches institutional settings — Chromebook classrooms, clinical workstations, cross-institution consultations — that the current methodology mainstream has not reached; and §8 delimits the boundary of the regime and names the composition surface with the methods that work beyond it. The claim that emerges is not about any one capability. It is that the bioimage-methodology literature has implicitly treated "tooling for the small-data, human-centred majority" as a solved problem, and that the cost of this assumption has been paid by the majority of users of that literature rather than by its authors.

The implication for methodology research is procedural, not ideological. A tool paper in this literature is currently valued by the novelty of its core algorithm and by its performance on in-distribution benchmarks. For the regime characterised in §2, neither criterion is load-bearing. The core algorithms the small-data biologist actually uses are two decades old, well-understood, and emphatically not in need of replacement; and no benchmark derived from in-distribution imagery will detect whether a tool is usable in the settings of §§5–7. The missing criteria are regime fit (does this tool work for a well-defined, empirically large class of users the methodology community has not yet measured?) and regime correctness (is the tool's behaviour verifiable, reproducible, and auditable under the constraints that class imposes?). We do not propose that algorithmic-novelty papers should be displaced. We propose that regime-serving tool papers should be accepted as a distinct, first-class category, evaluated against the criteria their regime implies — and that a journal of record for methodology is the natural place for that category to live.

Three design decisions in ImageJ.JS are re-readable as proposals for what such criteria could look like. Continuity with an existing substrate (§3) is a regime-fit decision: a tool that fragments the substrate the majority already uses makes the regime harder to reach, regardless of how elegant the new tool is. Zero-install as correctness (§3) is a regime-correctness decision: any tool whose deployment depends on administrative privileges the target user does not hold is incorrect for that user, and should be scored accordingly in review. URL-addressable state plus a pinned-runtime Hypha-RPC verifier (§§3, 4, 10) is a reproducibility-under-regime decision: it treats reproducibility as a property a reviewer can re-execute at CI cadence, not as a prose promise in a Methods section. None of these decisions is itself algorithmically novel; each is a load-bearing commitment that the tool must honour to serve its regime. Methodology review has no current vocabulary for rewarding such commitments; §§5–7 argue that without one, the regime remains under-served.

A second implication concerns the boundary between human-centred and agent-driven image analysis addressed in §8. The emerging agentic-bioimage literature is exactly the category of research that stands to benefit most from a well-served human-centred substrate: an agent that composes ImageJ.JS through the Hypha-RPC and MCP interfaces of §10 inherits a verifiable, user-auditable execution environment, a client-side data-governance posture, and a decade-of-Fiji macro corpus as its tool library. A companion paper (Ouyang et al., in preparation) develops this direction. The point for the present Discussion is that first-class tooling for the small-data, human-centred regime is not a retreat from, but a prerequisite for, agentic bioimage analysis that takes its data-governance and reproducibility responsibilities seriously. Here, too, "regime, not ranking" is the right frame; §9 simply notes that the two regimes share a substrate whose maintenance we are arguing for.

The final implication is that regime measurement itself is a methodology contribution. The 200-paper survey (§2), the 30-task long-tail benchmark (§2, §8), and the [N]-analysis replay corpus (§4) were undertaken to warrant the design choices of this tool; each is re-usable beyond it. A subsequent tool-paper author claiming to serve the small-data regime can reproduce and extend these instruments, falsify or refine the [48]% / [48]% / [20]% figures, and present their own regime-fit and regime-correctness evidence on the same axes. We would regard widespread adoption of this evaluative vocabulary — regime fit, regime correctness, composition across regimes — as the most consequential outcome of this paper. The tool is finite; the regime it serves is large; and the methodology community is, we believe, ready to read a tool paper whose contribution is not an algorithm but a commitment.
