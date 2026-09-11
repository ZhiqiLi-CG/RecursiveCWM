Four eastern buildings: the red-tiled two-story house facing the market square at lower left; the pale weathered thatched house near the little pond at lower right; the long straw-roof barn along the lane at middle right; and the dark red tiled long two-story house at upper right. Match the four different orientations, gable/ridge profiles, stone/plaster/timber wall patterns and the open spaces between them. Own the buildings and attached steps only; nearby awnings/goods belong to west-market. Do not build water or roads.

Approximate ROOT ground-foot anchors: [[425, 501], [481, 495], [506, 460], [505, 418]]. These locate foundation feet, not roofs; verify against your own target. Roof heights must rise from these ground positions.

Style: detailed faceted medieval strategy-map miniature. Dark structural timber, warm pale plaster, stone foundations, rusty tile or straw/slate roofs calibrated to the target. Buildings need full gables and ridges, roof overhang/thickness, four exterior walls, doors and windows, volumetric chimneys and plausible hidden sides. Complete beneath occlusions without moving visible silhouettes.

Integration contract:
- Your write scope is only your own fractal directory (and child material directories if descending). No git. Do not modify camera, inherited manifest, parents or siblings.
- Deliver component.js exporting synchronous build(ctx) => THREE.Group. Import THREE, mat, box etc. from ../scene/common.js. ctx exposes THREE, camera, contract, pixelToWorld(rootX,rootY,height=0), worldToPixel(Vector3). Ground foundations start near Y=0.06 with depth below this for terrain contact.
- Parent settlements owns through-roads/bridges; terrain owns ground/water/trees/cacti; root owns pins/graphics. Do not duplicate them. You may add tiny attached doorstep paths only. Report route changes in account.md.
- All three other west children appear in the target for context only: do not construct their owned objects. Group ownership is explicit above.
- preview.js adds the parent road network and your module. Create evidence/ and render using:
  ./.render-tools/node/bin/node runs/final-medieval-village/fractal/scene/render.cjs runs/final-medieval-village/fractal/west-east-houses/evidence/current.png '?settlements=../west-east-houses/preview.js&no-ui'
- Renderer uses locked root camera and terrain blockout. Missing sibling buildings and greenery in your preview are expected. Match crop_root_px / target_size exactly before comparing side by side. Inspect by eye at magnification.
- Render all four compass views with &compass=0 through &compass=3 before finishing; roofs, backs, props and attachments must have full volume. Return to locked reference view after completion.
- If a real internal subproblem needs descent, prepare child materials, write children.json and END for runner dispatch. Do not spawn agents.
- Only when complete, write part.json identifying module component.js, export build, children, ground_y and integration notes; write account.md with calibrated mental image and round-by-round visual evidence.
