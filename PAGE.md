# Recursive Code World Models

A static research project site built from the supplied paper assets, Medieval village run, and City run. No build step, framework, server-side API, or runtime CDN is needed.

## Serve

```bash
python3 -m http.server 8000 --directory /data/zhiqi/rcwm-project-page/site
```

Open `http://localhost:8000/`. JavaScript modules require HTTP. Publish the contents of `site/` unchanged; local assets use relative paths and verification also covers a nested `/site/` deployment.

The author's arXiv URL in `config.js` and BibTeX in `index.html` are preserved byte-for-byte. Author links remain placeholders; Code remains visibly disabled.

## Pages

- `index.html`: publication header, teaser, full abstract via disclosure, Method link, example switcher, live world, complete selectable tree, selected target/render and brief, results at a glance, BibTeX.
- `explore.html`: the shared tree and live viewer, matched target/render pair, crop window on the parent's render, brief and account excerpt, depth and node tokens, first 25 lines of the main module, original-file links, parent/child navigation, and **Watch it build** playback.
- `results.html`: the selected example's reference/render pair, saved camera views and comparison figure, followed by every paper comparison, novel-view grid, complete 40-row metrics table, and method figure.
- `method.html`: the original method figure and complete solver instruction rendered as headings, four numbered steps, Completion paragraph, Discipline paragraph, and download link. Every footer links here.

All pages share Overview / Explore a run / Results / Method / Paper navigation. The selected example persists through `?scene=city` or `?scene=medieval-village`. Method content, the abstract, and BibTeX are identical for both examples. The former front-page statistics strip stays removed. The layout study and decisions are in `../LAYOUT-NOTES.md`.

## Scene registry

`data/scenes.json` is the single registry. Each entry supplies:

| Field | Value |
| --- | --- |
| `id`, `name` | Query-string identifier and displayed example name. |
| `runDirectory` | Relative directory containing `tree.json`, `events.jsonl`, `camera-contract.json`, and `fractal/<node>/`. |
| `referenceImage`, `finalRender`, `hiResRender` | Relative paths to scene media. |
| `novelViews` | Array of `{ "src": "…", "caption": "…" }` camera images. |
| `comparisonFigure` | Image path, or `{ "src": "…", "original": "…" }`. |
| `viewerEntry` | Static iframe entry, currently `viewer.html` for both scenes. |
| `derivedDirectory` (optional) | Prepared `thumbs/<id>.webp` and `matched/<id>.webp`; raw images work when omitted. |
| `renderFile` (optional) | A common packaged filename such as `FINAL.png`; otherwise filenames come from `tree.json.final_render_source`. |
| `groupAliases` (optional) | Node-id to delivered-group-name mapping. |

To add an example, drop a run directory with the same layout into `site/runs/` and add one registry entry. The tree, levels, node details, tokens, playback, media, and navigation derive from that entry and run data. No application edits or metadata build are required. The supplied runs have `part.json`, `view.json`, `brief.md`, and `account.md` for each node; the main module comes from `part.json.module`, or `scene.js` for a primitive-spec run. The shared viewer supports the supplied perspective component-build and orthographic primitive-spec formats.

`tools/prepare_scenes.py` optionally creates optimized display images for the registered examples. It is not required to serve or add a raw run. The supplied asset packages store the chosen renders as `FINAL.png`, while `final_render_source` records their original names, including round renders. Their exact bytes are also copied to those recorded names inside the published runs; no render was regenerated. Nodes absent from `final_render_source` have no render slot. This applies to City's `foreground-park-cone-tree`, `foreground-park-ponds`, `foreground-park-spread-tree`, and `west-shop`.

## Interaction and playback

The world is a program, built recursively. Clicking a tree node highlights its program, frames its bounds, outlines its ancestors, and updates the details. The adjacent segmented control answers which geometry belongs to whom, relative to that selection (initially the root):

- **All** (default): the selected node’s own geometry plus all its descendants.
- **Current node only**: geometry owned by the selected node, outside every child subprogram.
- **Children only**: the direct children’s complete subprograms, including their descendants; the parent’s own geometry is hidden. A leaf keeps this mode selected but shows its own geometry with a “has no children” hint.

Every mode hides geometry outside the selected delivery. Node selection preserves the mode; hover/focus changes only the highlight. Children only frames the union of the children’s bounds; the other modes and leaf fallback frame the selected node’s bounds. Reset view restores the reference camera without changing selection, mode or visibility.

Ownership follows the nearest mapped program group. The Medieval village root and City’s foreground-park are assemblies with no own geometry, so Current node only is empty and the hint explains why. Village terrain owns its waterfall and delegates ground, mountain and vegetation; root/parent integration edits made inside child groups stay with those children. The City adapter reconstructs groups from delivered primitive IDs, with explicit park-instance, north-housing, and copied west-house-prototype aliases. See `../LAYOUT-NOTES.md` for these exceptions; no source program or geometry is changed.

Tree keys: ↑ parent, ↓ first child, ←/→ siblings, Home/End first/last node. Trees scroll horizontally where needed; explorer keyboard focus stays below its sticky viewer. Drag the world to orbit; scroll/pinch to zoom. Canvas keys orbit, +/− zoom, and R resets. Reset view restores the calibrated reference camera; reduced-motion preferences skip framing animations. A node can be linked directly, e.g. `explore.html?scene=city&node=school-sign`.

