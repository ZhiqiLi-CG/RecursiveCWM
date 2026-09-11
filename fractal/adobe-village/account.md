# Adobe village — depth 2 account

## Calibrated mental image
This is a compact riverside adobe hamlet in the style of a faceted medieval strategy-map miniature: squat warm plaster houses, a cooler gray square tower, flat parapeted roofs, tiny dark openings, cloth shades and goods beside the lane. A complete instance has substantial four-sided walls, complete roof slabs beneath the parapets, recessed door and window reveals, grounded goods and supported shade structures. The reference calibrates the houses toward varied footprints and orientation, sparse weathered masonry, a notably deep tower roof enclosure, a mauve western awning and a rusty shaded goods frontage on the upper eastern house.

## Inputs and ownership
Read target.png, view.json, brief.md, the inherited manifest, immutable camera contract and parent rendering interfaces. Applied the worldgen-techniques skill. All scene edits and evidence are inside this adobe-village directory; no git operations and no camera, manifest, parent or sibling edits. component.js exports synchronous build(ctx), returning the district alone. preview.js includes the parent's network only for comparison.

## Round 1 — whole, magnified parts and inherited rotation
Rendered the inherited parent settlement preview to evidence/inherited.png. Cropped the root frame at [372,571,708,811] and enlarged exactly to 1008 × 720, matching target.png; inspected evidence/round1-paired.png. The inherited six identical boxes were conspicuously wrong in footprint, height hierarchy, orientation, parapets, openings and all human-scale furnishings. The inherited compass-0 view showed solid boxes but no architectural articulation; the larger terrain remained an intentionally unfinished blockout.

Magnified the tower, western house, eastern houses and foreground house independently in evidence/detail-*.png. At this level these resolve into simple individual low houses with a small number of openings, coping runs and attached props. Their arrangement is the district-level work here; no individual building has an internal assembly requiring a separate target-and-loop solver. Wrote specification.json before construction. No children were needed.

## Round 2 — authored district and matched comparison
Built six individually traced roof footprints through ctx.pixelToWorld using ROOT coordinates at physical roof elevation, so all buildings retain the inherited camera and lie in common world space. Added full foundation volumes, four thick segmented wall assemblies per house, inset dark doors/windows with lintels and sills, complete flat roof slabs, finite coping thickness, vents and corner masonry. Added the western mauve awning with beams, posts and table; the cart/shade frame with wheels and goods; barrels, pots, sacks, one traveler and eleven lamps.

Inspected evidence/round2-paired.png and the tower close-up. The roof arrangement was much closer, but walls and lamps were too tall, the masonry was too contrasty, and the tower recess read as a raised lid. This was a real construction issue: the first pit slab's bottom exceeded its top. Corrected the slab, lowered the cavity floor, added four inward-facing enclosure walls and a broad coping band. Reduced house heights independently and restrained the corner relief.

## Round 3 — dimensions and volume checks
Inspected evidence/round3-paired.png and four full-frame compass views. Lower walls now read as squat adobe houses; the tower remained clearly taller and its roof enclosure read as a cavity. No empty backs or wall cards were exposed. Remaining local differences were the western awning's position, oversized foreground roof depth, the upper eastern roof's front corner, and the missing small rusty frontage shade. Lamps needed different placement near the western approach.

## Round 4 and final — attachments, local silhouettes, whole again
Moved the western awning along its attaching wall and raised it while retaining two full outer posts, beams and a table. Added the shallow upper eastern goods awning with three posts and a crate. Refined the foreground and upper eastern roof quadrilaterals and corrected the offset between sampled roof planes and coping elevations. Adjusted western lamp heights and positions, and provided the lower eastern facade with two small dark ground-level entrances. The hidden area beneath the graphic pin contains complete houses and an open lane court; the module does not add a pin.

Final evidence/final.png uses the immutable original 1400 × 963 camera. evidence/final-crop.png and evidence/final-paired.png repeat the exact original crop and 3× magnification. Inspected the final pair after the completion changes. The six distinct roof silhouettes, tower enclosure, general facade heights, western mauve shade and district spacing now follow the reference. The facades remain cleaner and more angular than the reference's softly worn adobe; the comparison also retains major expected background differences from unfinished terrain, water, vegetation and parent roads. No whole-frame pixel similarity claim is made.

## Four-compass completion inspection
Re-rendered the final component in all four compass directions with audit.cjs, saving evidence/final-compass-0.png through final-compass-3.png. Cropped the district's projected 3D bounds into evidence/final-compass-contact.png and inspected that magnified contact sheet.

- Compass 0: all six roof planes and thicknesses read clearly; tower cavity is enclosed and has a floor; house foundations sit on the preview ground.
- Compass 1: opposite house walls have sensible openings and masonry, the cart has four posts and two wheels, and no front-only building shells appear.
- Compass 2: rear walls and the opposite side of the western awning remain complete; the awning is attached, supported and has finite canopy thickness.
- Compass 3: side walls meet roof edges continuously; vents, packs, barrels, lamps and traveler remain volumes rather than view-facing cards.

The supplied parent roads remain continuous through the district and across the solid causeway. Terrain blockout boundaries and the broader network's unfinished endpoints are outside this component. Rechecked the original matched view after all four directions. Browser audit: 838 meshes, 23,466 vertices, no non-finite coordinates and no browser page errors, recorded in evidence/audit.json. Counts are descriptive only; the visual judgments above govern the result.

## Integration notes for settlements parent
Import build from ./adobe-village/component.js via the appropriate relative path, not preview.js, to avoid duplicating network geometry. Six named house groups plus goods-shade-cart are available for inspection. Foundation bottoms extend to Y=-0.025; ordinary props start at Y=0.035. Preserve ROOT-space placement; the existing camera remains untouched.

The southern crossing still appears as a straight raised rectangular deck in the preview, whereas the reference's approach broadens and blends softly into both banks. The parent should settle/taper its approach when the terrain child's banks are available, while keeping actual support thickness. The south route through [548,649], [580,670], [599,699], [627,754] must remain an open lane beside these houses. Terrain should bring sand under the tower and eastern house foundations, replacing the currently visible triangular green blockout boundary near the tower. Do not move buildings merely to follow that temporary boundary. Natural props and the graphic pin remain with their existing owners.

Completed this component without recursive children. part.json is the final handoff.
