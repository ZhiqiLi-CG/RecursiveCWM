# Recursive Code World Models

A static research project site built from the supplied paper assets and medieval-village run. No build step, package installation, framework, or external runtime CDN is required.

## Serve

```bash
python3 -m http.server 8000 --directory /data/zhiqi/rcwm-project-page/site
```

Open `http://localhost:8000/`. JavaScript modules require HTTP rather than `file://`. Publish the contents of `site/` unchanged for GitHub Pages; all local URLs are relative. Chromium verification also uses a nested `/site/` deployment path.

Set `ARXIV_URL` in `config.js` to update the arXiv button and shared Paper navigation. Until a URL is supplied, Paper points to the overview’s resource header. Author links remain `#`; Code is visibly marked `Code (TODO)` and disabled.

## Page architecture

- `index.html`: publication header, teaser, short abstract with the remaining supplied text in a disclosure, live recursive world, clickable branch preview and target/render pair, comparison slider and one city figure, BibTeX, and footer.
- `explore.html`: the complete recursion tree beside a live selection view, followed by target/render images, brief, program excerpt, and parent/child links. On portrait phones the live view stays visible while selecting tree nodes. On short screens and during fallback it scrolls normally.
- `results.html`: all paper comparison sheets, the novel-view grid, the complete HTML metrics table, and the method figure. An additional disclosure contains the supplied recursion-tree panel.

All pages share Overview / Explore a run / Results / Paper navigation. The reference study and architecture decision are in `../LAYOUT-NOTES.md`. Playback, the timeline, and token/event counters were removed.

## Live recursion

Both live views use the original delivered scene. Drag to orbit, scroll or pinch to zoom, and use Reset view to restore the reference camera. With the canvas focused, arrow keys orbit, +/− zoom, and R resets.

Depth buttons reveal the final program cumulatively: root, levels 1–3, and all five levels. Every mesh belongs to its nearest mapped program group. All 24 nodes map uniquely; the four aliases in `recursion-display.js` are:

| Node | Delivered group name |
| --- | --- |
| `scene` | `medieval-village-map` |
| `terrain-mountain` | `snow-massif` |
| `vegetation-west` | `western-conifer-grove` |
| `vegetation-foreground` | `foreground-pine-grove` |

The root is an assembly with no meshes of its own. Root-only therefore shows its actual bounds; later levels reveal delivered geometry and outline the current program frontier. This is a decomposition of the final program, not a replay of unavailable intermediate reconstructions.

Hovering or focusing a thumbnail/tree node outlines its subtree, keeps its original materials, dims other groups, and displays its node ID. Hover respects the chosen depth. Clicking selects the node and reveals all levels so its full subtree is visible. Clear highlight restores the exact original material objects; choosing a depth also clears the highlight. Overview clicks update both comparison images and the full-explorer link. `explore.html?node=east-farmyard` opens a particular program directly.

Tree keyboard controls: ↑ parent, ↓ first child, ←/→ previous/next node, Home/End first/last node. The tree scrolls horizontally where needed. Clipboard denial selects the BibTeX text for manual copying. If WebGL is unavailable, five supplied saved views replace the live scene.

## Files and data

| File or directory | Purpose |
| --- | --- |
| `index.html`, `explore.html`, `results.html` | Static page content and navigation. |
| `styles.css` | Shared typography, responsive hierarchy, viewer controls, tree and table layout. |
| `config.js` | Single publication URL setting. |
| `app.js` | Preview and explorer selection, matched images, source links, citation copying, and instruction disclosure. |
| `tree.js` | Connected thumbnail tree and keyboard navigation. |
| `world-ui.js` | Shared depth/selection controls and checked same-origin iframe messaging. |
| `viewer.js` | Original root build, lighting, calibrated camera, OrbitControls, responsive rendering and reset. |
| `recursion-display.js` | Validated node/group mapping, cumulative visibility, bounds, and reversible material highlighting. |
| `fractal/` | Supplied node programs, targets, original final renders, briefs, and historical records. All 77 delivered JS/MJS modules remain byte-for-byte unchanged. `scene/index.html` is the adapted viewer entry with its local Three.js import map. |
| `vendor/OrbitControls.js`, `fractal/scene/three.module.js` | Supplied local Three.js dependencies. |
| `camera-contract.json` | Recorded reference camera. |
| `data/tree.json`, `data/nodes.json` | Authoritative topology and prepared node details/source excerpts. |
| `data/solver-instruction.md` | Exact supplied instruction, loaded when its footer disclosure opens. |
| `data/results-table.md` | Original metrics table; HTML preserves every value and bold entry. |
| `data/events.jsonl` | Retained source trace for provenance; not loaded or presented by the site. |
| `images/` | Optimized teaser, reference, final render, and saved novel views from supplied assets. |
| `images/paper/` | Uncropped WebP display derivatives and unchanged full-resolution paper figures. Figure links open the originals. |
| `matched/`, `thumbs/` | Delivered images matched to target crops, plus small tree/preview thumbnails. |
| `tools/prepare_assets.py` | Optional original run/teaser image preparation using Pillow; not required to serve the site. |
| `tools/check-*.mjs` | Chromium architecture, page, recursion, and fallback checks. |
| `IMPLEMENTATION.md` | Implementation checklist and item 2b plan. |

All imagery comes from `../assets/`; no reconstruction images were fabricated. The overview reference/final pair uses the supplied clean medieval-village images. Eight original node final renders use the root frame; their `matched/` copies use the recorded crop and target size, while image links retain the untouched originals. The abstract and citation retain the supplied text. Paper images and metrics come from `../assets/paper/`.

Reference image: **WorldClaw, Fig. 9, used only as reconstruction input**. Files inside `fractal/` describe the historical run; their old environment paths are not serving instructions for this site.

## Verification

Verified in headless Chromium at **1440 × 1000** and **390 × 844**, with an additional **844 × 390** explorer check. Screenshots in `../checks/layout2-*.png` were visually inspected. Current reports:

- `layout2-report.json`: all three pages, preview/deep links, every node, keyboard navigation, matched images, source links, slider, metadata, citation copying, camera orbit/zoom/reset, exact metrics, and overflow checks.
- `layout2-recursion-report.json`: all 24 mappings, all five reveal states on both live pages, every explorer highlight, hover/selection clearing, exact material restoration, and phone selection visibility. Visible mesh counts by depth are 0, 66, 1,340, 7,855, and 9,768.
- `layout2-fallback-report.json`: both live pages and both widths with WebGL disabled.
- `layout2-source-report.json`: unchanged delivered modules and paper originals; ten-line layout notes.

Normal browser runs have no JavaScript/console errors, failed requests, or external runtime requests. Earlier screenshots and reports without the `layout2-` prefix describe superseded layouts.

To rerun from the project directory with the server above running:

```bash
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-layout.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-browser.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-recursion.mjs http://localhost:8000/
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-fallback.mjs http://localhost:8000/
```

The Node/Playwright paths are specific to this workspace. Hosting the finished site needs only a static HTTP server.
