# Recursive Code World Models

A static project page for the supplied medieval-village reconstruction. Open `index.html` through an HTTP server. There is no build step, package installation, external CDN, or server-side application.

## Serve locally

```bash
python3 -m http.server 8000 --directory /data/zhiqi/rcwm-project-page/site
```

Visit **http://localhost:8000/**. JavaScript modules and data loading require HTTP; opening the HTML directly with `file://` is not supported. To host on GitHub Pages, publish the contents of `site/`, preserving all subdirectories. URLs are relative and were tested under both `/` and `/site/`.

## Files

| File or directory | Purpose |
| --- | --- |
| `index.html` | Entry page: image comparison, recursion explorer, playback, live viewer, and footer. |
| `styles.css` | Responsive layout, typography, depth colors, tree states, and accessible focus styling. |
| `app.js` | Loads the supplied run, fills node details, handles comparison and related-node navigation, and coordinates the viewer/fallback. |
| `tree.js` | Connected thumbnail tree, selection, horizontal scrolling, and keyboard navigation. |
| `run.js` | Trace ordering, cumulative token accounting, playback state, time formatting, and crop coordinate transforms. |
| `playback.js` | Play/pause, one-event stepping, scrubbing, restart, speed, timeline ticks, and construction tree. |
| `viewer.js` | Builds the delivered root component with the original camera/context and lighting; adds OrbitControls, responsive framing, demand rendering, and camera reset. |
| `fractal/` | Copied original node directories: targets, original `FINAL.png` renders, `part.json`, program modules, views, briefs, accounts, and other supplied records. Relative cross-node module imports remain intact. |
| `fractal/scene/index.html` | Adapted viewer entry. Maps `three` to `./three.module.js` and initializes `viewer.js`. |
| `fractal/scene/three.module.js` | Provided local Three.js r160 dependency, with its original license header. |
| `vendor/OrbitControls.js` | Provided local OrbitControls module. |
| `camera-contract.json` | Unchanged recorded reference camera and calibration. |
| `data/tree.json`, `data/events.jsonl` | Unchanged source topology and chronological runner trace. |
| `data/nodes.json` | Prepared node index: parent/children, crop frames, image dimensions, brief, account excerpt, module name, and first 25 source lines (or the entire module if shorter). |
| `data/solver-instruction.md` | Exact supplied recursive-solver instruction, displayed in the footer disclosure. |
| `images/` | WebP derivatives of the supplied clean reference, clean final render, and five saved novel views. |
| `matched/` | Full-size delivered comparisons aligned to each node's target dimensions using the recorded crop when necessary. |
| `thumbs/` | Thumbnail derivatives of the delivered comparisons, at most 320 × 240 pixels. |
| `tools/prepare_assets.py` | Optional asset-packaging script using Pillow. Recreates image derivatives and the node index from `../assets/`; preserves the adapted viewer entry. Not needed to serve the page. |
| `run.test.mjs` | Node tests of real trace totals, delivery/recovery transitions, and nested crop mapping. Requires the adjacent original `assets/` directory. |
| `tools/check-browser.mjs` | Desktop/mobile Chromium checks and screenshots, using the task's supplied Playwright installation. |
| `tools/check-edge-cases.mjs` | All-node checks, nested-path hosting, keyboard behavior, a complete real-time 1× replay, and an actual WebGL-disabled fallback test. |
| `IMPLEMENTATION.md` | Completed implementation checklist. |
| `README.md` | Serving, file, provenance, interaction, and verification notes. |

Documents inside `fractal/` are historical run records. Their original environment paths and rendering instructions describe that run; use the serving command above for this project page.

## Source data and presentation

All displayed imagery derives from the provided `../assets/`; no reconstruction images were fabricated. The hero uses `reference-medieval-village-clean-white.png` and a downscaled `medieval-village-final-4x-clean.png`. Its split compares the supplied reference and final geometry at the same camera. Novel-view images come from `assets/novel-views/`.

The run is `final-medieval-village`, recorded on September 10, 2026. The authoritative `tree.json` contains **24 nodes, 23 connections, five levels (depth 0–4), and two root children: `terrain` and `settlements`**. This follows the actual data rather than the task's shorthand “root → 4.”

The trace contains **199 events and 45 recorded sessions**, spanning **01:17:23**. Node totals and the playback clock sum every recorded `session_end.usage_total`, including recovery sessions, for **3,548,594 tokens**. No usage records are deduplicated. Events are sorted by timestamp with original file order retained for ties. At 1×, the recorded wall-time interval maps linearly to 60 seconds; the original pause before recovery remains visible. Step advances exactly one event, including events sharing a timestamp. Scrubbing selects all events through the requested wall time.

