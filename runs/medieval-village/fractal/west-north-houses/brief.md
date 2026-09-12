Three buildings forming the north/west boundary: the tall, dark moss-thatched timber house at the left; the northern pale straw gable cottage; and the small blue-gray/slate building partly occluded by the green map pin. Match their different orientations, heights, footprints and distances. Own these three buildings only; the little cream tent behind the left house belongs to west-market. Preserve the open lane between buildings. Complete the pin-occluded building with solid walls and a full slate roof; do not construct the pin.

Approximate ROOT ground-foot anchors: [[220, 471], [300, 429], [352, 420]]. These locate foundation feet, not roofs; verify against your own target. Roof heights must rise from these ground positions.

Style: detailed faceted medieval strategy-map miniature. Dark structural timber, warm pale plaster, stone foundations, rusty tile or straw/slate roofs calibrated to the target. Buildings need full gables and ridges, roof overhang/thickness, four exterior walls, doors and windows, volumetric chimneys and plausible hidden sides. Complete beneath occlusions without moving visible silhouettes.

Integration contract:
- Your write scope is only your own fractal directory (and child material directories if descending). No git. Do not modify camera, inherited manifest, parents or siblings.
- Deliver component.js exporting synchronous build(ctx) => THREE.Group. Import THREE, mat, box etc. from ../scene/common.js. ctx exposes THREE, camera, contract, pixelToWorld(rootX,rootY,height=0), worldToPixel(Vector3). Ground foundations start near Y=0.06 with depth below this for terrain contact.
- Parent settlements owns through-roads/bridges; terrain owns ground/water/trees/cacti; root owns pins/graphics. Do not duplicate them. You may add tiny attached doorstep paths only. Report route changes in account.md.
- All three other west children appear in the target for context only: do not construct their owned objects. Group ownership is explicit above.
- preview.js adds the parent road network and your module. Create evidence/ and render using:
  ./.render-tools/node/bin/node runs/final-medieval-village/fractal/scene/render.cjs runs/final-medieval-village/fractal/west-north-houses/evidence/current.png '?settlements=../west-north-houses/preview.js&no-ui'
- Renderer uses locked root camera and terrain blockout. Missing sibling buildings and greenery in your preview are expected. Match crop_root_px / target_size exactly before comparing side by side. Inspect by eye at magnification.
- Render all four compass views with &compass=0 through &compass=3 before finishing; roofs, backs, props and attachments must have full volume. Return to locked reference view after completion.
- If a real internal subproblem needs descent, prepare child materials, write children.json and END for runner dispatch. Do not spawn agents.
- Only when complete, write part.json identifying module component.js, export build, children, ground_y and integration notes; write account.md with calibrated mental image and round-by-round visual evidence.
