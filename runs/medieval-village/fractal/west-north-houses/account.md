# west-north-houses

This is a trio of detached medieval strategy-map miniatures: a tall moss-thatched timber and stone house, a pale straw cottage with a small slate-covered entry, and a compact slate cottage partially hidden by the green marker. A complete instance has masonry contact with the ground, four timber/plaster walls, closed gables, two thick roof slopes and a ridge, framed openings, and a usable entrance. The reference calibrates these as compact, slightly irregular buildings with dark structure and muted materials; hidden elevations follow that same construction rather than reproducing the graphic occlusion.

## Scope and specification

`specification.json` records the initial three-object plan. `component.js` exports synchronous `build(ctx)` and uses the inherited projection utilities; the camera contract and manifest were read without modification. All writes were confined to this node. No shared road, market tent, vegetation, pin or neighboring building is included. No road changes are requested. Only integral stone entrance steps extend beyond the walls.

Magnified inspection of the three houses revealed ordinary gables, framing, openings and one small attached entry. These could be settled within this level's loop; no further subassembly required its own solve. Children are empty.

## Visual rounds

1. Inspected target at 672 × 404, then rendered the three full structures. `evidence/round1-paired.png` pairs the target with the root render cropped to [200,381,368,482] and enlarged exactly 4×. The initial buildings were conspicuously oversized, and the moss roof was too high. This was the first renderable state: the supplied preview referred to a component that did not yet exist.
2. `round2-paired.png`: reduced footprints and cottage heights; lowered the moss ridge; strengthened foundation courses. Open spacing improved. Roof pattern was still too regular and the pale cottage showed too much side wall.
3. Magnified each relevant house separately (`cottage-reference.png`, `moss-reference.png`). Added the small solid slate-covered entry visible beside the straw cottage's front gable. Rotated the cottage to expose its broader gable, darkened its wall infill, and adjusted the timber house's storey proportions. `round3-paired.png` showed distracting roof-strip aliasing and overly dark window openings.
4. `round4-paired.png`: lighter casement surrounds, a ground-floor opening and side entrance on the timber house, smaller slate cottage, and revised moss roof proportions. Removed the coarse roof strip pattern. Tested a modest orientation adjustment on the tall house and settled between the earlier narrow gable and over-rotated silhouette.
5. Final: replaced thatch strips with a subtle deterministic procedural straw texture; raised the thick roof surfaces to reduce intersections with gable framing. `final-paired.png` is the final matched 4× comparison. The three roof colors, detached arrangement, varied heights, northern cottage orientation, and small entry now read distinctly. Reference softness and irregularity remain greater than the procedural models, and the tall house's facade proportions are an approximation rather than an exact pixel reproduction. Missing contextual houses, trees, tent, pin and terrain detail are deliberately outside ownership.

## Completion inspection

Rendered and inspected compass 0, 1, 2 and 3 after construction, then repeated all four after the roof-surface correction. `evidence/compass-contact.png` collects enlarged crops of the structures from those views; full-frame compass screenshots are retained. Both end gables and both side walls exist on every house, roof edges have thickness, the cottages' rear doors and steps are present, the entry enclosure meets the straw cottage, and the slate chimney has a solid shaft, cap and inset dark opening. No empty backs, billboard surfaces or detached structures were seen. Foundations extend below nominal ground contact, and steps meet the ground.

Returned to the immutable reference camera after the final rotations and re-inspected `final-paired.png`. Parent road previews remain visible for context, with no alteration to their network. `inspect.cjs` reproduces the four rotations and reference view and records image bounds. JavaScript syntax check passed; browser rendering completed with no page errors (`evidence/render-errors.json` is empty).

## Integration

The component returns one named THREE.Group with three named building groups. Root-pixel placement anchors are [226,469], [303,422], and [351,416], projected at ground_y 0.06. The last building is intentionally complete beneath the parent's pin. The procedural thatch texture is generated synchronously using a browser canvas; no network assets or asynchronous loading are needed. No sibling or parent imports beyond the specified scene helpers are used by the component.
