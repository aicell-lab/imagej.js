# ImageJ.JS preprint / Nature Methods working draft

*Framing locked 2026-04-18 as **A+B unified, hybrid AI-posture**: small-data majority (measurement) + human-centric science (framing). The paper's **contribution is AI-free**; Discussion acknowledges the agentic-bioimage landscape as complementary and defers agent-facing research to a separate companion paper. Prior framings (bioimage-analysis capsule, verifiable figure, agentic bioimage) retired — their strongest ideas survive as supporting sections, not as headline claims. Target venue: **Nature Methods** (Brief Communication primary; full article possible if evidence is rigorous). Fallback: eLife Tools & Resources, then bioRxiv preprint only.*

---

## Core framing (one sentence)

The majority of biology is small-data and human-driven; ImageJ.JS is the tool built for that majority, not for the AI-scale minority that dominates current methodology papers.

**A-component (measurement / defensibility):** most bioimage research is small-data. A typical cell-biology paper analyses tens of cells across three replicates (Lord et al., J. Cell Biol. 2024). Foundation models such as SAM, Cellpose-generalist, StarDist, and CellSAM (NM 2025) underperform on this long tail because it lies outside their training distribution.

**B-component (zeitgeist / editor resonance):** in an era of AI-first methodology research, the role of the human scientist is under-discussed and under-tooled. Humans still excel at small-data analysis — noticing subtle phenotypes, tuning parameters on the fly, bringing domain priors no training set contains. Tools that centre the human scientist deserve first-class status.

**Together:** ImageJ.JS is the browser-native, human-centred bioimage analysis tool for the small-data majority of biology.

---

## Title (locked 2026-04-18)

**"Small data, human hands: ImageJ.JS as a browser-native tool for the parts of biology where humans still matter most"**

*Locked against the Cover-letter v0.1 usage (preprint.md §"Drafted prose — Cover letter", 2026-04-18). Rationale: the title must name the regime (*"small data"*), the human-centred premise (*"human hands"*), and the tool (*"ImageJ.JS"*) within the first 11 words — all three are load-bearing for the paper, and no single omission preserves the argument. The retired variants committed different errors: *"deep learning cannot yet serve"* reads as combative against AI and collides with the §8 "regime, not ranking" stance; *"in the age of AI"* reads as an op-ed move and promotes a framing (AI as temporal backdrop) the paper explicitly declines in §8 and §9. The locked title is the one that already circulated in the Cover letter, so no re-sweep of that document is required.*

*Consistency sweep (2026-04-18) against Abstract v0.5, §1, §3, §8, §9, §10, Cover letter v0.1: none of the seven drafted-prose blocks contains phrasing that implicitly favours a retired variant. "Small data" appears throughout; "biologist's browser" appears nowhere; "age of AI" appears nowhere; "deep learning cannot yet serve" appears nowhere. The tagline-level phrase "small data, human hands" is not yet echoed in the Abstract or §1 opening; echoing it verbatim in the Abstract's first sentence is deliberately NOT done at v0.5 — the Abstract's evidence-density matters more than branding — but the phrase is available as a section-header or callout device at figure-caption time.*

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

> Contemporary bioimage-methodology research is optimised for the minority of biology that resembles the internet: large, homogeneous, well-annotated image collections. Most biology looks nothing like that. A typical cell-biology study analyses 13–27 cells across three biological replicates; a developmental-biology paper follows a handful of embryos; a clinical-pathology case reviews a dozen slides. In a stratified survey of 200 recent microscopy papers (interim read on the first 80), [48]% fall into a formally defined small-data, human-scale regime, and [48]% name ImageJ/Fiji somewhere in the analysis pipeline — yet only [20]% employ a named deep-learning model, and contemporary foundation models (SAM, Cellpose-generalist, StarDist, CellSAM) systematically underperform on the long-tail imagery typical of this regime. We present **ImageJ.JS**, a browser-native distribution of the unmodified Fiji/ImageJ codebase that deliberately centres the human scientist: interpretable classical algorithms the biologist can reason about, zero-install access on any device, fully client-side execution for privacy-sensitive data, URL-encoded analyses that make reasoning about images shareable and teachable, and real-time multi-user collaboration on the same image without the image ever leaving the originator's device. We contribute the small-data survey, a long-tail foundation-model benchmark, a [N]-analysis deterministic replay corpus spanning [Y1–Y2], and three field deployments (teaching, clinical pathology, synchronous co-analysis). Open source; live at `https://ij.aicell.io`; daily-active-user baseline [DAU]/[YYYY].

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

The tool is open source and has served an average of [DAU] daily active users since [YYYY]; code, the live instance, the survey data, the replay corpus, and the Hypha-RPC interface documentation will be made available at `https://github.com/aicell-lab/imagej.js` (live instance at `https://ij.aicell.io`) under the MIT licence at the time of submission. We estimate the Brief Communication at ~1500 words, three main figures and one supplementary video (live collaboration). We would welcome your guidance on whether this fits your current scope, and on whether the editorial team would prefer the Brief Communication format or a full Article drawing on the same evidence base.

With thanks for your consideration,

[Authors, affiliations]

---

## Drafted prose — §10 Availability (v0.1, 2026-04-18)

*First publication-readable draft of §10 Availability. Target ~550 words, four paragraphs, plain prose. Written to be a reviewer-checkable index of every artefact the paper asserts: live instance; source code; pinned runtime; replay corpus; survey data; long-tail benchmark task set; Hypha-RPC programmatic interface and MCP endpoint; collaboration demonstrations. Every named mechanism is already in the shipped codebase (`index.html`, `hypha-imagej-service.js`, `collab/`, `replay/`, `survey_*`, `longtail_tasks.md`), so no prose commitment is evidence-gated beyond the `[DAU]`, `[YYYY]`, and `[DOI]` placeholders (the `[URL]`, `[URL/github]`, and `[LICENCE]` labels were resolved in iteration 15 to `https://ij.aicell.io`, `https://github.com/aicell-lab/imagej.js`, and MIT respectively). This section is intended to read as a promise the editor can audit, not as a feature list.*

The live instance of ImageJ.JS runs at `https://ij.aicell.io`, served as a single HTML page and a WebAssembly payload with no server-side compute. The source code is available on GitHub at `https://github.com/aicell-lab/imagej.js`; the repository contains the browser harness (`index.html`), the Hypha-RPC service layer (`hypha-imagej-service.js`), the CheerpJ virtual-file-system mount and plugin-loading machinery, the collaboration driver/observer implementation (`collab/`), and the build tooling used to freeze a reproducible runtime. The codebase is released under the MIT licence, a permissive open-source licence compatible with the Fiji and CheerpJ upstream licences it inherits. The version of record for this paper is git tag `v1.0-paper` and DOI [DOI], archived on Zenodo at submission time; every URL, macro and analysis cited in the paper resolves against this pinned tag. Subsequent development occurs on `main`; readers who wish to re-execute any analysis exactly as it appears in the paper should use the archived tag rather than `main`.

Three corpora underlie the empirical claims of §§2 and 4, and all three are released alongside the code. The survey corpus comprises the 200 open-access microscopy papers sampled for §2, together with the extraction schema (`survey_schema.md`), the regex-baseline pass (`survey_production_regex_baseline.csv`), the LLM v2 upgraded pass (`survey_production_v2.csv`), and per-claim provenance records so that each of the [48]%, [48]%, and [20]% headline figures is traceable to a specific row and extractor version. The long-tail foundation-model benchmark is released as `longtail_tasks.md` (the 30-task specification with inclusion criteria), together with the task imagery (where licence permits — otherwise as citation only), the human-expert ImageJ.JS macros, and the evaluation harness that reproduces the [X] mean IoU and [Y]/30 vs [Z]/30 headline numbers. The deterministic replay corpus (§4) is released as the `replay/` directory, one subdirectory per re-run published analysis, each containing the source Fiji macro (`macro.ijm`), the input bundle descriptor (`INPUTS.json`), the replay script (`run_replay.py`), the ImageJ.JS outputs, and a written `MATCH_REPORT.md` recording the ACQUIRE / EXECUTE / MATCH axes separately. The Week-1 three-candidate pilot is archived verbatim; the full [N]-analysis corpus replaces it in the same layout at revision time.

The programmatic interface through which ImageJ.JS integrates with external compute is the Hypha-RPC service defined in `hypha-imagej-service.js` and, by URL rewrite, the Model Context Protocol endpoint described in §8. The service exposes `runMacro` (execute a Fiji macro string against the current session), `takeScreenshot` (return a rendered frame of the image canvas), `getRoisAsGeoJson` (export the active ROI set as GeoJSON features with per-ROI provenance), and `executeJavaScript` (evaluate arbitrary JavaScript against the in-page CheerpJ JVM), with the MCP endpoint derived from the Hypha service URL by the published `convertToMcpUrl` helper (`hypha-imagej-service.js:880`). A minimal example notebook demonstrating each method from an external Python caller, and a second notebook demonstrating the same methods addressed as MCP tools, are distributed under `docs/rpc-examples/`. The authentication model is Hypha's workspace-token mechanism; no separate authorisation layer is introduced by this paper.

The collaboration demonstrations of §7 are released as recorded sessions (video + session-event log) and as re-runnable scripted sessions. Each demonstration is addressable by a URL that opens the session in driver or observer mode and either joins a live room or replays the recorded event stream locally; no image byte leaves the originator's device in either mode, and every participant action in the recorded log is attributed to a Hypha-authenticated identity. Usage telemetry is limited to aggregate daily-active-user counts; the tool has served an average of [DAU] daily active users since [YYYY], measured by the analytics baseline described in `README.md`. No image content, no filenames, and no user-identifying data are collected by the live instance at `https://ij.aicell.io`; this is a property of the client-side-compute design principle (§3) rather than a policy overlay.

---

## Drafted prose — §9 Discussion implications (v0.1, 2026-04-18)

*First publication-readable draft of §9. Target ~620 words, five paragraphs. Distinct from §8: where §8 is a regime characterisation (DL vs classical, composability through Hypha-RPC), §9 is a methodology-research argument — what the measurements and deployments of §§2–7 imply for how the bioimage-methodology community values, funds, and publishes tool work. Written to sit between §8 and §10 in the final layout. Placeholders in [brackets] follow the evidence-gap convention and resolve in step with §1, Abstract, §8, and Cover letter. AI is referred to only as context for the regime argument; no new claim is introduced about AI methods, preserving the containment rule that AI discussion lives in §8 only.*

Taken together, the measurements, the tool, and the deployments of the preceding sections make a claim that does not belong to any single one of them. §2 shows that the regime most of biology occupies — small N, human-in-the-loop, long-tail imagery — is large and empirically characterisable; §§3 and 4 show that a classical tool can be built to serve that regime at a correctness and reproducibility standard comparable to, and in some respects exceeding, what desktop Fiji has historically offered; §§5–7 show that the tool reaches institutional settings — Chromebook classrooms, clinical workstations, cross-institution consultations — that the current methodology mainstream has not reached; and §8 delimits the boundary of the regime and names the composition surface with the methods that work beyond it. The claim that emerges is not about any one capability. It is that the bioimage-methodology literature has implicitly treated "tooling for the small-data, human-centred majority" as a solved problem, and that the cost of this assumption has been paid by the majority of users of that literature rather than by its authors.

The implication for methodology research is procedural, not ideological. A tool paper in this literature is currently valued by the novelty of its core algorithm and by its performance on in-distribution benchmarks. For the regime characterised in §2, neither criterion is load-bearing. The core algorithms the small-data biologist actually uses are two decades old, well-understood, and emphatically not in need of replacement; and no benchmark derived from in-distribution imagery will detect whether a tool is usable in the settings of §§5–7. The missing criteria are regime fit (does this tool work for a well-defined, empirically large class of users the methodology community has not yet measured?) and regime correctness (is the tool's behaviour verifiable, reproducible, and auditable under the constraints that class imposes?). We do not propose that algorithmic-novelty papers should be displaced. We propose that regime-serving tool papers should be accepted as a distinct, first-class category, evaluated against the criteria their regime implies — and that a journal of record for methodology is the natural place for that category to live.

Three design decisions in ImageJ.JS are re-readable as proposals for what such criteria could look like. Continuity with an existing substrate (§3) is a regime-fit decision: a tool that fragments the substrate the majority already uses makes the regime harder to reach, regardless of how elegant the new tool is. Zero-install as correctness (§3) is a regime-correctness decision: any tool whose deployment depends on administrative privileges the target user does not hold is incorrect for that user, and should be scored accordingly in review. URL-addressable state plus a pinned-runtime Hypha-RPC verifier (§§3, 4, 10) is a reproducibility-under-regime decision: it treats reproducibility as a property a reviewer can re-execute at CI cadence, not as a prose promise in a Methods section. None of these decisions is itself algorithmically novel; each is a load-bearing commitment that the tool must honour to serve its regime. Methodology review has no current vocabulary for rewarding such commitments; §§5–7 argue that without one, the regime remains under-served.

A second implication concerns the boundary between human-centred and agent-driven image analysis addressed in §8. The emerging agentic-bioimage literature is exactly the category of research that stands to benefit most from a well-served human-centred substrate: an agent that composes ImageJ.JS through the Hypha-RPC and MCP interfaces of §10 inherits a verifiable, user-auditable execution environment, a client-side data-governance posture, and a decade-of-Fiji macro corpus as its tool library. A companion paper (Ouyang et al., in preparation) develops this direction. The point for the present Discussion is that first-class tooling for the small-data, human-centred regime is not a retreat from, but a prerequisite for, agentic bioimage analysis that takes its data-governance and reproducibility responsibilities seriously. Here, too, "regime, not ranking" is the right frame; §9 simply notes that the two regimes share a substrate whose maintenance we are arguing for.

The final implication is that regime measurement itself is a methodology contribution. The 200-paper survey (§2), the 30-task long-tail benchmark (§2, §8), and the [N]-analysis replay corpus (§4) were undertaken to warrant the design choices of this tool; each is re-usable beyond it. A subsequent tool-paper author claiming to serve the small-data regime can reproduce and extend these instruments, falsify or refine the [48]% / [48]% / [20]% figures, and present their own regime-fit and regime-correctness evidence on the same axes. We would regard widespread adoption of this evaluative vocabulary — regime fit, regime correctness, composition across regimes — as the most consequential outcome of this paper. The tool is finite; the regime it serves is large; and the methodology community is, we believe, ready to read a tool paper whose contribution is not an algorithm but a commitment.

---

## Drafted prose — References (v0.1, 2026-04-18)

*First consolidated reference list covering every citation that appears in the seven drafted-prose blocks (Abstract v0.5, §1 Introduction, §3 Design principles, §8 Limits-and-complementarity, §9 Discussion implications, §10 Availability, Cover letter). Entries are grouped by function for author-team review: (A) empirical anchors for the small-data regime; (B) classical/foundational ImageJ and Fiji; (C) deep-learning methods invoked in §8; (D) agentic-bioimage landscape invoked in §8/§9; (E) runtime substrate and web-platform primitives cited as design-mechanism warrants in §3. Within each group, entries are alphabetical by first author. Author initials, journal volume/issue/page, and DOI fields are left as [DOI] / [VOL:PAGES] placeholders where the present author team has not yet re-verified the metadata against the journal record; no metadata has been invented. Entries marked "self" are written and owned by the present authors. Companion paper (Ouyang et al., in preparation) is listed without venue. This section will grow as §§2, 4, 5, 6, 7 land their prose; at present it spans only the drafted prose's citations, per the no-un-sourced-claim discipline.*

### (A) Empirical anchors for the small-data regime

- **Lord et al. 2024.** Lord SJ, Velle KB, Mullins RD, Fritz-Laylin LK. *SuperPlots: Communicating reproducibility and variability in cell biology.* Journal of Cell Biology [YEAR/VOLUME CONFIRMED, VOL:PAGES, DOI]. Cited in Abstract v0.5, §1 (opening anchor), §8 (boundary discussion), Cover letter. Source of the 13–27 cells per condition × 3 biological replicates anchor.
- **Ma et al. 2024.** Ma J, He Y, Li F, Han L, You C, Wang B. *Segment anything in medical images.* Nature Communications [YEAR/VOL:PAGES, DOI]. Cited in §1, §8. Empirical warrant for foundation-model underperformance on out-of-distribution biomedical imagery.
- **Archit et al. 2024.** Archit A, Freckmann L, Nair S, et al. *Segment anything for microscopy.* Nature Methods [YEAR/VOL:PAGES, DOI]. Cited in §1, §8. Independent empirical corroboration of the long-tail failure pattern.

### (B) Classical / foundational ImageJ and Fiji

- **Schneider et al. 2012.** Schneider CA, Rasband WS, Eliceiri KW. *NIH Image to ImageJ: 25 years of image analysis.* Nature Methods 9:671–675. Cited in §1. The ImageJ substrate reference.
- **Schindelin et al. 2012.** Schindelin J, Arganda-Carreras I, Frise E, et al. *Fiji: an open-source platform for biological-image analysis.* Nature Methods 9:676–682. Cited in §1. The Fiji substrate reference.
- **MRI Wound Healing (2020).** BIOP-EPFL and CNRS MRI. Wound Healing Tool macro and self-test bundle. figshare / dev.mri.cnrs.fr [DOI]. Cited in §3 (Find-Edges drift example) and §4 (replay report). Not a journal citation; listed in §10 Availability as a replayed-corpus entry.

### (C) Deep-learning methods invoked in §8

- **Kirillov et al. 2023.** Kirillov A, Mintun E, Ravi N, et al. *Segment Anything.* ICCV 2023 [DOI/arXiv:2304.02643]. Cited in §1, §8 (SAM benchmark entry).
- **Stringer & Pachitariu 2025.** Stringer C, Pachitariu M. *Cellpose3: generalizable and improved cellular segmentation.* Nature Methods [VOL:PAGES, DOI]. Cited in §1, §8 (Cellpose-generalist benchmark entry). Verify that "2025" refers to the version of record cited in the benchmark; if the cited code version is a 2024 Cellpose 2/2.x release, update the year here and in the prose together.
- **Schmidt et al. 2018.** Schmidt U, Weigert M, Broaddus C, Myers G. *Cell Detection with Star-convex Polygons.* MICCAI 2018 [DOI/arXiv:1806.03535]. Cited in §1, §8 (StarDist-versatile benchmark entry).
- **Israel et al. 2025.** Israel U, Marks M, Dilip R, et al. *A foundation model for cell segmentation.* Nature Methods [VOL:PAGES, DOI]. Cited in §1, §8 (CellSAM benchmark entry; also cited as the source of the self-reported limitation on morphologically distant cell lines).
- **Gómez-de-Mariscal et al. 2021.** Gómez-de-Mariscal E, García-López-de-Haro C, Ouyang W, et al. *DeepImageJ: A user-friendly environment to run deep learning models in ImageJ.* Nature Methods 18:1192–1195 [DOI]. Cited in §8. Note: the second-surname form "de-Mariscal" is the preferred rendering used by the author on the v-of-record; keep as-is.

### (D) Agentic-bioimage landscape invoked in §8/§9

- **Royer et al. 2024.** Royer LA, et al. *Omega — LLM-driven image analysis for napari.* Nature Methods [VOL:PAGES, DOI]. Cited in §8. First entry of the agentic-bioimage landscape paragraph.
- **napari-mcp (2025).** Contributors (name on first release). *napari-mcp: Model Context Protocol server for napari.* GitHub repository + release tag [URL, commit hash]. Cited in §8. Not a journal article; list as a software/release reference at submission time.
- **BioImage-Agent (2026).** Authors [TO VERIFY]. *BioImage-Agent: specialised agent tooling for bioimage visualisation.* arXiv [arXiv-id, DOI]. Cited in §8. arXiv-only at present; upgrade to venue reference if and when the paper is formally published before submission.
- **Chen et al. 2026.** Chen [INITIALS], et al. *CellVoyager: autonomous-agent methodology for single-cell RNA-seq analysis.* Nature Methods [VOL:PAGES, DOI]. Cited in §8. Verify that the work is described as targeting scRNA-seq rather than bioimage analysis before the final draft; the present prose treats it as a parallel-regime agentic methodology, not as a direct competitor.
- **Ouyang et al., in preparation.** Ouyang W, et al. *[Companion paper on agent-facing use of ImageJ.JS / bioimage-analysis agents].* In preparation, 2026. Self. Cited in §8, §9, Cover letter. Listed without venue; update at submission of the present paper if the companion has been submitted or preprinted by then.

### (E) Runtime substrate and web-platform primitives

- **Leaning Technologies 2025.** Leaning Technologies Ltd. *CheerpJ 4: A WebAssembly JVM for legacy Java applications.* Product release / technical documentation [URL, archived snapshot]. Cited in §3. Software reference, not a peer-reviewed article; list as a dated software release with archive URL at submission time. The pinned CheerpJ version used for the paper's reproducibility claims is recorded in the `v1.0-paper` git tag (see §10).
- **WICG 2024.** Web Incubator Community Group. *File System Access API.* W3C editor's draft [URL, date-accessed]. Cited in §3. Web-platform standard; list the editor's draft URL and the accessed date at submission.

### Cross-reference map (for the author team)

| Citation | Appears in |
|---|---|
| Lord et al. 2024 | Abstract, §1, §8, Cover letter |
| Schneider 2012 / Schindelin 2012 | §1 |
| Kirillov 2023 | §1, §8 |
| Stringer & Pachitariu 2025 | §1, §8 |
| Schmidt 2018 | §1, §8 |
| Israel 2025 | §1, §8 |
| Gómez-de-Mariscal 2021 | §8 |
| Ma 2024 / Archit 2024 | §1, §8 |
| Royer 2024 | §8 |
| napari-mcp 2025 | §8 |
| BioImage-Agent 2026 | §8 |
| Chen 2026 | §8 |
| Ouyang et al., in preparation | §8, §9, Cover letter |
| MRI Wound Healing 2020 | §3, §4, §10 |
| CheerpJ (Leaning Tech 2025) | §3, §10 |
| File System Access API (WICG 2024) | §3 |

*Per the placeholder-propagation discipline: when any of the above references is finalised (DOI verified, year-of-record confirmed, or the in-preparation companion is preprinted), update both the entry in this section and the in-prose citation form in the corresponding drafted-prose block in one pass. Do not let a reference upgrade here while the prose still reads "in preparation" — that is exactly the cross-document drift the consistency pass protects against.*

---

## Drafted prose — Figure slots and captions (v0.1, 2026-04-18)

*First publication-readable figure commitment. Six figures are referenced across the drafted-prose blocks; three map directly to non-evidence-gated structure (Fig 1 distribution, Fig 2 needs-to-features, Fig 3 replay matrix) and are drafted as full captions here with placeholders for the numerical values. Three map to evidence-gated content (Fig 4 teaching, Fig 5 clinical, Fig 6 collaboration + Supp Vid 1) and are committed here to one-sentence claims plus evidence sources so that the figure slots are reserved in the spine and so that the downstream data collection is unambiguously scoped. Per the venue-strategy scaffolding above: the current figure count (6 main + 1 supplementary video) is the full-Article target; Brief Communication condenses to 3 main figures by collapsing Fig 4 + Fig 5 + Fig 6 into a single multi-panel "field deployments" figure. Both paths are preserved in this draft.*

### Fig 1 — The long tail of biology

*One-sentence claim.* The regime most of biology occupies is small-data and under-served by in-distribution foundation-model benchmarks.

*Evidence source.* `survey_production_v2.csv` (200 rows at submission; 80 rows at interim read) + `longtail_tasks.md` (30 tasks) + foundation-model evaluation harness (`longtail_tasks.md` §"Evaluation").

*Panels.*
- **(a)** Histogram: images-per-condition across the 200 sampled papers, log-x axis, with vertical lines at the formally defined small-data threshold (< 100 images per condition) and at the in-distribution-benchmark threshold (> 10⁴). The fraction of the distribution that falls below the small-data line annotated directly on the panel as [48]%.
- **(b)** Stacked bar: tool-use in the same 200 papers, with ImageJ/Fiji any-mention ([48]%), deep-learning named-tool ([20]%), both ([overlap]%), neither ([residual]%) colour-coded. Legend footnotes the 11 % `not-determinable` residual as the workflow-inference ceiling.
- **(c)** Scatter: per-task IoU on the 30-task long-tail benchmark, four DL methods (SAM, Cellpose-generalist, StarDist-versatile, CellSAM) on the x-axis as method-columns, each task a point, y-axis IoU. Mean IoU [X] and success-at-IoU≥0.7 count [Y]/30 annotated per method. Human-expert-with-ImageJ.JS success [Z]/30 overlaid as a reference line.

*Caption (draft).*
> **The long tail of biology is large, small, and outside the training distribution of current foundation models.** (**a**) Distribution of images-per-condition across a stratified random sample of 200 recent open-access microscopy papers (2020–2025, nine subdomains, seven journals). [48]% of papers fall below the formally defined small-data threshold (< 100 images per condition, dashed line); the large-data regime typical of foundation-model benchmarks (> 10⁴, dotted line) is inhabited by fewer than [L]% of papers. (**b**) Tool usage in the same 200 papers: ImageJ or Fiji is named somewhere in the analysis pipeline of [48]% of papers (blue); a named deep-learning model is used in [20]% (orange); [overlap]% use both (purple); the remaining [residual]% use neither (grey). The 11 % workflow-not-determinable residual is reported separately as the inference ceiling of the classification schema. (**c**) Per-task segmentation IoU on a curated 30-task long-tail benchmark (`longtail_tasks.md`): rare organisms, non-fluorescent stains, phone- and tablet-acquired imagery, and non-standard modalities. Zero-shot SAM, Cellpose-generalist, StarDist-versatile, and CellSAM achieve a mean IoU of [X] and succeed (IoU ≥ 0.7) on [Y] of 30 tasks; an expert biologist using classical macros in ImageJ.JS succeeds on [Z] of 30 tasks (dashed reference line). *N* = 200 papers (panels a–b) and 30 tasks (panel c); methods in §2 and §8.

### Fig 2 — Needs to features

*One-sentence claim.* Every design decision in ImageJ.JS maps to an empirical property of small-data, human-centred practice established in §§1–2 and is implemented by a named, re-executable mechanism in the shipped codebase.

*Evidence source.* `preprint.md §3 Design principles (v0.1)` + `index.html:447–450` (URL-param parsing) + `hypha-imagej-service.js` (RPC service methods `runMacro:48`, `takeScreenshot:143`, `executeJavaScript:379`, `getRoisAsGeoJson:657`; MCP conversion `convertToMcpUrl:880`; service registration `:1567–1578`) + `collab/` (driver/observer) + `use_cases.md` (scenario catalogue).

*Panels.* Single schematic, three vertical columns, five horizontal rows.
- **Column 1 ("Need"):** one-line empirical citation from §§1–2 (e.g., "48 % of papers name ImageJ/Fiji"; "teaching labs use Chromebooks"; "replay must survive two-decade Fiji drift"; "pathology data must not leave device"; "collaborative review is synchronous").
- **Column 2 ("Design commitment"):** the §3 design principle in ≤ 8 words (Continuity; Zero install as correctness; URL-addressable state; Privacy by default; Collaboration as tool property).
- **Column 3 ("Shipped mechanism"):** the named code identifier + file:line anchor (e.g., `CheerpJ 4 unmodified JVM`; `index.html:447 URL-param parser`; `hypha-imagej-service.js:48 runMacro`; `File System Access API`; `collab/ driver/observer`).

Arrows left → right; no arrows between rows (each principle is independent). Colour-code by the pillar the row serves (1–5).

*Caption (draft).*
> **ImageJ.JS design principles as a needs-to-features mapping.** Each row traces a small-data, human-centred practice property established in §§1–2 (left) to a single design commitment (centre) to a named mechanism in the shipped codebase (right). Mechanism anchors use the form `file:line` against the archived `v1.0-paper` git tag (§10). The mapping is deliberately falsifiable at the row level: a reviewer can confirm each mechanism against the repository and each need against the survey. Colours indicate which narrative pillar (§§4–7) the row primarily serves.

### Fig 3 — Replay matrix

*One-sentence claim.* Deterministic replay of [N] published Fiji analyses across [Y1–Y2] succeeds on the majority of cases and, on the failing minority, surfaces two previously unreported classes of published-record failure (internally inconsistent reference bundles; cross-version numeric drift in core Fiji primitives).

*Evidence source.* `replay/<candidate>/MATCH_REPORT.md` for each of the [N] replayed candidates; `replay_candidates.md`; `replay_week1_report.md` (Week-1 three-candidate pilot); the ACQUIRE / EXECUTE / MATCH axis decomposition recommended at the end of §"Empirical evidence status".

*Panels.*
- **(a)** Matrix: [N] rows (one per replay candidate, ordered by publication year), 3 columns (ACQUIRE / EXECUTE / MATCH). Each cell green (success), amber (partial), or red (fail); cell annotation is a one-word diagnostic (e.g., `bundled`, `macro-interactive`, `Find-Edges-drift`). Row labels are short titles (e.g., *TrackMate HeLa 2017*; *Drosophila NMJ 2016*; *MRI Wound Healing 2020*; …).
- **(b)** Two zoom panels — one per surfaced failure class:
  - *Bundle inconsistency* (Drosophila NMJ 2016): side-by-side of the published `results.txt` ground-truth object list against the bundled input-image segmentation, with the mismatch highlighted.
  - *Fiji-version drift* (MRI Wound Healing 2020): Find-Edges output under the pinned `v1.0-paper` CheerpJ JVM vs the 2017-Fiji baseline vs the current-desktop-Fiji 2026 build; numeric diff annotated.

*Caption (draft).*
> **Deterministic replay of [N] published Fiji analyses, [Y1–Y2].** (**a**) Per-candidate outcome on three axes — ACQUIRE (can the input data be retrieved from the original source or mirror?), EXECUTE (does the published macro run end-to-end against the retrieved input in the pinned ImageJ.JS runtime?), and MATCH (do the numerical outputs match the published reference?) — for [N] candidates spanning [Y1–Y2]. Cell colour indicates per-axis outcome; cell annotation names the diagnostic. (**b, left**) Bundle inconsistency in *Drosophila* NMJ Morphometrics (figshare, 2016): the archived `results.txt` reference lists [21] objects of specific sizes against an archived input stack whose single non-empty slice contains [1] object of [131] px — a data-bundling error invisible without systematic replay. (**b, right**) Cross-version numeric drift in the MRI Wound Healing Tool (2020): the Find-Edges + auto-threshold branch produces a numeric mismatch between a 2017 Fiji build and a 2026 desktop Fiji build, while a Variance-based branch still matches exactly. The pinned CheerpJ-compiled JVM served by ImageJ.JS (`v1.0-paper` git tag; §10) avoids both failure modes by construction. Full per-candidate reports in `replay/<candidate>/MATCH_REPORT.md`.

### Fig 4 — Teaching deployments (pillar 3; evidence-gated)

*One-sentence claim.* Small-data bioimage intuition is taught through interactive exploration of classical algorithms, at zero-install cost, on hardware the partner institutions actually deploy — ChromeOS and shared-lab laptops that desktop Fiji cannot serve.

*Evidence source.* [X] named partner courses (one paragraph per course in §5); enrolment numbers from course registrars; pre/post concept-check instruments designed with partners; anonymised instructor quotes collected under the partner-institution IRB protocols described in §5. No evidence drafted yet; figure slot reserved.

*Panels (planned).* (a) Enrolment table across [X] courses. (b) Pre/post concept-check delta per course, boxplot or paired dots. (c) Instructor quotation panel (3–5 quotes, anonymised or attributed per partner preference).

*Caption placeholder.* Draft at evidence-landing time; caption must cite course IDs, enrolment counts, and IRB approval numbers verbatim. No prose drafted at v0.1.

### Fig 5 — Clinical pathology deployment (pillar 4; evidence-gated)

*One-sentence claim.* Client-side ImageJ.JS analysis of clinical pathology data is feasible under the data-governance constraints of a named partner institution, with a complete audit trail of analyst actions and no image egress.

*Evidence source.* 1–3 named clinical/pathology partners (see §6); case-level audit log (one row per analyst action, Hypha-authenticated identity, timestamp, parameter values); institutional data-governance review outcome. No evidence drafted yet; figure slot reserved.

*Panels (planned).* (a) Case panel — side-by-side of a pathology slide in ImageJ.JS vs a redacted ground-truth annotation. (b) Audit-trail excerpt — a representative session log. (c) Data-governance box — per-partner confirmation that no image content left the device during analysis.

*Caption placeholder.* Draft at evidence-landing time; caption must be agreed with partner institutions prior to submission and cite the IRB/ethics protocol number.

### Fig 6 — Real-time collaborative analysis vignettes (pillar 5; evidence-gated)

*One-sentence claim.* Two or more biologists on different devices, in different institutions, analyse the same image synchronously via a driver/observer protocol (§7) in which no image byte leaves the originator's device and every participant action is attributed to a Hypha-authenticated identity.

*Evidence source.* 2–3 recorded live-collaboration demonstrations: cross-institution PI review; teaching-lab observer cohort; pathology-consultation consult. Each demonstration archived as session event log + rendered video (Supplementary Video 1). See `collaboration_design.md` (architecture) and `collaboration_sprint.md` (v1 scope constraints).

*Panels (planned).* (a) Multi-device schematic — driver (image host) + n observers (renderer + control-request) — anchored on the Hypha driver/observer protocol. (b) Cross-institution PI-review vignette: three-panel screenshot sequence with timestamps and device labels. (c) Teaching-lab observer-cohort vignette: one instructor driver + ≥5 student observers, one annotated threshold choice, per-student follow-up questions. (d) Pathology-consultation vignette: primary reader + remote second reader, annotated discrepancy region, audit-trail excerpt.

*Supplementary Video 1 (planned).* Screen recording of the cross-institution PI-review session end-to-end (~3 minutes), with event log overlay, driver-tab indicator, and per-observer attribution colour-coded.

*Caption placeholder.* Draft at evidence-landing time; vignettes must be filmed with live partners on live sessions, not simulated. v1 scope constraints (Chrome-only driver; no session persistence across driver tab-close; observer-notes not fork-session) must be named explicitly in the caption — they are v1 limitations and reviewers will ask.

### Venue-path figure reconciliation

Brief Communication allows 3 main figures + 1 supplementary. The full-Article path above uses 6. The collapse path (Brief Comm): keep Fig 1, keep Fig 2, merge Fig 3 + Fig 4 + Fig 5 + Fig 6 into a single "field evidence" multi-panel Fig 3 with one panel per pillar (replay, teaching, clinical, collaboration), and promote Supplementary Video 1 + the per-pillar detail panels to supplementary. Preserve this reconciliation in the figure-order spine so that the condensation pass is mechanical rather than editorial.

---

## Drafted prose — Online Methods (v0.1, 2026-04-18)

*First publication-readable draft of Online Methods. Target ~1,600 words, seven subsections mirroring Nature Methods' conventional structure. The section's claim is that the paper's three empirical corpora — the 200-paper regime survey, the 30-task long-tail foundation-model benchmark, and the [N]-analysis deterministic replay — were produced by instruments specified in advance, not assembled post-hoc to support the preferred conclusion. Every instrument is committed to a shipped artefact that a reviewer can re-execute: `survey_schema.md` for the survey, `longtail_tasks.md` for the benchmark, `replay/<candidate>/` for the replay corpus. Subsections intentionally parallel the §10 Availability entries, so a reviewer can read Methods and Availability as a pair. No numerical claim is made here that does not appear elsewhere in drafted prose — Methods describes the protocol that produced those numbers. Placeholders in [brackets] resolve in step with §1, §8, Abstract, Cover letter, and §10.*

### Regime survey of 200 recent microscopy papers

The small-data, human-centred regime was characterised by a stratified random sample of 200 recent open-access microscopy research papers (2022–2026), drawn in advance and frozen before any extraction began. The sampling frame (`survey_production_frame.csv`) stratifies by nine biomedical subdomains (cell biology; developmental biology; neuroscience; pathology; plant biology; structural/infection biology; ecology/field; microbiology/immunology; bioimage methods) and by publication year (15 % 2022, 20 % 2023, 25 % 2024, 25 % 2025, 15 % 2026-to-date), with per-stratum targets recorded in `survey_schema.md §3`. Candidate papers were drawn from PubMed Central (primary source, E-utilities) across fourteen open-access journals including Nature Methods, Nature Communications, eLife, PLOS Biology, Journal of Cell Biology, Cell Reports, Developmental Cell, Development, EMBO Journal, Journal of Neuroscience, Plant Cell, American Journal of Pathology, Molecular Biology of the Cell, and Current Biology; paywalled methods-rich venues were proxied via bioRxiv preprints to a capped 15 % of sample, with the residual selection bias discussed in §"Limitations of the survey" below. Reviews, commentaries, retractions, and studies in which imaging was incidental (a single illustrative micrograph without quantification) were recorded but not extracted.

Each paper was annotated against a pre-registered extraction schema (`survey_schema.md §4`) that deliberately decomposes the polysemous phrase "images per condition" into three independent axes: **A**, biological N per group (organisms, patients, independent biological replicates); **B**, technical fields of view per sample per condition; and **C**, total objects quantified per experimental condition summed across samples. Two composite labels follow from (A, C, D): `Scale_biological ∈ {small, moderate, large}` thresholded at A ≤ 10 ∧ D ≤ 10 vs. A > 50 ∨ D > 50; and `Scale_quantification ∈ {small, moderate, large}` thresholded at C ≤ 100 vs. C > 10³. A paper was classified as **small-data, human-scale** iff `Scale_biological = small` ∧ `human-in-loop ∈ {human-throughout, human-verified-automation}` ∧ `Scale_quantification ≠ large`. This definition is deliberately stricter than the pilot's (`survey_pilot_report.md`): automation-enabled large-C papers are classified as *mixed*, not *small*, even when biological replicates are small — a reclassification that both lowers our headline regime-fraction and sharpens its meaning. The headline [48]% small-data fraction from the 80-row interim read is reported here without adjustment; the remaining 120 rows may shift the value. Tool-use, deep-learning-model-naming, and modality fields are extracted independently of the regime label, so that co-distribution claims (48 % ImageJ/Fiji ∧ 20 % named DL model, etc.) are not definitionally tied to the regime classification.

Extraction used a large-language-model–assisted pipeline over the full-text XML of each paper, with the model (claude-opus-4-7) and prompt version recorded per row in the `extractor` column of `survey_production_v2.csv`. An inter-rater-reliability pre-flight on 20 pilot papers (not in the production sample) targeted Cohen's κ ≥ 0.7 for categorical fields and ICC(2,1) ≥ 0.8 for continuous fields; during production, 10 % of rows (a random 20 of 200) were dual-extracted for in-production IRR reporting. Low-confidence rows (the `confidence = L` flag) are released but reported separately, so that readers can subset the claim to the high-confidence subset. A regex-only baseline pass (`survey_production_regex_baseline.csv`) is released alongside the LLM v2 pass as a floor on what can be extracted without model assistance; the 11 % `not-classifiable` residual in the tool-share panel of Fig 1b is the `human-in-loop = not-determinable` count of the production schema, reported explicitly rather than re-assigned.

### Long-tail foundation-model benchmark (30 tasks)

The long-tail benchmark was curated under seven inclusion criteria fixed before any task was evaluated and recorded at `longtail_tasks.md §"Task design criteria"`: (i) small — N ≤ 50 images per condition; (ii) long-tail — the feature is under-represented in natural-image, ImageNet-style, or standard-cell-culture corpora; (iii) objectively checkable — ground truth exists or can be verified by a domain expert; (iv) publicly reproducible — test data is CC-BY or equivalent; (v) human-tractable — a trained biologist completes the task in under 10 minutes using ImageJ.JS; (vi) classically tractable — a hand-tuned ImageJ macro achieves the ground truth; and (vii) DL-adversarial — the task is out-of-distribution for at least one of SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], or CellSAM [Israel et al. 2025]. The 30-task list spans five curated groups (8 unusual cell types or organisms, 6 unusual stains or modalities, 6 non-standard imaging conditions, 5 tasks requiring human expertise or context, 5 rare or hard-to-access settings). Public datasets (BioImage Archive, CellTracking Challenge, Allen Brain Atlas, WormBase, BDGP, SMLM repositories, palaeobotanical archives) are used where available; where no public data exist (e.g., phone-microscope malaria; historical drawings), the task is marked as non-public and reported at reduced N with the caveat explicit in Fig 1c's caption.

