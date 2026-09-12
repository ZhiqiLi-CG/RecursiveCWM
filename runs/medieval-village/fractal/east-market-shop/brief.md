Solve only the low southwest market shop and its attached open porch. This child exists because magnification reveals a joined, irregular roof assembly: a steep large grey-blue tiled slope on the right, warm ochre/orange gable faces and shallow warm roof planes extending left, with open dark bays on supported timber posts below. The roof junctions, porch attachment, and complete building envelope need their own loop. Do not reduce it to a single pyramid or a row of unrelated stalls.

Reference and ownership
- root target bounds [864,417,913,460], target magnification 12x. Use view.json; the target was cut from east-market's target without reframing.
- Approximate roof peak is (896,422), principal right eave (894,450), far right roof edge (907,438), and footprint centre around (886,448). Verify every anchor by eye. These are approximate ROOT image pixels; roof landmarks are NOT ground feet.
- Own the complete low shop, porch, attached timber goods underneath, foundation/steps immediately touching it. A full instance has enclosed rear/storage walls, supported porch bays, roof thickness, joined roof slopes with finished eaves, and goods that stand on ground.
- Other stalls, villagers, crates and well are parent east-market. Through-roads and lamps are ancestors. All terrain and natural features are outside scope. Do not create the green map pin.
- The left edge clips a small part of the shop; complete the structure plausibly across this boundary using the same warm timber and plaster style.

Immutable integration contract
- Write only fractal/east-market-shop/ (plus new child directories if a further genuine subproblem is identified). No git. Do not modify camera-contract.json, inherited manifest, ancestors or siblings.
- Export synchronous build(ctx) from component.js returning THREE.Group. ctx includes THREE,camera,contract,pixelToWorld(rootX,rootY,height),worldToPixel. Helpers THREE,mat,box are importable from ../scene/common.js.
- Foundations at world Y=.06. Use ground feet for pixelToWorld placement, never roof peaks.
- The provided preview.js imports the parent snapshot of the court, outside-region district placeholders, roads, lamps, and your component. It expects component.js to exist; begin with an empty group if necessary to render a baseline.
- Render: ./.render-tools/node/bin/node runs/final-medieval-village/fractal/scene/render.cjs runs/final-medieval-village/fractal/east-market-shop/evidence/current-root.png '?settlements=../east-market-shop/preview.js&no-ui'
- Crop root screenshot to view.json crop_root_px and resize to target_size. Inspect matched side by side. Take rotated views early with &compass=0 and &compass=1; all four compass views before completion. Rotated assets move across the root frame, so inspect their actual projected region.
- Deliver part.json with module component.js, export build, children array, ground_y .06 and notes, plus account.md describing calibrated complete form, successive visual judgments, rotated checks and integration concerns. Do not write part.json until finished.
