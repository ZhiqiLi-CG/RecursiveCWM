# Medieval village map

The final scene composes the completed `terrain` and `settlements` children in `component.js`. The browser entrypoint `index.html` adds the locked camera, lighting, drawn background, map pins and labels. All geometry is generated locally; no reference image is used as a rendered texture.

Run from the workspace root:

```bash
.render-tools/node/bin/node runs/final-medieval-village/fractal/scene/render.cjs runs/final-medieval-village/fractal/scene/final.png
```

The renderer starts its own temporary HTTP server and uses the installed Playwright Chromium. For a browser preview, serve the workspace root and open `/runs/final-medieval-village/fractal/scene/index.html`. The reference view is 1400×963.

Query parameters:
- `?compass=0` through `?compass=3`: alternative directions.
- `?no-ui`: hide graphic pins, arrows and legend.
- `?blockout`: original blockout for comparison.
- `?sun-height=22&ambient=1.8&sun=3`: explicit lighting defaults for experiments.
- `?terrain=../terrain/terrain.js&settlements=../settlements/component.js`: component overrides for diagnostic work.

`component.js` exports synchronous `build(ctx)`, returning a THREE.Group with no cameras, lights or UI. `ctx` is made with `common.js` and the immutable `../../camera-contract.json`. Always build with the locked camera before rotating, since some parts convert measured pixel anchors into world positions. The root group exposes the low-ground `heightAt` and `surfaceAt` samplers through `userData`.

`audit.cjs` captures four compass views, a lower side view, and the restored reference view. It also checks finite coordinates, tree roots, mountain edge topology, and exact camera restoration. `compare_final.py` writes matched whole/part comparisons. See `account.md` for visual decisions and limitations.