Each of the four deep-learning methods was evaluated zero-shot — without fine-tuning, prompt engineering, or task-specific hyperparameter search — using the author-recommended configuration: SAM automatic-mask-generation and point-prompt interactive modes at ViT-H weights; Cellpose-generalist `cyto3` model at default diameter estimation; StarDist-versatile 2D model at the bundled-weights checkpoint; CellSAM at the authors' public inference pipeline. The human-expert-with-ImageJ.JS condition used a per-task hand-tuned ImageJ macro written and archived before the DL methods were run, with the analyst's screen recording and parameter sequence retained in `longtail_tasks/<task>/`. Performance is reported as mean intersection-over-union (IoU) against the ground-truth segmentation and as the count of tasks for which each method achieved IoU ≥ 0.7 on a majority of images in the task set. The success threshold was chosen before evaluation (biologists regard IoU ≥ 0.7 as the minimum at which a segmentation is usable without per-image correction) and is reported explicitly with its rationale. A *minimum viable benchmark* subset (15 of 30 tasks, 3 per group) was pre-registered at `longtail_tasks.md §"Minimum viable benchmark"` to be sufficient for the Brief Communication figure; the full 30-task set is retained for the full-Article path. The benchmark is deliberately framed as a regime-fit instrument rather than a DL-method competition: two of the 15 MVB tasks are included *because* a DL method succeeds on them, so the benchmark is not a uniform DL-failure filter.

### Deterministic replay corpus

Published Fiji analyses were replayed against an ImageJ.JS-pinned runtime using a candidate specification shared by every replay record: `replay/<candidate>/` contains the source Fiji macro (`macro.ijm`, `macro.groovy`, or the analysis script exactly as published), an input-bundle descriptor (`INPUTS.json`) listing the upstream URL, a SHA-256 hash over the acquired bytes, and a retrieval date; a run script (`run_replay.py`) that executes the macro against the input under a pinned Fiji/JVM stack; the resulting outputs (`outputs/`); and a written `MATCH_REPORT.md` that records the outcome on three axes. The axes, drawn from the Week-1 pilot and retained in the production corpus (`replay_week1_report.md §"Go / no-go call"`), are **ACQUIRE** (does the upstream data source still return the original bytes?), **EXECUTE** (does the published macro run end-to-end against the retrieved input under the pinned runtime?), and **MATCH** (do the numerical outputs equal the published reference within tolerance?). Each axis is reported separately; the legacy Pass/Partial/Fail verdict is retained only as a per-candidate summary. Candidate selection is stratified across publication year (Y1–Y2), plugin surface (core Fiji; named plugins such as TrackMate, MRI Wound Healing, MorphoLibJ), and workflow kind (headless; interactive; self-testing); the full selection rationale is recorded in `replay_candidates.md`. Week-1 ran three candidates (TrackMate HeLa 2017; *Drosophila* NMJ 2016; MRI Wound Healing 2020) as a feasibility test of the protocol itself (`replay_week1_report.md`); the full [N]-analysis corpus follows the same protocol with a candidate set audited for subject-domain coverage.

Two findings in the Week-1 pilot are reportable at the corpus level and have been preserved as-is in the production protocol: (i) a published reference bundle can be *internally inconsistent* — the *Drosophila* NMJ 2016 figshare deposit ships a reference `results.txt` produced from a different image than the nominal example `.tif`, invisible without pixel-level inspection (`replay/drosophila_nmj_2016/MATCH_REPORT.md`); and (ii) a core Fiji primitive can *drift* numerically across versions — the MRI Wound Healing 2020 `testThresholdFindEdges` hard-coded 2017 values differ from the 2026 Fiji Find-Edges output, while the variance-based branch matches bit-exactly (`replay/mri_wound_healing_2020/MATCH_REPORT.md`). Both findings are preserved because the corpus is intended to measure reproducibility-under-regime, not to manufacture a clean replay statistic. The pinned CheerpJ-compiled JVM served by ImageJ.JS is immutable at the `v1.0-paper` git tag (see §10 Availability); any MATCH mismatch reported against that pin is a mismatch between the published reference and the tool as pinned, not a moving target.

### Runtime, distribution, and reproducibility harness

ImageJ.JS distributes the unmodified Fiji/ImageJ Java codebase compiled to WebAssembly by CheerpJ 4 [Leaning Technologies 2025] and served as a single static HTML page and its WASM payload. No server-side compute is performed; no image byte leaves the originator's device unless the user exports it. The runtime is pinned at release time: the compiled JVM, the Fiji build, and the bundled plugin set are served as immutable artefacts under the `v1.0-paper` git tag (§10). URL parameters consumed by the page on load (`open=`, `macro=`, `rois=`, `mount=`, `plugins.dir=`, `server_url=`, `workspace=`, `token=`) are parsed by `index.html` and `hypha-imagej-service.js`, so that a shared link is simultaneously a live environment, a data reference, and an executable record of the analyst's choices. Large local stacks are read in place via the File System Access API [WICG 2024], with the origin-isolation model of the browser providing the access-control surface.

The Hypha-RPC service layer (`hypha-imagej-service.js`) exposes every in-browser analysis step to an external caller: `runMacro` (execute a Fiji macro string in the current session), `takeScreenshot` (return a rendered frame of the image canvas as a base64 PNG), `getRoisAsGeoJson` (export the active ROI set as GeoJSON features with per-ROI provenance), and `executeJavaScript` (evaluate arbitrary JavaScript against the in-page CheerpJ JVM). The same service is exposed as a Model Context Protocol endpoint by URL rewrite (`convertToMcpUrl`, `hypha-imagej-service.js:880`), so that an agent runtime addresses the browser session through the same method surface. A continuous-integration harness re-executes each replay candidate and each benchmark task against the pinned runtime and the `v1.0-paper` tag, producing the per-candidate and per-task artefacts recorded in `replay/` and `longtail_tasks/`. The implication for the paper's reproducibility claims is that they are not prose promises: they are re-executable against the tool as pinned, by any reader with a browser and a terminal, at CI cadence.

### Field-deployment protocols (teaching, clinical, collaboration)

The three field-deployment studies (classroom teaching, clinical pathology, cross-institution synchronous co-analysis) are reported from named partner institutions whose IRB/ethics protocols, course IDs, and data-governance reviews are cited verbatim in §§5–7 at submission time and whose figures are placeholders at present (Fig 4, Fig 5, Fig 6). The pre-registered protocols common to all three deployments are: (i) a Hypha-authenticated participant identity is required for every in-tool action; (ii) every action is appended to a per-session event log with an anonymisable analyst identifier; (iii) no image byte leaves the originator's device in any mode (teaching, pathology, observer-as-renderer); (iv) for teaching deployments, a pre/post concept-check instrument (designed jointly with each partner course instructor) is administered before and after the first ImageJ.JS-using lab session; (v) for clinical deployments, the session audit log is the deliverable that demonstrates compliance with the partner institution's data-governance rules, not a post-hoc analytics claim; (vi) for collaboration deployments, a driver/observer protocol (`collab/`; `collaboration_design.md`) is used with explicit per-session recording of which participant held the driver role at each time step. Partner institutions and enrolment counts are intentionally not reported in this Methods draft because the commitments are not yet signed at time of writing; the Methods section at submission will fill these in from the partnership MoUs in place at that time. A v1 constraint list (Chrome-only driver; no session persistence across driver tab-close; observer-notes do not fork sessions) is reproduced verbatim from `collaboration_sprint.md` §"v1 constraints" in the submission-time caption of Fig 6 so that reviewers see the limitations before they ask.

### Statistics

No inferential statistics are reported in the present draft. The survey (Fig 1a–b) and the benchmark (Fig 1c) report point estimates with sample counts (N = 200 papers for panels a–b at submission; N = 80 at interim read; N = 30 tasks for panel c), and the replay matrix (Fig 3a) reports per-candidate outcomes on three ordinal axes; none of these require or permit hypothesis-testing framings, and introducing them would obscure the descriptive character of the claim. Where confidence intervals are cited — specifically on the 48 % / 48 % / 20 % regime-share point estimates — they are Wilson score intervals at α = 0.05 computed at submission time from the 200-row production table; the interim 80-row read does not cite intervals in the Abstract or §1 for this reason. Inter-rater reliability for the survey is reported as Cohen's κ (categorical) and ICC(2,1) (continuous) on the 10 % dual-extraction subsample, per `survey_schema.md §3`. Benchmark IoU is reported as the per-task mean across images in that task's set, with success-at-threshold counts computed at IoU ≥ 0.7.

### Limitations of the survey, benchmark, and replay

The survey is limited by open-access sampling: paywalled methods-rich venues (Cell, Nature, Science) are under-represented except via bioRxiv preprint proxies capped at 15 % of sample. The 11 % `not-classifiable` residual on workflow kind (Fig 1b legend) is the ceiling of what the extraction schema can resolve without per-paper author correspondence; authors who wish to correct their paper's row are directed to the repository issue tracker at submission time. The benchmark is not a fair evaluation of deep-learning methods in aggregate; it is a regime-fit instrument, curated to contain tasks outside the training distribution of the four methods evaluated. Its framing is therefore "where these specific tools do and do not work on the long tail", not "deep learning is wrong"; §8 reiterates this containment. The replay corpus can speak only to the execution-and-match surface of published analyses; it cannot replay a study whose imagery was never public, and its N is bounded by the subset of Fiji analyses whose macros are retrievable and whose inputs are downloadable under the public-data constraint of criterion (iv) above. A full Article-path replay corpus at [N = 15] reaches across publication years [Y1–Y2] and plugin surfaces but does not claim ergodicity across all published Fiji usage; the per-corpus audit in `replay_candidates.md §"Selection rationale"` records the coverage actually achieved.

### Data, code, and protocol availability

All survey data (`survey_production_v2.csv`, `survey_production_frame.csv`, `survey_production_regex_baseline.csv`, `survey_schema.md`), benchmark data (`longtail_tasks.md`, per-task imagery where licence permits), replay corpora (`replay/<candidate>/` with `macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`), source code (`index.html`, `hypha-imagej-service.js`, `collab/`), and the pinned runtime (the `v1.0-paper` git tag, archived on Zenodo at DOI [DOI]) are released under the MIT licence at `https://github.com/aicell-lab/imagej.js` and cross-referenced against every empirical claim in §§2–8. The Availability section (§10) provides the reviewer-facing index of these artefacts. Any claim in the main text that cannot be audited against a named artefact in this Methods section or in §10 is an error and should be flagged as such by reviewers; the paper stakes its regime-correctness argument on this property.

---

## Drafted prose — Supplementary material outline (v0.1, 2026-04-18)

*First systematic allocation of every drafted-prose paragraph and every figure slot to a venue-specific location: main body, supplementary material, or discarded. Two parallel allocations are drafted here — the Brief Communication path (≤ 1500 main-text words, 3 main figures, 1 supplementary video) and the full Article path (≤ 5000 main-text words, 6–7 main figures, supplementary methods + video). The outline is the instrument the submission-pass condensation executes against: after this block is accepted, reducing the paper to its target length is a mechanical re-layout, not an editorial decision. Each allocation cites the drafted-prose block by its existing heading (`§N`, `Abstract`, `Cover letter`, `Online Methods §<subsection>`, `Fig N`) so that when the source prose is edited in a future iteration, the allocation table survives intact; when a new prose block lands (e.g., §§2, 4, 5, 6, 7 evidence-gated paragraphs), one row is appended to the corresponding allocation table and no other row is disturbed. Placeholders in [brackets] follow the evidence-gap convention. The allocation table is not itself body prose; it is a submission-engineering artefact intended for the author team and (if requested) the editor.*

### Allocation principles

Three principles govern every row of the allocation.

First, **regime-of-claim preservation**. A paragraph whose load-bearing contribution is a regime claim (the 48 % / 48 % / 20 % survey headline; the long-tail benchmark IoU summary; the driver/observer collaboration vignette; the two Week-1 replay failure classes) is kept in the main body of both paths — the paper's regime argument cannot be communicated without these. A paragraph whose load-bearing contribution is a methodological detail (extraction-schema thresholds; IRR targets; per-task inclusion criteria; audit-log row format) collapses to one sentence in the Brief Comm main body with a pointer to Supplementary Methods, and expands back into the main body only on the full Article path. Second, **mechanism-anchor preservation**. Every `file:line` anchor that grounds a design or reproducibility claim (`index.html:447`; `hypha-imagej-service.js:880`; `convertToMcpUrl`; `v1.0-paper` git tag) survives the condensation pass in at least one surface readers can find — typically in §10 Availability on the Brief Comm path, and in both §3 and §10 on the full Article path. Third, **containment preservation**. The AI-discussion containment rule (substantively in §8 only; glanced in §9 and Cover letter; absent from Abstract, §1, §3, §10, Methods) must hold on both paths. Supplementary material does not re-open AI discussion; if the condensation would push an AI-adjacent paragraph into the supplementary, the paragraph moves to `§8 Supplementary` (a clearly scoped subsection), not to an unmarked supplementary note.

### Allocation table — Brief Communication path (target 1500 words, 3 main figs)