Calls reveal children, session starts mark solving, successful `visual_stop` records and `child_return` records with `delivered: true` reveal renders, and unsuccessful stops/returns remain incomplete. When a parent resumes after child returns, it is marked “whole again.” Recovery records and repeated calls remain in the playback. Only retained final images are available, so those images illustrate recorded delivery events; this is not a replay of intermediate visual revisions.

Eight supplied node finals are full 1400 × 963 root-frame renders, although their targets are crops. `matched/` crops those originals using `view.json.crop_root_px` and resizes to the target dimensions. Other finals already use the node's frame. Parent-window outlines map each child's root-pixel crop into its parent's displayed crop. Clicking the comparison images opens the untouched original target or `FINAL.png`. The source selection from `tree.json.final_render_source` is retained in the node index.

The live viewer calls the original root `component.js` build function through the copied recursion tree, with the locked camera before geometry construction. Scene programs and source trace files remain byte-for-byte identical to the originals. The viewer uses a white background and omits the original 2D presentation labels; it retains the supplied geometry and lighting. Responsive framing preserves the reference camera pose and calibrated lens shift. If initialization fails or WebGL is unavailable, all five provided novel-view renders appear with an explicit fallback caption.

Reference-image acknowledgement: **WorldClaw paper, Fig. 9, used only as input**. Paper and code destinations are visibly marked “coming soon” because no publication URLs were supplied.

## Interactions

- Drag or use the hero range input to compare reference and reconstruction.
- Click a tree node to inspect its target, delivery, parent crop, brief, account, tokens, and program. In the explorer, **↑** selects the parent, **↓** the first child, **←/→** the previous/next node in traversal order, and **Home/End** the first/last node.
- Use related-node buttons below the detail panel to jump to a parent or child. The tree scrolls horizontally on smaller screens.
- Playback supports **Play/Pause**, **Step**, **Restart**, a scrubber, and **0.25×–4×** speed. Its arrow keys keep focus within the playback tree; activating a node opens its details. Playback pauses when the browser tab is hidden.
- In the live scene, drag to orbit and scroll/pinch to zoom. The toolbar restores the reference camera. With the canvas focused, arrow keys orbit, **+/−** zoom, and **R** resets.

## Verification

Verified with the task's Node executable and Playwright in headless Chromium, served by Python `http.server`. Desktop viewports were 1440 × 1050 and 1280 × 900; the phone viewport was 390 × 844. Screenshots were saved to **`../checks/` and visually inspected**.

Checks covered all 24 node details, target/delivery sizing, crop overlays, program excerpts, image comparison, keyboard and related-node navigation, playback stepping/scrubbing/pause/restart, whole-again highlighting, and the complete replay. The 1× run completed in **60.054 seconds**, ending with all 24 delivered renders and the exact recorded token total.

The live viewer loaded **9,768 meshes and 860,969 triangles**. Mouse orbit, zoom, keyboard camera controls, and restoration of camera position, orientation, and projection passed. Mobile layout had no page-level horizontal overflow. Nested-path hosting passed with no JavaScript errors or failed HTTP requests. A separate Chromium run with WebGL disabled loaded all five fallback images. Asset regeneration was also checked to preserve the adapted viewer.

Results are in `../checks/browser-report.json`, `edge-report.json`, and `fallback-report.json`. Images include desktop/mobile full pages, hero, recursion/detail panels, playback during construction/whole-again/completion, reference/orbit camera views, and fallback views.

To rerun the main checks with a local server running:

```bash
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node --test site/run.test.mjs
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-browser.mjs http://127.0.0.1:8000/
```

Run these from `/data/zhiqi/rcwm-project-page`. For the nested-path checks, start a second server at the project root and pass its `/site/` URL:

```bash
python3 -m http.server 8001 --directory /data/zhiqi/rcwm-project-page
/data/zhiqi/CodeWorld2/.render-tools/node/bin/node site/tools/check-edge-cases.mjs http://127.0.0.1:8001/site/
```

The optional asset-preparation command is:

```bash
/data/zhiqi/CodeWorld2/.venv/bin/python site/tools/prepare_assets.py
```

The supplied runtime paths are specific to this workspace; serving the finished site needs only an ordinary static HTTP server.
