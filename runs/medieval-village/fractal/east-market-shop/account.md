# East market shop — depth 4 account

This is a small medieval timber market shop in a soft, painterly low-poly village diorama: a steep blue-grey slate roof and ochre front gable join a broad, lower warm roof over an open porch. A complete instance has enclosed rear storage, full roof slopes and gables, thick fascia and wall panels, a grounded foundation, supported open bays, and goods on counters or the floor. The reference calibrates that mental model toward an irregular joined roof and low arcade, rather than a tall house or separate stalls; the cropped left boundary continues as the same timber porch.

## Scope and specification

Read brief.md, view.json, manifest.json, and the locked camera contract. specification.json records the assemblies, materials, relations, and exclusions before construction. All writes stayed inside this node. No children were launched and no children.json was created, because this is the maximum depth. component.js exports synchronous build(ctx); it returns an already positioned THREE.Group named east-market-shop. The inherited preview is used unchanged.

## Round 0 — whole

Rendered the inherited court with an empty shop group. evidence/baseline-paired.png compares the 49 by 43 root-pixel crop to the 588 by 516 target at matched 12x magnification. The entire shop was absent, so the conspicuous residual was a joined architectural assembly. The target's slate silhouette, warm left roof, orange gable, dark porch bays and pale front fascia governed construction. Background ground and neighboring fragments belong to ancestors.

## Round 1 — complete volume

Built the main store and recessed front arcade, two roof slopes, thick slate tiles, warm porch roof, posts, braces, counter, goods, barrels, rear doors and foundation. The silhouette followed roof landmarks evaluated at their actual world heights; the roof landmarks were never treated as ground feet. Foundations remain at the inherited ground level of .06, with the small slab seated across it. The first paired image showed excessive support height and a dark slate face. The initial four compass views showed a recognizable complete shop, but inspection of the construction exposed insufficient wall thickness and an unfinished rear extension.

## Round 2 — silhouette and thickness

Lowered the world elevations while preserving the reference roof projections, reducing the distance from eaves to the ground. Gave vertical wall and gable panels actual normal-direction thickness, warmed the front gable, and lightened slate materials. evidence/round2-paired.png exposed a rendering defect: the broad roof underlay intersected the bilinear tile surface, leaving a dark central patch. This was a geometry residual, not a color mismatch.

## Round 3 — roof repair

Replaced the crossing underlay with adjoining solid tile cells over the entire roof. evidence/round3-paired.png verifies that the dark patch disappeared. Narrowed the slate palette and reduced course density to soften the overly busy roof. Completed walls beneath the rear warm-roof continuation and grounded the rear posts. The extension now has a finished storage envelope in reverse views.

## Final whole and four-side checks

Added the small connecting warm canopy face so the porch's visible front edge rises continuously into the main roof junction, matching the reference's broad left silhouette. Brought the pale front gable fascia forward of the thick wall panel, where it is visibly attached, and lightened the counter goods. Re-rendered the locked reference view and all four compass directions after these changes.

Evidence/final-paired.png (lowercase directory `evidence`) is the final matched comparison. Both sides use the same 49 by 43 source extent at 12x; final render enlargement uses bicubic interpolation, consistent with the inherited parent comparison. Earlier pairs retain nearest-neighbor enlargement to expose individual root pixels. The full-frame image is evidence/final-root.png. evidence/compass-montage.png shows all four object regions; the corresponding compass-N-root.png and compass-N-bounds.json preserve complete frames and projected bounds.

By eye, the peak, right eave, large slate face, warm left projection and low shop footprint now occupy the intended region. The reverse views show enclosed back walls, a rear door, complete gables and roof surfaces, supported porch corners, and floor-supported goods. I see no empty building back, floating roof, or paper wall. No roads are owned by this component.

The remaining visible differences are the regular procedural slate pattern, simplified timber/plaster weathering, and some sharper join edges compared with the soft reference. The inherited flat green ground and its lighting/shadow response also differ from the reference; they are not modified here. Browser renders completed without reported page errors. Visual judgments, rather than image metrics, determined revisions.

## Integration

Load component.js and call build(ctx), then add its result without another transform. Parent-owned court objects, roads, lamps, terrain, and map pin are excluded. The shop continues slightly beyond the left crop boundary as a complete porch. The immutable manifest and camera contract remain untouched. part.json is the final delivery marker and has no child references because this terminal node was solved locally.