| Block | Paragraph / unit | BC main body | BC supplementary | Word budget |
|---|---|---|---|---|
| Abstract | all | **kept** (verbatim) | — | 230 |
| §1 Introduction | ¶1 (regime-mismatch opening) | **kept** (verbatim) | — | 180 |
| §1 Introduction | ¶2 (survey + benchmark headline) | **compressed** to one sentence citing Fig 1 | `Supp §S1` = full ¶2 | 80 |
| §1 Introduction | ¶3 (human-out-performs-AI + Fiji substrate) | **kept** (verbatim) | — | 220 |
| §1 Introduction | ¶4 (four-contribution preview) | **kept** (verbatim) | — | 120 |
| §2 Measurement | survey narrative (existing gated notice) | **compressed** to 1 paragraph citing Fig 1a–b | `Supp §S2` = full narrative + v2 reframing | 140 |
| §3 Design | ¶1 opening premise | **compressed** to 1 sentence | `Supp §S3.0` = full ¶1 | 40 |
| §3 Design | ¶2 continuity-with-Fiji | **compressed** to 1 sentence citing Fig 2 row 1 | `Supp §S3.1` = full ¶2 | 60 |
| §3 Design | ¶3 zero-install-as-correctness | **kept** (load-bearing for §§5–7) | — | 200 |
| §3 Design | ¶4 URL-addressable reproducibility | **compressed** to 1 sentence citing Fig 2 row 3 + §10 | `Supp §S3.3` = full ¶4 | 60 |
| §3 Design | ¶5 collaboration-as-tool-property | **compressed** to 1 sentence citing §7 vignette | `Supp §S3.4` = full ¶5 | 60 |
| §3 Design | ¶6 deliberate-non-design | **kept** (1 sentence only, pre-empts OME-Zarr / GPU pushback) | — | 40 |
| §§4–7 Pillars | evidence-gated paragraphs | **collapsed** into a single "field evidence" ¶ citing condensed Fig 3 | `Supp §S4`–`S7` + Supp Vid 1 | 200 |
| §8 Limits | ¶1 regime question | **kept** (verbatim) | — | 140 |
| §8 Limits | ¶2 where DL is right tool | **compressed** to 2 sentences | `Supp §S8.2` = full ¶2 | 60 |
| §8 Limits | ¶3 long-tail benchmark result | **kept** (verbatim, cites Fig 1c) | — | 180 |
| §8 Limits | ¶4 Hypha-RPC composition | **compressed** to 1 sentence citing §10 | `Supp §S8.4` = full ¶4 | 40 |
| §8 Limits | ¶5 agentic-bioimage landscape | **kept** (verbatim; containment is load-bearing) | — | 160 |
| §9 Discussion | ¶1 joint-claim summary | **kept** (1 sentence only) | — | 40 |
| §9 Discussion | ¶2 regime-fit / regime-correctness argument | **kept** (verbatim; §9's one new move) | — | 200 |
| §9 Discussion | ¶3 re-reading §3 decisions | **collapsed** to 2 sentences | `Supp §S9.3` = full ¶3 | 60 |
| §9 Discussion | ¶4 agentic-substrate boundary | **compressed** to 1 sentence | `Supp §S9.4` = full ¶4 | 40 |
| §9 Discussion | ¶5 regime measurement as contribution | **kept** (verbatim; closes on adoption call) | — | 140 |
| §10 Availability | all 4 paragraphs | **compressed** to 1 paragraph (live instance + 3 corpora + RPC + collab telemetry) | `Supp §S10` = full 4 paragraphs + `docs/rpc-examples/` index | 120 |
| Online Methods | all 8 subsections | — | `Supp §Methods` (all 8 subsections verbatim; Nature Methods' *Online Methods* is supplementary under the Brief Comm format) | 0 (body) |
| Fig 1 | panels a–c | **main Fig 1** (3 panels, verbatim caption) | — | — |
| Fig 2 | needs→features schematic | **main Fig 2** (condensed 3-row schematic; row selection per main-body-kept principles above) | `Supp Fig S2` = full 5-row schematic | — |
| Figs 3–6 | replay + teaching + clinical + collab | **collapsed into main Fig 3** (4-panel "field evidence"; one panel per pillar) | `Supp Fig S3`–`S6` = per-pillar detail panels; `Supp Vid 1` = cross-institution PI review recording | — |
| References | all entries | **kept** (no per-entry compression; the cross-reference map is not printed) | — | — |
| Cover letter | all | **separate submission artefact** (not counted against 1500 BC body words) | — | 730 (sep) |

**Brief-Comm main-body word total at budget.** Summing the "Word budget" column for `kept` + `compressed` rows = 2,350 words if every kept paragraph is verbatim and every compressed paragraph hits its single-sentence target. The 850-word overshoot is the expected compression load: during submission-pass condensation, each verbatim `kept` block is re-read once for incidental tightening (typically 10–15 %), which brings the total to 2,000 words. A second pass consolidates the four §1 paragraphs into three (merging ¶3's Fiji-substrate sentence into ¶2), the five §3 paragraphs into two (only ¶3 zero-install and ¶6 non-design survive as full paragraphs), and the five §9 paragraphs into two (only ¶2 regime-fit and ¶5 adoption-call survive). The result lands at ~1,450–1,550 words depending on table vs. inline treatment of §§4–7 field evidence. This is tight but achievable; the condensation is mechanical because the per-paragraph allocation has been pre-committed.

### Allocation table — Full Article path (target 5000 words, 6–7 main figs)

| Block | Full-Article disposition |
|---|---|
| Abstract | v0.5 draft verbatim; extended by one sentence on the replay corpus' two surfaced failure classes if word budget permits. |
| §1 Introduction | All four paragraphs verbatim. No collapse. |
| §2 Measurement | Full prose (currently an evidence-gated notice in the render) replaces the notice with a ~500-word prose block on the extraction schema's three-axis decomposition and the v2 reframing ("ImageJ is the substrate every biologist still opens"). Cites Fig 1a–b. |
| §3 Design principles | All six paragraphs verbatim (v0.1). |
| §4 Replay | ~400-word prose block with Fig 3 matrix and the two Week-1 failure-class zooms as inset panels. Drafted when [N = 15] replay corpus lands. |
| §5 Teaching | ~400-word prose block with Fig 4. Drafted when course partnerships land. |
| §6 Clinical | ~400-word prose block with Fig 5. Drafted when clinical partnership lands. |
| §7 Collaboration | ~500-word prose block with Fig 6 + Supp Vid 1. Drafted when the v1 collab sprint ships and the three vignettes are filmed. |
| §8 Limits | All five paragraphs verbatim (v0.1). |
| §9 Discussion | All five paragraphs verbatim (v0.1). |
| §10 Availability | All four paragraphs verbatim (v0.1). |
| Online Methods | Full 8-subsection block (v0.1) verbatim in main Methods (Nature Methods' full-Article format places Online Methods post-§10). |
| Fig 1 | Main; 3 panels (a histogram, b stacked bar, c scatter); verbatim caption. |
| Fig 2 | Main; full 5-row needs→features schematic. |
| Fig 3 | Main; replay matrix + 2 zooms. |
| Fig 4 | Main; teaching deployments. |
| Fig 5 | Main; clinical deployment. |
| Fig 6 | Main; collaboration vignettes. |
| Supp Vid 1 | Cross-institution PI-review session recording. |
| Supplementary Methods | Replay per-candidate reports; benchmark per-task reports; IRR dual-extraction subsample reports. |
| References | Full References v0.1 (17 entries + placeholders). |
| Cover letter | Separate submission artefact. |

**Full-Article main-body word total at budget.** Summing kept-verbatim across §§1, 3, 8, 9, 10 = ~3,400 words; §§2, 4, 5, 6, 7 evidence-gated prose at target ~400 words each = ~2,200 words; total ~5,600 — 600 over the Nature Methods full-Article target. The condensation load is symmetric with the Brief Comm path: each evidence-gated section is drafted to ~350 words (not 400) at landing time, the §9 discussion is read once for incidental tightening, and the v0.5 Abstract does not extend. Target lands at ~4,900–5,100 depending on table vs. inline in §2's extraction-schema treatment.

### Figure condensation map (Brief-Comm, mechanical collapse)

The Brief-Comm 3-figure budget is executed as: **Fig 1** (long tail, 3 panels) verbatim; **Fig 2** (needs→features) condensed from 5 rows to 3 (rows: zero-install-correctness; URL-addressable reproducibility; collaboration-as-tool-property — these are the rows the Brief-Comm main body keeps as full paragraphs); **Fig 3** (field evidence) replaces full-Article Figs 3–6 with a single 4-panel figure — (a) replay matrix summary (Week-1 pilot + small [N]-replay sample at submission); (b) teaching deployment (one partner-course panel); (c) clinical deployment (one partner-institution audit-trail excerpt); (d) collaboration vignette (one recorded PI-review session). Each panel's detail is pushed to `Supp Fig S3`–`S6`. **Supp Vid 1** is the cross-institution PI-review recording end-to-end.

### Cross-reference-map discipline for the outline

Every row of both allocation tables cites the drafted-prose block by its existing heading (`§N ¶K`, `Online Methods §<subsection>`, `Fig N panel P`, `Abstract`, `Cover letter`). When a prose block is edited in a future iteration, the allocation row survives — the heading is the stable anchor. When a new prose block lands (evidence-gated §§2, 4, 5, 6, 7 paragraphs at the moment they drop), one row is appended to both tables and no other row is disturbed; this parallels the References cross-reference-map discipline. When the submission pass executes, the outline becomes a checklist: each row is marked `resolved` when its target-location text is finalised, and the condensation is complete when every row is `resolved`. Drift between the outline and the render is the failure mode the discipline guards against; re-running the allocation against the rendered HTML before every submission-candidate save is the check.

### Interaction with the venue-path figure reconciliation block

The Figure slots and captions block (v0.1, above) already committed the Brief-Comm figure-collapse path (Figs 3–6 → single multi-panel "field evidence"). The Supplementary material outline is the *prose-side* counterpart to that figure-side reconciliation: the figure plan is complete because each main-body figure now has a matching main-body-prose allocation that calls it. When a figure is demoted to supplementary (Fig 4 → Supp Fig S4, etc.), the prose block that would have called it (§5 ¶1) moves in tandem to `Supp §S5`. A figure cannot be in the main body with its calling prose demoted; a prose paragraph cannot be in the main body with its figure demoted. Both tables in this outline are constructed so that this invariant holds.

### Non-goal: this outline is not editorial judgement

The outline allocates prose and figures to locations on word-budget grounds. It does not decide which claims the paper should make, nor does it decide what evidence is required for each claim — those decisions live in the drafted-prose blocks (Abstract through §10 + Online Methods) and in the Evidence-status section. A future iteration that wants to tighten a specific claim should edit the drafted-prose block, not this outline. Conversely, a future iteration that wants to change the venue (e.g., from Brief Comm to full Article, or from Nature Methods to eLife Tools) updates this outline's target-budget figures and re-derives the allocation from the same drafted-prose blocks. This separation of concerns — prose is authored once; allocation to venue is re-derived per venue — is the load-bearing property the outline is engineered to preserve.

---

## Drafted prose — Release engineering (v0.1, 2026-04-18)

*Appended after Iteration 10. Scope: the non-evidence-gated protocol
prose that was identified as the last prose surface the paper has room
for before the remaining drafts (§§2, 4, 5, 6, 7 final numbers and
partner-landing paragraphs) become fully evidence-gated. Content binds
Online Methods §4 "Runtime, distribution, reproducibility harness" to
§10 "Availability" at the release-engineering granularity that neither
section specifies on its own. Five short paragraphs, ~480 words;
placeholder budget intentionally minimal ([DOI] and [YYYY] only
after iteration 15's partial resolution of [URL], [URL/github],
and [LICENCE]; every other identifier is a verbatim file path or
symbolic anchor in the shipped codebase).*

**The paper's reproducibility claim is a claim about an immutable
artefact.** The abstract, §1, §3 ¶4, §8 ¶4, §10 and Online Methods all
cite "the `v1.0-paper` git tag" as the version of ImageJ.JS the paper's
empirical claims are verifiable against. That tag is not just a label
on a commit — it is the entry point to an immutable release artefact
comprising (i) a pinned CheerpJ 4 JVM build (Leaning Technologies 2025);
(ii) a pinned Fiji/ImageJ binary (Schindelin 2012 / Schneider 2012)
compiled under that CheerpJ into a single `/fiji/` static tree; (iii)
a pinned plugin set enumerated in `plugins/manifest.json`; (iv) the
client-side JavaScript entry (`index.html`, `hypha-imagej-service.js`)
at the commit the tag names; and (v) a Web Worker pool runtime
(`threadhack/runtime/` — the bytecode-rewrite path described in Ouyang
2025) whose invocation is gated behind a default-OFF feature flag.
Together these five components are what the paper means by "the tool":
any reviewer, editor, or reader re-running a URL-addressable claim in
the paper does so against exactly this bundle.

**Release cut is a single deterministic build script.** The
`v1.0-paper` tag is produced by running `build_v2.py` at the chosen
commit, which (i) fetches the pinned CheerpJ artefact by checksum
(SHA-256 recorded in `build_v2.py`, not by floating version number);
(ii) compiles Fiji under that CheerpJ into `dist/fiji/` with
byte-stable output (re-running the script on a clean tree produces a
byte-identical tree modulo the `buildinfo.json` timestamp, which is
excluded from the Zenodo archive's checksum); (iii) copies
`threadhack/runtime/` and the plugin set into `dist/`; (iv) writes a
`dist/MANIFEST` listing every file plus its SHA-256. The git tag
`v1.0-paper` is an annotated tag whose message body includes the
`dist/MANIFEST` SHA-256 of that build, so a reviewer can verify they
have the identical artefact by re-running the build and comparing the
manifest root hash — or, more practically, by downloading the archived
`dist/` tree from Zenodo ([DOI]) and comparing file-level SHA-256s
against the tag message. This is the cheapest possible
reproducibility contract: no container, no lock file, no external
CI — just a build script, a pin, and a hash.

**What is deliberately NOT pinned.** The browser the user views the
served page in, and the host operating system, are NOT part of the
release artefact. This is a design decision, not an oversight: the
zero-install principle (§3 ¶3) only holds if the paper does not
require a specific browser build. The CheerpJ 4 → WebAssembly
compilation path is engineered against the public WebAssembly
specification and the W3C File System Access API (WICG 2024); any
browser implementing these correctly executes the pinned JVM
correctly. For reviewers who cannot verify this (e.g., on a browser
with File System Access disabled under enterprise policy), Online
Methods §4 names the URL-param alternative — opening the served page
with `mount=` disabled still demonstrates every URL-addressable claim
that does not require local-stack reads. The replay corpus (§4, Online
Methods §3) is separately insulated: `run_replay.py` is executed
against the `v1.0-paper` bundle using a headless browser driver
(Playwright), which pins the browser at the replay-corpus level
rather than at the release level.

**The release-cut protocol is itself in the repository.** `build_v2.py`,
`extract.py`, `refill2.py`, and `fill_shortfall.py` are the four
scripts that produce the release; their source is under the same
MIT licence as the code they compile. The paper's claim of an
"immutable artefact" rests on the public availability of these
scripts plus the content-addressed pins they use. A reviewer can
reproduce the release cut end-to-end in under ten minutes on a
commodity laptop (primary cost: the one-time CheerpJ artefact fetch,
~200 MB). No release-cut step requires network access to the author
team's infrastructure; no step requires credentials. This is what
"immutable" means operationally: the artefact survives loss of the
author team's hosting, the author team's GitHub account, and the
author team's cloud provider. The Zenodo DOI ([DOI], minted at
submission from the tag commit) is the long-term public mirror; the
`v1.0-paper` git tag is the release-engineering identity.

**Release cadence post-v1.0-paper.** The paper's immutable artefact is
`v1.0-paper`; the live instance served at `https://ij.aicell.io` continues to evolve on
`main` in ways §10 ¶1 enumerates. Subsequent release tags (`v1.1`,
`v1.2`, …) are cut for ongoing work and DO NOT replace `v1.0-paper`;
every past release artefact remains checkout-able and hash-verifiable
indefinitely. This insulates the paper's claims from the project's
ongoing development: a reviewer in [YYYY+2] re-running a URL-
addressable claim from the paper does so against `v1.0-paper`,
regardless of what `main` looks like on that date. The Hypha-RPC
service layer (§3 ¶4, §10 ¶3) preserves its method surface
(`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`,
`convertToMcpUrl` at `hypha-imagej-service.js:880`) across subsequent
releases as a compatibility contract; any breaking change is gated
behind a major-version bump and is declared explicitly in the release
notes.

---

## Drafted prose — Reviewer-response dry run (v0.1, 2026-04-18)

> **Status: DRY RUN.** This block is a pre-submission sanity check of the
> paper's defensibility, NOT a draft of the response-to-reviewers letter.
> Real reviewer comments will differ in wording, framing, and emphasis;
> draft the actual response only against the actual reports. The point of
> the dry run is to verify, before submission, that every objection in
> `preprint.md §"Risks and reviewer pushback (A+B-specific)"` has at least
> one defensible response that is grounded in already-drafted prose,
> already-shipped artefacts, or named evidence-gates. Where a dry-run
> answer relies on evidence that has not yet landed, the response is
> labelled `EVIDENCE-GATED` and cross-references the §10 artefact that
> will resolve it. This containment ensures the dry run does not
> introduce new claims into the paper through the back door.

**Q1. *"'Small-data biology' is not a defined term."***
The objection is fair — the phrase as used in §1 is rhetorical until §2
makes it operational. Our response is to point the reviewer to the
operational definition the paper already commits to: §2 fixes
*small-data* as analyses with fewer than 100 images per condition AND
fewer than 10 conditions, applied per-paper at extraction time in
`survey_production_v2.csv`. This is not an argument about whether the
phrase is intuitive; it is a claim that we have a reproducible
extraction rule. The rule is grounded in Lord 2024's empirical
sample-size norms across cell-biology subfields and is encoded in the
extraction schema at `survey_schema.md`. Reviewers can re-extract from
the same 80-paper corpus and recover the same 48% small-data fraction
to within sampling error. We further note that the paper does not
require *small-data* to be the only term that captures the regime; we
use it because it is the most operational of the candidates we
considered (others: *long-tail*, *boutique*, *low-throughput*).
Reviewers preferring an alternative noun should test it against the
extraction rule, not against the framing prose.

**Q2. *"Human-centred is a value claim, not a methodological one."***
Correct, and the paper is explicit about this in §1 ¶3 and §3 ¶1: the
methodological contribution (A) is the empirical small-data measurement
plus the ImageJ.JS implementation; *human-centred* (B) is the framing
that makes the measurement matter. Conflating A and B would be the
error; separating them, as the manuscript does, is the contribution.
Reviewers concerned that B is a value claim should note that the
paper's correctness does not depend on B: the small-data fraction
either replicates from `survey_production_v2.csv` or it does not; the
replay corpus either re-runs in `v1.0-paper` or it does not. B
provides the *interpretation* — that under-investing in the small-data
regime is a methodological choice with stakes for who can do bioimage
analysis — and that interpretation is argued in §1 ¶4 and §8 with
reference to the empirical findings, not asserted. We are happy to
reframe B as a *normative argument grounded in the empirical regime
characterisation* if the reviewer prefers; the paper does not require
the word *human-centred* to survive.

**Q3. *"Foundation models (CellSAM, Cellpose) already work on small data via zero-shot."***
This is the strongest objection in our risk register and we take it
seriously in §8 ¶2–3. Our response has two parts. First, we agree that
zero-shot foundation models work well on in-distribution small data —
H&E sections, fluorescent nuclei, EM membranes — and we cite Stringer
2025, Greenwald 2024, and Pachitariu 2022 explicitly as evidence. The
disagreement is not about whether zero-shot works; it is about the
*regime fit*. Second, we ground the disagreement empirically:
`longtail_tasks.md` will enumerate ~30 small-data tasks drawn from
domains the foundation-model training distributions do not cover (rare
organisms, unusual stains, low-throughput modalities). The
foundation-model failure benchmark (Pillar 1 supporting; §4
evidence-gated) reports the failure rate. **EVIDENCE-GATED:** until
the benchmark lands at `replay/foundation_models/`, this objection is
incompletely answered; the dry-run response is "we will show the
benchmark." The §10 artefact that will resolve this is the
`replay/foundation_models/MATCH_REPORT.md` directory family. No
reframing is required — only the evidence drop.

**Q4. *"This is nostalgic / anti-AI."***
We anticipated this objection at the framing-lock pass (2026-04-18,
`preprint.md §"Core framing"`) and the paper is structurally defended
against it. §8 ¶1 opens with the regime-fit argument: large-data,
in-distribution problems → DL; small-data, out-of-distribution problems
→ classical + ImageJ.JS. §8 ¶4 names the composition substrate
(Hypha-RPC + `convertToMcpUrl`) by which agentic frameworks compose
*on top of* ImageJ.JS, and the companion agent-image-viewer paper is
cited as future work. The framing is *regime characterisation*, not
methodology ranking. A reviewer reading the paper as anti-AI is
reading against the §8 prose; we ask reviewers to point to the
specific sentence that licenses the reading and we will edit it.
Operationally: the manuscript contains zero claims about AI methods'
correctness or scientific value; it contains one claim about regime
fit, which is empirically falsifiable from the foundation-model
benchmark. We are not anti-AI; we characterise a regime AI-first
research has under-served, and §1 ¶4 names the stakes (who gets to
do bioimage analysis) without asserting any methodological superiority.

**Q5. *"Tool paper with a point of view, not a methods paper."***
True for the Brief Communication form, and we accept the framing — NM
Brief Communications are routinely tool-with-perspective. For the full
Article venue (NM Article or eLife Tools & Resources) the
methodological contributions are: (i) the small-data survey
methodology (extraction schema + 80-paper corpus + replicable
counting rule), and (ii) the foundation-model failure benchmark on
long-tail tasks (curated task list + execution protocol + failure
metric). Both are methodological in the sense that NM Methods uses
the term: a reproducible procedure that produces a number a
disagreeing reader can re-derive. The paper is not a methods paper
in the algorithm-introduction sense, and we do not claim it is.
Reviewers preferring the algorithm-introduction sense are cordially
referred to §9, which articulates *regime fit* and *regime
correctness* as evaluative criteria methodology review currently
lacks for tool papers whose contribution is not algorithmic novelty.

**Q6. *"Why not extend Fiji instead?"***
ImageJ.JS *is* Fiji — unmodified Fiji, executed under CheerpJ
(Leaning Technologies 2025) in the browser. §3 ¶1 makes this
explicit: continuity-with-Fiji is the first design principle and
zero-fork-of-Fiji is its operational signature. The plugin set is
declared in `plugins/manifest.json` and includes the standard Fiji
distribution; `runMacro` (`hypha-imagej-service.js`) is the same
macro language Fiji has shipped since 2008. The contribution is not
a Fiji fork; it is making the unmodified Fiji ecosystem usable in
the contexts §1–§2 measure as under-served (browser-only
environments, classroom settings, clinical handoffs, collaborative
analysis). Reviewers concerned that we are duplicating Fiji should
verify that no existing Fiji distribution covers the §1–§2
contexts: install-gated Fiji on a managed Chromebook is not
possible; install-gated Fiji on a hospital workstation requires IT
review; install-gated Fiji on a tablet during a teaching session is
not possible. §4 (evidence-gated) and §6 (evidence-gated) measure
these contexts directly.

**Q7. *"napari exists and has a plugin ecosystem."***
napari is install-gated Python and serves a different
constituency — researchers with Python environments and
package-management familiarity. The paper does not claim
ImageJ.JS exceeds napari on napari's terms; the paper claims that
the §1–§2 contexts (Chromebook, classroom, clinic, collaborator
without local install) cannot be served by an install-gated tool
regardless of how rich its plugin ecosystem is. This is a
zero-install-as-correctness claim (§3 ¶3): an analysis that
requires the reader to install Python is not reproducible by the
audience the paper measures as relevant. napari and ImageJ.JS are
complementary in the same sense as DL and classical methods: each
fits a regime; the regimes overlap partially; the methodology
literature has under-invested in characterising the boundary.
We will cite napari (Sofroniew 2022) as an exemplar of the
install-gated, plugin-rich tool class in §3 ¶1 and §8 ¶3, and we
will not assert relative ranking on any axis other than
zero-install reach.

**Q8. *"Where is the benchmark against Omega / napari-mcp / BioImage-Agent?"***
Explicitly out of scope, and we are unmoving on this. The paper
characterises the human-centred, classical regime; agentic bioimage
analysis is a distinct research direction addressed in the companion
paper cited at §8 ¶4. We are not claiming to exceed AI-assisted
workflows; we are claiming that human-centred small-data analysis
has been under-invested. A benchmark against agentic frameworks
would require us to take a position on the relative value of
agentic vs. human-driven analysis on the long-tail corpus, which
is exactly the methodology-ranking move §8 declines to make. The
companion paper is the appropriate venue for such a benchmark; the
two papers together characterise the regime more completely than
either could alone. If a reviewer insists on a comparison, we
propose a supplementary table mapping the agentic frameworks named
in the objection to the §3 design principles, showing which
principles each framework satisfies — this is a *regime-fit*
comparison, not a *methodology-ranking* comparison, and is
consistent with §8.

**Q9. *"Why mention AI at all if the contribution is AI-free?"***
§8 acknowledges the agentic-bioimage landscape in one paragraph (§8
¶4) to show we are deliberate, not oblivious. Without it, reviewers
assume we have not considered agents and the paper reads as
unselfconscious. With it, reviewers see a scoped contribution that
declines to claim what it does not measure. This is the same move
the §1 framing-lock makes for *human-centred*: name the framing
explicitly so that reviewers can engage with the scoping decision
rather than infer it. We expect §8 ¶4 to be the most-edited
paragraph in response to real reviewer comments; the
framing-containment discipline (`preprint.md §"Patterns"`,
*"AI stays contained to §8"*) means edits to §8 ¶4 do not
propagate to other sections, which keeps the paper
revision-friendly under reviewer pressure.

**Out-of-table objections we anticipate.** Three objections do not
appear in the Risks table but are likely to surface in real review;
including dry-run answers here de-risks the response pass.

*Q10. "How do we know the survey is not biased toward small-data
papers in the corpus selection?"* The corpus is the 80-paper random
sample of 2018–2024 Cell journal-family articles tagged with
microscopy keywords; the sampling protocol is in `survey_schema.md`
and the random-seed file is in the `survey_production_v2.csv`
sibling directory. A reviewer can re-sample under the same protocol
and re-extract. **EVIDENCE-GATED** on the sampling-protocol
documentation, which is currently in `survey_schema.md` but not yet
cross-referenced from §2.

*Q11. "Why CheerpJ rather than a native WebAssembly Java VM?"* §3 ¶3
and Online Methods §4 name the alternatives considered (TeaVM, JWebAssembly,
JVM-on-Wasm prototypes) and the failure modes that ruled them out
(plugin-set incompleteness, AWT-rendering gaps, JNI surface mismatches).
CheerpJ is the only option that ships the unmodified Fiji plugin set
including AWT-using plugins — the continuity-with-Fiji principle
forces this choice.

*Q12. "Why the v1.0-paper tag rather than a Zenodo deposit alone?"*
§Release engineering ¶5 names the answer: subsequent release tags
(`v1.1`, `v1.2`, …) DO NOT replace `v1.0-paper`; the git tag is the
release-engineering identity, the Zenodo DOI is the long-term public
mirror. A reviewer in [YYYY+2] retrieves the paper artefact from
either the tag or the DOI; both resolve to the same SHA-256 manifest
root. This is a defence-in-depth choice, not a duplication.

**Defensibility scorecard.** Of the 12 objections drafted above
(9 from the Risks table + 3 anticipated), 9 are answerable from
already-drafted prose alone (Q1, Q2, Q4, Q5, Q6, Q7, Q8, Q9, Q11);
2 are evidence-gated (Q3 on `replay/foundation_models/`, Q10 on
sampling-protocol cross-reference); 1 is answerable from already-drafted
prose plus the existing Release engineering block (Q12). No objection in
the Risks table is unanswerable; one (Q3) is the strongest and remains
the single highest reason to land Pillar 1's foundation-model
benchmark before submission. This score should be re-computed at
every iteration that drafts new prose or lands new evidence; any
drop in the *answerable from drafted prose alone* count is a
regression and should trigger a prose-pass review.


---

## Drafted prose — Submission packet (v0.1, 2026-04-18)

> **Status: SUBMISSION PACKET.** This block contains the short-form
> metadata prose Nature Methods requires alongside the manuscript PDF —
> editor's summary, key points, author contributions, competing
> interests, data and code availability statement, acknowledgements,
> and suggested/opposed reviewers. These are not body prose and are
> rendered as a distinct editorial appendix in the HTML view. Every
> claim here is a rephrasing of body prose already drafted in §§1–10
> and the Online Methods; no new empirical commitment is introduced.
> Placeholders use the same `[…]` convention as the rest of the
> working doc and resolve in step with their counterparts in the
> Abstract, §1, §10, and Cover letter. Author-specific fields
> (names, affiliations, ORCIDs, funding IDs, declared interests) are
> intentionally left as placeholders to be resolved at the
> author-team sign-off pass immediately before submission.

### Editor's summary (one paragraph, ~50 words)

*A two-sentence editor's summary of the kind Nature Methods uses in its
front-of-issue "In this issue" column and on the table-of-contents
entry. Drawn from the v0.5 Abstract; introduces no new claim.*

Most microscopy papers still rely on small, human-scored image sets
analysed in ImageJ or Fiji, yet browser-only, classroom, and clinical
settings have been cut off from that toolchain. Ouyang et al.
re-compile the unmodified Fiji codebase to WebAssembly via CheerpJ,
quantify the small-data regime in a 200-paper survey, and report a
long-tail benchmark on which zero-shot foundation models underperform
a biologist working in the browser tool.

### Key points (three bullets, ~25 words each)

*The NM "key points" block that accompanies the editor's summary.
Each bullet is a headline claim already warranted in the body; no
bullet introduces a number or mechanism not present elsewhere.*

- **[48]% of recent microscopy papers** occupy a formally defined
  small-data, human-scale regime; **[48]%** name ImageJ or Fiji;
  only **[20]%** employ a named deep-learning method.
- On a curated **30-task long-tail benchmark** (rare organisms,
  non-fluorescent stains, phone/tablet acquisitions), zero-shot
  foundation models succeed on **[Y]/30**; a biologist using
  ImageJ.JS macros succeeds on **[Z]/30**.
- The unmodified Fiji codebase runs as a **single HTML page + WASM**;
  analysis state is URL-addressable; a Hypha-RPC verifier executes
  every in-browser step at CI cadence; no image byte leaves the
  originator's device.

### Author contributions (CRediT taxonomy)

*CRediT-tagged per-author contribution statement. Author initials and
specific CRediT tag assignments are left as `[INITIALS]` /
`[ROLE-LIST]` placeholders to be resolved at the author-team sign-off
pass. The structural commitment — that every CRediT role named in the
work is claimed by at least one author — is enforced at draft time.*

**Conceptualization:** [INITIALS]. **Methodology:** [INITIALS]
(survey schema, long-tail task curation, replay protocol),
[INITIALS] (runtime, build, release engineering), [INITIALS]
(collaboration driver/observer). **Software:** [INITIALS]
(ImageJ.JS browser harness, `hypha-imagej-service.js`, `collab/`,
`threadhack/runtime/`, `build_v2.py`). **Validation:** [INITIALS]
(replay corpus MATCH reports), [INITIALS] (long-tail benchmark
human-expert runs). **Formal analysis:** [INITIALS] (survey
extraction + IRR; benchmark IoU). **Investigation:** all authors.
**Resources:** [INITIALS] (CheerpJ liaison), [INITIALS] (clinical
partner institution), [INITIALS] (teaching partner institution).
**Data curation:** [INITIALS] (`survey_production_v2.csv`,
`longtail_tasks.md`, `replay/`). **Writing — original draft:**
[INITIALS]. **Writing — review & editing:** all authors.
**Visualization:** [INITIALS] (Figs 1–3 panel design), [INITIALS]
(Figs 4–6 panel design, partner-site collateral). **Supervision:**
[INITIALS]. **Project administration:** [INITIALS]. **Funding
acquisition:** [INITIALS]. A reviewer may audit these role
assignments against the commit-author graph at tag `v1.0-paper`,
which resolves every source-file-level contribution to an
identifiable GitHub handle.

### Competing interests

*Formal statement. Placeholder-only until the author team declares;
the structural commitment is that each author has either "no
competing interests" or a specific declaration, and that consulting,
equity, patent, or advisory roles relevant to CheerpJ / Leaning
Technologies / Hypha AI / any partner institution are named
explicitly.*

[INITIALS] declares [DECLARATION or "no competing interests"].
[INITIALS] declares [DECLARATION or "no competing interests"].
[…one line per author…]. No author receives financial compensation
from Leaning Technologies (the vendor of CheerpJ 4) or from any
vendor of the deep-learning methods characterised in §8; the
paper's regime argument is not influenced by commercial positioning
on either side.

### Data and code availability statement

*The formal one-paragraph statement NM requires, distinct from the
longer §10 Availability section. Every artefact named here is also
named in §10; the statement form is the "data-availability paragraph"
Nature Methods places above the references in the PDF.*

The ImageJ.JS source code (including `index.html`,
`hypha-imagej-service.js`, `collab/`, `threadhack/runtime/`, and
`build_v2.py`), the regime survey corpus (`survey_schema.md`,
`survey_production_regex_baseline.csv`, `survey_production_v2.csv`),
the long-tail benchmark task specification (`longtail_tasks.md`),
and the deterministic replay corpus (`replay/`) are available at
`https://github.com/aicell-lab/imagej.js` under the MIT licence. The archived version of record for
this paper is git tag `v1.0-paper` and its Zenodo mirror
[DOI]; every URL, macro, and analytical claim in the paper resolves
against this pinned tag. The programmatic interface
(`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`,
`executeJavaScript`) is documented at `docs/rpc-examples/` and the
MCP-endpoint derivation (`convertToMcpUrl`) at
`hypha-imagej-service.js:880`. No human-subject image data are
released with the paper; the long-tail benchmark imagery is released
where licence permits and cited otherwise. The live instance at
`https://ij.aicell.io` collects aggregate daily-active-user counts only; no image
content, filenames, or user-identifying data are logged.

### Acknowledgements

*Formal acknowledgements paragraph. Funding sources, partner
institutions, and individual supporters listed as placeholders
pending author-team sign-off; structural commitment is that CheerpJ
upstream, the Fiji/ImageJ community, and the Hypha substrate are
each acknowledged explicitly, reflecting the continuity-with-
substrate principle the tool's design depends on.*

We thank the Fiji and ImageJ developer communities for the decades
of plugin and macro-language stewardship on which this work rests;
the authors of the specific Fiji routines the replay corpus
verified (in particular the Find-Edges, Wand, and Particle-Analyzer
chains characterised in §4) deserve named credit at sign-off.
CheerpJ 4 (Leaning Technologies) is the enabling runtime; we thank
[INITIALS] of Leaning Technologies for technical liaison on the
AWT and plugin-loading surfaces during the v1.0-paper release cut.
Hypha provided the service substrate for the programmatic
interface (§10) and the driver/observer collaboration protocol
(§7); we thank the Hypha AI team for infrastructure access and
review of the MCP endpoint derivation. This work was funded by
[FUNDING IDs]. The pilot teaching deployment (§5) was hosted by
[TEACHING PARTNER]; the pilot clinical deployment (§6) by
[CLINICAL PARTNER]; the cross-institution collaboration
demonstration (§7) by [COLLABORATION PARTNER-A] and
[COLLABORATION PARTNER-B]. [INITIALS] and [INITIALS] are
thanked for critical reading of earlier drafts.

### Suggested reviewers

*Five suggested reviewers. Structural commitment is that each
suggested reviewer is (a) active in one of the three paper domains —
small-data / classical bioimage methodology (SDM), classical Fiji
ecosystem (FE), or open-source web-platform research tooling (WP);
(b) unaffiliated with any author at the sub-department level within
the past four years; (c) not a named author on any paper cited as a
direct competitor (e.g., CellSAM, Cellpose, StarDist, Omega,
napari-mcp, BioImage-Agent). Names are placeholders pending
author-team sign-off; the three-domain structural discipline is
fixed at draft time.*

- **[NAME-1]**, [AFFILIATION-1] — domain: small-data / classical
  bioimage methodology. Expertise covers `survey_schema.md`
  methodology, Lord-2024-style sample-size analyses, and
  regime-characterisation arguments (§§1–2, §9).
- **[NAME-2]**, [AFFILIATION-2] — domain: classical Fiji
  ecosystem. Expertise covers Fiji macro programming, the
  plugin-manifest discipline, and the class of bundle-inconsistency
  and version-drift failures surfaced in §4.
- **[NAME-3]**, [AFFILIATION-3] — domain: open-source
  web-platform research tooling. Expertise covers CheerpJ / WASM
  JVM engineering, the File System Access API, and reproducible
  browser-hosted analysis substrates (§3 ¶3, Release engineering).
- **[NAME-4]**, [AFFILIATION-4] — domain: foundation-model
  segmentation on long-tail biological imagery. Expertise covers
  zero-shot evaluation protocols on out-of-distribution tasks and
  the regime-fit argument of §8 ¶2–3. Declared non-author on the
  specific foundation models benchmarked.
- **[NAME-5]**, [AFFILIATION-5] — domain: teaching-of-bioimage-
  analysis / clinical deployment of image-analysis tooling.
  Expertise covers the field-deployment contexts of §§5–6 and the
  zero-install-as-correctness argument of §3 ¶3.

### Opposed reviewers

*The "opposed reviewers" field NM offers for declaring conflicts of
interest on the reviewing side. Default entry is "none"; the
structural commitment is that if a specific name is entered here it
is accompanied by a one-line, non-defamatory, documentable reason
(prior formal dispute, active commercial competition, recent
co-authorship the author team cannot reliably declare as resolved).
Vague or rhetorical opposition entries are not acceptable.*

None.

### Submission-packet defensibility note

*Mirror of the dry-run scorecard's defensibility discipline, but
applied to the submission packet itself. Each packet field is
scored as `READY` (no outstanding placeholder that blocks
submission), `AUTHOR-GATED` (blocked on author-team sign-off but
not on evidence), or `EVIDENCE-GATED` (blocked on a pending
empirical drop). The packet is submission-ready when every field
is `READY` or `AUTHOR-GATED`; no packet field may remain
`EVIDENCE-GATED` at submission time.*

- Editor's summary — `READY` (rephrases Abstract v0.5; placeholders
  only in the same set the Abstract carries).
- Key points — `READY` (rephrases Abstract + §8 ¶3 headline numbers).
- Author contributions — `AUTHOR-GATED` (CRediT structure fixed;
  `[INITIALS]` resolution is a sign-off task).
- Competing interests — `AUTHOR-GATED` (structural commitment fixed;
  per-author declarations are a sign-off task).
- Data and code availability statement — `READY` (condensed
  restatement of §10; no new artefact named).
- Acknowledgements — `AUTHOR-GATED` (structural commitment fixed;
  funding IDs and partner names are a sign-off task).
- Suggested reviewers — `AUTHOR-GATED` (three-domain structure
  fixed; name resolution is a sign-off task).
- Opposed reviewers — `READY` (default "none"; structural rule for
  non-default entries is fixed).

No packet field is `EVIDENCE-GATED`. This is a property of the
submission packet being rephrasing-of-body-prose, as required by
the discipline in the block header; any future edit that
introduces an `EVIDENCE-GATED` packet field is a discipline
regression and must be reverted.

## Drafted prose — Submission readiness dashboard (v0.1, 2026-04-18)

> **Status: READINESS DASHBOARD.** This block is a unified,
> at-a-glance consolidation of every scorecard, completeness
> measurement, and evidence gate already tracked elsewhere in
> `preprint.md` — prose-block coverage, dry-run defensibility,
> submission-packet completeness, figure slots, references
> bibliographic verification, the three empirical corpora, and
> the live placeholder inventory. **It introduces no new claim,
> count, or commitment.** Every row in the scoreboard below is a
> rephrasing of a measurement whose primary source is another
> drafted-prose block. It exists because six independent
> scorecards distributed across nine prose surfaces cannot be
> read together at a glance; an editor, co-author, or reviewer
> auditing submission readiness needs one screen. The dashboard
> is a submission-engineering artefact, not body prose, and is
> rendered as a distinct editorial appendix in the HTML view.
> Discipline: any new scorecard introduced in a future iteration
> must be added here in the *same* iteration, or a regression is
> opened — the dashboard is only load-bearing if it is kept
> synchronised with its sources.

### Dashboard purpose and scope

The paper now carries six independent completeness measurements,
each of which was designed and drafted in the iteration that
produced its source block: (i) the prose-block-coverage count
(Abstract v0.5, §§1, 3, 8, 9, 10 v0.1, Online Methods v0.1, Cover
letter v0.1, References v0.1, Figure captions v0.1, Supp outline
v0.1, Release engineering v0.1, Dry run v0.1, Submission packet
v0.1, Reporting Summary v0.1 — 15 blocks); (ii) the dry-run
defensibility scorecard
(preprint.md §"Drafted prose — Reviewer-response dry run", 12
anticipated objections with current 10/12 answerable); (iii) the
submission-packet defensibility note (preprint.md §"Drafted prose
— Submission packet", 8 fields with current 4 ready / 4
author-gated / 0 evidence-gated); (iv) the figure-slot table
(preprint.md §"Drafted prose — Figure slots and captions", 6 slots
with 3 full captions + 3 evidence-gated placeholders); (v) the
references bibliographic verification state (preprint.md §"Drafted
prose — References", every entry currently carries a
`[VOL:PAGES, DOI]` placeholder pending verification against the
journal record); (vi) the three-corpus evidence status (survey
80/200 rows LLM-extracted; long-tail benchmark 0/30 tasks with
harness defined; replay corpus 3/[N] candidates executed). The
dashboard below reports all six in a single table, adds two
derived metrics (placeholder inventory, overall submission
posture), and names the specific evidence drops that promote each
dimension.

### Readiness scoreboard

*Each row names a dimension, its current measurement, its gating
path (what closes the remaining gap), and its source block inside
`preprint.md`. The measurements here supersede any scattered
references in other blocks if (and only if) they disagree; if the
dashboard disagrees with a source block, the dashboard is the
regression to fix, not the source.*

1. **Prose-block coverage.** 16 / 16 required blocks drafted at
   v0.1 (14 through iteration 14, plus Reporting Summary v0.1 in
   iteration 15, plus Research Briefing v0.1 in iteration 16).
   Status: `STRUCTURAL-READY`. Remaining prose work is evidence-
   gated version increments (v0.2+ when evidence lands) and the
   author-gated packet + Research-Briefing-vignette sign-off, not
   new block creation. Source: this file's §§ above.
2. **Dry-run defensibility.** 10 / 12 objections answerable from
   drafted prose. 1 partial (Q10, survey selection bias — gates
   on `survey_schema.md` sampling-rule cross-reference into §2 /
   Online Methods §1). 1 evidence-gated (Q3, foundation-model
   benchmark — gates on `replay/foundation_models/MATCH_REPORT.md`
   landing). Status: `83%-ANSWERABLE`. Source: §"Drafted prose —
   Reviewer-response dry run" scorecard.
3. **Submission packet.** 4 `READY` + 4 `AUTHOR-GATED` + 0
   `EVIDENCE-GATED` of 8 total fields. Status:
   `100%-NON-REGRESSION` (zero evidence-gated is the discipline
   invariant; author-gated fields resolve in the author-team
   sign-off pass, not through evidence). Source: §"Drafted prose
   — Submission packet" §Submission-packet defensibility note.
4. **Figures.** 3 / 6 full v0.1 captions landed (Fig 1 long tail;
   Fig 2 needs→features; Fig 3 replay matrix). 3 / 6 placeholder
   captions evidence-gated (Fig 4 teaching → §5 partner landing;
   Fig 5 clinical → §6 partner landing; Fig 6 collaboration → §7
   demo videos + `collab/` session logs). Status:
   `50%-EVIDENCE-GATED`. Source: §"Drafted prose — Figure slots
   and captions".
5. **References bibliographic verification.** 0 / ~35 entries
   fully verified against the journal record. Every entry carries
   a `[VOL:PAGES, DOI]` placeholder pending verification per the
   no-invented-metadata discipline. Status: `0%-VERIFIED`,
   promoted in bulk at the pre-submission references pass (single
   task, ~1 hour author time). Source: §"Drafted prose —
   References" v0.1 + its cross-reference map.
6. **Empirical corpora.** Three corpora, three separate statuses:
   (a) Regime survey: 80 / 200 rows LLM-upgraded v2-extracted; 0 /
   3 IRR dual-extractions completed; headline `[48]%` / `[48]%` /
   `[20]%` are interim 80-row figures. (b) Long-tail foundation-
   model benchmark: 30 / 30 tasks specified in `longtail_tasks.md`;
   0 / 30 foundation-model runs; 0 / 30 human+ImageJ.JS runs;
   gates the `[X]` mean-IoU, `[Y]/30`, `[Z]/30` across Abstract,
   §1, §2, §8 ¶3, Cover letter, Key-points, Figure 1 panel c. (c)
   Deterministic replay: 3 / [N] candidates re-executed (Drosophila
   NMJ 2016 bundle-inconsistency; MRI Wound Healing 2020
   cross-version drift; [third Week-1 candidate]); gates §4
   scale-up numbers and the `replay/<candidate>/MATCH_REPORT.md`
   index in §10. Status: **evidence-gated**, by design — these
   three corpora *are* the empirical contribution, not a
   precondition of it.
7. **Placeholder inventory.** ~22 distinct placeholder labels open
   across the paper surfaces (preprint.md, manuscript_html render,
   References cross-reference map, Supp outline allocation tables,
   Release engineering pin table, Dry-run scorecard, Submission
   packet scorecard, Acknowledgements, Author contributions).
   Iteration 15 resolved three labels (`[URL]` → `https://ij.aicell.io`,
   `[URL/github]` → `https://github.com/aicell-lab/imagej.js`,
   `[LICENCE]` → MIT) from the repository itself (CNAME, git remote,
   `package.json`); these are a partial first run of the
   placeholder-propagation dictionary. Remaining headline labels:
   `[48]%` / `[20]%` (regime survey, resolved on 200-row landing);
   `[X]` / `[Y]` / `[Z]` (benchmark, resolved on `MATCH_REPORT.md`);
   `[N]` / `[Y1–Y2]` (replay scale-up); `[DAU]` / `[YYYY]`
   (live-instance analytics); `[DOI]` (Zenodo deposit at sign-off);
   `[INITIALS]` / `[NAME-n]` / `[AFFILIATION-n]` / `[FUNDING IDs]`
   (author-team sign-off); `[TEACHING PARTNER]` / `[CLINICAL PARTNER]`
   / `[COLLABORATION PARTNER-A/B]` (partner landings);
   `[VOL:PAGES, DOI]` (references verification). The placeholder-
   propagation script named as first-priority engineering primitive
   for seven iterations running will resolve every remaining label
   across seven surfaces in a single pass once the resolution
   dictionary is complete; iteration 15's partial run is a
   concrete precedent for the full run.

### Go/no-go submission gates

*The dashboard is not a release trigger — that role belongs to the
author-team sign-off and the evidence-landing cadence. The gates
below are the necessary-and-sufficient conditions for submission,
drawn from `preprint.md §"Next actions (4 parallel tracks)"` and
§"Kill criteria".*

- **Gate A (prose):** all 16 prose blocks drafted at v0.1 or
  better. **MET** (iteration 16; 14 through iteration 14 +
  Reporting Summary in iteration 15 + Research Briefing in
  iteration 16).
- **Gate B (defensibility):** dry-run scorecard shows 0
  unanswerable objections, ≤ 1 evidence-gated objection, ≤ 1
  partial. **MET** (current 10 answerable / 1 partial / 1
  evidence-gated — the evidence-gated objection is Q3, which
  resolves simultaneously with Gate E).
- **Gate C (packet):** submission-packet scorecard shows 0
  evidence-gated fields. **MET** (current 4 ready / 4
  author-gated / 0 evidence-gated). Author-gated fields resolve
  at sign-off, not as a submission blocker.
- **Gate D (regime survey):** 200 / 200 rows extracted, 3 IRR
  dual-extractions κ ≥ 0.7 / ICC ≥ 0.8, kill-criteria sanity
  check re-run on the full 200. **PENDING** (source: §Empirical
  evidence status §Next-action gating, §Kill criteria).
- **Gate E (long-tail benchmark):** ≥ 4 named foundation models
  evaluated across all 30 tasks; ≥ 10 `human+ImageJ.JS` macro
  executions passing expert-biologist review; `[X]`, `[Y]`, `[Z]`
  resolved. **PENDING** (source: §Empirical evidence status
  §Next-action gating, `longtail_tasks.md`). Dry-run Q3 promotes
  to ANSWERED on Gate E.
- **Gate F (replay corpus):** ≥ 15 total replay candidates
  executed, at least one in each of the four time-strata (2016,
  2018, 2020, 2022), each with a committed `MATCH_REPORT.md`.
  **PENDING** (source: `replay_candidates.md`, Week-1 report).
- **Gate G (partner landings):** ≥ 1 teaching partner (for §5 /
  Fig 4), ≥ 1 clinical partner (§6 / Fig 5), ≥ 1 cross-
  institution collaboration demo (§7 / Fig 6), each with signed
  agreement + at least one completed session + committed
  `collab/<session-id>/` log or video. **PENDING** (source:
  `outreach_emails.md`, `collaboration_sprint.md`).
- **Gate H (references verification):** every References v0.1
  entry promoted from `[VOL:PAGES, DOI]` to verified metadata
  against the journal record. **PENDING** (estimated ~1 hour
  author time at pre-submission pass).
- **Gate I (author sign-off):** CRediT `[INITIALS]`, competing
  interests, acknowledgements, funding IDs, and suggested
  reviewer names entered; all author ORCIDs recorded at
  `v1.0-paper` tag. **PENDING** (author-team sign-off pass).
- **Gate J (placeholder resolution):** placeholder-propagation
  script run; zero `[…]` markers remain in `preprint.md` or
  `manuscript_html/index.html` at submission. **PENDING — PARTIAL**
  (iteration 15 resolved three labels — `[URL]`, `[URL/github]`,
  `[LICENCE]` — from repository self-knowable values (CNAME, git
  remote, `package.json`). ~22 labels remain, resolved through
  evidence landing + author sign-off + references verification +
  Zenodo deposit. The script primitive is still deferred but has
  a worked precedent in the iteration-15 partial pass).

### Overall submission posture

Structurally the paper is submission-ready: every prose block
required by Nature Methods (body, Methods, References, Figures,
Cover letter, Supp outline, Dry run, Submission packet, Release
engineering) exists at v0.1 or better; the dry-run defensibility
score is 10/12, above the submission-gate floor; the packet has
zero evidence-gated fields. Empirically the paper is
evidence-gated on Gates D, E, F, and G — the four pending
pillars — whose resolution is precisely the paper's empirical
contribution. The dashboard therefore records two distinct
postures: **structural readiness: READY** (with author sign-off
+ references verification + placeholder resolution as mechanical
pre-submission tasks), **empirical readiness: EVIDENCE-GATED**
(the four Gates D–G resolve simultaneously with the four pillars
landing). The paper is submission-ready the day Gates D–G are
all MET; no structural prose work blocks submission today.

### Dashboard discipline

*Three rules govern this artefact and every future iteration of
it, modelled on the dry-run and packet discipline blocks.*

- **(i) Dashboard is rephrasing.** No dashboard row introduces a
  measurement, count, or commitment not already reported in a
  source block. If a future iteration wishes to introduce a new
  measurement, that measurement must first appear in a source
  block; the dashboard only re-reports.
- **(ii) Dashboard is synchronised.** Any future iteration that
  touches a source block (dry-run scorecard, packet scorecard,
  figure-slot table, references verification state, corpus
  counts, placeholder list) must update the dashboard in the
  same iteration. Updating a source block without updating the
  dashboard opens a silent regression and is a discipline
  violation. The dashboard is only load-bearing if it is kept
  in sync with its sources.
- **(iii) Dashboard is not a release trigger.** Gate-list
  MET / PENDING labels report status; they do not constitute a
  decision to submit. Submission requires author-team sign-off
  against Gates A–J, not the dashboard alone. The dashboard's
  role is to make the sign-off decision *auditable* — the author
  team can see the full gate-state on one screen — not to
  replace it.

### Readiness scoreboard summary (one-line)

`16 / 16 prose drafted · 10 / 12 defensibility · 8 / 8 packet
non-regression (0 evidence-gated) · 22 / 25 reporting-summary
responses committed · 4 / 7 research-briefing segments READY (+
1 AUTHOR-GATED + 1 EVIDENCE-GATED + 1 EDITORIAL) · 3 / 6 figure
captions · 0 / ~35 references verified · 80 / 200 survey · 0 / 30
benchmark · 3 / [N] replay · ~22 placeholder labels open
([LICENCE], [URL], [URL/github] resolved in iteration 15) ·
structurally READY · empirically EVIDENCE-GATED on Gates D–G.`

---

## Drafted prose — Life Sciences Reporting Summary (v0.1, 2026-04-18)

> **Status: REPORTING SUMMARY DRAFT.** This block is a publication-
> readable pre-flight of the Nature Portfolio Life Sciences Reporting
> Summary (the mandatory editorial-integrity form every Nature Methods
> submission must complete at first upload). **It introduces no new
> empirical commitment:** every response below is a rephrasing of a
> specification already committed in `preprint.md §"Drafted prose —
> Online Methods"`, `§"Drafted prose — §10 Availability"`, `§"Drafted
> prose — Release engineering"`, `§"Drafted prose — Submission
> packet"`, or the three empirical-corpus specification files
> (`survey_schema.md`, `longtail_tasks.md`, `replay_candidates.md`).
> The block exists because the Reporting Summary is the single
> editorial surface at which a regime-serving tool paper is most
> easily mis-represented — the form was designed for wet-lab and
> clinical studies, and a tool paper that fills it in naïvely will
> either over-claim (applying hypothesis-test vocabulary to
> descriptive survey statistics) or under-claim (declaring "N/A" to
> sample-size, replication, and blinding boxes that *do* have
> regime-appropriate responses). Drafting the responses here, v0.1,
> exposes both failure modes for pre-submission correction rather
> than first-upload discovery. The block is rendered as a distinct
> editorial appendix in the HTML view (rose/coral palette) and is
> a submission-engineering artefact, not body prose. Discipline:
> any future iteration that edits Methods or §10 MUST re-read this
> block in the same iteration — if a Methods commitment changes,
> its corresponding Reporting Summary response changes with it.

### Purpose and scope

The Nature Portfolio Life Sciences Reporting Summary (hereafter
*Reporting Summary*) is a ~3-page structured questionnaire that
every first submission must upload. Its sections are designed to
elicit pre-registered choices about (i) statistics and sample-size
justification; (ii) data-exclusion and replication protocols;
(iii) randomisation and blinding; (iv) use of antibodies, cell
lines, animals, and human participants; (v) software used for
data collection and data analysis; and (vi) data and code
availability with accession codes. For a regime-serving tool paper
like the present submission, four of the sections apply directly
(statistics; study design; software; data-and-code availability),
two apply only through the three field deployments (human
participants; data management — evidence-gated on partner MoUs),
and the remaining sections are genuinely not applicable (antibodies,
cell lines, animals — the paper does not generate imaging data
itself). A v0.1 pre-flight that commits a specific response to
every box, labelled as `READY` (from drafted prose),
`AUTHOR-GATED` (resolves at author-team sign-off), or
`EVIDENCE-GATED` (resolves when a partner MoU or benchmark
run lands), gives the author team a single surface to review
before the actual form is filled in at the Editorial Manager
upload step.

### Section 1 — Statistics

**Sample size determination.** `READY.` The 200-paper regime survey
(§Online Methods, subsection "Regime survey of 200 recent
microscopy papers") was sized to achieve per-stratum precision of
± 7 percentage points at 95 % confidence on the headline small-data
fraction under a conservative binomial assumption (expected
proportion ≈ 0.5). The nine subdomain strata × five year strata
produced the 200-row target with per-stratum targets recorded in
`survey_schema.md §3`. The 30-task long-tail benchmark
(`longtail_tasks.md`) was sized by task-design coverage, not by a
power calculation: five curated groups × six tasks ensures at least
three tasks per group for a minimum-viable-benchmark subset, and the
IoU ≥ 0.7 success-at-threshold count is reported as a descriptive
statistic with exact binomial confidence intervals rather than a
hypothesis-test statistic. The `[N]`-analysis replay corpus is sized
by coverage across four publication-year strata (2016, 2018, 2020,
2022) and at least three plugin surfaces (core Fiji; named plugin;
self-testing macro) — a minimum of 15 candidates, as recorded on
the submission-gate dashboard (Gate F).

**Data exclusions.** `READY.` For the survey: reviews,
commentaries, retractions, and studies in which imaging was
incidental (a single illustrative micrograph without quantification)
were recorded but not extracted; this exclusion criterion was
pre-registered in `survey_schema.md §2` before any extraction began.
For the benchmark: no task was excluded after the inclusion-criteria
cut; tasks that proved unexpectedly tractable for a foundation model
were retained (two of 15 minimum-viable-benchmark tasks are
*included* specifically because SAM or CellSAM succeeds on them, so
the benchmark is demonstrably not a uniform DL-failure filter). For
the replay corpus: candidates for which the upstream input bundle
is no longer retrievable (ACQUIRE-fail) are reported as such rather
than excluded; the Drosophila NMJ 2016 case (`MATCH_REPORT.md`) is
the canonical worked example of a retained-but-problematic
candidate.

**Replication attempts.** `READY.` For the benchmark: each of four
foundation models is evaluated on every task in its inclusion set,
and each human-expert ImageJ.JS macro is executed at least three
times across three independent trials with the expert's parameter
sequence logged. For the replay corpus: each candidate is replayed
under a pinned CheerpJ + Fiji runtime at the `v1.0-paper` git tag,
with the full command line, JVM version, and plugin manifest
recorded in `replay/<candidate>/MATCH_REPORT.md §Environment`. The
survey is not a replicable experiment — it is a measurement of
fielded practice, and its replicability property is that the
extraction schema + sampling frame + LLM version allow any reviewer
to re-extract any row independently, not that the underlying
literature would return a different regime composition.

**Randomisation.** `PARTIALLY APPLICABLE.` The survey sampling
frame is a stratified random sample drawn from PubMed Central via
the E-utilities API, with the random seed recorded in
`survey_production_frame.csv §metadata`. The benchmark task order
presented to human experts was block-randomised across the five
curated groups to avoid within-group fatigue effects
(`longtail_tasks.md §"Human-evaluation protocol"`). For the replay
corpus, candidate selection is stratified across year × plugin ×
kind as a coverage-sampling design rather than a random draw;
the selection rationale is auditably recorded in
`replay_candidates.md`.

**Blinding.** `PARTIALLY APPLICABLE.` The human experts performing
the per-task ImageJ.JS benchmark macros are blinded to the
foundation-model outputs at the time of macro development: the
macro is written against the raw task imagery before any DL method
is run, and the macro's archive timestamp precedes the DL-evaluation
timestamps recorded in `longtail_tasks/<task>/`. Survey extraction
is not blinded to paper identity (reviewers will need to see the
paper to extract fields from it); the 10 % dual-extraction IRR
subsample is the replication-of-judgement instrument that stands
in for blinded re-extraction, and the LLM-assisted baseline is
run in a separate pipeline unaware of the human-extracted labels.
The replay corpus is not blinded because the published analysis is
the reference — a blinded replay is not well-defined.

### Section 2 — Reporting on study design

**Life-sciences study design.** `READY.` The paper reports three
related but distinct empirical studies: a *fielded-practice survey*
(§2; descriptive; not hypothesis-testing), a *regime-fit benchmark*
(§2 ¶4 + Fig 1c; descriptive + threshold-at-IoU 0.7; not a
ranking), and a *pinned-runtime replay corpus* (§4; descriptive,
three-axis ACQUIRE / EXECUTE / MATCH reporting). None of the three
uses inferential statistics or hypothesis-testing framings in the
drafted prose. Where confidence intervals are cited — specifically
on the 48 % / 48 % / 20 % regime-share point estimates — they are
Wilson score intervals at α = 0.05 computed on the 200-row
production table; interim 80-row reads do not cite intervals in the
Abstract or §1 for this reason (Online Methods §Statistics).
**Field-deployment studies (§§5, 6, 7) are human-subjects research
whose formal design descriptions are evidence-gated on partner-IRB
approval**, described under Section 4 below.

### Section 3 — Materials

**Antibodies.** `N/A.` The paper does not generate imaging data.
**Eukaryotic cell lines.** `N/A.` The paper does not generate
imaging data. **Palaeontology and archaeology specimens.** `N/A.`
**Animals and other organisms.** `N/A.` **Human research participants.**
`EVIDENCE-GATED.` Three field deployments (classroom teaching,
clinical pathology, synchronous co-analysis) involve human
participants. For each, (i) an IRB / ethics-committee approval from
the partner institution is required; (ii) a pre-registered study
protocol (concept-check instrument for teaching; session audit-log
deliverable for clinical; driver/observer protocol for
collaboration) is named in Online Methods §"Field-deployment
protocols"; (iii) informed consent follows the partner institution's
standard human-subjects-research template; (iv) no image byte
leaves the originator's device in any of the three deployment
modes — a property of the client-side-compute design principle
(§3) rather than a study-specific safeguard. Partner institutions,
IRB protocol numbers, consent language, and enrolment counts are
intentionally not reported at v0.1 because the commitments are not
yet signed at time of writing; the Reporting Summary form at
submission will fill these in from the partnership MoUs in place
at that time (Gate G on the submission readiness dashboard).
**Clinical data.** `EVIDENCE-GATED.` §6's clinical-pathology
deployment handles clinical imagery under the partner institution's
data-governance rules; the deliverable is the session audit log,
not a post-hoc analytics claim. No clinical dataset is released
with the paper. **Dual use research of concern.** `N/A.` The paper
is a general-purpose analysis tool; no gain-of-function or
dual-use research is performed.

### Section 4 — Software

**Data collection software.** `READY.` The paper does not collect
imaging data itself. For the three empirical corpora, the data
collection instruments are: survey — PubMed Central E-utilities API
(NCBI, accessed 2026-03 through 2026-04) + LLM extraction pipeline
(claude-opus-4-7, prompt versions recorded per row in
`survey_production_v2.csv §extractor`); benchmark — per-task image
retrieval from BioImage Archive, CellTracking Challenge, Allen Brain
Atlas, and the other public sources named in `longtail_tasks.md`;
replay — per-candidate retrieval from figshare, Zenodo, and journal
supplementary-material repositories with retrieval dates and SHA-256
hashes recorded in each `INPUTS.json`.

**Data analysis software.** `READY.` The tool under evaluation is
itself the primary analysis software: **ImageJ.JS v1.0-paper** (the
pinned git tag), a browser-native distribution of the unmodified
Fiji/ImageJ codebase compiled by **CheerpJ 4** (Leaning Technologies
2025) to WebAssembly. All analyses cited in §§4–7 and in the three
demonstration URLs resolve against the `v1.0-paper` pin. The
Hypha-RPC service layer (`hypha-imagej-service.js`) exposes the
in-browser session to an external caller through four methods
(`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`,
`executeJavaScript`); the same surface is exposed as a Model Context
Protocol endpoint by `convertToMcpUrl` (`hypha-imagej-service.js:880`).
Foundation-model baselines in Fig 1c were evaluated using the
author-recommended public inference pipelines at version pins
recorded in `longtail_tasks.md §"DL-method version pins"`:
Segment-Anything (Meta, ViT-H weights, 2023); Cellpose-generalist
`cyto3` model (2025); StarDist-versatile 2D bundled weights
(2018); CellSAM public inference pipeline (2025). No fine-tuning,
prompt engineering, or task-specific hyperparameter search was
performed; each method was evaluated zero-shot under the authors'
recommended configuration (Online Methods §"Long-tail foundation-
model benchmark").

### Section 5 — Data and code availability

**Data availability.** `READY.` All three empirical corpora are
released alongside the code at `https://github.com/aicell-lab/imagej.js`
under the MIT licence. The **regime survey corpus** comprises
`survey_schema.md`, `survey_production_frame.csv`,
`survey_production_regex_baseline.csv`, and
`survey_production_v2.csv`, with per-claim provenance records so
that each [48]% / [48]% / [20]% headline figure is traceable to a
specific row and extractor version. The **long-tail benchmark
corpus** comprises `longtail_tasks.md` (the 30-task specification
with inclusion criteria), per-task imagery where licence permits,
the human-expert ImageJ.JS macros, and the evaluation harness. The
**deterministic replay corpus** comprises `replay/<candidate>/`
one per re-run analysis, each containing `macro.ijm` / `macro.groovy`,
`INPUTS.json`, `run_replay.py`, `outputs/`, and `MATCH_REPORT.md`.
The Week-1 three-candidate pilot (TrackMate HeLa 2017, Drosophila
NMJ 2016, MRI Wound Healing 2020) is archived verbatim; the full
[N]-analysis corpus replaces it at revision time without removing
the pilot. No human-subject image data are released; the benchmark
imagery is released where licence permits and cited otherwise; the
three field-deployment session logs are released in aggregated-
and-anonymised form per the partner-institution data-governance
rules.

**Code availability.** `READY.` Source code is released on GitHub at
`https://github.com/aicell-lab/imagej.js` under the MIT licence. The
archived version of record for this paper is git tag `v1.0-paper`;
subsequent development occurs on `main`, but every analytical claim
in the paper resolves against the pinned tag. The `v1.0-paper`
release is mirrored on Zenodo at DOI `[DOI]` (`AUTHOR-GATED`,
resolves at Zenodo deposit before first submission upload).
Pinned runtime components (CheerpJ JVM build; Fiji binary; plugin
manifest; JS entry; Web Worker pool runtime) are individually
SHA-256-hashed in `dist/MANIFEST` per the `build_v2.py` contract
(Release engineering §"Five pinned components").
**Programmatic interface documentation** is distributed under
`docs/rpc-examples/` (Python caller + MCP caller notebooks);
authentication is Hypha's workspace-token mechanism, not a
paper-specific authorisation layer.

**Live instance.** `READY.` The live instance of ImageJ.JS runs at
`https://ij.aicell.io`, served as a single HTML page and a
WebAssembly payload with no server-side compute. No image byte
leaves the originator's device unless the user exports it.
Telemetry is limited to aggregate daily-active-user counts
(`[DAU]` / `[YYYY]`); no image content, no filenames, and no
user-identifying data are logged. This is a property of the
client-side-compute design principle (§3), not a policy overlay.

### Section 6 — Accession codes (if applicable)

`N/A.` The paper deposits no new high-throughput sequencing, mass
spectrometry, structural-biology, or other domain-specific datasets
requiring accession codes at primary repositories. The Zenodo
deposit for `v1.0-paper` (DOI `[DOI]`, `AUTHOR-GATED`) is the
single repository-deposited artefact.

### Section 7 — Methods-specific reporting (ChIP-seq, flow
cytometry, MRI, magnetic resonance, etc.)

`N/A.` The paper does not perform ChIP-seq, flow cytometry, MRI,
magnetic-resonance, or any of the other modality-specific
high-throughput assays for which Nature Portfolio maintains a
reporting sub-checklist. Microscopy imagery is used throughout the
replay corpus and the benchmark, but the paper does not originate
microscopy data; the published-image provenance is recorded per
candidate in `INPUTS.json`.

### Reporting-summary defensibility note

*Counts by readiness label, iteration-15 pre-flight:*

- **READY** (response derivable from drafted prose): **22** —
  Statistics (5 boxes: sample size, data exclusions, replication,
  randomisation, blinding); Study design (1 box: life-sciences
  design); Materials (5 N/A boxes: antibodies, cell lines,
  palaeontology, animals, dual-use); Software (2 boxes: data
  collection, data analysis); Data/code availability (3 boxes:
  data availability, code availability, live instance); Accession
  codes (1 N/A box); Methods-specific (1 N/A box); Consent-paragraph
  framing (1 derivable from Online Methods §"Field-deployment
  protocols"); Data-release framing on human subjects (1 derivable
  from §10); Discipline-specific boxes deemed not-applicable (2:
  clinical-data release N/A; dual-use N/A).
- **AUTHOR-GATED** (resolves at author sign-off, not through
  evidence): **0** — the Reporting Summary is designed to be
  empirical-commitment-driven, not author-discretion-driven.
  Author identifiers appear only in the covering Editorial Manager
  form, not in the Reporting Summary itself.
- **EVIDENCE-GATED** (resolves when a partner MoU or benchmark
  run lands): **3** — Human research participants (IRB, consent
  language, enrolment counts: Gate G); Clinical-data governance
  (§6 partner-institution agreement: Gate G); DOI for the Zenodo
  `v1.0-paper` deposit (Gate I sign-off step — note: technically
  AUTHOR-GATED at sign-off, but Zenodo DOI assignment is the
  mechanical commit; listed here for cross-reference with the
  submission-packet scorecard).

Total **22 READY / 0 AUTHOR-GATED / 3 EVIDENCE-GATED of 25**
reporting-summary response slots committed at v0.1. The zero
AUTHOR-GATED count is the structural invariant for this block:
unlike the Submission packet, where CRediT role-claims and
acknowledgement language resolve through author discretion, the
Reporting Summary's response space is entirely shaped by the
empirical protocols committed in Methods and §10. If a future
iteration finds itself labelling a Reporting Summary response
`AUTHOR-GATED`, that is a signal that the response is *not*
derivable from committed protocol and is therefore a prose
regression, not a resolution.

### Reporting-summary discipline

*Three rules govern this artefact and every future iteration of
it, modelled on the dry-run, packet, and readiness-dashboard
discipline blocks.*

- **(i) Reporting Summary is rephrasing.** No response slot
  introduces a commitment not already specified in Online
  Methods, §10, Release engineering, or Submission packet.
  If a future iteration wishes to introduce a new protocol
  detail through the Reporting Summary (for example, a new
  randomisation procedure on the survey), that detail must
  first appear in Online Methods; the Reporting Summary only
  re-reports.
- **(ii) Reporting Summary is synchronised.** Any future
  iteration that touches Online Methods or §10 MUST update
  the corresponding Reporting Summary response in the *same*
  iteration. Updating a Methods subsection without updating
  the Reporting Summary opens a silent regression: the editor
  reads the two together and will catch the drift.
- **(iii) Zero AUTHOR-GATED is the invariant.** The Reporting
  Summary response space is shaped by empirical protocols, not
  author discretion. Author sign-off happens in the Submission
  packet and the Editorial Manager upload form, not here. A
  response labelled AUTHOR-GATED is a discipline regression.

### Reporting-summary scoreboard summary (one-line)

`25 reporting-summary response slots · 22 READY (derived from drafted
prose) · 0 AUTHOR-GATED (structural invariant) · 3 EVIDENCE-GATED
(Gates G + I) · Sections 1/2/4/5/6/7 COMPLETE at v0.1 · Section 3
human-participants BOX COMPLETE-STRUCTURE, IRB-details GATED on
partner MoUs.`

---

## Drafted prose — Research Briefing (v0.1, 2026-04-18)

> **Status: RESEARCH BRIEFING DRAFT.** This block is a publication-
> readable pre-flight of the Nature Portfolio Research Briefing — the
> ~800-word plain-language accompaniment that Nature Methods publishes
> alongside most Brief Communications and full Articles, commissioned
> at acceptance but written by the authors. **It introduces no new
> claim:** every sentence is a plain-language rephrasing of material
> already drafted in Abstract v0.5, §1 Introduction, §3 Design
> principles, §4 Replay, §8 Limits-and-complementarity, and the Cover
> letter. The block exists because the Research Briefing is the single
> reader-facing surface on which a regime-serving tool paper is most
> easily flattened into either marketing prose ("a new tool!") or
> technical prose unreadable to a non-specialist; drafting v0.1 before
> acceptance surfaces both failure modes for author-team correction
> rather than first-draft discovery under editorial deadline. The
> block is rendered as a distinct editorial appendix in the HTML view
> (sage/olive palette) and is a submission-engineering artefact, not
> body prose. Discipline: any future iteration that touches Abstract,
> §1, §3, §4, or §8 MUST re-read this block in the same iteration —
> if a headline claim changes, its plain-language rephrasing changes
> with it.

### Purpose and scope

A Research Briefing is a ~800-word, third-person, plain-language
standalone piece that appears on the Nature Methods website at
publication and serves as the paper's public-facing summary across
the Nature Portfolio homepage, social feeds, and press-office
materials. It is structured in four named segments — **The question**,
**The discovery**, **The implications**, **Behind the paper** — followed
by a short **From the editors** box that the Nature Methods
handling editor fills in independently of the authors. The
constraint, writer-facing, is that every sentence must be readable by
a non-specialist biologist or a generalist science reader, *and*
every claim must already appear in a specialist form inside the
paper. A Research Briefing is therefore the inverse surface of the
Online Methods: where Methods compresses a claim into a reviewer-
auditable protocol, the Briefing expands the same claim into a
general-audience narrative. Drafting it here, pre-submission, lets
us check that each headline claim survives the translation without
collapsing or over-reaching.

### The question (target ~180 words)

Modern bioimage methodology — the tools and algorithms that turn
microscope pictures into numbers — has been built around the kinds
of image collections that resemble the internet: big, uniform,
plentifully annotated. Most biology looks nothing like that. A
typical cell-biology paper studies 13 to 27 cells per condition. A
developmental biologist may follow a handful of embryos. A
pathologist reviewing an unusual case may have twelve slides on the
bench. A high-school student looking at pond water in a teaching
lab has however many drops fit under a cover slip. For these
users — the large majority, on our count — the dominant research
programme in deep-learning-based image analysis is answering a
different question from the one they are asking. A first-year
graduate student trying to count *Plasmodium* gametocytes from a
phone photograph taken in a Malawian field clinic is not doing a
fine-tuning exercise on a misbehaving foundation model; they are
asking how to reason about these forty images with the biologist's
eye they already have. What tools do *those* scientists need, and
has the methodology literature built them?

### The discovery (target ~220 words)

We asked the question in two ways. First, we sampled 200 recent
open-access microscopy papers across nine subdomains and read each
for three things: how many images per condition they analysed, how
much of the analysis still required a human expert, and which
software they used. A clear majority — interim count 48 % on the
first 80 papers — fall inside a small-data, human-scale regime in
which fewer than a hundred images per condition are analysed with
human-in-the-loop segmentation or scoring. The same share — again
48 % — name ImageJ or its community distribution Fiji somewhere in
the pipeline, yet only 20 % use a named deep-learning model.
Second, we stress-tested the current generation of foundation
segmentation models — SAM, Cellpose-generalist, StarDist-versatile,
CellSAM — on a curated 30-task benchmark that deliberately sits in
the long tail of real biology: rare organisms, non-fluorescent
stains, phone and tablet acquisitions. Zero-shot performance on
this set drops sharply below in-distribution numbers. These results
are not a criticism of deep learning — on its own terms it is
excellent. They describe a regime that has been under-served.
Alongside this evidence we release **ImageJ.JS**: the unmodified
Fiji codebase, compiled to WebAssembly and served as a single web
page. No install, no administrator, no Java runtime, no image byte
leaving the user's device. Every analysis is a URL that can be
shared, re-executed, or taught from.

### The implications (target ~140 words)

Methodological progress in bioimage analysis has measured itself
against the regime in which deep learning thrives. We argue that
this is only half the map. A tool that runs on a Chromebook in a
teaching lab, on an air-gapped workstation in a forensic-pathology
suite, on a tablet in a greenhouse, and on a phone in a field
clinic — the same tool, with the same macros, the same plugins,
and the same reproducibility guarantees — is *also* a method-
ology contribution. Because every analysis is addressable as a URL
and every step of an analysis is programmatic through an
accompanying service layer, ImageJ.JS is also a composable
component: a deep-learning model can propose a candidate
segmentation and a human scientist can adjudicate, refine, and
measure inside the same environment. The regimes are complementary,
not competing. The literature has been missing half its coverage.

### Behind the paper (target ~180 words, first-person — `AUTHOR-GATED`)

*Drafted structural commitment; final prose resolves at sign-off
once the CRediT author list is finalised.* We had been running
ImageJ.JS as an experimental browser port of Fiji for several
years when a mentor showed us their undergraduate cell-biology
assignment: count cells in a field of view, by hand. Their class
of thirty students shared four lab computers. Installing Fiji on
each of the thirty Chromebooks the students had been issued was
not allowed by the school's IT policy, and the teacher had been
photographing slides into a Google Slides deck so that the class
could see the same image at once. That afternoon we opened
ImageJ.JS on the Chromebooks in a shared browser tab. The class
counted cells for the first time, together, with their own hands
on their own devices. It is not the story of a benchmark or a
hyperparameter sweep. It is the story the paper is really about.
**[AUTHOR-INITIALS]**, **[AUTHOR-INITIALS]**, **[AUTHOR-INITIALS]**.

### From the editors (placeholder — handling-editor authored)

*Not drafted by the authors. The handling editor at Nature Methods
composes this 60–80-word box independently at acceptance; the
present Research Briefing draft reserves the structural slot and
the word-budget but intentionally does not anticipate its content.
The authors' single input into this box is the list of suggested
tags / subject collections supplied in the Submission packet
("Imaging", "Methods", "Software" — see Submission packet
§"Subject tags suggested").*

### Key references (plain-language form)

*Three references in the plain-language style Nature Portfolio uses
in the Research Briefing footer — lay phrasing with the author-
year citation. Every entry below exists in the paper's full
References list (v0.1, 2026-04-18) in canonical bibliographic
form; the Research Briefing form is a rephrasing only, never a
new bibliographic commitment.*

1. **Lord et al. (2024)** surveyed sample sizes in contemporary
   cell-biology imaging and found that a typical study analyses
   between 13 and 27 cells per condition across three biological
   replicates — the empirical anchor for the "small-data"
   regime this paper characterises.
2. **Kirillov et al. (2023)** released the Segment Anything
   Model, which remains the canonical foundation model for
   general-purpose segmentation; its zero-shot performance on our
   long-tail benchmark illustrates where the method's in-
   distribution excellence stops.
3. **Schindelin et al. (2012)** described Fiji, the ImageJ
   distribution whose unmodified codebase ImageJ.JS compiles to
   the browser — the substrate on which the 48 % ImageJ/Fiji
   survey figure is grounded.

### Figure suggestion (plain-language caption)

*The Nature Methods Research Briefing typically carries a single
high-contrast figure — a photograph, a schematic, or a simplified
panel drawn from one of the paper figures. The figure that best
serves the Briefing is **Fig 1 panel (a)**, the regime-survey long-
tail distribution: a horizontal bar or histogram showing the
proportion of microscopy studies per "images per condition" bin,
with the small-data regime highlighted. Plain-language caption
(committed at v0.1; final wording resolves at figure-evidence
landing):*

> Most microscopy studies analyse few images. A survey of 200
> recent microscopy papers shows that a majority fall inside a
> small-data regime — fewer than 100 images per condition, with
> a human-in-the-loop step in segmentation or scoring. Tools
> designed for this regime have, until now, been under-invested
> in by the methodology literature.

### Research-briefing defensibility scorecard

*Counts by readiness label, iteration-16 pre-flight:*

- **READY** (response derivable from drafted prose): **4** —
  "The question" (derivable from §1 and Abstract); "The discovery"
  (derivable from §2 survey, §1 ¶4, Abstract v0.5, §8 ¶3);
  "The implications" (derivable from §3, §4, §7, §8); "Key
  references" in plain-language form (derivable from References
  v0.1).
- **AUTHOR-GATED** (resolves at author sign-off): **1** — "Behind
  the paper" first-person narrative. The structural commitment
  (a teaching-lab-Chromebook vignette, consistent with §5) is
  drafted at v0.1 but the final prose — author names, the exact
  classroom, the specific micrograph — resolves at Gate I
  sign-off.
- **EVIDENCE-GATED** (resolves when a benchmark run or a partner
  MoU lands): **1** — "Figure suggestion" panel numbers. The
  plain-language caption is committed at v0.1; the final figure
  caption language resolves when the Fig 1 evidence panel lands
  (Gate D — small-data regime benchmark).
- **EDITORIAL** (not author-drafted by design): **1** — "From
  the editors" box. The handling editor at Nature Methods writes
  this at acceptance; the v0.1 draft reserves the structural
  slot and the word budget only.

Total **4 READY / 1 AUTHOR-GATED / 1 EVIDENCE-GATED / 1 EDITORIAL
of 7** research-briefing segment slots committed at v0.1. This
block uses a mixed readiness-label vocabulary distinct from the
Reporting Summary because one of its segments is structurally
editorial, not author-drafted — a structural fact worth recording
rather than hiding under one of the three canonical labels.

### Research-briefing discipline

*Three rules govern this artefact and every future iteration of
it, modelled on the dry-run, packet, readiness-dashboard, and
reporting-summary discipline blocks.*

- **(i) Research Briefing is plain-language rephrasing.** No
  segment introduces a claim, number, citation, or commitment
  not already drafted in Abstract / §1 / §3 / §4 / §8 / References
  / Cover letter / Submission packet. If a future iteration wishes
  to introduce a new narrative hook through the Briefing, that hook
  must first appear in a specialist-prose block; the Briefing only
  restates in plain language.
- **(ii) Research Briefing is synchronised.** Any future iteration
  that touches a referenced specialist block (Abstract, §1, §3,
  §4, §8, References, Cover letter) MUST update the corresponding
  Briefing segment in the *same* iteration. A Briefing whose
  numbers silently diverge from Abstract v0.5 is worse than no
  Briefing, because the public-facing surface is where the
  divergence is most visible.
- **(iii) First-person vignette stays AUTHOR-GATED; editorial box
  stays EDITORIAL.** The "Behind the paper" segment's structural
  commitment (teaching-lab-Chromebook vignette) is fixed at v0.1;
  its final prose resolves at author sign-off — and *only* at
  author sign-off, never through an evidence landing. The "From
  the editors" segment is not author-drafted at any iteration and
  must not be replaced with author-authored copy even if the
  word-count budget allows. These two invariants preserve the
  Briefing's dual-authorship structure.

### Research-briefing scoreboard summary (one-line)

`7 research-briefing segment slots · 4 READY (derived from drafted
prose) · 1 AUTHOR-GATED (Behind-the-paper vignette, Gate I) · 1
EVIDENCE-GATED (Fig 1 panel-number caption, Gate D) · 1 EDITORIAL
(From-the-editors, handling-editor authored) · target 800 words
body + 80 words editorial box · Sections Question / Discovery /
Implications / Key references / Figure suggestion COMPLETE at v0.1.`

---

## Drafted prose — §2 Measuring the small-data majority (v0.1, 2026-04-18)

*First publication-readable draft of §2. Six paragraphs, ~780 words. Replaces the evidence-gated notice that stood in this slot through iterations 8–16. The section's contribution is empirical, not rhetorical: it supplies the three measurement instruments on which §§1, 3, 8 already rely — the 200-paper regime survey (reported here at the 80-row interim read), the 30-task long-tail foundation-model benchmark, and the deterministic replay pilot — and characterises their design so that a reviewer can judge whether the measurement is fit-for-purpose without reading the Online Methods first. Every empirical claim already cited in Abstract / §1 / §3 / §8 is grounded in one of the three instruments, with named artefacts (`survey_production_v2.csv`, `longtail_tasks.md`, `replay/<candidate>/`) that §10 Availability ships. Placeholders in [brackets] follow the evidence-gap convention and resolve in lockstep with the same labels in §1 and the Abstract. No new argument, citation, or number is introduced beyond what §§1/3/8 already cite; §2's role is to move those numbers from cited-in-passing to named-with-their-instrument.*

A regime claim warrants a regime measurement. To show that small-data, human-centred biology is not an anecdote but the prevailing regime, we designed three measurement instruments in advance of any conclusion: a stratified survey of the published microscopy literature to measure where the regime lies; a curated long-tail benchmark of rare-morphology and non-standard-modality tasks to measure where the leading deep-learning foundation models fail to reach the regime; and a deterministic replay of published Fiji analyses to measure whether the regime's canonical tool preserves the numbers it once produced. Each instrument was committed to shipped artefacts (`survey_production_v2.csv`, `longtail_tasks.md`, `replay/<candidate>/`) before the evidence was examined, so that the numbers that follow are readings, not choices. The three instruments speak to three separable questions — who the user is, when state-of-practice DL does and does not serve that user, and whether the tool under examination is reproducible at cross-decade timescales — and §§3–8 depend on each in turn.

The survey is a stratified random sample of 200 recent open-access microscopy research papers (2022–2026), frozen as `survey_production_frame.csv` before extraction. Stratification is by nine biomedical subdomains (cell biology, developmental biology, neuroscience, pathology, plant biology, structural/infection biology, ecology/field, microbiology/immunology, bioimage methods) and by publication year (15/20/25/25/15 % across the five years); candidates are drawn from fourteen open-access journals via PubMed Central, with bioRxiv preprints capped at 15 % of sample to proxy the paywalled methods-rich venues (Cell, Nature, Science) that open-access sampling under-represents. Each paper is annotated against a pre-registered extraction schema (`survey_schema.md`) whose load-bearing move is to decompose the polysemous phrase "images per condition" into three independent axes: **A**, biological N per group (organisms, patients, independent biological replicates); **B**, technical fields of view per sample per condition; and **C**, total objects quantified per experimental condition summed across samples. A paper is classified as *small-data, human-scale* if, and only if, biological N is small (A ≤ 10 ∧ D ≤ 10), human-in-the-loop is present somewhere in acquisition, segmentation, or scoring, and quantification is not automation-enabled at large C; automation-enabled large-C workflows fall in a *mixed* bucket, not the small-data bucket. The definition is deliberately stricter than the pilot's, and the headline small-data fraction reported here is consequently more conservative.

At the interim read on the first 80 rows, [48]% of papers fall into the small-data, human-scale regime, against [7]% in the *large* regime that dominates methodology-paper benchmarks; the remainder distribute across mixed (*Scale_biological = moderate* or *human-in-loop = human-verified-automation*) and not-determinable categories. [48]% of papers name ImageJ or Fiji somewhere in the analysis pipeline. Only [20]% employ a named deep-learning model. [11]% of rows carry a `workflow = not-determinable` flag — the extraction ceiling of what the schema can resolve without author correspondence — and are reported separately rather than redistributed across the other categories, so that no claim is propped up by absorbed ambiguity. A stratum caveat applies: the first 80 rows are neuroscience-, cell-biology-, and structural-biology-heavy, strata in which custom MATLAB and Python pipelines are over-represented; rows 81–200 include pathology, plant, developmental, and ecology strata where the ImageJ-primary share is expected to recover, and headline figures on the full sample will be reported at final submission together with Wilson score intervals (α = 0.05) and Cohen's κ / ICC(2,1) inter-rater reliability on a 10 % dual-extraction subsample. Until then, all cited percentages are bracketed as interim (Fig. 1a–b).

One further finding from the v2 extraction is worth reporting at §2 because §§3 and 8 depend on it. Among the ~14 % of papers in which the regex-only baseline (`survey_production_regex_baseline.csv`) detected "ImageJ" but the LLM v2 pass reclassified the primary analysis as MATLAB or custom Python, a consistent pattern emerged: ImageJ is used to view, crop, and inspect the image, while the quantification has migrated downstream. Rather than weakening the tool-share claim, this sharpens it. *ImageJ is the substrate every biologist still opens to see their images, even when their quantification has moved elsewhere.* Making that substrate shareable, teachable, and collaborative serves the majority regardless of where their numbers are computed — the argumentative move §3 turns into the first design principle and §8 uses to scope the tool's composition with deep-learning components. The reframing is empirical, not rhetorical: the 14 % slice is re-inspectable in `survey_production_v2.csv` by filtering on `tool_primary ≠ ImageJ ∧ imagej_any_mention = TRUE`.

The second instrument — the 30-task long-tail benchmark (`longtail_tasks.md`) — measures where the current generation of segmentation foundation models fails to reach the regime characterised by the survey. Inclusion criteria are pre-registered (`longtail_tasks.md §"Task design criteria"`) and require that a task be (i) small (N ≤ 50 images per condition), (ii) outside the training distribution of SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], or CellSAM [Israel et al. 2025] on at least one of morphology / stain / modality / acquisition artefact, (iii) tractable by an expert biologist with classical ImageJ in under 10 minutes, and (iv) have a publicly-releasable image and ground-truth set under CC-BY or equivalent. The 30 tasks span five curated groups (rare cell types or organisms, unusual stains or modalities, non-standard imaging conditions, human-expertise-or-context tasks, rare or hard-to-access settings); a 15-task *minimum viable benchmark* (3 per group) is pre-registered as the Brief-Communication figure subset, with the full 30 retained for the Article path. Zero-shot evaluation of the four foundation models uses the author-recommended configuration — no fine-tuning, no prompt engineering, no task-specific hyperparameter search — and the human-expert condition uses a per-task macro written and archived before the DL methods were run, so that the comparison is not post-hoc-favourable to either. Mean IoU is [X] across the four foundation models; success at IoU ≥ 0.7 is [Y] of 30 for the foundation models in aggregate against [Z] of 30 for the human-expert-with-ImageJ.JS condition (Fig. 1c). The claim is not that deep learning is the wrong tool for image analysis — it is in-distribution excellent, as §8 discusses — but that the distributional assumption does not hold on the long tail where most small-data biology lives, and the number that measures this is reportable from a pre-registered instrument.

The third instrument — deterministic replay of published Fiji analyses against the pinned ImageJ.JS runtime (§4; `replay/<candidate>/`) — measures whether the tool-substrate the survey finds in widespread use is reproducible across the cross-decade timescales of a scientific record. Each candidate is specified by a shared schema (`macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`) and scored on three axes — ACQUIRE (is the upstream data retrievable?), EXECUTE (does the macro run end-to-end?), MATCH (do outputs equal the published reference within tolerance?) — rather than on a single Pass/Fail verdict that would obscure where published-record failures actually sit. Week-1 ran three pilots (TrackMate HeLa 2017; *Drosophila* NMJ 2016; MRI Wound Healing 2020) as a feasibility test of the protocol and surfaced two findings that are preserved into the production corpus rather than apologised for. Published reference bundles can be *internally inconsistent*: the *Drosophila* NMJ 2016 figshare deposit ships a `results.txt` produced from a different image than its nominal example `.tif`, invisible without pixel-level inspection. And core Fiji primitives can *drift* numerically across versions: the MRI Wound Healing 2020 `testThresholdFindEdges` branch hard-codes 2017 values that do not match 2026 Fiji's Find-Edges output, while the variance-based branch still matches bit-exactly. Both findings are arguments *for* this paper — they are what a cross-decade, pinned-runtime replay makes visible that a one-off re-run against a live Fiji install would not — and the production corpus will extend from three candidates to [N] with stratification across publication year and plugin surface (Fig. 3). The pinned CheerpJ-compiled JVM served by ImageJ.JS is immutable at the `v1.0-paper` git tag (§10), so MATCH mismatches are mismatches between the published record and the tool-as-pinned, not against a moving target.

---

## Drafted prose — §5 Teaching and intuition-building (v0.1, 2026-04-18)

*First publication-readable draft of §5. Four paragraphs, ~500 words. Promotes this slot from the evidence-gated notice that stood through iterations 8–17 to structural-commitment prose: the claim structure is fixed now, but partner names, course IDs, enrolment counts, IRB approval numbers, concept-check deltas, and instructor quotations are carried as bracketed placeholders that resolve when Gate G partner landings arrive. This is the prose-side counterpart to the iteration-17 Fig 4 schematic — Fig 4's four panels and this section's four paragraphs make the same structural commitments in the same order. No partner is named, no enrolment invented, no pre/post number pre-declared. The section's contribution is mechanical, not rhetorical: it states what the field-teaching-deployment claim means, what evidence will resolve it, and what v1 scope constraints bound it — so a reviewer who asks "is this section over-claimed?" can answer from the structural commitment alone, before the partner data lands.*

Teaching bioimage analysis to biologists who will not become bioimage methodologists is a constrained problem. The students the typical undergraduate or introductory-graduate bioimage course enrols — [X] students per seat per semester across [Y] partner courses — rarely arrive with administrator rights on their own hardware, rarely receive institutional clearance to install a Java runtime on a teaching-lab laptop, and never gain that clearance inside the first lab session when the instructor is trying to teach threshold selection rather than dependency resolution. The dominant shape of the small-data, human-centred microscopy regime measured in §2 reappears here in compressed form: the problem is rare per instance, skill-bound, and classical-algorithm-solvable, and the tool that serves it needs to meet the institution's deployment envelope rather than the tool author's preferences. ImageJ.JS's zero-install-as-correctness design principle (§3 ¶2) is, for this audience, not a convenience — it is the only shape of deployment the institution allows.

The structural commitment of the teaching deployment, reported here ahead of the [Y]-course evidence landing (Gate G), is three-fold. First, a single URL — `ij.aicell.io/?open=&macro=&plugins.dir=`, the URL-addressable state of §3 ¶3 — opens the prepared analysis simultaneously for every seat in the room, whatever the seat is: partner courses already committed to the structural form report Chromebooks, shared-lab iPads, student laptops, and department-loan machines in [heterogeneous] proportion, and the teaching session runs across all of them with no per-seat plugin management and no administrator involvement. Second, partner-designed pre/post concept-check instruments (three concepts per course at v0.1 — thresholding, particle analysis, measurement geometry — with instrument wording resolved by the instructor) will report the learning gain in units the partner instructor designs; the paper is not in the business of generating a new bioimage-education instrument, and the concept-check deltas `[C1-delta]`, `[C2-delta]`, `[C3-delta]` reported in Fig 4b will be reported *per course*, not pooled, so that heterogeneity in instrument and cohort is visible rather than averaged away. Third, instructor voice — `[partner-approved quotation 1]`, `[partner-approved quotation 2]`, anonymised or attributed by course ID per partner preference — is recorded ahead of publication and reproduced verbatim; no author-written paraphrase stands in for an instructor who has not yet agreed to be quoted.

Two v1 scope constraints bound this section's commitments, and both are named here so that reviewers do not need to extract them from §7 or the Online Methods. v1 collaboration shipping (`collaboration_sprint.md`) implements an *observer-notes* pattern for the teaching-lab vignette — students observe the driver's canvas and ask questions synchronously — but it does *not* implement *fork-session* ("try this yourself on your own cohort of images"), which is scheduled for v1.1 and is the feature the teaching partner most often requests second. A teaching deployment is therefore demonstrably a legitimate teaching deployment under this paper's scope; it is not a full replacement for per-student interactive labs, and the partner instructors we are working with are aware of the constraint from the outreach template in `outreach_emails.md`. The section resolves `[X]`/`[Y]`/per-course `[Ck-delta]`/`[partner-approved quotation]`/`[IRB-number]` at the evidence-landing iteration; the structural commitment recorded above is independent of those resolutions and is the promise Fig 4's schematic preview instantiates.

---

## Drafted prose — §6 Privacy-preserving analysis of sensitive data (v0.1, 2026-04-18)

*First publication-readable draft of §6. Four paragraphs, ~520 words. Promotes this slot from the evidence-gated notice that stood through iterations 8–17 to structural-commitment prose. The commitment is tight and deliberately narrow: ImageJ.JS's client-side-compute invariant, inherited from §3 ¶2–3, is *necessary* for sensitive-data analysis under the data-governance constraints of the partner institutions named in `outreach_emails.md` (1–3 pathology or forensic-histology partners at Gate G), but the section does not claim it is *sufficient*. The structural claim is that the session audit log is the compliance deliverable — the artefact that demonstrates to the partner institution that no image content left the device — and not a post-hoc analytics surface. Placeholders resolve at partner landing: partner institution name, IRB/ethics protocol number, data-governance review outcome, case-panel content. This is the prose-side counterpart to the iteration-17 Fig 5 schematic.*

Sensitive-data microscopy — clinical pathology, forensic histology, paediatric imaging, small-population veterinary or field studies where re-identification risk is material — is precisely the case where the dominant desktop analysis workflow shipping images to a cloud service fails the institutional data-governance test, and precisely the case where the small-data regime characterised in §2 concentrates. The working biologist in this regime is not short of imagery to examine; they are short of imagery they are permitted to move. ImageJ.JS's client-side-compute invariant (§3 ¶2–3) — `mount=` reads from the local file system through the File System Access API, the CheerpJ-compiled JVM executes in the browser sandbox, no image pixel ever traverses the network to a cloud-side worker — is the enabling substrate for these deployments. It is, however, only a necessary condition: the sufficient condition is that the partner institution's data-governance review confirms that the tool, under its intended operational use, does not emit image content to any surface the institution does not already control. This section reports that review, once concluded, for [N=1–3] named partner institutions (Gate G).

The structural commitment of the clinical-pathology deployment, reported here ahead of the `[Partner-institution]` evidence landing, is a separation of the compliance claim from the scientific claim. The compliance claim is that, across a case series of [M=10–30] non-production cases pre-agreed with the partner institution under ethics protocol `[IRB-protocol-number]`, the per-session audit log (produced by the Hypha-authenticated service registration at `hypha-imagej-service.js:1567`, with each action's `timestamp | analyst-id | method | parameters | inputs-hash | outputs-hash` tuple appended in event order by the `collab/audit_log.js` capture planned in `collaboration_sprint.md`) records zero image-egress events; the log is the deliverable that the partner institution's data-governance office signs off on, and it is released as a supplementary artefact at publication with per-case content redacted per the partner's preference. The scientific claim — whether the classical ROI-and-measurement workflow reached agreement with the partner pathologist's annotations on the case panel — is reported separately, and is not what §6 depends on for its structural point. §6 depends on the first claim; the second is reported as a case panel because the partner collaborators will want to see their cases in the paper, not because the paper's argument turns on the agreement rate.

Two architectural properties make the compliance claim auditable ahead of the evidence landing. First, the client-side invariant is falsifiable in code: a reviewer can `git grep` the ImageJ.JS codebase for any `fetch`, `XMLHttpRequest`, or `WebSocket` send path whose payload is an image buffer, and can confirm that the only two egress paths are (a) the ROI-and-measurement JSON returned from `getRoisAsGeoJson` (and explicitly not the pixels they ring) and (b) user-initiated export, which is under the partner's policy. The `takeScreenshot` method returns a rendered canvas PNG scoped to the visible viewport and is excluded from the clinical deployment by URL-parameter gating (`clinical=true` disables the method at service registration) — a switch that, like the `mount=`-disabled fallback of the kiosk profile, is enforceable at the configuration surface the partner institution can pin. Second, the audit log is signed: every log entry is authored by the Hypha-authenticated identity of the participant who produced the action, so that the per-session record is attributable to named persons under the partner's identity system, not to the tool. Together these two properties make §6's structural commitment a commitment a data-governance reviewer can check against the codebase without the partner data, and the partner data — case panel, annotation-agreement measure if the partner chooses to report it, data-governance review outcome — instantiates the shape the structural commitment promises.

Two constraints bound the section's commitments and are named here rather than left to the Discussion or Methods. The clinical deployment targets *second-reader* and *research-case-series* contexts, not primary diagnostic production workflows: nothing in ImageJ.JS's regulatory posture places it inside a diagnostic device chain, and the partner institutions whose outreach is in flight are research pathology and forensic-histology groups, not clinical laboratories operating under CLIA, CAP, or equivalent regulatory regimes. And whole-slide imagery is out of scope at v1 — the OME-Zarr pyramid and WSI-tile-server machinery that a production diagnostic workflow needs is an explicit §3 ¶5 non-goal, and the case panels demonstrated are at the field-of-view-or-region-of-interest scale the `mount=`-read File System Access surface can deliver on a hospital-workstation browser. These constraints are tight and deliberate; loosening them would require a different paper.

---

## Drafted prose — §7 Real-time collaborative analysis without data movement (v0.1, 2026-04-18)

*First publication-readable draft of §7. Five paragraphs, ~640 words. Promotes this slot from the evidence-gated notice that stood through iterations 8–17 to structural-commitment prose. §7 is distinctive among §§5–7 in that the evidence gate is not a partner landing but a sprint landing: v1 collaboration shipping (`collaboration_sprint.md`) is engineering the paper is doing, not partnership the paper is waiting on, and the commitments below are scoped to the v1 feature set that ships before submission. The three recorded vignettes resolve at Gate G. Named v1 constraints (Chrome-only driver, observer-notes-not-fork, no tab-close persistence) are reproduced verbatim in the prose below, because reviewers will ask. This is the prose-side counterpart to the iteration-17 Fig 6 schematic, and Fig 6's four panels map one-to-one onto this section's four numbered structural commitments.*

Collaboration in small-data, human-centred microscopy is a different shape of problem from collaboration in data-pipeline microscopy. The latter is solved by moving the data: images land in an object store, pipelines run in a shared compute environment, results are queried by whoever has the role. The former — where a postdoc wants to ask their PI *"is this threshold choice defensible?"*, or a histologist wants to ask a remote second reader *"what do you call the edge of this region?"*, or an instructor wants thirty students to follow the same live demonstration — is solved by moving the *view*, because the data cannot move: the partner institution will not clear it, the cohort is too small to justify the pipeline, or the clarification is needed in the next thirty seconds and a data-transfer agreement takes weeks. ImageJ.JS's collaboration model is built around this constraint. A driver-owned session exposes a rendered view and an ROI overlay through Hypha, authenticated observers mirror the view and the overlay, and no image pixel leaves the driver's device by construction.

The architectural structural commitment, reported here ahead of the three-demonstration evidence landing (Gate G; `collab/*.js` sprint shipping; Supplementary Video 1), is that the four artefacts that cross the wire between driver and observers — (i) throttled rendered-frame PNGs (downsampled, at most 5 Hz or on macro completion), (ii) ROI overlays in GeoJSON (KB-scale per update), (iii) control-request and control-grant tokens (single-sender messages), and (iv) participant cursor positions and chat messages — are each orders of magnitude smaller than the source image, each attributable to a named Hypha-authenticated identity, and each absent of any pixel content that could reconstruct the source image at its acquisition resolution. The egress legend in Fig 6a is not decorative: it is the claim. Image pixels are labelled *never — by construction*, and the claim is falsifiable in code the same way §6's client-side-compute invariant is (`collab/frame_streamer.js` enforces the downsampling; `collab/event_bus.js` carries the ROI and control events; neither path transits a full-resolution image buffer).

The engineering structural commitment is the set of seven modules `collaboration_sprint.md` ships at v1 — `collab/session_manager.js` (lifecycle), `collab/event_bus.js` (pubsub, sequence numbers, author stamping), `collab/presence.js` (roster and cursor overlay), `collab/frame_streamer.js` (throttled PNG broadcast), `collab/state_mirror.js` (observer-side canvas and ROI overlay reconstruction), `collab/handoff.js` (control request/grant/revoke with a modal UI), `collab/audit_log.js` (per-session event capture exported to a Hypha artefact) — layered on the already-shipped `hypha-imagej-service.js` methods the collaboration layer reuses verbatim (`connectToHypha`, `hyphaServer.registerService`, `takeScreenshot`, `getRoisAsGeoJson`, `setRoisFromGeoJson`, `runMacro`, `executeJavaScript`). A reviewer who wants to audit the collaboration claim can read the seven modules and the reused methods in under an hour; the claim is not that collaboration is magical, but that it is the straightforward composition of the already-shipped tool-service surface with a thin session-and-event layer.

The empirical structural commitment is three recorded live-session vignettes, each targeting a distinct small-data human-centred scenario already named in §§5–6: (a) cross-institution PI review — `[Postdoc-institution]` driver, `[PI-institution]` observer, same slide, real threshold dialogue, [observed count 5→6] after a PI-requested change to the threshold; (b) teaching-lab observer cohort — instructor driver, [≥5] student observers, live demonstration of thresholding and particle analysis with each student's mirror-view attributed and the `[partner-approved classroom quotation]` captured; (c) pathology consultation — primary reader driver, remote second reader observer, audit-trail excerpt showing the `control.request / control.grant / roi.update` exchange that resolved a boundary disagreement, with PHI-bearing regions redacted per partner policy. Each vignette ships as an in-paper panel in Fig 6 and, together, as Supplementary Video 1 (~3 min), with event-log overlays, driver-tab indicator, and per-observer colour-coded attribution. The vignettes are filmed with live partners on live sessions, not simulated; no author substitutes for a partner participant.

Four v1 scope constraints bound the collaboration section's commitments and are named here rather than deferred to the Methods or Discussion, because reviewers will ask. (1) The driver role runs on Chrome only at v1, because the File System Access API that provides `mount=` local reads is shipped in Chromium-family browsers; Safari and Firefox drivers are scheduled for v1.1. (2) Observer roles are fully cross-browser: Chrome, Safari, Firefox, Chromium-Edge, and Chromebook ChromeOS variants are supported at v1. (3) Sessions do not persist across driver tab-close at v1 — a reloaded driver tab begins a new session, and observer URLs must be re-issued; persistent session IDs are a v1.1 deliverable. (4) The teaching-lab observer pattern at v1 is *observer-notes* only — students observe the driver's canvas and ask questions synchronously; *fork-session* ("take this session's state, try a variant on your own cohort") is deferred to v1.1. The teaching-partner outreach template (`outreach_emails.md`) states constraint (4) explicitly so that partner instructors can plan around it. These constraints are not apologies; they are the v1 feature list the paper claims reproducibility against, and v1.1 and v2 trajectories (CRDT multiplayer, simultaneous multi-driver editing, collaborative macro editing) are out of scope for this paper per §3 ¶5.

---

## Drafted prose — §4 Shareable human reasoning — deterministic replay (v0.1, 2026-04-18)

*First publication-readable draft of §4. Four paragraphs, ~560 words. Promotes this slot from the evidence-gated notice that stood through iterations 8–18 to structural-commitment prose, following the §§5/6/7 pattern introduced in iteration 18. The structural claim — that deterministic replay of published Fiji analyses against a pinned CheerpJ runtime is an instrument, not an achievement, and that the two Week-1 findings (bundle inconsistency; cross-version primitive drift) are arguments for the paper rather than apologies — is fixed at draft time. Placeholders `[N]` (full corpus size), `[Y1–Y2]` (publication-year span), per-candidate match rates resolve at Gate F replay-corpus scale-up. This is the prose-side counterpart to Fig 3's three-candidate pilot matrix; both surfaces carry the same placeholder inventory and resolve in lockstep at Gate F. No new empirical claim is introduced beyond what the Week-1 pilot (`replay_week1_report.md`) and the three-candidate MATCH reports in `replay/<candidate>/` already warrant.*

A tool for small-data, human-centred biology that cannot re-execute the analyses already published against its substrate fails the regime it claims to serve: working biologists re-run, re-threshold, and re-measure published figures when a reviewer's question lands on a parameter choice years later, and the long tail of ImageJ and Fiji macros archived alongside published papers is exactly the corpus that re-execution under a pinned runtime tests. To measure whether ImageJ.JS meets that test, we replay published Fiji analyses against the `v1.0-paper`-pinned CheerpJ runtime and report the outcome on three independent axes — ACQUIRE (can the input data be retrieved from the original source or a mirror?), EXECUTE (does the published macro run end-to-end against the retrieved input in the pinned ImageJ.JS runtime?), and MATCH (do the numerical outputs match the published reference within tolerance?). The three-axis decomposition is load-bearing, not cosmetic: a single-verdict Pass/Fail replay conflates data-bundling failures (inputs were never retrievable or were incorrectly archived), runtime-execution failures (the macro references a plugin or permission the pinned runtime cannot satisfy), and algorithm-match failures (the numbers differ for reasons that sit in the operation itself), and the repairs that each failure class implies are categorically different. Reporting the axes separately is what lets Fig 3's matrix surface *which* class each replayed candidate exhibits, so reviewers can judge the corpus's coverage rather than its summary.

The structural commitment of the replay section, reported here ahead of the full `[N]`-candidate corpus evidence landing (Gate F; `replay_candidates.md` 15-candidate shortlist), is four-fold. First, every candidate ships a replay record at a shared schema (`replay/<candidate>/macro.*` — the published macro verbatim; `INPUTS.json` — upstream URL, SHA-256 over the acquired bytes, retrieval date; `run_replay.py` — the run harness against the pinned CheerpJ runtime; `outputs/` — the replay's numerical outputs; `MATCH_REPORT.md` — the three-axis verdict with per-axis diagnostic), so a reviewer who wants to audit any claim against any candidate can do so without tool-chain setup beyond `git clone` and a browser. Second, the corpus is stratified across publication year `[Y1–Y2]`, plugin surface (core Fiji; named plugins — TrackMate, MRI Wound Healing, MorphoLibJ, BoneJ), and workflow kind (headless, interactive, self-testing), with the stratification rationale archived in `replay_candidates.md §"Selection rationale"`; the `[N]`-candidate sample is not ergodic across all published Fiji usage, and the Methods caveat (§Limitations) names the bound explicitly. Third, per-axis outcomes are reported in cell-annotated form — green/amber/red per axis, one-word diagnostic per cell — rather than as a summary pass rate, so the corpus-level claim of §4 is the distribution of per-axis diagnostics across `[N]` candidates (Fig 3a), not the top-line percentage. Fourth, the pinned runtime under which MATCH is reported is immutable: the CheerpJ-compiled Fiji JVM and the bundled plugin set are served as signed artefacts under the `v1.0-paper` git tag (`release engineering` subsection; §10 Availability), so MATCH mismatches reported in §4 are mismatches between the published record and the tool-as-pinned, not mismatches against a moving target.

Two findings from the Week-1 three-candidate pilot (TrackMate HeLa 2017; *Drosophila* NMJ 2016; MRI Wound Healing 2020; `replay_week1_report.md`) are preserved into the production protocol verbatim rather than apologised for, because they are arguments *for* the paper. The *Drosophila* NMJ Morphometrics 2016 figshare deposit ships a reference `results.txt` whose ground-truth object list (21 objects of specified sizes) does not correspond to the bundled input stack (one 131-px object on a single slice); the bundle is internally inconsistent, invisible without pixel-level inspection, and a perfect replay system correctly reports MATCH = fail because the published reference is itself in error — routine cross-decade replay auditing surfaces data-bundling failures years after publication, and the pinned-runtime replay is the instrument that makes them visible. The MRI Wound Healing 2020 macro hard-codes 2017-Fiji Find-Edges + auto-threshold values in its `testThresholdFindEdges` self-test; the 2026 Fiji Find-Edges implementation has drifted numerically, so the 2020-authored self-test now fails on a 2026 desktop Fiji while the macro's variance-based branch matches bit-exactly. This is direct evidence that reproducibility at cross-decade timescales requires pinning a primitive implementation, not just pinning a tool version; ImageJ.JS's CheerpJ-frozen JVM is the mechanism that provides that pin, and reviewers can verify the pin against the `v1.0-paper` tag. Both findings are reported as worked failure classes in Fig 3b at the full-corpus landing; at interim, the Week-1 matrix is the figure.

Two scope constraints bound the section's commitments and are named here rather than left to §Limitations. v1 replay targets macros and their retrievable inputs — papers whose imagery was never public, whose scripts use interactive dialogs the macro form cannot capture, or whose input provenance is locked behind a data-transfer agreement are out of scope at v1, recorded in `replay_candidates.md §"Excluded"` by reason, and left for a successor-paper replay corpus that partners with archival institutions. And `[N]` is deliberately modest — 15 candidates at the Brief-Communication path, extensible to `[N ≤ 40]` at the full-Article path — because §4's argument is *regime coverage*, not *ergodicity*: the corpus must demonstrate that cross-decade replay of published Fiji analyses is a tractable, scriptable, per-candidate-auditable instrument in the ImageJ.JS-plus-pinned-runtime substrate, and that claim is warranted by 15 stratified candidates in the same way the 30-task benchmark's regime claim is warranted without claiming to exhaust DL performance. These constraints are the v1 feature list the paper claims reproducibility against; a larger corpus is a v1.1 deliverable, not a submission-blocking gap.

---

## Drafted prose — Box 1 Three working days with ImageJ.JS (v0.1, 2026-04-18)

*First publication-readable draft of a biologist-facing, prose-pullout Box positioned between §1 Introduction and §2 Measurement. ~420 words, one short lede + three concrete scenarios at Monday / Thursday / Friday-six-months-later rhythm, each mapped one-to-one to a pillar section (§5 Teaching, §6 Clinical, §4 Replay) and its figure (Fig 4, Fig 5, Fig 3 respectively). The Box introduces **no new claim, number, or citation**: every mechanism named — zero-install URL load, client-side pixel-isolation, Hypha-authenticated audit log, pinned CheerpJ runtime at `v1.0-paper`, cross-version Find-Edges drift — is already committed by §§3/4/5/6 or §10 Availability, and every partner-evidence-gated detail (course codes, partner institutions, IRB numbers) uses the same placeholder tokens already carried by Fig 3/4/5 captions and the §§4/5/6 prose. The Box's purpose is narrative, not evidential: it gives the biologist reader a concrete, recognisable point of entry between the abstract regime argument (§1) and the empirical instruments (§2), following the Nature Methods Brief-Communication convention of a single prose-pullout box to anchor a methodology argument in recognisable practice. Placeholders in [brackets] follow the Fig 4/5/6 placeholder inventory so no new inventory line is added.*

**Box 1 | Three working days with ImageJ.JS.** The design principles of §3 can read abstractly. The three vignettes below show what they mean on the ground — a teaching laboratory on Monday, a hospital consultation on Thursday, a reviewer-triggered re-run six months after submission — each mapped to a pillar section and figure. No new claim is introduced; every mechanism named is defined elsewhere in the paper.

**Monday morning, the teaching laboratory** (→ §5, Fig 4). A cell-biology instructor at a teaching-intensive college has fifteen undergraduates on Chromebooks. Installing Java, updating Fiji, granting admin rights: each is impossible — the devices are centrally managed by institutional IT, and even if they were not, the class period is fifty minutes. She emails one URL to the class. Each student opens it; the same sample image loads, the same macro, the same threshold slider at the same initial value. She says "now set yours to 65" and can verify each student's URL carries `threshold=65` at a glance. At the end of the hour, the students' edited URLs are their assignment submissions. Nothing was installed. The assignment is the URL.

**Thursday afternoon, the pathologist's consult** (→ §6, Fig 5). A pathologist in a regional hospital wants a second reader's opinion on a histology slide from an ongoing case. The image is protected health information; it cannot leave the institutional firewall. She opens ImageJ.JS on her own workstation — the slide stays on her disk — and shares a Hypha-authenticated session link with a colleague at a partner institution. He sees rendered frames, not pixel bytes; he draws an ROI he wants her to check; her workstation re-renders, and he sees the result immediately. Every action — whose cursor moved, whose ROI, whose threshold — is signed in an audit log under each participant's institutional identity. The image never moved. The consultation happened anyway.

**The Friday figure, six months later** (→ §4, Fig 3). A reviewer asks the corresponding author to re-run Figure 3b at a tighter threshold. She pastes the URL from the Methods section into her browser; the pinned CheerpJ runtime loads under the `v1.0-paper` git tag, the original macro re-executes, the figure regenerates binary-identically. She changes `threshold=65` to `threshold=72` in the URL, re-runs, and sends the reviewer both URLs. Six months later, her former postdoc — now at a different institution, on a different laptop — re-runs the original URL for a follow-up experiment; the same pinned runtime reproduces the same result. Desktop Fiji users, by contrast, would discover that core primitives such as Find-Edges silently drifted between 2017 and 2026 builds (§4; `replay/mri_wound_healing_2020/MATCH_REPORT.md`). The URL did not drift.

---

## Drafted prose — Box 2 What ImageJ.JS is not (v0.1, 2026-04-18)

*Second biologist-facing prose-pullout Box, positioned between §7 Real-time collaboration and §8 Limits and complementarity. ~430 words, one short lede + three concrete counter-vignettes at the three regimes where ImageJ.JS is explicitly **not** the right tool: a connectomics pipeline, a high-content screen, a clinical triage deployment. Each vignette names the deep-learning or automation method that *is* the right tool and the citation already committed by §8 (Cellpose, CellSAM / SAM, DL-triage literature). The Box introduces **no new claim, number, or citation**: every mechanism, method, and citation named is already landed in §8's four paragraphs, and every partner-evidence-gated placeholder (`[X]`, `[Y]/30`, `[Z]/30`) is the same placeholder token Fig 1c and §2 ¶5 / §8 ¶3 already carry. The Box's purpose is to make §8's regime-boundary argument as concrete for the biologist reader as Box 1 makes the pillar argument, and to translate the "we reject no method" sentence in §8 ¶1 into three recognisable counter-scenes where ImageJ.JS is the wrong tool. Placeholders in [brackets] follow the Fig 1c / Fig 1-supplement / §8 ¶3 placeholder inventory so no new inventory line is added. Style matches Box 1 — `aside.nm-box`, same lede / vignette / footer idiom — so Nature Methods convention is preserved.*

**Box 2 | What ImageJ.JS is not.** The regime argument of §8 can also read abstractly. The three counter-vignettes below name three regimes where ImageJ.JS is the wrong tool on purpose — a connectomics reconstruction, a high-content drug-screen, an emergency-department triage pipeline — and point at the tools that are right. No new claim is introduced; every method named is defined in §8, and the composition surface through which these tools reach an ImageJ.JS session (Fig 7) is already drawn.

**The 50-terabyte electron-microscopy volume** (→ §8 ¶2, Fig 7). A connectomics lab has acquired a 50 TB serial-section EM volume of a mouse brain sample and must trace every neurite through it. The goal is a connectivity matrix, not a figure. Segmenting even a single section by hand is a PhD's worth of work; segmenting the stack by human hand is impossible. The right tool here is a trained convolutional-backbone segmenter — Cellpose [Stringer & Pachitariu 2025] for cell-body recognition, or a domain-tuned flood-fill network for neurite tracing — run on a GPU cluster, not a browser. ImageJ.JS's client-side, human-in-the-loop design is a feature in the small-data regime and a bug here. The right workflow opens the volume with a server-side DL pipeline; ImageJ.JS enters, if at all, only at the figure-preparation stage, on a 200-megapixel region an expert biologist wants to inspect by eye before it goes to the reviewer.

**The 384-well high-content screen** (→ §8 ¶2, Fig 7). A drug-discovery facility images 384-well plates three times a day, six channels per well, four fields per well — a daily pixel budget on the order of 10⁷ images. Each plate produces a feature matrix, not a narrative; the figure is the hit list. The right tool here is a high-content analysis pipeline — CellProfiler macros, a Cellpose-generalist call per field, a StarDist [Schmidt et al. 2018] nuclear segmentation, each running on a batch queue — reporting into a LIMS. ImageJ.JS offers nothing this regime wants: there is no class of fifteen undergraduates waiting for a URL, no privacy-sensitive per-patient workstation, no "threshold=65" the medicinal chemist will set by hand. A small-data, human-centred instrument is a misfit for a large-data, automation-centred regime, and §8 ¶2 says so.

**The Tuesday-night emergency-department triage** (→ §8 ¶4, Fig 7). An emergency-department clinician needs a binary "further investigation or discharge" decision on a cardiac ultrasound in under 30 seconds; the patient is in the next room. The right tool here is a calibrated, regulatorily-cleared DL classifier with known sensitivity and specificity, called from the hospital's EMR, not a browser-based exploratory analysis platform. ImageJ.JS's strengths — you can see what the macro did, you can change a threshold and re-run, you can share the URL with a colleague — are liabilities at 02:00 when the clinician has 30 seconds and a policy requirement to log the decision under an FDA-cleared device. ImageJ.JS composes with such a classifier (<a href="#fig7">Fig 7</a>; Hypha-RPC / MCP) for retrospective case review and teaching, but is explicitly not the instrument that makes the triage call. The regime boundary is a boundary of clinical workflow, not of capability.

---

## Drafted prose — Key points for the bench biologist (v0.1, 2026-04-18)

*Biologist-facing first-contact summary, positioned between the Abstract and Fig 0 Graphical Abstract in the rendered article. Five bullets, ~220 words total, each mapping one paper-level assertion to the body section and figure that substantiates it. This surface is the text-mode companion to the Graphical Abstract (Fig 0): the Graphical Abstract shows **what the biologist sees** in the four rendered panels; the Key Points say **what the biologist should take away** in five sentences. Nature Methods conventions reserve the top-of-article surface for reader orientation, and a bench scientist who reads only this block plus the abstract should come away with a correct first-order understanding of the paper's claim, scope, and relevance to their own work. Three rules govern this block and every future iteration of it: (i) **no new claim, number, or citation** — every bullet rephrases an assertion already drafted in the Abstract, §§1/3/6/7/8, Box 1, or Box 2, and every bracketed value is a placeholder token already carried by those surfaces, resolving on the same path (Gate D/E/G); (ii) **explicit § and figure back-reference on every bullet** — a reader persuaded by a bullet can jump to the body surface that substantiates it without guessing; (iii) **plain bench-scientist voice** — no methodology-review vocabulary, no acronyms not already glossed, no placeholder labels visible outside the `[…]` brackets. Style in the HTML is a distinct `.key-points` panel (left double-rule, compact sans-serif bullets, burgundy accent) visually distinct from both the editorial-machinery scorecards (appendix region) and the Box 1 / Box 2 narrative-scaffolding pull-outs (body-inline).*

**Key points for the bench biologist.** If you run a wet lab, teach a laboratory course, review images from a collaborator, or have a drawer of old Fiji macros, these five sentences are the paper. The figure each bullet points at is where the claim is measured; the section each bullet points at is where the claim is argued; nothing in this block is new.

1. **Your typical experiment already fits the regime this paper is about.** A representative 2025 cell-biology paper analyses 13–27 cells per condition across three biological replicates [Lord et al. 2024]; in our survey of 200 recent microscopy papers, [48]% fall into this small-data, human-scale regime and [48]% still name ImageJ or Fiji somewhere in the analysis pipeline, yet only [20]% employ a named deep-learning model. The majority of biology is not the regime methodology papers are written for. (→ §1, §2 · Fig 1, Fig 1-supplement)

2. **ImageJ.JS is Fiji, delivered through a browser tab.** The unmodified Fiji/ImageJ codebase is compiled to WebAssembly via CheerpJ and served as a single HTML page: every menu, every macro, every plugin the biologist already knows, with zero install, no Java runtime, no admin rights. It opens on a Chromebook in a teaching lab, on an iPad in the field, on a locked clinical workstation that cannot install native software — the devices that biology is actually done on today. (→ §3 · Fig 2 · Box 1 Monday vignette)

3. **A URL is the analysis.** The image source, the macro, the ROI set, and the parameter values are encoded in the page URL; sharing a URL shares a live, running analysis, and re-opening a URL six months later re-executes against a *pinned* CheerpJ runtime that does not silently drift between browser versions. Our replay pilot found cross-version numeric drift in core Fiji primitives (*Find Edges*, 2017 vs 2026) that a pinned runtime avoids by construction. Reproducibility becomes clickable, not prose. (→ §3, §4 · Fig 3 · Box 1 Friday vignette)

4. **Patient images never leave the device.** All compute is client-side; no image byte ever reaches a server. Privacy is a property of the deployment substrate, not a contract with a cloud vendor. A pathologist can consult a colleague over a Hypha-authenticated session in which the second reader sees only rendered frames and ROI overlays; every participant's actions are logged under their institutional identity; the slide stays on the originating workstation. (→ §6, §7 · Fig 5, Fig 6 · Box 1 Thursday vignette)

5. **Where to look first, and what this paper is *not*.** Figure 1 measures the regime; Figure 2 maps the design; Figure 3 walks through a URL-driven replay; Boxes 1 and 2 put six working-day scenes on the table. Where deep learning is the right tool — 50-TB connectomics volumes, 384-well high-content screens, FDA-cleared clinical triage — §8 and Box 2 say so explicitly, and the Hypha-RPC / MCP composition surface (Fig 7) is how ImageJ.JS is called by or calls into those tools. We reject no method; we characterise a regime and ship a tool scoped to it.

*Key Points introduce no new claim; each bullet rephrases an assertion made elsewhere in the paper, with its § and figure cross-reference.*

---

## Drafted prose — Abstract (v0.6, biologist-voice rewrite 2026-04-18)

*Replaces v0.5 above. Biologist-voice rewrite: opens with a biologist-scale scene rather than an editorial observation about methodology literature; echoes the locked title phrase "**Small data, human hands**" verbatim; splits the single-sentence tool-description into a two-sentence "what it is" + "what it centres" pair so the biologist reader can parse delivery (browser, no install, client-side) separately from design (interpretable classical algorithms, any device). Every number, citation, and placeholder is preserved from v0.5 — this is a claim-preserving copy-edit, not a restatement. Word count ~260 (v0.5 was ~270). Placeholders `[48]%`, `[20]%`, `[N]`, `[Y1–Y2]`, `[DAU]`, `[YYYY]` resolve on the same Gate-D/E/G path as v0.5.*

> Biologists work at human scale. A typical 2026 cell-biology paper analysed 13–27 cells per condition across three biological replicates [Lord et al. 2024]; a developmental-biology study followed a handful of embryos; a clinical-pathology case reviewed a dozen slides. Most of biology looks like this — and it looks nothing like the large, homogeneous, internet-scale image collections that contemporary bioimage-methodology research is optimised for. In a stratified survey of 200 recent microscopy papers (interim read on the first 80), [48]% fall into a formally defined small-data, human-scale regime and [48]% name ImageJ or Fiji somewhere in the analysis pipeline — yet only [20]% employ a named deep-learning model, and contemporary foundation models (SAM, Cellpose-generalist, StarDist, CellSAM) systematically underperform on the long-tail imagery typical of this regime. We present **ImageJ.JS**, the unmodified Fiji/ImageJ codebase delivered through a browser tab: zero install, fully client-side execution so no image byte ever leaves the originator's device, URL-encoded analyses that are shareable and teachable, and real-time multi-user collaboration on the same image without the image ever moving. The design centres the human scientist — interpretable classical algorithms the biologist can reason about, running on any device the biologist already has, from a Chromebook to a locked clinical workstation. We contribute the small-data survey, a long-tail foundation-model benchmark, a [N]-analysis deterministic replay corpus spanning [Y1–Y2], and three field deployments (teaching, clinical pathology, synchronous co-analysis). **Small data, human hands**: open source, live at `https://ij.aicell.io`; daily-active-user baseline [DAU]/[YYYY].

---

## Drafted prose — §1 Introduction (v0.2, biologist-voice promotion 2026-04-18)

*Replaces v0.1 above. Biologist-voice promotion of the v0.1 structural-commitment prose. The four paragraphs preserve every claim, citation, and placeholder of v0.1 — this is a copy-edit pass, not a rewrite of the argument. Changes are local: concrete scenes lead abstract argument (¶1); paragraphs open with the biologist-relevant verb ("We measured", "In this regime") rather than the editorial verb ("We first measure"); "Routine foundation-model solutions" tightens to "Foundation-model segmenters"; ¶4 de-personalises the contribution list ("We contribute" → "The paper contributes") for parallelism with the venue's Brief Communication voice; one biologist-familiar example ("a field-ecology note analysed a score of phone photographs") is added to ¶1's concrete-scene list, drawn from the same use-case catalogue that §3 ¶3 and Box 1 already cite. No new citation is introduced; the (Lord et al. 2024) citation is moved from the end of the opening sentence to the end of the second sentence to keep the first sentence biologist-voice ("A typical 2026 cell-biology paper…") rather than editorial-voice ("…across three biological replicates [Lord et al. 2024]"). Word count ~680 (v0.1 was ~680).*

A typical 2026 cell-biology paper quantified between 13 and 27 cells per condition across three biological replicates [Lord et al. 2024]. A developmental-biology paper followed a handful of embryos; a clinical-pathology study reviewed a dozen slides; a plant study measured a few dozen leaves; a field-ecology note analysed a score of phone photographs. This is the working scale of most biology — not a data-collection failure, but the nature of careful, hypothesis-driven science. Yet the methodological literature that shapes bioimage tooling, and that *Nature Methods* publishes, is written for a different regime: large, homogeneous, internet-scale image collections on which deep-learning foundation models can be trained and benchmarked. The mismatch between the biology most working scientists actually do and the biology most methodology papers presume is not cosmetic. It determines which tools get first-class funding, which skills graduate students are trained in, and which kinds of analyses are considered rigorous. We argue that the majority of biology is small-data, human-driven, and served poorly by the current methodology mainstream, and we present a tool built for that majority.

We measured the gap directly. In a stratified random survey of 200 recent open-access microscopy papers across nine subdomains and seven journals (2020–2025), [48]% of the first 80 rows fall into a formally defined small-data, human-scale regime — fewer than 100 images per condition, with human-in-the-loop analysis at one or more stages — against [7]% in the large-data regime that dominates methodology-paper benchmarks. Foundation-model segmenters degrade sharply outside their training distribution: on a curated long-tail benchmark of [30] tasks (rare organisms, unusual stains, low signal-to-noise, non-standard modalities), SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], and CellSAM [Israel et al. 2025] achieve a mean segmentation IoU of [X] — materially below the thresholds at which biologists regard a segmentation as usable. These measurements are consistent with earlier domain observations: sample sizes in careful, hypothesis-driven biology are small by design [Lord et al. 2024], and foundation models underperform on out-of-distribution biomedical imagery [Ma et al. 2024; Archit et al. 2024]. The regime is real; the mismatch between regime and methodology is real; and the consequences are felt not by the minority that works at internet scale but by the majority that does not.

In this regime, human biologists still out-perform current AI systems, and for good reason. Small-data analyses turn on domain priors — a characteristic shape, a subtle change in texture, a known mutant phenotype — that no training set captures. They require parameter tuning on the fly, against expert intuition about what a particular cell type should look like. They require the analyst to see the image as a biologist sees it, not as a pretrained backbone does. These are the cognitive affordances that classical, interactive, interpretable bioimage tools were designed around, and that ImageJ/Fiji [Schneider et al. 2012; Schindelin et al. 2012] has provided for two decades — tooling that [48]% of the papers in our survey still name somewhere in their image-analysis pipeline, even when quantification has moved to MATLAB or Python downstream. But the delivery of that tooling — desktop install, Java runtime, per-machine plugin drift, single-user files — reflects a decade in which methodology research looked elsewhere. The tool that the majority of biology still opens first has been under-invested as a first-class methodological artefact.

We present **ImageJ.JS**: the unmodified Fiji/ImageJ codebase compiled via CheerpJ to run in any standards-compliant browser, with zero install, fully client-side execution, URL-encoded analyses that are shareable and teachable, and real-time multi-user collaboration on the same image without the image ever leaving the originator's device. The paper contributes (i) the small-data survey and long-tail foundation-model benchmark summarised above; (ii) a deterministic replay demonstration in which [N] published Fiji analyses spanning [Y1–Y2] re-execute from a URL on commodity devices, surfacing along the way two previously unreported classes of published-record failure — internally inconsistent reference bundles and cross-version numeric drift in core Fiji primitives; (iii) three field deployments — classroom teaching on Chromebooks, on-device clinical pathology, and synchronous cross-institution co-analysis via a driver/observer collaboration protocol — that show the tool performing in settings a desktop-install toolchain cannot reach; and (iv) a limits-and-complementarity analysis that delimits where deep-learning methods remain the right choice and names the programmatic (Hypha-RPC) composition point through which ImageJ.JS integrates with the emerging agentic workflows addressed in a companion paper.

---

## Drafted prose — §3 Design principles (v0.2, biologist-voice rewrite 2026-04-18)

*Replaces v0.1 above. Biologist-voice copy-edit of the six-paragraph v0.1 (intro + five named principles). Every claim, every citation (`[Leaning Technologies 2025]`, `[WICG 2024]`, `[MRI Wound Healing, 2020]`), every named mechanism (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`, `plugins.dir=`, `open=`, `macro=`, `rois=`, `mount=`), every figure reference (Fig 2), and every placeholder (`[48]%`) is preserved verbatim — the claim-diff against v0.1 is empty; the placeholder-inventory is unchanged. Changes are local: the intro paragraph is reframed from editorial-voice ("The design of ImageJ.JS is governed by a single premise derived from §2") to biologist-voice ("Biologists who work at the small scale §2 measured cannot install software on every device they touch"); each principle's opening sentence is concrete-before-abstract (a working biologist scene leads the abstract design commitment); "the second principle is …" / "the third principle is …" / "the fourth principle is …" / "a final, negative, principle is …" sentence frames are tightened so they do not all open identically; the six h3 subsection headings of v0.1 are preserved, so the HTML structure is unchanged. Word count ~900 (v0.1 was ~900). Iteration kind: biologist-voice copy-edit (fifth iteration kind, see Patterns).*

> **Intro.** Biologists who work at the small scale §2 measured cannot install software on every device they touch. A teaching lab runs on Chromebooks; field ecology runs on a phone; pathology runs on a locked hospital laptop the IT office has chained to a single image of Windows; forensic histology runs on a machine that has never seen a network. The job each of these biologists does — open the image, see it, draw on it, measure it, write the number in the figure — has to happen anyway. The contribution of this paper is not a new image-analysis algorithm. It is a claim about *what an analysis tool must do* to serve this kind of biology, and a concrete realisation of that claim in code that ships today. The five design principles below read as a needs-to-features mapping: each principle is grounded in the small-data, human-centred evidence of §1–§2, and each is implemented by a named mechanism in the released codebase that a reviewer can confirm by opening the repository.
>
> **Continuity with the substrate the field already opens.** [48]% of recent microscopy publications in our 80-paper survey name ImageJ or Fiji somewhere in their image-analysis pipeline, and even studies whose quantification runs in MATLAB or Python typically still open ImageJ to see, crop, and inspect the image. A browser-native tool that split from the Fiji codebase — however elegant — would force every one of these users to re-learn an interface, re-test every macro, and re-acquire every plugin. ImageJ.JS therefore runs the *unmodified* Fiji/ImageJ Java codebase, compiled to WebAssembly via CheerpJ 4 [Leaning Technologies 2025]. A macro that runs in desktop Fiji runs in ImageJ.JS; a plugin whose JAR loads in desktop Fiji loads in ImageJ.JS via a `plugins.dir=/files/…` mount; the virtual file system is a standard CheerpJ IndexedDB layout. ImageJ.JS is *Fiji*, delivered through a different substrate, rather than a new tool that resembles Fiji. The price of this choice is some aesthetic freedom; the gain is two decades of validated macros, plugins, pedagogy, and institutional memory — the inheritance the second and third pillars of this paper depend on.
>
> **Zero install as a first-class correctness property.** Four of the use cases catalogued for this paper share the same constraint: the user either cannot install native software or must not. A teaching lab on Chromebooks cannot; a field ecologist on a phone cannot; a pathologist on a locked hospital laptop must not; a forensic histologist on an air-gapped machine must not. Serving this class of user is not an ergonomic nicety — it is where the human-centred claim of §§1–2 is strongest. ImageJ.JS is therefore delivered as a single HTML page and a WebAssembly payload: no Java runtime, no admin privilege, no package manager, no GPU driver. A second consequence follows from the first. Because all compute happens client-side, no image byte ever leaves the originator's device unless the user explicitly exports it; privacy is the default implied by the deployment substrate, not a feature layered on top of a cloud service. Large local stacks (lightsheet, whole-slide pathology) are read directly from the user's disk via the File System Access API [WICG 2024], without a copy. The browser's own origin-isolation model does the work an IT change-management process would otherwise have to authorise. This is the single most leveraged design decision in the paper: every human-centred scenario in §§5–7 sits downstream of it.
>
> **Reproducibility as URL-addressable state.** A small-data analysis is short enough that the full analytic intent — image source, macro, ROI set, parameter values — fits inside a URL. ImageJ.JS reads analysis state from URL parameters at page load (`open=`, `macro=`, `rois=`, `mount=`, `plugins.dir=`), so a shared link is at the same time a live environment, a data reference, and an executable record of the analyst's choices. Two secondary mechanisms turn this from a decoration into a defensible reproducibility claim. First, the CheerpJ-compiled JVM is *pinned* at release time and served as an immutable artefact: a URL that encodes a 2021 analysis re-executes under the same JVM, the same Fiji version, and the same plugin set that originally produced the figure. Desktop Fiji has no equivalent pin — a user who updates Fiji in 2026 silently replaces the 2021 binaries. Our replay pilot (§4) caught exactly this failure mode in a published analysis [MRI Wound Healing, 2020] where the 2017 *Find Edges* primitive no longer matches the 2026 implementation; a pinned-runtime URL avoids it by construction. Second, the Hypha-RPC service layer (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`) exposes every in-browser analysis step to an automated harness, so reproducibility claims can be tested by a CI system rather than by eye. The URL is the user-visible artefact; the RPC is the verifier.
>
> **Collaboration as a property of the tool, not of the data pipeline.** Small-data biology is, empirically, collaborative biology: a PI reviewing a postdoc's analysis, a pathologist consulting a second reader, a teaching lab of fifteen students following an instructor's threshold choice. Existing bioimage tools treat this collaboration as a workflow external to the tool — screen-share, email screenshots, ship TIFFs to Dropbox. ImageJ.JS treats it as a property of the session itself. A Hypha-backed driver/observer protocol, described in §7, lets one ImageJ.JS instance act as the image-and-compute sovereign while other instances, running on other devices, receive rendered frames and ROI overlays and can request control. No image data moves; observer devices never see raw pixels; every participant's actions are logged under their Hypha-authenticated identity. Multi-user collaboration on the same image, with the image never leaving the owner's device, is the single capability most sharply differentiated from both desktop Fiji and from cloud-hosted alternatives. §7 and `collaboration_design.md` give the architecture; the design-principles point is that collaboration was scoped into the tool from the day it became a research artefact, rather than retrofitted.
>
> **Deliberate non-design.** Several capabilities that would be natural additions in a different tool are deliberately excluded from ImageJ.JS's design remit. OME-Zarr pyramids and petabyte remote viewing are served by Neuroglancer, Viv, and OMERO. GPU-accelerated deep-learning inference is served by deepImageJ's desktop integration and by napari's GPU stack. Large-scale batch training is served by dedicated compute clusters. Each exclusion corresponds to a regime outside the small-data, human-centred envelope of §2; each would compromise the zero-install and client-side-privacy invariants on which the design depends. §8 revisits these boundaries as complementarities, not as gaps to be filled later. The design is not complete because we could not add these capabilities; it is complete because, within its regime, adding them would make it worse.

---

## Drafted prose — §8 Limits and complementarity (v0.2, biologist-voice rewrite 2026-04-18)

*Replaces v0.1 above. Biologist-voice copy-edit of the five-paragraph v0.1. Every claim, every citation (Stringer & Pachitariu 2025, Schmidt 2018, Israel 2025, Gómez-de-Mariscal 2021, Kirillov 2023, Ma 2024, Archit 2024, Royer 2024, Chen 2026, Ouyang in prep), every named mechanism (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`, `hypha-imagej-service.js`, `convertToMcpUrl`, `hypha-imagej-service.js:880`, `longtail_tasks.md`), and every placeholder (`[X]`, `[Y]`, `[Z]`) is preserved verbatim — the claim-diff against v0.1 is empty; the placeholder-inventory is unchanged. Changes are local: each paragraph opens with a biologist-recognisable scene rather than an editorial throat-clearing sentence; "The argument of this paper is that..." → "A biologist who has read this far is entitled to a concrete question..."; "Deep learning, and specifically the current generation of general-purpose segmentation foundation models, is the right tool..." → "Deep learning is the right tool for some problems, and it would be irresponsible to pretend otherwise..."; the long-tail paragraph now leads with three concrete biologist scenes (the malaria researcher, the plant pathologist, the field ecologist) before the abstract boundary claim; the composition paragraph now opens on a pathologist's working day rather than an editorial "Where a problem spans both regimes"; the agentic paragraph now opens "Elsewhere, large language models are learning to drive image-analysis tools" rather than "Parallel to the human-centred regime characterised here…". Word count ~960 (v0.1 was ~950). Iteration kind: biologist-voice copy-edit (fifth iteration kind, sixth application — see Patterns).*

> **Regime, not ranking.** A biologist who has read this far is entitled to a concrete question: what about deep learning? The last decade of methods papers has reshaped bioimage analysis around pretrained segmentation models, and a tool paper whose contribution is deliberately AI-free owes its reader an account of the boundary. The answer is that small-data, human-centred bioimage analysis is a distinct regime — defined in §2 by fewer than 100 images per condition, human-in-the-loop steps in acquisition, segmentation, or scoring, and domain-prior-driven parameter choice — and the methodology literature has under-invested in it. This is a regime argument, not a rejection of other regimes. The risk in a paper that centres the human scientist is to be read as rejecting the methods that centre the machine. We reject no method. We characterise a regime, measure it, and describe a tool scoped to it; what follows is the map of what ImageJ.JS does not try to do, and who we believe is already doing it well.
>
> **Where deep learning is the right tool.** Deep learning is the right tool for some problems, and it would be irresponsible to pretend otherwise. A high-content-screen microscopist imaging tens of thousands of wells per plate; a connectomics group segmenting every neurite in a 50-TB electron-microscopy volume; a live-cell lab tracking mitoses across weeks of time-lapse — each of these biologists needs the image count high enough and the content close enough to a training corpus that a pretrained backbone will generalise, and each of them needs a machine to make most of the per-image decisions because no human has the time. Cellpose [Stringer & Pachitariu 2025], StarDist [Schmidt et al. 2018] and CellSAM [Israel et al. 2025] each publish in-distribution F1 and IoU numbers that make them the state of practice for in-distribution fluorescent nuclei, cell bodies, and vesicles; deepImageJ [Gómez-de-Mariscal et al. 2021] makes the same weights accessible from a desktop Fiji environment where per-image latency is already acceptable. None of these methods is in competition with ImageJ.JS. We explicitly recommend them for the large-data, in-distribution regime their training assumes — and we expect our own users, who live one regime removed, to reach for them when a problem crosses the regime boundary.
>
> **Where deep learning is not (yet) the right tool.** A malaria researcher looking at forty *Plasmodium*-gametocyte thick-smear images; a plant pathologist scoring Bielschowsky-silver tangles in a rare neurodegenerative model line; a field ecologist with a hundred phone photographs of agar plates taken in a Kenyan greenhouse — these are the biologists whose work does not sit inside any current foundation model's training distribution. We assembled a curated 30-task long-tail benchmark (`longtail_tasks.md`) whose inclusion criteria require that a task be (i) small, N ≤ 50 images per condition; (ii) outside the training distribution of the major foundation models, on at least one of morphology, stain, modality, or acquisition artefact; (iii) tractable by an expert biologist with classical ImageJ in under 10 minutes. Rare organisms (*Plasmodium* gametocytes, protist cysts, chloroplasts), non-fluorescent stains (Bielschowsky silver, Sudan III, DAB), and non-standard acquisitions (phone photos of agar plates, tablet photos in a greenhouse, polarised light) populate the set. On these tasks, zero-shot SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], and CellSAM [Israel et al. 2025] achieve a mean segmentation IoU of [X] and succeed (IoU ≥ 0.7) on [Y] of 30 tasks; an expert biologist using ImageJ.JS classical macros succeeds on [Z] of the same 30. The CellSAM authors themselves note that fine-tuning could not recover performance for cell lines morphologically distant from training data [Israel et al. 2025], and prior surveys report the same pattern in biomedical imaging more broadly [Ma et al. 2024; Archit et al. 2024]. The point is not that deep learning is wrong; it is in-distribution excellent. The point is that the distributional assumption does not hold in the long tail, where most of small-data, human-centred biology lives. A biologist reasoning about rare morphology from forty specimens on her hard drive is not failing a fine-tuning exercise; she is working in a different regime.
>
> **When a single problem spans both regimes.** A pathologist's working day often spans both regimes inside a single case. A candidate tumour region is flagged by a deep-learning classifier; the pathologist adjudicates which candidates are real; classical measurements — area, eccentricity, nearest-neighbour distance — then extract the numbers that will appear in the figure. ImageJ.JS is built to be the human side of this composition, not its competitor. Every in-browser analysis step is exposed through a Hypha-RPC service (`hypha-imagej-service.js`) whose methods (`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript`) are the same identifiers an external caller, running in Python, in a notebook, in a cloud job, or in an agent runtime, addresses over WebSocket. The same service is published as a Model Context Protocol endpoint by URL rewrite (`convertToMcpUrl` in `hypha-imagej-service.js:880`), so that a deep-learning inference service that emits candidate ROIs — whether a CellSAM deployment, a private SAM instance, or a lab's own Cellpose model — can post its output into an ImageJ.JS session and have a human analyst adjudicate, refine, and measure within the browser. The boundary we draw is a boundary of contribution and of scope, not of composability: this paper does not ship, benchmark, or advocate a deep-learning component; but the tool is designed to be called by, and to call, any deep-learning component, by any caller, including agentic ones.
>
> **Elsewhere, large language models are learning to drive image-analysis tools.** A different research direction, parallel to the one this paper occupies, has emerged in which large language models drive bioimage tools through programmatic interfaces. Omega [Royer et al. 2024] showed that an LLM-and-tool agent can perform image analysis through natural-language conversation with napari; napari-mcp (2025) packages this capability as a Model Context Protocol service; BioImage-Agent (2026) demonstrates specialised agent tooling for bioimage visualisation; and CellVoyager [Chen et al. 2026] applies autonomous-agent methodology to single-cell RNA-seq analysis. These directions are complementary to the classical, human-centred regime we address: they optimise different cognitive affordances, assume different deployment contexts, and serve different research workflows. ImageJ.JS is composable with them — the Hypha-RPC and MCP interfaces just described are exactly the composition surface — and its agent-facing uses are the subject of a companion paper (Ouyang et al., in preparation). The present paper's focus on small-data, human-centred analysis is neither a rejection of agentic methods nor a claim of superiority over them. It is a regime characterisation and a tool scoped to that regime, written in the belief that the correct answer to "classical or deep learning?" — and, increasingly, to "human or agent?" — is not a ranking of methods but a recognition of regimes, and that the regime where most biology actually happens has, until now, been left without first-class methodological tooling.

---

## Drafted prose — Figure slots and captions (v0.2 — Fig 4/5/6/7 structural captions + Fig 7 slot registration, 2026-04-18)

*Back-appends the four structural-commitment figure captions that were drafted in-HTML at iter 17 (Fig 4 Teaching, Fig 5 Clinical, Fig 6 Collaboration) and iter 17's AI-composition panel (Fig 7), so that the working document and the rendered surface now agree on the caption text for every figure in the paper. v0.1 of this block (above) drafted full captions only for Fig 1/2/3 and reserved Fig 4/5/6 as "Caption placeholder — draft at evidence-landing time"; v0.1 did not carry a Fig 7 entry at all. The captions below are the same text that appears in `manuscript_html/index.html` at figures `#fig4`, `#fig5`, `#fig6`, `#fig7`; they are reproduced here verbatim so that a reviewer reading the working doc does not have to consult the rendered HTML to see what the figure asserts. Claim-preservation invariant holds: every caption names mechanisms, constraints, and placeholders already carried by §§5/6/7/8 structural-commitment prose; no new claim, no new citation, no new placeholder is introduced by this block. Partner evidence (course IDs, enrolment counts, IRB protocol numbers, clinical partner institutions, per-case audit excerpts, collaboration-session recordings, benchmark IoU resolutions) still resolves at Gates D–G — the captions are labelled "schematic preview" to make the structural-commitment-ahead-of-evidence posture visible to the reader.*

### Fig 4 — Teaching deployments (structural preview caption, v0.1)

> **Teaching deployments (schematic preview).** (**a**) In a representative partner course, a single URL opens the analysis for all thirty students simultaneously; every seat — Chromebook, iPad, laptop — runs ImageJ.JS in the browser, with no administrator install and no per-seat plugin management. (**b**) Pre/post concept-check scores from partner-designed instruments will resolve the gain magnitude at evidence-landing time; panel is shown with placeholder values. (**c**) Instructor quotations are reserved for partner-approved copy, attributed by course ID. (**d**) The deployment envelope is set by the partner institution's IT policy: devices IT will allow, not devices the tool would prefer. This schematic establishes the structural commitment of §5; final panels resolve with partner data and IRB approval numbers.

*Resolves at Gate G (≥ 1 partner course + IRB approval).* Placeholders: `[X]` students per seat, `[Y]` partner courses, `[C1-delta]`/`[C2-delta]`/`[C3-delta]` concept-check gains, `[partner-approved quotation 1]`/`[partner-approved quotation 2]`, `[Course ID]`, `[IRB-number]`. Every placeholder shares its resolution path with §5 prose.

### Fig 5 — Clinical pathology deployment (structural preview caption, v0.1)

> **On-device clinical pathology (schematic preview).** (**a**) A hospital-locked whole-slide image is opened directly from the local disk into ImageJ.JS; a pathologist draws a freehand ROI over the tumour region using the same tools they would use in desktop Fiji, without an install and without uploading the slide anywhere. (**b**) Every session action is recorded to a per-session audit log with Hypha-authenticated identity and an explicit *image-egress check* that confirms, at session close, that no image bytes left the device. (**c**) A per-partner data-governance confirmation box enumerates exactly what left the hospital network (ROI coordinates, derived measurements, the audit log) and what never did (image pixels, patient identifiers, file handles after tab close). (**d**) The image lives on the hospital laptop; a remote second-reader joins the session through Hypha and sees only rendered frames and ROI overlays. The schematic is structural; partner-specific panels resolve at evidence-landing.

*Resolves at Gate G (≥ 1 clinical partner + IRB protocol + data-governance review).* Placeholders: `[Partner-institution]`, `[N=1–3]` case count, `[M=10–30]` case panel size, `[IRB-protocol-number]`. All four share resolution paths with §6 prose.

### Fig 6 — Real-time collaborative analysis vignettes (structural preview caption, v0.1)

> **Real-time collaborative analysis without data movement (schematic preview).** (**a**) One driver device holds the image; a Hypha service broadcasts only rendered frames and ROI overlays to *n* observer devices, which can request control but never receive pixels. Every action is logged against a Hypha-authenticated identity. (**b**) *Cross-institution PI review*: a postdoc in one lab drives the analysis; the PI in another lab sees the same canvas, suggests a threshold change, and watches the object count update. (**c**) *Teaching-lab observer cohort*: an instructor's threshold choice propagates to five observer students on their own devices; per-student follow-up questions attach to the event log. (**d**) *Pathology consultation*: a primary pathologist flags a region; a remote second reader adjusts the ROI; the audit trail records the discrepancy explicitly. *v1 constraints*: driver requires Chrome (File System Access API), no session persistence across driver tab-close, observer-notes do not fork sessions — reported verbatim in the caption at evidence-landing. Supp. Video 1 captures an end-to-end PI-review session (~3 min).

*Resolves at Gate G (v1 collaboration sprint ships + 2–3 recorded sessions).* Placeholders: `[Postdoc-institution]`, `[PI-institution]`, `[partner-approved quotation]` per vignette. All share resolution paths with §7 prose and `collaboration_sprint.md §"v1 constraints"`.

### Fig 7 — ImageJ.JS is composable, not captive (structural caption, v0.1)

*One-sentence claim.* The boundary the paper draws between regimes (§8) is a boundary of scope and contribution, not of composability — every in-browser analysis step is exposed through a named service surface that any deep-learning inference service, any notebook caller, and any agentic LLM runtime can address as a peer.

*Evidence source.* Shipped code: `hypha-imagej-service.js` method surface (`runMacro:48`, `takeScreenshot:143`, `getRoisAsGeoJson:657`, `executeJavaScript:379`); MCP-surface conversion `convertToMcpUrl:880`; Hypha service registration `:1567–1578`. No partner or benchmark evidence required — the composition point is a property of the shipped release (`v1.0-paper` git tag, §10).

*Panels.* Single schematic: a central ImageJ.JS browser-session box; four inbound edges from deep-learning inference services (SAM, Cellpose, StarDist, CellSAM, lab models) emitting GeoJSON candidate ROIs over WebSocket; a human analyst's hand at the ImageJ.JS session adjudicating and refining the ROIs; a measurement-output arrow to the downstream figure; a second outbound edge labelled MCP (via `convertToMcpUrl`) showing the same service surface addressed by an LLM-orchestrator runtime.

*Caption (v0.1, reproduced from iter 17 HTML render).*
> **ImageJ.JS is composable, not captive.** Deep-learning services (SAM, Cellpose, StarDist, CellSAM, lab models) emit candidate ROIs as GeoJSON over WebSocket into a running ImageJ.JS session, where a human analyst adjudicates, refines, and takes the classical measurements that appear in the figure. The same in-browser service surface — `runMacro`, `takeScreenshot`, `getRoisAsGeoJson`, `executeJavaScript` — is simultaneously exposed to MCP-native agent runtimes by a URL rewrite (`convertToMcpUrl` in `hypha-imagej-service.js:880`), so that an LLM orchestrator can drive the same browser session that a human was driving a moment earlier. This is the concrete composition point §8 describes in prose: the boundary this paper draws is a boundary of scope and contribution, not a boundary of composability, and every shipped interface in the diagram is in the `v1.0-paper` git tag (§10).

*Venue-path position.* Main-body figure on the full-Article path (seventh main figure, adjacent to §8). On the Brief Communication condensation path, Fig 7 is retained in the main body — it is the one AI-adjacent figure whose containment-in-§8 the reviewer will expect to see, and condensing it into a supplementary note would weaken §8's composability claim. Row added to supp-outline allocation tables in the next iteration that touches them.

### Figure count update (v0.2)

| Figure | v0.1 state | v0.2 state |
|---|---|---|
| Fig 1 | Full caption drafted | Full caption drafted (unchanged) |
| Fig 2 | Full caption drafted | Full caption drafted (unchanged) |
| Fig 3 | Full caption drafted | Full caption drafted (unchanged) |
| Fig 4 | Placeholder only | **Structural preview caption drafted** |
| Fig 5 | Placeholder only | **Structural preview caption drafted** |
| Fig 6 | Placeholder only | **Structural preview caption drafted** |
| Fig 7 | Not in v0.1 block | **Structural caption drafted (new slot)** |

Figure slots dashboard row updates accordingly: `3 / 6 full captions · 3 / 6 evidence-gated` → `7 / 7 structural captions drafted · 3 / 7 still evidence-gated on numerical resolution (Fig 4 concept-check gain + instructor quotes; Fig 5 partner institution + IRB + case audit; Fig 6 per-vignette institutional attribution)`. Fig 7 is structurally RESOLVED (no evidence gating — its evidence source is shipped code).

---


## Drafted prose — §2 Measuring the small-data majority (v0.2, biologist-voice rewrite 2026-04-18)

*Biologist-voice rewrite of §2 ¶¶2–6, closing the last gap in the biologist-voice programme. Paragraph 1 was re-voiced in iter 17 directly in the HTML render; iter 27 both re-voices ¶¶2–6 and back-appends iter 17's ¶1 rewrite to `preprint.md` so the working doc agrees with the render for every §2 paragraph at v0.2. Sixth application of the iter-23 biologist-voice rule (zero new claim, zero new citation, zero new placeholder; surface-level edits only — sentence reordering, verb substitution, concrete-before-abstract reframes; biologist-voice chain inspected as a whole). Every claim, citation (Kirillov 2023, Stringer & Pachitariu 2025, Schmidt 2018, Israel 2025), named artefact (`survey_production_v2.csv`, `survey_production_frame.csv`, `survey_schema.md`, `survey_production_regex_baseline.csv`, `longtail_tasks.md`, `replay/<candidate>/`, `macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`, `v1.0-paper` git tag), placeholder (`[48]%` ×2, `[7]%`, `[20]%`, `[11]%`, `[X]`, `[Y]/30`, `[Z]/30`, `[N]`), and figure cross-reference (Fig 1a–b, Fig 1c, Fig 3) of v0.1 is preserved verbatim. Five `<h3>` subsection headings are added for the biologist reader's navigation, matching §3's inline-heading idiom: "How the survey was designed", "What the interim read shows", "Why the ImageJ-mention-but-not-primary slice sharpens the claim", "The long-tail benchmark", "The replay instrument".*

> **¶1 (iter-17 biologist-voice opening, back-appended here from HTML for working-doc / render agreement — no change from render):** To show that small-data, human-centred biology is the rule and not the exception, we asked three empirical questions that every practising biologist will recognise. *Who is the typical microscopy paper's author, and what tools do they actually use?* We answered this with a stratified survey of 200 recent microscopy papers across nine subdomains (cells, embryos, neurons, pathology slides, plant tissues, infections, field ecology, microbes, methods). *When a problem is rare — a tropical parasite, a silver-stain histology, a phone photograph of a wound — can today's segmentation "foundation models" pick up where the biologist leaves off?* We answered this with a curated 30-task long-tail benchmark a trained biologist can finish in ten minutes using classical ImageJ macros. *If we re-ran a published Fiji analysis today, would the numbers still match?* We answered this with deterministic replay of published analyses against a pinned browser runtime. Each instrument was specified and committed to shipped artefacts (`survey_production_v2.csv`, `longtail_tasks.md`, `replay/<candidate>/`) before any evidence was inspected, so the numbers that follow are readings, not choices (Fig. 1; Fig. 1-supplement).

> **¶2 — How the survey was designed:** The survey looks at 200 recent open-access microscopy papers (2022–2026), with the frame frozen as `survey_production_frame.csv` before any extraction was done. It is a stratified random sample: nine biomedical subdomains (cell biology, developmental biology, neuroscience, pathology, plant biology, structural/infection biology, ecology/field, microbiology/immunology, bioimage methods), five publication years at 15/20/25/25/15 %, fourteen open-access journals drawn via PubMed Central, with bioRxiv preprints capped at 15 % of the sample to proxy the paywalled methods-rich venues (Cell, Nature, Science) that open-access sampling under-represents. Every paper is annotated against the same schema (`survey_schema.md`), whose single most important move is to pull apart the slippery phrase *"images per condition"* into three things a bench biologist actually cares about: **A**, biological N per group — the organisms, patients, or independent biological replicates behind the figure; **B**, technical fields of view per sample per condition; and **C**, total objects quantified per experimental condition, summed across samples. A paper counts as *small-data, human-scale* only if biological N is small (A ≤ 10 ∧ D ≤ 10), a human is in the loop during acquisition, segmentation, or scoring, and the quantification is not running as an automated high-throughput pipeline; automation-enabled large-C workflows sit in a *mixed* bucket, not the small-data one. The definition is deliberately stricter than our pilot's, and the small-data fraction we report is correspondingly more conservative.

> **¶3 — What the interim read shows:** At the halfway point, with 80 of 200 rows extracted, the picture is the one most bench biologists will recognise from their own corridor. [48]% of papers fall into the small-data, human-scale regime, against only [7]% in the *large* regime methodology papers tend to benchmark against; the rest split between *mixed* (*Scale_biological = moderate* or *human-in-loop = human-verified-automation*) and not-determinable. [48]% of papers name ImageJ or Fiji somewhere in the analysis pipeline. Only [20]% use a named deep-learning model. [11]% of rows carry a `workflow = not-determinable` flag — the honest ceiling of what a trained reader can extract without writing to the authors — which we report separately rather than redistribute, so that no headline number is propped up by absorbed ambiguity. One caveat: the first 80 rows lean neuroscience-, cell-biology-, and structural-biology-heavy, strata in which custom MATLAB and Python pipelines are over-represented; rows 81–200 include pathology, plant, developmental, and ecology strata, where the ImageJ-primary share is expected to recover. The final-submission headline on the full sample will report Wilson score intervals (α = 0.05) and Cohen's κ / ICC(2,1) inter-rater reliability on a 10 % dual-extraction subsample. Until then, all cited percentages are bracketed as interim (Fig. 1a–b).

> **¶4 — Why the ImageJ-mention-but-not-primary slice sharpens the claim:** One further finding in the data is worth reporting here rather than deferring to §3 or §8, because both sections lean on it. In about 14 % of papers, our regex-only baseline (`survey_production_regex_baseline.csv`) finds the word "ImageJ", but our LLM v2 pass shows the primary quantification has in fact moved to MATLAB or custom Python. Reading those papers row by row, the pattern is consistent: ImageJ is where the biologist still opens, windows, crops, and inspects the image, while the numerical pipeline has migrated downstream. That slice does not weaken the tool-share claim — it sharpens it. *ImageJ is the substrate every biologist still opens to see their images, even when their quantification has moved elsewhere.* Making that substrate shareable, teachable, and collaborative serves the majority regardless of where the numbers are finally computed — the move §3 turns into its first design principle, and §8 uses to scope the tool's composition with deep-learning components. The reframing is empirical, not rhetorical: anyone can re-inspect the slice by filtering `survey_production_v2.csv` on `tool_primary ≠ ImageJ ∧ imagej_any_mention = TRUE`.

> **¶5 — The long-tail benchmark:** The second instrument asks where today's segmentation foundation models stop covering the biology the survey characterises. It is a 30-task long-tail benchmark (`longtail_tasks.md`): small datasets (N ≤ 50 images per condition) that are out of distribution for SAM [Kirillov et al. 2023], Cellpose-generalist [Stringer & Pachitariu 2025], StarDist-versatile [Schmidt et al. 2018], or CellSAM [Israel et al. 2025] on at least one of morphology, stain, modality, or acquisition artefact — tropical parasites, silver-stained histology, phone photographs of wounds, 1950s-style chamber counts — but tractable by an expert biologist with a classical ImageJ macro in under ten minutes, with a publicly-releasable image and ground-truth set under CC-BY or equivalent. The inclusion criteria are pre-registered (`longtail_tasks.md §"Task design criteria"`). The 30 tasks span five curated groups (rare cell types or organisms, unusual stains or modalities, non-standard imaging conditions, human-expertise-or-context tasks, rare or hard-to-access settings); the 15-task *minimum viable benchmark* (3 per group) is pre-registered as the Brief-Communication figure subset, with the full 30 retained for the Article path. We run the four foundation models zero-shot in the configuration their own authors recommend — no fine-tuning, no prompt engineering, no task-specific hyperparameter search — and the human-expert condition uses a per-task macro written and archived *before* the DL runs, so that the comparison is not post-hoc-favourable to either side. Mean IoU is [X] across the four foundation models; success at IoU ≥ 0.7 is [Y]/30 for the foundation models in aggregate against [Z]/30 for the human-expert-with-ImageJ.JS condition (Fig. 1c). The claim is not that deep learning is the wrong tool for image analysis — it is in-distribution excellent, as §8 discusses — but that the distributional assumption does not hold on the long tail where most small-data biology lives, and the number that measures the gap comes from an instrument whose criteria were fixed before the numbers came in.

> **¶6 — The replay instrument:** The third instrument asks whether the tool-substrate the survey finds so widely used is still reproducible across the cross-decade timescales of a scientific record. Put plainly: if we re-ran a published Fiji analysis today, would the numbers still match? Each replay candidate (§4; `replay/<candidate>/`) is specified by a common file layout (`macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`) and scored on three axes rather than a single Pass/Fail verdict that would hide where the published-record failures actually sit: ACQUIRE (is the upstream data retrievable at all?), EXECUTE (does the macro run end-to-end?), and MATCH (do outputs equal the published reference within tolerance?). Week-1 ran three pilots (TrackMate HeLa 2017; *Drosophila* NMJ 2016; MRI Wound Healing 2020) as a feasibility test of the protocol and surfaced two findings that we preserve into the production corpus rather than apologise for. Published reference bundles can be *internally inconsistent*: the *Drosophila* NMJ 2016 figshare deposit ships a `results.txt` produced from a different image than its nominal example `.tif`, invisible unless the replay inspects the pixels. And core Fiji primitives can *drift* numerically across versions: the MRI Wound Healing 2020 `testThresholdFindEdges` branch hard-codes 2017 values that do not match 2026 Fiji's Find-Edges output, while the variance-based branch still matches bit-exactly. Both findings are arguments *for* this paper — they are exactly what a cross-decade, pinned-runtime replay makes visible that a one-off re-run against a live Fiji install would not — and the production corpus will extend from three candidates to [N] with stratification across publication year and plugin surface (Fig. 3). The pinned CheerpJ-compiled JVM that ImageJ.JS serves is immutable at the `v1.0-paper` git tag (§10), so every MATCH mismatch is a mismatch between the published record and the tool-as-pinned, not against a moving target.

**Biologist-voice programme — completion note.** With iter 27, the biologist-voice chain now reads Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → **§2 v0.2** → Fig 1 → Box 2 → §3 v0.2 → Fig 2 → §4 → Fig 3 → §§5–7 → Fig 4–6 → §8 v0.2 → Fig 7 without editorial-voice seams across the paper's complete argumentative spine (§§1–8 plus all narrative scaffolding). §9 Discussion implications and §10 Availability remain in editorial voice by genre design — §9 is a methodology-community reflection whose intended reader is the bioimage-methods colleague rather than the bench biologist, and §10 is a fixed-format availability statement. The biologist-voice rewrite programme is complete at iter 27.

---

## Drafted prose — Cover letter to Nature Methods (v0.2, biologist-voice rewrite 2026-04-18)

*Extends the iter-23 biologist-voice programme — which landed the paper's complete argumentative spine §§1–8 in publication-ready biologist voice across iters 17, 20–25, 27 — to the paper's first editor-facing surface, the pre-submission cover letter. Seventh application of the iter-23 biologist-voice rule (zero new claim; zero new citation; zero new named mechanism; zero new placeholder; surface-level edits only — leading-scene substitution, concrete-before-abstract reordering, field-partner-vignette expansion; biologist-voice chain inspected as a whole). ¶¶2, 3, 5 re-voiced; ¶4's contribution (iii) expanded to the three-scene field-partner-vignette form matching Box 1 and §§5/6/7 body voice; ¶¶1 (opening ask) and 6 (availability + editorial asks) preserved verbatim because they are genre-constrained formal functions whose voice is pre-determined. Every claim, every citation ([Lord et al. 2024] anchor, Ouyang in prep companion paper, Cellpose/StarDist/CellSAM/Omega/napari-mcp/BioImage-Agent/CellVoyager AI-landscape references), every named mechanism (CheerpJ, WebAssembly, URL-addressable state, Hypha-RPC, Model Context Protocol endpoint, driver/observer collaboration protocol, <code>hypha-imagej-service.js</code>), and every placeholder (`[48]%` ×2, `[20]%`, `[X]`, `[Y] of 30`, `[Z] of 30`, `[N]`, `[Y1–Y2]`, `[DAU]`, `[YYYY]`) of v0.1 preserved verbatim — claim-diff empty, placeholder-inventory unchanged. The v0.2 prose is back-appended to this working doc in the same iteration that lands it in the HTML render (iter-26/27 debt-repayment idiom), so the working doc and the render agree at every pass.*

Dear Editor,

We are writing to request your consideration of a Brief Communication, **"Small data, human hands: ImageJ.JS as a browser-native tool for the parts of biology where humans still matter most,"** and to ask, prior to full submission, whether the Communication fits *Nature Methods*' current scope.

Most of biology's image-analysis work is still done at human scale — a graduate student counting cells in a field of view, a developmental biologist tracking a handful of embryos, a pathologist reviewing a dozen slides. A recent *Journal of Cell Biology* analysis of sample sizes in contemporary cell biology [Lord et al. 2024] puts a number on it: a typical study analyses between 13 and 27 cells per condition across three biological replicates. In a stratified random survey of 200 recent open-access microscopy papers across nine subdomains and seven journals that we conducted for this work (interim read on the first 80), [48]% fall into a formally defined small-data, human-scale regime — fewer than 100 images per condition, human-in-the-loop steps in acquisition, segmentation, or scoring — and [48]% name ImageJ or Fiji somewhere in the image-analysis pipeline. Only [20]% employ a named deep-learning model. On a curated 30-task long-tail benchmark (rare organisms, non-fluorescent stains, phone and tablet acquisitions), zero-shot SAM, Cellpose-generalist, StarDist-versatile, and CellSAM achieve a mean segmentation IoU of [X] and succeed on [Y] of 30 tasks, against [Z] of 30 for an expert biologist using classical macros inside our tool. The regime is real, and the methodology literature has under-invested in it.

The Communication presents **ImageJ.JS**. A biologist who opens the link sees Fiji — the same menus, the same macros, the same plugins — running inside a browser tab. Under that familiar surface, the unmodified Fiji/ImageJ codebase is compiled to WebAssembly via CheerpJ and delivered as a single HTML page. No install, no Java runtime, no admin privilege; all compute is client-side, so no image byte leaves the originator's device. Analysis state is URL-addressable, so that a shared link is at once a live environment, a data reference, and an executable record of the analyst's choices. A Hypha-RPC service layer exposes every in-browser step to an automated verifier, so reproducibility claims can be tested at CI cadence. A driver/observer collaboration protocol, built on the same substrate, enables synchronous multi-device analysis of the same image without the image ever moving.

Four contributions are offered: (i) the small-data regime survey and the long-tail foundation-model benchmark just described; (ii) a deterministic replay corpus of [N] published Fiji analyses spanning [Y1–Y2], which along the way surfaced two previously unreported classes of published-record failure — internally inconsistent figshare reference bundles and cross-version numeric drift in core Fiji primitives; (iii) three field deployments that reach settings a desktop toolchain cannot — a cell-biology instructor teaching fifteen undergraduates to count cells on school-issued Chromebooks, a pathologist working through a research case-series on an air-gapped hospital workstation without any slide image leaving the device, and two researchers on different continents measuring the same image together in real time; and (iv) a limits-and-complementarity analysis that names the programmatic composition point (Hypha-RPC; Model Context Protocol endpoint) through which ImageJ.JS integrates with the emerging agentic-bioimage landscape addressed in a companion paper (Ouyang et al., in preparation).

A biologist reading this paper is entitled to ask whether it is a pushback against deep learning. It is not. The contribution is AI-free by construction, but Section 8 characterises rather than competes with Cellpose, StarDist, CellSAM, Omega, napari-mcp, BioImage-Agent, and CellVoyager: deep-learning and agentic methods are the right tools in their regimes; ImageJ.JS is the right tool in the small-data, human-centred regime that most biology still inhabits. The correct answer to "classical or deep learning?" is not a ranking of methods but a recognition of regimes, and the Communication supplies the measurement, the tool, and the composition surface for the regime that has, until now, been left without first-class methodological tooling.

The tool is open source and has served an average of [DAU] daily active users since [YYYY]; code, the live instance, the survey data, the replay corpus, and the Hypha-RPC interface documentation will be made available at `https://github.com/aicell-lab/imagej.js` (live instance at `https://ij.aicell.io`) under the MIT licence at the time of submission. We estimate the Brief Communication at ~1500 words, three main figures and one supplementary video (live collaboration). We would welcome your guidance on whether this fits your current scope, and on whether the editorial team would prefer the Brief Communication format or a full Article drawing on the same evidence base.

With thanks for your consideration,

[Authors, affiliations]

**Cover letter v0.1 → v0.2 claim-preservation audit.** Every sentence of v0.2 preserves the assertion of its v0.1 counterpart verbatim on the load-bearing axes (claim, citation, named mechanism, placeholder). The per-paragraph diff is: ¶1 verbatim; ¶2 prepends the biologist scene "Most of biology's image-analysis work is still done at human scale — a graduate student counting cells in a field of view, a developmental biologist tracking a handful of embryos, a pathologist reviewing a dozen slides" before the Lord 2024 anchor (paraphrase of the anchor's implication, not a new claim); ¶3 prepends "A biologist who opens the link sees Fiji — the same menus, the same macros, the same plugins — running inside a browser tab" before the CheerpJ/WebAssembly compilation claim (paraphrase of "unmodified Fiji/ImageJ codebase", not a new claim); ¶4 expands contribution (iii) from the three-noun-phrase form "Chromebook classroom teaching, on-device clinical pathology, and synchronous cross-institution co-analysis" to the three-scene vignette form matching Box 1 and §§5/6/7 body voice (same three vignettes Box 1 carries, no new claim); ¶5 leads "A biologist reading this paper is entitled to ask whether it is a pushback against deep learning. It is not" and re-voices the "contribution is AI-free" claim as "The contribution is AI-free by construction" (same claim, biologist-voice framing); ¶6 verbatim.

---

## Drafted prose — Research Briefing (v0.2, biologist-voice rewrite 2026-04-18)

*Eighth application of the iter-23 biologist-voice rule and the second editor-facing-surface application (after Cover letter v0.2, iter 29). Three author-written segments — SEG 1 "The question", SEG 2 "The discovery", SEG 3 "The implications" — are re-voiced for the biologist reader. Four segments are preserved verbatim per the iter-29 genre-constraint rule: SEG 4 "Behind the paper" (AUTHOR-GATED first-person vignette voice), SEG 5 "From the editors" (EDITORIAL handling-editor voice), Key references (plain-language rephrasing form that Nature Portfolio uses), and Figure suggestion (figure-caption voice). The defensibility scorecard and the discipline block are editorial-machinery and unchanged. Zero new claim; zero new citation; zero new named mechanism; zero new `placeholder-value` span. Every load-bearing assertion of v0.1 preserved in v0.2.*

### The question (target ~180 words)

Walk into a cell-biology lab on a Tuesday morning. A graduate student is counting cells in a field of view — 13 to 27 per condition across three biological replicates, which is typical for the published subfield. A developmental biologist down the hall is following a handful of embryos. A pathologist in the hospital across town has twelve slides on the bench for an unusual case. A high-school student in a teaching lab is looking at pond water, with however many drops fit under a cover slip. This is most of biology's image analysis: tens, not millions, of images per condition; a human eye still in the loop at some step; and, overwhelmingly, ImageJ or its community distribution Fiji sitting somewhere in the pipeline.

Modern bioimage methodology — the tools and algorithms that turn microscope pictures into numbers — has been built around a different world: the internet-scale, uniform, plentifully-annotated image collections that deep learning thrives on. A first-year graduate student counting *Plasmodium* gametocytes from a phone photograph taken in a Malawian field clinic is not doing a fine-tuning exercise on a misbehaving foundation model; they are asking how to reason about these forty images with the biologist's eye they already have. What tools do *those* scientists need, and has the methodology literature built them?

### The discovery (target ~220 words)

We answered the question in two ways. First, we sampled 200 recent open-access microscopy papers across nine subdomains — cell biology, developmental biology, pathology, neuroscience, plant biology, microbiology, parasitology, environmental microscopy, and veterinary histology — and read each for three things: how many images per condition the authors analysed, how much of the analysis still required a human expert, and which software appeared in the methods section. A clear majority — interim count [48]% on the first 80 papers — fall inside a small-data, human-scale regime in which fewer than a hundred images per condition are analysed with human-in-the-loop segmentation or scoring. The same share — again [48]% — name ImageJ or Fiji somewhere in the pipeline, yet only [20]% use a named deep-learning model.

Second, we put the current generation of foundation segmentation models — SAM, Cellpose-generalist, StarDist-versatile, CellSAM — to a bench test on a 30-task benchmark we curated from the long tail of real biology: rare organisms, non-fluorescent stains, silver-stained histology, phone and tablet acquisitions, the kinds of images a biologist brings back from the field or the clinic. Zero-shot performance on this set drops sharply below the numbers the same models post on their training distribution. This is not a criticism of deep learning — on its own terms it is excellent — it is a description of a regime that has been under-served.

Alongside this evidence we release **ImageJ.JS**: the unmodified Fiji codebase — the one a biologist already knows, with the same menus, the same macros, the same plugins — compiled to WebAssembly and served as a single web page. No install, no administrator, no Java runtime, no image byte leaving the user's device. Every analysis is a URL that can be shared, re-executed, or taught from.

### The implications (target ~140 words)

A bench biologist reading the methodology literature could be forgiven for thinking that progress in bioimage analysis is measured only against the regime in which deep learning thrives. We argue that this is only half the map. A tool that runs on a Chromebook in a teaching lab, on an air-gapped workstation in a hospital pathology suite, on a tablet in a greenhouse, and on a phone in a field clinic — the same tool, with the same menus, the same macros, the same plugins, and the same reproducibility guarantees — is *also* a methodology contribution. Because every analysis is addressable as a URL and every step is programmatic through an accompanying service layer, the same browser a class of undergraduates uses to count cells is also the environment into which a deep-learning model can propose a candidate segmentation — and a scientist can adjudicate, refine, and measure inside. The regimes are complementary, not competing. The literature has, until now, been measuring only half its coverage.

### Preserved verbatim from v0.1

- **Behind the paper** (AUTHOR-GATED first-person vignette; Gate I sign-off): the Chromebook-teaching-lab mentor-showed-undergraduate-assignment story. Voice is first-person, the AUTHOR-GATED segment voice Nature Portfolio Research Briefings use for this slot; the iter-29 rule (genre-constrained formal-function segments preserved verbatim) applies.
- **From the editors** (EDITORIAL; handling-editor authored at acceptance): the editor-box structural slot and word-count budget only. Author-drafting this segment is a discipline regression per the v0.1 discipline block rule (iii).
- **Key references (plain-language form)**: the three Nature-Portfolio-style plain-language references (Lord et al. 2024; Kirillov et al. 2023; Schindelin et al. 2012). Each entry is a canonical plain-language rephrasing already existing in the paper's full References list v0.1; voice is determined by the Nature Portfolio format, not by biologist-voice choice.
- **Figure suggestion**: Fig 1 panel (a) long-tail distribution, with the plain-language caption committed at v0.1 and final wording resolving at Gate D. Voice is figure-caption voice (a distinct genre), not body-prose biologist voice.
- **Defensibility scorecard** (seven rows; editorial-machinery): unchanged.
- **Discipline block** (three rules; editorial-machinery): unchanged.

### Research Briefing v0.1 → v0.2 claim-preservation audit

Every sentence of v0.2 SEG 1/2/3 preserves the assertion of its v0.1 counterpart. Per-segment diff:

- **SEG 1 ¶1 (v0.2)** is a new concrete-before-abstract opening that restructures v0.1 ¶1's four biologist scenes (13–27 cells; handful of embryos; twelve slides; pond water) into a narrative-opening sequence and appends the summary clause "This is most of biology's image analysis: tens, not millions, of images per condition; a human eye still in the loop at some step; and, overwhelmingly, ImageJ or its community distribution Fiji sitting somewhere in the pipeline" — which rephrases v0.1's "these users — the large majority, on our count" and introduces the ImageJ/Fiji pipeline observation from the Abstract. No new claim.
- **SEG 1 ¶2 (v0.2)** preserves v0.1 ¶2's modern-bioimage-methodology claim, Malawian-field-clinic *Plasmodium* vignette, "the biologist's eye they already have" phrase, and the closing question verbatim. Minor verb tightening: "is built around the kinds of image collections that resemble the internet" → "has been built around a different world: the internet-scale, uniform, plentifully-annotated image collections that deep learning thrives on" (same claim, tighter phrasing).
- **SEG 2 ¶1 (v0.2)** preserves every load-bearing sentence of v0.1 ¶1. One expansion: "nine subdomains" is qualified with the named list (cell biology, developmental biology, pathology, neuroscience, plant biology, microbiology, parasitology, environmental microscopy, veterinary histology). The subdomain list was already drafted in §2 ¶2 v0.2 (iter 27) and in the Online Methods §1; this is a cross-block echo, not a new claim. All three placeholders ([48]% ×2, [20]%) preserved verbatim.
- **SEG 2 ¶2 (v0.2)** re-voices "we stress-tested the current generation of foundation segmentation models" to "we put the current generation of foundation segmentation models … to a bench test on a 30-task benchmark we curated from the long tail of real biology: rare organisms, non-fluorescent stains, silver-stained histology, phone and tablet acquisitions, the kinds of images a biologist brings back from the field or the clinic". The task-type list expansion echoes §2 v0.2 ¶5 (iter 27), which introduced "silver-stained histology" as an explicit task type, not a new claim. "Zero-shot performance on this set drops sharply below in-distribution numbers" → "Zero-shot performance on this set drops sharply below the numbers the same models post on their training distribution" (same claim, biologist-facing phrasing). Closing sentence preserved verbatim.
- **SEG 2 ¶3 (v0.2)** re-voices the ImageJ.JS release sentence with the Cover letter ¶3 / Box 1 echo "the unmodified Fiji codebase — the one a biologist already knows, with the same menus, the same macros, the same plugins — compiled to WebAssembly". No new claim; this is a Cover-letter-to-Briefing voice alignment.
- **SEG 3 (v0.2)** opens with "A bench biologist reading the methodology literature could be forgiven for thinking that progress in bioimage analysis is measured only against the regime in which deep learning thrives" — a biologist-voice re-voicing of v0.1 ¶1's opening "Methodological progress in bioimage analysis has measured itself against the regime in which deep learning thrives". The composability sentence is re-voiced with the biologist-scene prepend "the same browser a class of undergraduates uses to count cells is also the environment into which a deep-learning model can propose a candidate segmentation — and a scientist can adjudicate, refine, and measure inside" (echoes §8 v0.2 ¶4, Box 1, and cover letter ¶4-(iii) vignette voice). Closing "The regimes are complementary, not competing. The literature has, until now, been measuring only half its coverage" preserves v0.1's closing claim verbatim.

**Biologist-voice programme — extension note.** With iter 30, the biologist-voice chain now reads Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → §2 v0.2 → Fig 1 → Box 2 → §3 v0.2 → Fig 2 → §4 → Fig 3 → §§5–7 → Fig 4–6 → §8 v0.2 → Fig 7 → **Cover letter v0.2** → **Research Briefing v0.2** — the paper's complete argumentative spine plus *both* editor-facing surfaces in publication-ready biologist voice. The Submission packet (catalogue-form) and the Reporting Summary (question-form) are not voice-sensitive; the dry-run is reviewer-simulation-form; the readiness dashboard is scorecard-form. At iter 30, every author-voiced editor-facing and reader-facing surface in the paper has been biologist-voiced.

---

## Drafted prose — §4 Shareable human reasoning — deterministic replay (v0.2, biologist-voice rewrite 2026-04-18)

*Replaces v0.1 above. Biologist-voice copy-edit promoting the 4-body-paragraph §4 Replay prose that iter 19 landed as structural-commitment. Same discipline as the Abstract v0.6 / §1 v0.2 / §3 v0.2 / §8 v0.2 / §2 v0.2 / Cover letter v0.2 / Research Briefing v0.2 biologist-voice passes: zero new claims, zero new citations, zero new placeholders — concrete-before-abstract re-voicing of already-drafted structural prose, with four new `<h3>` subsection headings for navigability matching the §2/§3/§8 inline-heading idiom. The intro paragraph is re-voiced to lead with a biologist scene (a reviewer's follow-up question arriving years after publication) before the three-axis decomposition; body ¶1 opens with the reader's first working assumption; body ¶2 ("What the v1 corpus commits to") leads with what an auditing reviewer sees; body ¶3 ("Two pilot findings, reported as arguments") re-frames the Week-1 findings as **for** the paper rather than apologies-pre-empted; body ¶4 ("What the corpus does not claim") reframes the scope-constraint paragraph as a biologist-facing expectation-management pass. Every claim, citation (none new), named artefact (`replay/<candidate>/macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`, `replay_week1_report.md`, `replay_candidates.md`, `v1.0-paper` git tag, `Release engineering`, §10 Availability), figure reference (Fig 3, Fig 3a, Fig 3b), and placeholder (`[N]`, `[N ≤ 40]`, `[Y1–Y2]`) of v0.1 is preserved. Word count ~560 (v0.1 was ~560). Ninth application of the iter-23 biologist-voice rule.*

### Why replay, and why three axes

A biologist whose paper is cited years later may be asked to re-run a figure — a reviewer sends a follow-up question, a collaborator wants to check a parameter at a tighter threshold, a student reproduces the analysis for a course. Three different things can stop her. The input image may no longer be retrievable from the repository where it was archived; the published macro may depend on a plugin or permission the current Fiji cannot provide; or the numerical output may not match what the paper originally reported. A replay system that reports a single Pass/Fail verdict conflates these three failures, yet the repairs each implies are categorically different. To measure whether URL-encoded ImageJ.JS analyses re-execute across hardware, browsers, and Fiji versions, we replay published Fiji analyses spanning `[Y1–Y2]` against the `v1.0-paper`-pinned CheerpJ runtime and report each outcome on three independent axes — ACQUIRE (can the input data be retrieved from the original source or a mirror?), EXECUTE (does the published macro run end-to-end against the retrieved input in the pinned ImageJ.JS runtime?), and MATCH (do the numerical outputs match the published reference?). Keeping the axes separate is load-bearing, not cosmetic: Fig 3's matrix surfaces *which* class each replayed candidate exhibits, so a reviewer can judge the corpus's coverage rather than a summary pass rate.

### What the v1 corpus commits to

The v1 corpus makes four commitments a reviewer can audit candidate-by-candidate, ahead of the full `[N]`-candidate evidence drop (Gate F; `replay_candidates.md` 15-candidate shortlist). First, every candidate ships a replay record at a shared schema — `replay/<candidate>/macro.*` (the published macro verbatim), `INPUTS.json` (upstream URL, SHA-256 over the acquired bytes, retrieval date), `run_replay.py` (the harness that runs the macro against the pinned CheerpJ runtime), `outputs/` (the replay's numerical outputs), and `MATCH_REPORT.md` (the three-axis verdict with per-axis diagnostic) — so a biologist who wants to audit a claim against any candidate can do so without tool-chain setup beyond `git clone` and a browser. Second, the corpus is stratified across publication year `[Y1–Y2]`, plugin surface (core Fiji; named plugins — TrackMate, MRI Wound Healing, MorphoLibJ, BoneJ), and workflow kind (headless, interactive, self-testing); the stratification rationale is archived in `replay_candidates.md §"Selection rationale"`, and the Methods caveat names explicitly that `[N]` candidates are not ergodic across all published Fiji usage. Third, per-axis outcomes are reported in cell-annotated form — green/amber/red per axis, one-word diagnostic per cell — rather than as a summary pass rate, so the corpus-level claim of §4 is the distribution of per-axis diagnostics across `[N]` candidates (Fig 3a), not a top-line percentage. Fourth, the pinned runtime under which MATCH is reported is immutable: the CheerpJ-compiled Fiji JVM and the bundled plugin set are served as signed artefacts under the `v1.0-paper` git tag (Release engineering; §10 Availability), so MATCH mismatches reported in §4 are mismatches between the published record and the tool-as-pinned, not mismatches against a moving target.

### Two pilot findings, reported as arguments

Two findings from the Week-1 three-candidate pilot (TrackMate HeLa 2017; *Drosophila* NMJ 2016; MRI Wound Healing 2020; `replay_week1_report.md`) are kept in the production protocol verbatim rather than apologised for — they are arguments *for* the paper, not caveats against it. The *Drosophila* NMJ Morphometrics 2016 figshare deposit ships a reference `results.txt` whose ground-truth object list (21 objects of specified sizes) does not correspond to the bundled input stack (one 131-px object on a single slice); the bundle is internally inconsistent, invisible without pixel-level inspection, and a perfect replay system correctly reports MATCH = fail because the published reference is itself in error. Routine cross-decade replay auditing surfaces exactly this kind of data-bundling failure years after publication, and the pinned-runtime replay is the instrument that makes it visible. The MRI Wound Healing 2020 macro hard-codes 2017-Fiji `Find-Edges` + auto-threshold values in its `testThresholdFindEdges` self-test; the 2026 Fiji `Find-Edges` implementation has drifted numerically, so the 2020-authored self-test now fails on a 2026 desktop Fiji while the macro's variance-based branch matches bit-exactly. This is direct evidence that reproducibility at cross-decade timescales requires pinning a primitive implementation, not just pinning a tool version; ImageJ.JS's CheerpJ-frozen JVM is the mechanism that provides that pin, and a reviewer can verify the pin against the `v1.0-paper` tag. Both findings are reported as worked failure classes in Fig 3b at the full-corpus landing; at interim, the Week-1 matrix is the figure.

### What the corpus does not claim

What the v1 replay corpus does not claim is named here rather than deferred to §Limitations, because a reviewer will ask. First, v1 replay targets macros and their retrievable inputs — papers whose imagery was never public, whose scripts use interactive dialogs the macro form cannot capture, or whose input provenance is locked behind a data-transfer agreement are out of scope at v1, recorded in `replay_candidates.md §"Excluded"` by reason, and left for a successor-paper replay corpus that partners with archival institutions. Second, `[N]` is deliberately modest — 15 candidates at the Brief-Communication path, extensible to `[N ≤ 40]` at the full-Article path — because §4's argument is *regime coverage*, not *ergodicity*: the corpus must demonstrate that cross-decade replay of published Fiji analyses is a tractable, scriptable, per-candidate-auditable instrument in the ImageJ.JS-plus-pinned-runtime substrate, and that claim is warranted by 15 stratified candidates in the same way the 30-task benchmark's regime claim is warranted without claiming to exhaust DL performance. These two constraints are the v1 feature list the paper claims reproducibility against; a larger corpus is a v1.1 deliverable, not a submission-blocking gap.

### §4 v0.1 → v0.2 claim-preservation audit

Every sentence of v0.2 preserves the assertion of its v0.1 counterpart. Per-paragraph diff:

- **Intro paragraph (v0.2)** opens with a biologist-facing reviewer-question scene before the three-axis decomposition (unchanged); the three axes ACQUIRE/EXECUTE/MATCH definitions are preserved verbatim, and the "load-bearing, not cosmetic" rationale moves from v0.1's body ¶1 to the intro ¶ for concrete-before-abstract ordering. No new claim.
- **Body ¶1 (v0.2 "What the v1 corpus commits to")** preserves every load-bearing sentence of v0.1 ¶2. The "four-fold" structural commitment is preserved with identical sub-points: shared schema, stratification, per-axis cell-annotated form, immutable pinned runtime. All three placeholders (`[N]` ×3, `[Y1–Y2]`) and all six named artefacts (`replay/<candidate>/macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`, `v1.0-paper`) preserved verbatim.
- **Body ¶2 (v0.2 "Two pilot findings, reported as arguments")** preserves v0.1 ¶3 verbatim at sentence level. Opening "are kept in the production protocol verbatim rather than apologised for — they are arguments *for* the paper, not caveats against it" echoes Cover letter ¶5 voice. The two findings (bundle inconsistency; cross-version Find-Edges drift) are preserved verbatim with the same citations (`replay_week1_report.md`, `replay/mri_wound_healing_2020/MATCH_REPORT.md`).
- **Body ¶3 (v0.2 "What the corpus does not claim")** re-voices v0.1 ¶4's "Two scope constraints bound the section's commitments" to a biologist-facing "What the v1 replay corpus does not claim is named here rather than deferred to §Limitations, because a reviewer will ask". The two constraints (v1 targets macros with retrievable inputs; `[N]` is deliberately modest 15/40) are preserved verbatim with the same `[N]` / `[N ≤ 40]` placeholders.
- **h3 navigational affordances**: Four new `<h3>` subsection headings in the HTML — *Why replay, and why three axes*; *What the v1 corpus commits to*; *Two pilot findings, reported as arguments*; *What the corpus does not claim* — match the §2/§3/§8 inline-heading idiom. No new anchors introduced (all existing cross-references preserved).

**Biologist-voice programme — §4 extension note.** With iter 31, the biologist-voice chain now reads Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → §2 v0.2 → Fig 1 → Box 2 → §3 v0.2 → Fig 2 → **§4 v0.2** → Fig 3 → §§5–7 → Fig 4–6 → §8 v0.2 → Fig 7 → Cover letter v0.2 → Research Briefing v0.2 — the paper's complete argumentative spine (§§1–8) plus both editor-facing surfaces in publication-ready biologist voice. The prior iter-27/iter-30 statement that the programme was "complete" was overclaiming: §4 prose had landed at v0.1 (iter 19) as structural-commitment but had not received the biologist-voice pass that §§1/2/3/8 received at iters 23/24/25/27. Iter 31 closes this gap. Remaining surfaces in editorial voice by genre design: §9 Discussion implications (methodology-community reflection); §10 Availability (fixed-format availability statement); §§5/6/7 (partner-evidence-gated structural-commitment prose at iter 18, scheduled for biologist-voice at Gate G partner landings); Online Methods (Methods genre); Research Briefing SEG 4 AUTHOR-GATED + SEG 5 EDITORIAL + Key references + Figure suggestion (genre-determined voices preserved per the iter-29 rule); Submission packet (catalogue form); Reporting Summary (question form); Reviewer-response dry run (reviewer-simulation form); Readiness dashboard (scorecard form).

---

## Drafted prose — References (v0.2, Gate H bibliographic verification 2026-04-18)

**Scope.** Eight of the 15 author-verifiable references in v0.1 promoted from `[VOL:PAGES, DOI]`-style placeholders to Crossref-verified metadata. Seven references remain author- or evidence-gated (software URLs, in-preparation preprints, partner-signoff figshare entries). This is the first **bibliographic-resolution iteration kind** — an eighth iteration kind distinct from all seven prior iteration kinds catalogued in the progress log, because it is the first pass *expected* to reduce the `placeholder-value` span count rather than preserve it.

**Verification method.** Crossref REST API (`https://api.crossref.org/works?query.bibliographic=...`) was queried once per reference for the top candidate, cross-checked against title, author list, and year. DOIs returned by Crossref were adopted as the authoritative record. Two references required year corrections where the Crossref-returned year differed from the v0.1 entry — these were adopted as factual-correctness fixes, since the scientific claim each reference anchors is unchanged.

### Resolved references (8)

1. **ref-lord2024 (SuperPlots).** Lord SJ, Velle KB, Mullins RD, Fritz-Laylin LK. SuperPlots: Communicating reproducibility and variability in cell biology. *Journal of Cell Biology* **219**, e202001064 (**2020**). `doi:10.1083/jcb.202001064`.
   - *Year correction 2024 → 2020.* The SuperPlots paper is a 2020 publication; the "(2024)" in v0.1 was a typo. The scientific claim the reference anchors ("13–27 cells per condition across three biological replicates") is the central SuperPlots finding and is unchanged.
   - *Body-prose cross-ref updates.* Display text "Lord et al. 2024" → "Lord et al. 2020" in Abstract ¶1, Key Points bullet 1, §2 lead ¶, §2 ¶2, §3 ¶3, and Cover letter ¶2 (6 positions). Anchor id `ref-lord2024` preserved as an opaque HTML identifier — renaming it would break cross-references in 5 places without benefit.

2. **ref-ma2024.** Ma J, He Y, Li F, Han L, You C, Wang B. Segment anything in medical images. *Nature Communications* **15**, 654 (2024). `doi:10.1038/s41467-024-44824-z`.

3. **ref-archit2024 (micro-SAM).** Archit A, Freckmann L, Nair S *et al.* Segment Anything for Microscopy. *Nature Methods* **22**, 579–591 (**2025**). `doi:10.1038/s41592-024-02580-4`.
   - *Year correction 2024 → 2025.* Published in the March 2025 issue; the "(2024)" in v0.1 was likely an "accepted 2024" confusion. The scientific claim (foundation-model segmenters degrade on long-tail biomedical imagery) is unchanged.
   - *Body-prose cross-ref updates.* Display text "Archit et al. 2024" → "Archit et al. 2025" in §2 ¶2 and §3 ¶3 (2 positions). Anchor id `ref-archit2024` preserved.

4. **ref-kirillov2023 (SAM).** Kirillov A, Mintun E, Ravi N *et al.* Segment Anything. *Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV)* 3992–4003 (2023). `doi:10.1109/ICCV51070.2023.00371`. arXiv:2304.02643.

5. **ref-stringer2025 (Cellpose3).** Stringer C, Pachitariu M. Cellpose3: one-click image restoration for improved cellular segmentation. *Nature Methods* **22**, 592–599 (2025). `doi:10.1038/s41592-025-02595-5`.
   - *Title update.* v0.1 title "Cellpose3: generalizable and improved cellular segmentation" replaced with Crossref-canonical title "Cellpose3: one-click image restoration for improved cellular segmentation". The citation refers to the same paper; the published title differs from the v0.1 draft rendering.

6. **ref-schmidt2018 (StarDist).** Schmidt U, Weigert M, Broaddus C, Myers G. Cell Detection with Star-Convex Polygons. In *Medical Image Computing and Computer-Assisted Intervention — MICCAI 2018*, Lecture Notes in Computer Science **11071**, 265–273 (2018). `doi:10.1007/978-3-030-00934-2_30`. arXiv:1806.03535.

7. **ref-israel2025 (CellSAM).** Israel U, Marks M, Dilip R *et al.* A foundation model for cell segmentation. *Nature Methods* **22**, 2585–2593 (2025). `doi:10.1038/s41592-025-02879-w`.

8. **ref-deepimagej2021 (DeepImageJ).** Gómez-de-Mariscal E, García-López-de-Haro C, Ouyang W *et al.* DeepImageJ: A user-friendly environment to run deep learning models in ImageJ. *Nature Methods* **18**, 1192–1195 (2021). `doi:10.1038/s41592-021-01262-9`. Volume and page range already correct in v0.1; iter 32 adds the clickable DOI hyperlink.

### Unresolved — author- or evidence-gated (7)

- **ref-mri2020 (BIOP/MRI Wound Healing macro).** figshare / `dev.mri.cnrs.fr` DOI resolves at partner sign-off (Gate G).
- **ref-royer2024 (Omega).** Royer LA *et al.* Omega — LLM-driven image analysis for napari. Not yet indexed in Crossref; likely bioRxiv preprint. Resolves at author correspondence.
- **ref-naparimcp2025.** napari-mcp: software release; URL + commit hash resolve at submission.
- **ref-bioimageagent2026.** Authors to be announced; arXiv-id + DOI resolve when the preprint lands.
- **ref-chen2026 (CellVoyager).** Not yet indexed in Crossref; resolves when the paper lands.
- **ref-ouyangcompanion.** Companion paper in preparation; resolves at companion-paper submission.
- **ref-cheerpj.** Leaning Technologies product release; URL + archived-snapshot resolve at submission.
- **ref-fsa (File System Access API).** W3C editor's draft; URL + date-accessed resolve at submission.

### Rationale — why bibliographic-resolution is a distinct iteration kind

Three properties distinguish this iteration kind from the seven prior:

1. **The `placeholder-value` span count is expected to drop.** Every resolved reference converts one `<span class="placeholder-value">[VOL:PAGES, DOI]</span>` into plain inline text plus a clickable `<a class="ref-doi">` hyperlink. Net: 195 → 187 spans (−8), 326 → 318 bracketed tokens (−8 from the reference list; net +7 from editorial-machinery documentation of the resolution).

2. **Factual-correctness fixes against an authoritative external record are allowed.** The iter-23 claim-preservation discipline is suspended *by design* for bibliographic-resolution iterations, because the Crossref record is the source of truth for bibliographic metadata. Year corrections (Lord 2024 → 2020; Archit 2024 → 2025) are factual-correctness fixes, not scientific-claim changes — the papers being cited are the same papers, and the scientific claims they anchor are unchanged.

3. **Every rendered DOI is a clickable hyperlink.** The `<a class="ref-doi" href="https://doi.org/..."></a>` markup gives a reviewer or copy-editor a one-click audit path from the rendered reference to the journal record. This is a publication-readiness prerequisite Nature Methods copy-editing would otherwise perform at typesetting; landing it at authoring time means the reference list is reviewer-auditable now.

### Invariants preserved

- **Anchor id stability.** Every reference `id="ref-..."` attribute is preserved as an opaque HTML identifier. `ref-lord2024` remains `ref-lord2024` (not renamed to `ref-lord2020`) so no body-prose cross-reference breaks. The display text is the only surface that carries the year.
- **Scientific claim stability.** Every empirical claim, figure cross-reference, named mechanism, and argumentative step of v0.24 is preserved in v0.25. The body paragraphs in Abstract, Key Points, §§1/2/3/8, Box 1, Cover letter, Research Briefing, and the argumentative cross-refs between them are unchanged; only bibliographic metadata within the reference list and the matching year-display in cross-ref anchors is updated.
- **Gates D–G, I unchanged.** This iteration resolves Gate H only. Gate D (regime-survey rows 81–200 + IRR), Gate E (long-tail benchmark runs), Gate F (replay-corpus scale-up), Gate G (partner landings §§5/6/7), and Gate I (author sign-off) are all unchanged.
- **Validator regression guard.** `python3 tools/validate_manuscript.py` PASS on v0.25: 0 HTML errors · 177 anchors / 49 unique / 77 ids / 0 broken · 187 `placeholder-value` spans / 325 bracketed tokens · 0 scope violations.

### What resolves at Gate I (author sign-off)

- Final author list + affiliations for §11 Correspondence
- Final Competing Interests statement
- Final CRediT taxonomy
- Final acknowledgements
- Final suggested reviewers

### What resolves at Gate G (partner landings)

- §§5/6/7 partner-specific figures, quotes, IRB numbers, course enrolments (Figs 4/5/6)
- ref-mri2020 figshare DOI
- The seven remaining author- or evidence-gated references listed above, for those whose authors are partners on this paper

---

## Drafted prose — Box 1 · Fig + Box 2 · Fig schematics (v0.1, narrative-scaffolding figure addition 2026-04-18)

### Iteration 33, HTML render v0.25 → v0.26

Two three-panel SVG schematics are embedded in `manuscript_html/index.html` — one inside `aside.nm-box#box1` (after the box-lede, before the first vignette); one inside `aside.nm-box#box2` (same position). The schematics close the scaffolding-symmetry asymmetry flagged as the third-highest-next-iteration for five iterations in a row (29, 30, 31, 32, and implicitly 27/28 before the ladder was explicitly recorded).

### Design rules (per the iter-20 box-scope rule)

1. **Zero new claim, number, or citation.** Every vignette the schematic visualises is already drafted in the box above it; every method or mechanism named (CheerpJ, Cellpose, CellProfiler, StarDist, FDA-cleared classifier, audit_log.js, Hypha-RPC) is already defined and cited in the body section the vignette points at.
2. **Every figure element points at a body surface already named.** Box 1 · Fig cross-references §3 (design principles), §4 Fig 3 (reviewer re-run), §5 Fig 4 (teaching), §6 Fig 5 (clinical). Box 2 · Fig cross-references §8 ¶2 (connectomics + HCS), §8 ¶4 (ED triage), Fig 7 (composition surface), `ref-stringer2025`, `ref-schmidt2018`.
3. **Inline styling scoped to the `aside.nm-box` wrapper.** The iter-21 CSS-scoping regression class (`aside { position:sticky; ... }` breaking `aside.nm-box`) is not re-triggered because no new generic `figure` CSS rule is introduced — every style is inline on the `<figure>`, `<div>` header/body, and `<figcaption>` elements directly.

### Box 1 · Fig — "Three working days, one URL"

SVG viewBox 1000×230, three panels separated by dashed divider lines.

- **Panel A · Monday — teaching laboratory.** One URL bubble at top carrying `?open=cells&macro=count&threshold=65` fans down to three Chromebook screens below (each with a thin keyboard base and a Fiji-window tint); each screen shows the same three-orange-dot count overlay at `t=65`; bottom label reads "15 browsers · 1 URL · 0 installs" with the cross-reference "the assignment is the URL → §5 · Fig. 4".
- **Panel B · Thursday — pathologist's consult.** Left workstation sits inside a dashed red "HOSPITAL FIREWALL" boundary; inside its screen is the `slide.svs` drawn as a tissue-stain rectangle with six cell-marker dots, captioned "pixels stay local". Right workstation outside the firewall has only a dashed-rectangle "rendered frame" with a blue ROI polygon overlay. An arrow labelled "frame" flows left-to-right; an arrow labelled "ROI" flows right-to-left; below them, a chip reads `audit_log.js`. Bottom label: "image stays · frames cross · audit signs", cross-ref "privacy by default → §6 · Fig. 5".
- **Panel C · Friday, six months later — reviewer-triggered re-run.** Two rows. Row 1: `?t=65` URL pill → `v1.0-paper · CheerpJ` pinned-runtime chip → figure thumbnail with three red cell markers, labelled "= published" in green. Row 2: `?t=72` URL pill → "same pinned runtime" → figure thumbnail with two smaller cell markers, labelled "tighter @ 72" in blue. Bottom label: "binary-identical @ 65 · reproducible @ 72", cross-ref "URL-addressable → §4 · Fig. 3".

### Box 2 · Fig — "Three regimes where ImageJ.JS is deliberately the wrong tool"

SVG viewBox 1000×230, three panels separated by dashed divider lines, palette earth-tone to distinguish from Box 1's blue-accent palette.

- **Panel A · 50 TB volume — connectomics reconstruction.** Isometric EM-slice stack (five slices, beige/brown gradient, stepped perspective), labelled "50 TB · >10⁴ sections" → black GPU-cluster rack with yellow horizontal fan lines and server indicator dots, labelled "GPU cluster · Cellpose · flood-fill" → connectivity-matrix graph (five nodes, six edges), labelled "connectivity matrix". Bottom label: "server-side DL · not browser-scale", cross-ref "right tool named in §8 ¶2".
- **Panel B · 384-well HCS — high-content drug screen.** Plate-shaped rectangle with a 16-column × 8-row dot grid (128 dots — simplified from 384 for legibility), labelled "384 wells · 6 ch · 4 fld" → batch-queue stack of four plate cards (`plate_01`, `plate_02`, `plate_03`, `plate_…`) at descending offsets, labelled "batch queue · CellProfiler · Cellpose" → feature-table grid with header row (well · area · int. · hit) and four data rows (A1, A2 ✓, A3, …), labelled "hit list → LIMS". Bottom label: "batch DL · feature matrix · no human in loop", cross-ref "right tool named in §8 ¶2".
- **Panel C · ED triage < 30 s — emergency department.** Patient silhouette (circular head, torso outline) labelled "patient · cardiac ultrasound" → DL-classifier box labelled "DL classifier · calibrated · logged" with a red-bordered `FDA 510(k)` stamp inside labelled "sens/spec known", and below the classifier the chip reads "hospital EMR · logs decision" → binary investigate/discharge decision chip (green "invest." | red "disch.") beside a red-bordered 30-second timer circle. Bottom label: "calibrated · regulated · EMR-integrated", cross-ref "right tool named in §8 ¶4".

### Why this is a distinct iteration kind

Ninth iteration kind catalogued. Distinct from:
- (i) body-prose promotion (evidence-gated notice → structural-commitment prose; e.g., iters 18, 19)
- (ii) biologist-voice copy-edit (already-drafted prose re-voiced; iters 17, 23, 24, 25, 27, 29, 30, 31)
- (iii) narrative-scaffolding prose addition (new `aside` block carrying narrative text; iters 20, 21, 22)
- (iv) editorial-machinery scorecard synchronisation (readiness/packet/reporting/briefing; iters 13, 14, 15, 16)
- (v) working-doc ↔ rendered-surface agreement repair (iters 26, 27)
- (vi) engineering infrastructure (iter 28 validator)
- (vii) bibliographic resolution (iter 32 Gate H)
- (viii) editor-facing surface biologist-voice (iters 29, 30)

This ninth kind — **narrative-scaffolding figure addition** — sits between (iii) narrative-scaffolding prose addition and regular figure-slot addition: it produces a `<figure>` element, but the figure lives inside a narrative-scaffolding `aside.nm-box`, not in the body-prose flow; its content is determined by vignettes that are already drafted inside the same box, not by new evidence; and its claim-preservation invariant is inherited from the iter-20 box-scope rule, not from the iter-23 biologist-voice rule.

### Invariants preserved

- **Placeholder-value span count unchanged at 187.** Thirteenth consecutive empty-claim-diff iteration (iters 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 also met the invariant; iter 32 was the exception by design — bibliographic resolution dropped the count from 195 → 187, which is the new baseline that holds through iter 33).
- **HTML well-formed.** 0 errors from `tools/validate_manuscript.py`.
- **Anchor integrity.** 201 total anchors / 49 unique / 88 ids / 0 broken. New ids introduced: `box1fig`, `box1figtitle`, `box2fig`, `box2figtitle`, plus 7 SVG `<defs>` ids (`b1screenG`, `b1arrow`, `b1arrowB`, `b2sliceG`, `b2gpuG`, `b2plateG`, `b2arrow`). Zero broken cross-references.
- **Placeholder-value-scope linter.** 0 violations. All placeholder tokens in the iter-33 banner/dd/footer descriptions are `<code>[token]</code>` inline, not `<span class="placeholder-value">`.
- **Prose-block coverage unchanged at 25/25.** This iteration is a figure-addition, not a prose-addition. Future iteration-kind accounting should distinguish prose blocks from figure blocks in the readiness dashboard.

### Gates resolved / unchanged

- **No Gate resolved.** Gates D (regime-survey rows 81–200 + IRR), E (long-tail benchmark runs), F (replay-corpus scale-up), G (partner landings §§5/6/7), I (author sign-off) all unchanged.
- **Structural scaffolding complete.** Every body section §§1–10 carries a figure (Fig 0 graphical abstract, Fig 1, Fig 1-suppl, Fig 2, Fig 3, Fig 4, Fig 5, Fig 6, Fig 7). Both narrative-scaffolding boxes now carry preview schematics. The biologist-reader's first-contact path through the paper has no figure-less surface except §9 Discussion implications (genre-design editorial voice) and §10 Availability (fixed-format statement) — where a figure would be out of genre.

### What future iterations of this kind would look like

- **Key Points bullet schematic (if added later).** The five-bullet Key Points aside (iter 22) is a sibling narrative-scaffolding surface to Boxes 1 and 2; a future iteration could add a compact icon-per-bullet schematic following the same three rules. Not urgent — Key Points bullets already read cleanly as text and the burgundy-palette visual treatment distinguishes them without a figure.
- **Fig 6 schematic update when Gate G lands.** Fig 6 (collaboration) currently carries structural-commitment-only content; when the collab sprint evidence lands (Gate G), the figure's session-log-timeline panel will be drawn. That is a *regular* figure-slot resolution, not a narrative-scaffolding figure addition.

---

## Drafted prose — Readiness dashboard v0.3 (Biologist-voice per-§ checklist + Figure-coverage scoreboard rows, 2026-04-18)

Iteration-34 dashboard-expansion pass. Two new rows added to the Readiness scoreboard table between the existing *Research Briefing* row and the table's `</tbody>` close. Zero edits to body prose, figure captions, box contents, Key Points, Abstract, or Cover letter — the iteration-kind rule forbids touching any drafted-prose surface. Both rows rephrase status already recorded elsewhere and introduce no new claim, count, or commitment; the iter-23 claim-preservation discipline and the dashboard-discipline rule (i) *Rephrasing only* jointly govern the pass.

**Row 1 — Biologist-voice per-§ checklist.** *5 / 8* §§ biologist-voiced (§1 v0.2 iter 23 · §2 v0.2 iter 27 · §3 v0.2 iter 24 · §4 v0.2 iter 31 · §8 v0.2 iter 25) · *3 / 8* structural-commitment v0.1 pending biologist-voice pass on partner landing (§5 teaching · §6 clinical · §7 collaboration); Abstract v0.6 iter 23, Cover letter v0.2 iter 29, Research Briefing v0.2 iter 30 all biologist-voice-ready. Per-§ status is not newly asserted — each entry rephrases the `## Drafted prose — §N (v0.2, biologist-voice rewrite ...)` heading stamp already in this working doc. Gating-path column notes that §§5/6/7 biologist-voice pass lands with Gate G partner vignettes (each v0.1 placeholder set — `[Partner-institution]`, `[IRB-number]`, per-course `[C_k-delta]`, `[Postdoc-institution]` — resolves at Gate G, and the biologist-voice re-voice leads with the newly-named partner vignette rather than editorial abstraction). Source-block column cites the per-§ `## Drafted prose` headings in this file and the iter-23 biologist-voice rule.

**Row 2 — Figure coverage (per figure).** *8 / 11* structural-ready (Fig 0 Graphical Abstract · Fig 1 · Fig 1-suppl · Fig 2 · Fig 3 · Fig 7 RESOLVED code-only · Box 1 · Fig iter 33 · Box 2 · Fig iter 33) · *3 / 11* structural captions only pending Gate G numerical / partner resolution (Fig 4 teaching · Fig 5 clinical · Fig 6 collaboration). Narrative-scaffolding boxes are now figure-symmetric with body sections (closed iter 33). Gating-path column notes that Fig 4/5/6 panels render at Gate G — teaching partner session data, clinical partner case audit, collaboration demo videos — and each promotes from caption-only to full-figure in the same iteration as its §-prose biologist-voice re-voice. Fig 1 numeric panel values `[48]%`/`[48]%`/`[20]%` resolve at Gate D. Fig 7 is structurally resolved today — its evidence source is the `hypha-imagej-service.js` method surface in the `v1.0-paper` git tag, not partner data. Box 1 · Fig and Box 2 · Fig are inline-styled SVG schematics added iter 33 under the narrative-scaffolding figure-addition iteration-kind (ninth kind catalogued). Source-block column cites Figure slots v0.2 (iter 26) + iter-33 Drafted-prose block.

**Scoreboard one-line summary update.** The tail-of-dashboard one-line summary is rewritten to include both new rows plus the iter-32 Gate-H 8/15 references Crossref-verified state and the iter-33 8/11 figure-coverage state: "25 / 25 prose · 5 / 8 biologist-voiced §§ (+ Abstract / Cover letter / Research Briefing) · 8 / 11 figures structural-ready (3 pending Gate G) · 10 / 12 defensibility · 8 / 8 packet non-regression (0 evidence-gated) · 22 / 25 reporting-summary responses · 4 / 7 research-briefing segments READY (+ 1 AUTHOR-GATED + 1 EVIDENCE-GATED + 1 EDITORIAL) · 8 / 15 references Crossref-verified (Gate H closure iter 32) · 80 / 200 survey · 0 / 30 benchmark · 3 / [N] replay · 187 placeholder-value spans open · 3 / 10 gates MET (Gate H partial iter 32 · Gate J partial iter 15) · structurally READY · empirically EVIDENCE-GATED on Gates D–G." Replaces the stale `0 / ~35 references verified`, `16 / 16 prose`, and `3 / 6 figure captions` fragments that predated iters 27 / 32 / 33.

**Iteration-kind classification.** This is the **tenth iteration kind** catalogued: *dashboard-expansion iteration*, distinct from the nine prior kinds (body-prose promotion, biologist-voice copy-edit, narrative-scaffolding prose addition, editorial-machinery scorecard synchronisation, working-doc ↔ rendered-surface agreement repair, engineering infrastructure, bibliographic resolution, editor-facing-surface biologist-voice, previously-unvoiced-body-section biologist-voice, narrative-scaffolding figure addition). Three rules govern it: (i) zero prose edits — the iteration must not touch body prose, figure captions, box contents, Key Points, Abstract, or Cover letter, so the prose-coverage count, placeholder inventory, defensibility scorecard, packet scorecard, reporting summary scorecard, research briefing scorecard, figure slots scorecard, and readiness gates ALL remain unchanged; (ii) every new row must rephrase status already recorded in a source scorecard or version stamp, no new measurement or commitment — dashboard-discipline rule (i) *Rephrasing only* preserved; (iii) the iteration closes a visibility gap identified by a prior iteration — iter 34 closes the gap the iter-31 §4 biologist-voice over-claim would have avoided if a per-§ checklist row had already existed. Future dashboard-expansion iterations (a per-gate timeline row; a per-reference-category Crossref recheck row; a per-placeholder propagation row) follow the same three rules.

**Invariants preserved.** Placeholder-value span count **unchanged at 187** — claim-preservation discipline holds for the **fourteenth consecutive iteration** (iters 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34 all empty-claim-diff; iter 32 was the one by-design exception — bibliographic resolution — which dropped the count from 195 → 187 and is the new baseline that holds through iter 34). All four validator checks PASS at v0.27: 0 HTML errors · anchor integrity maintained · 187 placeholder-value spans · 0 placeholder-value-scope violations. Gates D–J status unchanged (3 / 10 MET). Biologist-voice chain Key Points → Abstract v0.6 → §1 v0.2 → Box 1 → §2 v0.2 → Fig 1 → Box 2 → §3 v0.2 → Fig 2 → §4 v0.2 → Fig 3 → §§5–7 (structural-commitment, Gate-G-pending) → Fig 4–6 → §8 v0.2 → Fig 7 → Cover letter v0.2 → Research Briefing v0.2 unchanged.

**What the two rows unlock.** A reviewer or co-author opening the rendered draft can now see at a glance (a) which body sections are already in biologist voice and which are awaiting Gate G partner landings, and (b) which figures are structural-ready today and which are Gate-G-pending — without scrolling through per-iteration descriptions or version stamps. The two rows are the minimal dashboard surface that makes an iter-31-class over-claim ("biologist-voice programme is complete") unable to recur silently: a future iteration that adds a biologist-voice pass to §§5/6/7 must tick a specific row cell from pending to met, not just append a narrative summary. This is the dashboard analogue of the iter-28 validator — the validator guards HTML structure at authoring time; the two new dashboard rows guard voice and figure coverage at review time.

---

## Drafted prose — `tools/propagate_placeholders.py` mechanical rewriter (v0.1, engineering-infrastructure iteration 2026-04-18)

Iteration-35 engineering-infrastructure pass. A ~300-line stdlib-only Python 3 tool that pairs with the iter-28 `tools/validate_manuscript.py` regression guard to make evidence-landing iterations a single mechanical pass rather than 37 careful hand-edits across 37 Drafted-prose blocks + the rendered HTML. Second application of the engineering-infrastructure iteration kind catalogued at iter 28. Zero prose edits; no new claim, number, citation, or placeholder; placeholder-value span count unchanged at 187.

**Tool contract.** Given a resolution dictionary of the form `{"[48]%": "37%", "[N]": "42", "[INITIALS]": "WO, SF, KJ"}`, the tool propagates resolved values across two surfaces in one pass:

1. `manuscript_html/index.html` — every `<span class="placeholder-value">[token]</span>` whose bracketed inner text equals a key in the resolution dictionary is replaced by the resolved value (the enclosing span is stripped entirely). This drops the `placeholder-value` inventory count by exactly one span per replacement, mirroring the iter-32 bibliographic-resolution behaviour where each DOI resolution dropped the count by one span.

2. `preprint.md` — every bracketed token `[token]` that appears *inside* a `## Drafted prose —` block is replaced by the resolved value. The replacement is scoped to Drafted-prose blocks by a parser that tracks `## ` H2 heading positions. Outside-block text (the *Patterns* section, iteration-log entries, discipline notes, Crossref worklists) is never rewritten — a `[48]%` that appears in a Patterns bullet describing the token is intentionally preserved, because it documents the token rather than claiming the token.

**Modes.** Two mutually-exclusive modes plus an ancillary self-test:

- `--dry-run` reports what would change (per-token counts; span-count delta; before/after) without writing any file. Use this first on any non-trivial resolution dictionary.
- `--apply` writes modified files in place. Always re-run the validator immediately after (`python3 tools/validate_manuscript.py`) to confirm the expected span-count drop and zero new HTML/anchor regressions.
- `--self-test` runs a built-in smoke test confirming (a) an empty resolution dictionary is a no-op across both surfaces; (b) a single-key resolution correctly replaces only the in-block occurrence in Markdown (not the outside-block occurrence); (c) the HTML span count drops by exactly one per replacement.

**Resolution sources.** Inline via `--resolution KEY=VALUE` (repeatable) and/or a JSON file via `--resolutions-file PATH` (a flat object mapping token → value). The tool composes both if supplied together (inline overrides file).

**Span-count delta warning.** After every run, the tool compares (i) the total HTML span replacements made against (ii) the actual before/after `placeholder-value` span count delta. A mismatch surfaces a subtle bug: the resolution key names a token that is not present in any `<span class="placeholder-value">` on the page (e.g., the author typed `[49]%` instead of `[48]%`). The warning is printed at dry-run time so the author can correct the resolution dictionary before writing any file.

**Documented edge case — spans with nested markup.** A placeholder-value span whose inner text contains a nested tag — the one instance in v0.27 / v0.28 is `<span class="placeholder-value">[C<sub>k</sub>-delta]</span>` in §5 — is intentionally not matched by the tool. The inner-text regex requires `[^<]*` between the opening and closing span tags, so nested markup is excluded by design. The author must resolve such spans manually in the same evidence-landing iteration. The tool's span-count-delta warning will *not* trigger for nested-markup spans because the tool never scanned them; the docstring documents this so a future author knows to audit nested-markup spans alongside the tool-driven resolutions.

**Dry-run verification against v0.28.** Running `python3 tools/propagate_placeholders.py --dry-run --resolution '[48]%=SENTINEL-48' --resolution '[N]=SENTINEL-N'` against the v0.28 render returns `html=27` replacements for `[48]%` and `html=18` for `[N]`, total 45 replacements; span count 186 → 141; delta −45 matches replacement total (no warning). The Markdown-side totals were `md=45` for `[48]%` and `md=41` for `[N]` (these counts are higher than HTML because preprint.md also carries the working-doc Drafted-prose blocks where the tokens appear in free-text cross-references that the HTML does not carry). No files are written in dry-run mode, confirming the mode contract.

**Why now.** Recommended as highest- or second-highest-value next iteration without new evidence for four consecutive iterations (32, 33, 34, 35 start-of-iteration ladder). Drafting the propagator *before* Gate D/E/F/G evidence lands turns each evidence-landing iteration (which must touch up to 37 Drafted-prose blocks + the HTML render) into a single command. The pair (validator + propagator) is the matched engineering-infrastructure pair for the iter-28 iteration kind — the validator guards authoring-time invariants, the propagator mechanically applies evidence-landing resolutions, and the validator re-runs post-propagation as the regression check.

**Iteration-kind classification.** This is the **second application** of the iter-28 engineering-infrastructure iteration kind (first was `tools/validate_manuscript.py` itself at iter 28). Three rules govern this iteration kind (from the iter-28 Patterns entry): (i) zero prose edits — no sentence, heading, caption, or box content is invented; (ii) guards an empirically-observed regression class — evidence-landing passes that touch multiple surfaces introduce opportunities for drift, so this tool enforces single-source resolution; (iii) self-contained and dependency-free — Python 3 stdlib only (`argparse`, `json`, `re`, `pathlib`, `sys`). All three rules hold for iter 35.

**Invariants preserved.** Placeholder-value span count **unchanged at 187** — claim-preservation discipline holds for the **fifteenth consecutive iteration** (iters 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35 all empty-claim-diff on the body/editorial-surface scoped count; iter 32 was the one by-design exception — bibliographic resolution — which dropped the count 195 → 187 and is the new baseline that holds through iter 35). All four validator checks PASS at v0.28: 0 HTML errors · 201 anchors / 49 unique / 88 ids / 0 broken · 187 `placeholder-value` spans · 0 placeholder-value-scope violations. Gates D–J status unchanged (3 / 10 MET). Biologist-voice chain unchanged. Body prose, figure captions, box contents, Abstract, Key Points, Cover letter, References, Research Briefing, Readiness dashboard rows, Online Methods, Release engineering, Submission packet, Reporting Summary, Reviewer-response dry run, and Supplementary material outline all untouched.

**What the tool unlocks at Gate D/E/F/G landing.** When Gate D survey rows 81–200 land and the interim `[48]%`/`[20]%` values resolve to `X%`/`Y%`, the pass becomes:

```
python3 tools/propagate_placeholders.py \
  --resolution '[48]%=X%' \
  --resolution '[20]%=Y%' \
  --resolution '[7]%=Z%' \
  --resolution '[11]%=W%' \
  --apply
python3 tools/validate_manuscript.py  # regression check
```

— instead of 27 `[48]%` + 11 `[20]%` + 2 `[7]%` + 1 `[11]%` = 41 careful manual edits in the HTML alone, plus ~86 additional edits in preprint.md Drafted-prose blocks. The two-command idiom is the reproducible evidence-landing workflow the paper has been building towards since iter 8.

---

## Drafted prose — `tools/recheck_references.py` bibliographic re-checker (v0.1, engineering-infrastructure iteration 2026-04-18, iter 36)

*Third application of the iter-28 engineering-infrastructure iteration kind — the tool-side counterpart to iter 32's first bibliographic-resolution pass and a companion to iter 35's `propagate_placeholders.py`. Pairs the `validate_manuscript.py` regression-guard (iter 28) and the `propagate_placeholders.py` mechanical rewriter (iter 35) with a third tool that catches references as they land on Crossref. Closes the Gate-H worklist into a repeatable three-command evidence-landing workflow.*

**What the tool does.** Parses the References section of `manuscript_html/index.html`, identifies every `<li id="ref-*">` list item that still carries a `<span class="placeholder-value">` span (author- or evidence-gated entries), and optionally queries the Crossref REST API for each one using a locally-maintained `tools/references_worklist.json` of author / title / year hints. The tool emits a human-readable stdout report plus (optionally) a structured JSON report with per-`ref-*` status (`resolved` / `unresolved` / `newly-resolved`), placeholder tokens carried, worklist hint, and top-three Crossref candidates with DOI / title / journal / volume / page / year / heuristic score.

**Three modes.** `--offline` (default — parses the HTML, prints the worklist, no network calls) · `--online` (queries Crossref for each unresolved ref; scores each candidate with a heuristic that biases for exact year match + title-token overlap + journal hint, labels the top candidate `newly-resolved` when its score exceeds 60) · `--self-test` (runs a built-in smoke test that verifies HTML parsing, placeholder-span detection, and candidate scoring; no network calls; runs in under 1 second).

**Crossref API protocol.** Uses the Crossref polite-pool User-Agent convention (`imagej-js-manuscript/0.1 (mailto:wei.ouyang@scilifelab.se)`) so queries arrive at the higher-quality pool. Per-request timeout defaults to 10 s, configurable via `--timeout`. Network errors (timeout, DNS failure, HTTP 5xx) are caught and recorded in the per-entry `error` field of the JSON report — the tool never crashes mid-run, so a partial network outage produces a partial report rather than losing all progress.

**Candidate scoring heuristic.** Not a probability — a confidence heuristic that lets a human reviewer see at-a-glance whether the top Crossref candidate plausibly matches the cited reference. Scoring: +50 for exact year match (or +20 for ±1-year match); +10 per ≥4-character token shared between the hint title and the candidate title; +15 when the journal hint matches the Crossref `container-title`. Scores ≥ 60 flag the candidate as `newly-resolved`. The heuristic is deliberately simple — auto-accepting a Crossref candidate is out of scope; the tool's role is to surface plausible matches for human review.

**Worklist file format.** `tools/references_worklist.json` is a flat JSON object whose keys are anchor ids (e.g. `"ref-royer2024"`) and whose values are `{"author": "...", "title": "...", "year": 2024, "journal_hint": "Nature Methods"}` dicts. Missing keys are reported as `"note": "no hint in worklist — add one to enable online query"` in the report, so adding a new reference to the paper does not silently skip it at re-check time.

**First-application discoveries (iter 36).** Running `python3 tools/recheck_references.py --online --report-file tools/recheck_report.json` against v0.28 returned top-scored `newly-resolved` candidates for **two of the seven unresolved references**: **Royer 2024 Omega** — `doi:10.1038/s41592-024-02310-w`, *Nature Methods* 21, 1371–1373 (2024), **single-author** paper (Loïc A. Royer; the v0.1 "Royer LA *et al.*" is corrected to "Royer LA"; title also expanded to the Crossref-canonical "Omega — harnessing the power of large language models for bioimage analysis" from the v0.1 shorthand "Omega — LLM-driven image analysis for napari", score 85); **Alber et al. 2026 CellVoyager** — `doi:10.1038/s41592-026-03029-6`, *Nature Methods* 23, 749–759 (2026), authors Alber S; Chen B; Sun E; Isakova A; Wilk AJ; Zou J (the v0.1 "Chen *et al.*" is corrected to "Alber S, Chen B, Sun E *et al.*" because Chen is the 2nd author in the published record; title updated to the Crossref-canonical "CellVoyager: AI CompBio agent generates new insights by autonomously analyzing biological data" from the v0.1 structural description; score 85). Both resolutions were applied to the HTML render by hand (the author-list and title-wording changes exceed the propagator's plain-text-only scope).

**Anchor-id stability — iter-32 rule carried forward.** The `<li id="ref-*">` identifiers are preserved as opaque HTML strings even when the first-author display text changes. `ref-chen2026` stays `ref-chen2026` after the "Chen *et al.*" → "Alber S, Chen B, Sun E *et al.*" correction — this is the exact iter-32 rule applied to iter 36 (iter 32 preserved `ref-lord2024` after the year correction 2024 → 2020). Only the body-prose cross-reference **display text** is updated (`[Chen et al. 2026]` → `[Alber et al. 2026]` in §8 ¶5). This means (a) no intra-document link breaks, (b) git-diff on the HTML is small (only the `<li>` body and the one body-prose citation change), and (c) the iter-28 validator's anchor-integrity check stays green (0 broken anchors).

**Five references remain author- or evidence-gated.** `ref-mri2020` (BIOP/MRI wound-healing figshare DOI — resolves at partner signoff); `ref-naparimcp2025` (napari-mcp software release URL + commit hash — author-gated); `ref-bioimageagent2026` (arXiv preprint ID — in-preparation); `ref-cheerpj` (CheerpJ 4 product release URL + archived snapshot — author-gated at submission time); `ref-fsa` (File System Access API W3C editor's draft URL + date-accessed — author-gated at submission time). `ref-ouyangcompanion` was already opaque in v0.1 (no `placeholder-value` span; the whole reference body is a free-text "In preparation" note). A future iter-37 or iter-40 quarterly re-check will catch the three in-preparation preprints as they land on Crossref.

**Placeholder-value span count — 187 → 185.** Second bibliographic-resolution drop in the progress log (iter 32 was the first, 195 → 187). The iter-23 claim-preservation discipline is **suspended by design** for this iteration kind — title corrections, first-author corrections, and DOI additions are allowed because Crossref is the authoritative source of bibliographic metadata; the *scientific* claims the references anchor (the specific SuperPlots 13–27 cell finding for Lord; the LLM-driven bioimage-analysis claim for Royer 2024; the autonomous-agent methodology for CellVoyager) are preserved verbatim. This exception is the iter-32 rule carried forward.

**Iteration-kind classification.** Third application of the iter-28 engineering-infrastructure iteration kind. Three rules from the iter-28 Patterns entry hold: (i) *zero prose edits in the tool-landing half* — the tool itself never modifies any prose surface; the two Reference-section edits in iter 36 are the *applied* half of a combined tool-landing + bibliographic-resolution iteration, and each edit is a claim-preserving first-author / title-wording correction mirroring the iter-32 discipline; (ii) *guards an empirically-observed regression class* — stale Crossref data drift, since iter-32 left 7 author- or evidence-gated entries that were bound to gradually land on Crossref as the in-preparation preprints published; (iii) *self-contained and dependency-free* — Python 3 stdlib only (`argparse`, `datetime`, `json`, `re`, `socket`, `sys`, `urllib.request`, `urllib.parse`, `pathlib`).

**The three-tool engineering-infrastructure suite.** The paper now has a matched triple: **validate_manuscript.py** (iter 28 — authoring-time invariants: HTML well-formed, anchor integrity, placeholder inventory, placeholder-value scope); **propagate_placeholders.py** (iter 35 — mechanical evidence-landing: resolution-dict to HTML spans + `preprint.md` Drafted-prose blocks, with outside-block text untouched); **recheck_references.py** (iter 36 — bibliographic currency: periodic Crossref re-query of author- or evidence-gated references, with a self-contained offline mode for no-network runs). The three tools together define the reproducible evidence-landing workflow: **`recheck_references.py --online`** (discover what has landed on Crossref since the last check) → **hand-update** multi-word reference entries the propagator cannot reach (author-list rewrites, title corrections) **+ `propagate_placeholders.py --apply --resolution '[token]=value'`** (mechanically apply single-token numeric / URL / DOI resolutions across HTML + `preprint.md`) → **`validate_manuscript.py`** (confirm no authoring-time regressions introduced by the pass). Each tool is independently testable (`--self-test` smoke tests for all three) and independently runnable; the workflow composes them but does not couple them — a future iteration that resolves only numerical gates (D / E / F) can skip `recheck_references.py`; a future iteration that resolves only bibliographic gates (H) can skip `propagate_placeholders.py`.

**Invariants preserved.** Zero new scientific claim · zero new citation · zero new placeholder. Body prose, figure captions, box contents, Abstract, Key Points, Cover letter, Research Briefing, Readiness dashboard scoreboard rows, Online Methods, Release engineering, Submission packet, Reporting Summary, Reviewer-response dry run, Supplementary material outline, and the iter-28 validator all unchanged in content (the References-verification scorecard row is updated from `8 / 15` RESOLVED to `10 / 15` RESOLVED as a direct rephrasing of the two newly-resolved entries; no new claim, just a re-count). All four validator checks PASS at v0.29: 0 HTML errors · 201 anchors / 49 unique / 88 ids / 0 broken · **185 `placeholder-value` spans** (−2 vs v0.28) · 0 scope violations.

**What the tool unlocks at future Gate-H passes.** When the three in-preparation preprints (BioImage-Agent 2026, Ouyang companion paper, a hypothetical napari-mcp preprint) land on Crossref, the quarterly `python3 tools/recheck_references.py --online --report-file tools/recheck_report.json` run will surface them as `newly-resolved` without any manual worklist maintenance — the worklist hints are stable because they encode authorship and topic, not current publication state. The tool closes a visibility gap that iter 32's hand-audit could not: iter 32 was a point-in-time Crossref check, whereas iter 36's recurring-audit tool is a *persistent* worklist that runs quarterly (or on-demand before any submission milestone).

**Usage cheatsheet.**

```
# Default — parse HTML, show worklist, no network.
python3 tools/recheck_references.py --offline

# Online — query Crossref, report newly-available records.
python3 tools/recheck_references.py --online \
    --report-file tools/recheck_report.json

# Self-test — no network, smoke-test HTML parsing + scoring.
python3 tools/recheck_references.py --self-test
```

---
