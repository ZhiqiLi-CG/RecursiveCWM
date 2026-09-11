# East blue mill — depth 4

This is a small medieval farm mill rendered as a faceted, softly shaded village miniature: ivory plaster, irregular dark timber framing, a steep blue roof, and four narrow warm wooden rotor arms. A complete instance has four enclosing walls, both gable ends, two substantial roof slopes, a working axle on a supported bearing, and an attached grey-roofed lower projection. The reference calibrates that general model to a nearly face-on front gable with a square loft window, flared roof edges, long horizontal rotor arms, and partial occlusion by neighboring buildings.

## Scope and specification

Only the mill and its attached projection were changed. `component.js` exports synchronous `build(ctx)` and returns a named THREE.Group; it imports the shared primitives. Footprint calibration uses root pixels (791,383) and (825.5,385), with foundations at Y=.06. `specification.json` records the assets, materials, and attachment relations. Camera, target, viewport, manifest and parent snapshot were read without modification. No children were created at maximum depth; no git commands were used.

## Round 0 — inherited whole and rotated views

`evidence/round0-paired.png` compares the target and inherited two-mesh placeholder at the prescribed 530×680 size. Its low grey hipped roof, unframed plaster block and missing rotor were the conspicuous residuals. Four isolated compass views confirmed it was solid but structurally the wrong building. The replacement needed a complete gabled mill assembly; this was resolved locally because this node is already the maximum-depth mill subproblem.

## Round 1 — complete assembly

Built closed plaster walls and gables, two extruded flaring blue roof slopes, timber framing on all faces, a square front loft opening, rear access door and threshold, grey-roofed projection, and a four-arm timber rotor with solid hub, axle, bearing mast and ridge brace. Compared `round1-paired.png` and inspected `round1-compass-board.png`. The roof and front silhouette became recognizable; the rotor was too low, the window too large, the roof relief too regular and the plaster too dark.

## Round 2 — visible calibration

Raised the rotor, increased front ridge height slightly, broadened the front footprint, reduced the square opening, warmed rotor timber, lightened plaster and softened shingle relief. `round2-paired.png` uses bilinear enlargement of the exact root crop, making the display sampling closer to the supplied enlarged target. The rotor cross and blue slopes now occupy approximately the reference bands. The front bearing diagonals were visibly intrusive and the loft opening still sat low.

## Round 3 — front structure and roof finish

Raised the loft opening and its framing, replaced the intrusive front bearing diagonals with the existing supported rearward ridge brace, and reduced shingle relief shadows. Inspected `round3-paired.png` and all four rotated views. The bearing mast meets the front ridge and the brace meets the roof farther behind; rotor arms are solid beams connected through a solid hub and axle. The closed rear and side faces, full roof depth and repeated timber bays read as a complete building.

## Final completion check

Closed the small wedge beneath the lean-to roof with an extruded sloping plaster body. Re-rendered the locked full camera and cropped exactly (785,326,838,394), enlarged to 530×680. Inspected `evidence/final-paired.png`, `evidence/detail-gable-projection.png` and `evidence/final-compass-board.png`; the compass board contains isolated north/east/south/west elevated views made by moving only an audit camera after the locked render. Individual full-resolution compass images are also saved. These views show full backs, thick roof slopes and members, attached projection, supported rotor and grounded foundation. No billboard or open-back geometry is used.

## Residuals and integration limits

The mill now carries the required identity and complete structure, but the comparison is not an exact pixel match: the reference has softer, less regular timber and blue-roof shading, while the model remains cleaner; the grey projection and window proportions also retain small differences. The roof behind the rotor is more exposed in the preview, where inherited neighboring house geometry and vegetation occlusion differ substantially from the reference. Greenery, terrain, neighboring house and foreground barn are outside this node's ownership and were not altered to conceal those differences. Parent integration should retain the locked placement and judge these shared occlusion boundaries again when the neighboring components are in place.

## Delivery

`part.json` references `component.js`, with an empty child list. `inspect.cjs` and `compare.py` reproduce the render and comparison evidence. The browser rendered the final 388-mesh component without reported page errors. Geometry bounds were approximately [2.0186, .0595, .8953] to [3.6005, 1.8802, 2.5620]; the tiny .0005 timber overlap at the foundation is intentional ground seating. Visual inspection, rather than a numeric similarity threshold, governed acceptance.