Playback runs the recorded timestamps in stable file order, compressed to about 60 seconds at 1×. Play/pause, restart, step, scrub, and 0.5–4× speed are available. Children appear when called, sessions light up their nodes, supplied render thumbnails appear on delivery, and returning parents are outlined during “whole again.” The clock and tokens track the trace. Playback scrolls within its own tree; Inspect opens the full node detail.

The Medieval village trace contains 199 events over 1:17:23 and 3,548,594 tokens. City contains 243 events over 1:47:11. Its 68 session-end records have empty `usage_total` fields; the parser converts only those missing values to `null`, retaining every event and timestamp. City token totals are displayed as unavailable, never invented.

## Files and source preservation

| Files | Purpose |
| --- | --- |
| `app.js`, `scenes.js` | Shared page integration, registry/navigation, lazy node data, image matching and crop coordinates. |
| `method.js`, `data/solver-instruction.md` | Safe formatting of the exact supplied instruction. |
| `tree.js`, `world-ui.js` | Shared tree, keyboard/hover selection, ownership modes and same-origin viewer messages. |
| `run.js`, `playback.js`, `playback.css` | Trace parsing, state reduction, connected playback tree and controls. |
| `viewer.html`, `viewer.js` | Static viewer entry, scene loading, camera controls, smooth framing and reset. |
| `city-adapter.js` | Geometry-preserving static rendering of City's `candidate.json` with its recorded camera. |
| `recursion-display.js` | Validated program groups, selection-relative ownership visibility, bounds and reversible material dimming. |
| `runs/` | Copied source runs, chosen render aliases, and optional display derivatives. |
| `fractal/`, `vendor/` | Retained first-version village files and supplied local Three.js/OrbitControls. |
| `images/paper/`, `data/results-table.md` | Original paper evidence and optimized display copies. |
| `tools/check-layout5-browser.mjs`, `tools/check-layout4*.mjs`, `tools/check-city-viewer.mjs`, `tools/check-trace.mjs` | Current browser/source behavior checks. |

City's delivered `scene.js` fetches server endpoints and batches all primitives by color. It remains byte-for-byte unchanged. The separate adapter loads static `candidate.json` and `camera-contract.json`, preserving all 11,063 primitives and 48,797 colored triangles. It assigns primitives to the 25-node hierarchy using their component IDs and parent instance names; all leaves, including those without renders, have real geometry. The adapted reference render is pixel-identical to the delivered renderer. Medieval village retains its original 24-node component build and four group aliases.

All delivered JS/MJS modules, paper originals, and source run files remain unchanged. The complete instruction is identical to `assets/solver-instruction.md`. No imagery or missing token values were fabricated. Reference acknowledgement remains WorldClaw, Fig. 9, used as reconstruction input. Historical environment paths in the downloaded briefs/accounts are source text, not site hosting instructions.

## Verification

The ownership-mode checks in `../checks/layout5-report.json` cover both live pages, both scenes, and desktop/phone widths. `layout5-*.png` captures All / Current node only / Children only for the root and a deeper branching node in every combination, plus leaf fallback and empty assemblies. Tests compare visible meshes to actual group ancestry for every delivered node, check framing, hover, mode persistence, exact camera reset, decoded images, overflow, and request/console errors. Focused geometry tests are in `recursion-display.test.mjs`; `city-adapter.test.mjs` independently checks ownership against the delivered instance metadata and audited component counts. `layout5-viewer-report.json` verifies exact City geometry/reference rendering and camera resets after the ownership correction. `layout5-integration-report.json` confirms navigation, keyboard selection, the complete instruction and a third registry entry; `layout5-source-report.json` confirms source and author-metadata preservation.

The previous headless Chromium checks cover all four pages for both scenes at **1440 × 1000** and **390 × 844**. Reports and inspected screenshots are in `../checks/layout4-*`:

- `layout4-report.json`: 16 scene/page/viewport combinations; node selection and details, live viewers, complete playback runs, metadata, images, page width, and screenshots.
- `layout4-results-report.json`: full-page and footer captures of Results; CPU rendering avoids the headless GPU capture limit on long pages.
- `layout4-playback-report.json`: final playback card bounds, hidden future connectors, completion and whole-again screenshots on both scenes and widths.
- `layout4-integration-report.json`: actual scene switching across pages, sibling/parent/child keyboard selection, hover stability, complete visible instruction text, missing-render display, and a third registry entry using raw images with no application changes.
- `layout4-fallback-report.json`: both live pages, scenes and widths with WebGL disabled; all 49 node details, images and original-file links checked.
- `layout4-source-report.json`: publication/instruction preservation and unchanged source assets.
- `layout4-viewer-report.json`: every node's bounds/highlighting/reset at desktop and phone sizes, plus exact City geometry and reference-image agreement.

Normal page runs have no JavaScript/console errors, failed requests, or external runtime requests. Earlier `layout2-*` and `layout3-*` reports describe superseded layouts; `layout5-*` supersedes the visibility behavior in `layout4-*`.

```bash
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node --test site/recursion-display.test.mjs site/city-adapter.test.mjs
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-layout5-browser.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-layout4-browser.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-layout4-integration.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-layout4-fallback.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-city-viewer.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-trace.mjs
```

Commands run from the project directory. Node/Playwright paths are specific to this workspace; hosting only requires a static HTTP server.
