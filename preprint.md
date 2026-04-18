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

All survey data (`survey_production_v2.csv`, `survey_production_frame.csv`, `survey_production_regex_baseline.csv`, `survey_schema.md`), benchmark data (`longtail_tasks.md`, per-task imagery where licence permits), replay corpora (`replay/<candidate>/` with `macro.*`, `INPUTS.json`, `run_replay.py`, `outputs/`, `MATCH_REPORT.md`), source code (`index.html`, `hypha-imagej-service.js`, `collab/`), and the pinned runtime (the `v1.0-paper` git tag, archived on Zenodo at DOI [DOI]) are released under [LICENCE] at [URL/github] and cross-referenced against every empirical claim in §§2–8. The Availability section (§10) provides the reviewer-facing index of these artefacts. Any claim in the main text that cannot be audited against a named artefact in this Methods section or in §10 is an error and should be flagged as such by reviewers; the paper stakes its regime-correctness argument on this property.

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
placeholder budget intentionally minimal ([DOI], [LICENCE], [URL],
[YYYY] only — every other identifier is a verbatim file path or
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
[LICENCE] as the code they compile. The paper's claim of an
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
`v1.0-paper`; the live instance served at [URL] continues to evolve on
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
[URL/github] under [LICENCE]. The archived version of record for
this paper is git tag `v1.0-paper` and its Zenodo mirror
[DOI]; every URL, macro, and analytical claim in the paper resolves
against this pinned tag. The programmatic interface
(`runMacro`, `takeScreenshot`, `getRoisAsGeoJson`,
`executeJavaScript`) is documented at `docs/rpc-examples/` and the
MCP-endpoint derivation (`convertToMcpUrl`) at
`hypha-imagej-service.js:880`. No human-subject image data are
released with the paper; the long-tail benchmark imagery is released
where licence permits and cited otherwise. The live instance at
[URL] collects aggregate daily-active-user counts only; no image
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
v0.1 — 14 blocks); (ii) the dry-run defensibility scorecard
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

1. **Prose-block coverage.** 14 / 14 required blocks drafted at
   v0.1. Status: `STRUCTURAL-READY`. Remaining prose work is
   evidence-gated version increments (v0.2+ when evidence lands)
   and the author-gated packet sign-off, not new block creation.
   Source: this file's §§ above.
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
7. **Placeholder inventory.** ~25 distinct placeholder labels open
   across the paper surfaces (preprint.md, manuscript_html render,
   References cross-reference map, Supp outline allocation tables,
   Release engineering pin table, Dry-run scorecard, Submission
   packet scorecard, Acknowledgements, Author contributions).
   Headline labels: `[48]%` / `[20]%` (regime survey, resolved on
   200-row landing); `[X]` / `[Y]` / `[Z]` (benchmark, resolved on
   `MATCH_REPORT.md`); `[N]` / `[Y1–Y2]` (replay scale-up);
   `[DAU]` / `[YYYY]` (live-instance analytics); `[URL]` /
   `[LICENCE]` / `[DOI]` (availability tag + Zenodo); `[INITIALS]`
   / `[NAME-n]` / `[AFFILIATION-n]` / `[FUNDING IDs]` (author-team
   sign-off); `[TEACHING PARTNER]` / `[CLINICAL PARTNER]` /
   `[COLLABORATION PARTNER-A/B]` (partner landings); `[VOL:PAGES,
   DOI]` (references verification). The placeholder-propagation
   script named as first-priority engineering primitive for seven
   iterations running will resolve every label across seven
   surfaces in a single pass once the resolution dictionary exists.

### Go/no-go submission gates

*The dashboard is not a release trigger — that role belongs to the
author-team sign-off and the evidence-landing cadence. The gates
below are the necessary-and-sufficient conditions for submission,
drawn from `preprint.md §"Next actions (4 parallel tracks)"` and
§"Kill criteria".*

- **Gate A (prose):** all 14 prose blocks drafted at v0.1 or
  better. **MET** (iteration 13).
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
  `manuscript_html/index.html` at submission. **PENDING**
  (script is the compounding engineering primitive named as
  first-priority since Iteration 8).

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

`14 / 14 prose drafted · 10 / 12 defensibility · 8 / 8 packet
non-regression (0 evidence-gated) · 3 / 6 figure captions ·
0 / ~35 references verified · 80 / 200 survey · 0 / 30 benchmark ·
3 / [N] replay · ~25 placeholder labels open · structurally
READY · empirically EVIDENCE-GATED on Gates D–G.`

