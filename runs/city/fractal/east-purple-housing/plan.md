# east-purple-housing execution plan

Approved scope: three purple-roof cream houses, dormers, chimneys, porch columns, doors/windows, own lots, paths and low shrubs. The camera and manifest remain read-only. No git, no direct agents, writes restricted to this node. The supplied approved work order replaces interactive design/approval gates.

Design: generate actual world-space geometry with the inherited inverse projection. Use separate measured anchors for each house, a cream box shell, a notched front roof surface with vertical fascia, solid dormers, chimney and porch. Reuse the architectural construction with separately specified placement. A simple unnotched roof would lose the porch silhouette; independent subsolvers add no value for these compact repeated parts at present.

Files: generate.py owns scene construction and emits candidate.json and preview.json; compare.py makes equal-scale visual evidence; render.mjs and scene.js are inherited unchanged. Final part.json is written only after visual review. account.md records visual iterations and remaining context limits.

- [x] Read scope, interface, locked camera and inspect baseline comparison and enlarged first house.
- [x] Generate three houses and local ground, preview with read-only district context.
- [x] Render at 736x580; compare target and render without independent resizing; revise dominant owned residuals.
- [x] Validate unique owned IDs, finite geometry, camera digest and absence of borrowed context in candidate.
- [x] Write final part.json with empty children if no independent subproblem remains, and account.md.

Verification: .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-purple-housing/render.mjs --scene preview.json --view view.json --out round1.png. Inspect browser error report and actual side-by-side. Geometry is reversible scene data, so use render and schema checks rather than implementation-mirroring unit tests.
