# Scene execution plan

Goal: Reconstruct the supplied 941×520 city as parameterized Three.js geometry.
Approved architecture: root owns camera, terrain and connected streets; independently solved districts return world-coordinate primitive arrays. The runner performs recursive dispatch.

- [x] Analytically derive orthographic projection from ground edges and verticals; create a provisional camera.
- [x] Build and render terrain and streets at 941×520. Inspect equal-size comparison and overlay; correct conspicuous root-owned errors.
- [x] Lock camera only after full-frame eye review; retain evidence and calibration observations.
- [x] Prepare enlarged, unwarped target crops, inherited view offsets, ownership briefs, and a primitive interface for independently solvable districts.
- [x] Validate materials and write children.json last; yield to runner without a final part.json.
- [x] On return integrate child components, render whole scene, review continuity, and write final part.json plus account.md when finished.

No git. No image generation or reference-image projection into scene. Raster operations are solely reference crops and visual comparison. All child output stays in that child's directory. No new approval gates.

## Resume cycle 2

The five children have no part.json on disk despite .children_done. Existing child accounts report interrupted work. Keep camera, manifests and base.json byte-for-byte intact because descendants inherit their hashes.

- [x] Render the inherited base again and inspect full-frame comparison.
- [x] Create refine_base.py producing base-refined.json from base.json. Eye review rejected the transposed-stripe trial; preserve reference stripe orientation, adjust bar length/width and first crossing position, and mask intersecting lane paint. Keep other substrate geometry unchanged until districts can be integrated.
- [x] Render rounds 3–5 at 941×520, create equal-scale comparisons and matched 6× crossing crops, and inspect them visually.
- [x] Audit five direct child target/view/brief/manifest files, record missing deliverables in resume-audit.json, restore children.json last and yield to runner. Do not synthesize district geometry or publish part.json.

On the next successful return compose base-refined.json with delivered children. The inherited base remains the read-only contextual snapshot for descendants. No approval gate and no git.
