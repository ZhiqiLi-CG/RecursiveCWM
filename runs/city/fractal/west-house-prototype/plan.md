# West house prototype execution plan

Goal: deliver one reusable root-coordinate 3D house under the inherited camera.
Architecture: parameterized boxes and triangle meshes; parent base is preview-only.
Constraints: own directory writes, immutable camera and manifest, no git, no target texture.

- [x] Read target, brief, shared interface and baseline comparison.
- [x] Build wall block, asymmetric gable roof, two dormers, chimney, windows, door and porch in generate.py.
- [x] Render preview.json with inherited view and inspect equal-scale comparison; refine visible residuals.
- [x] Record geometry anchor and clone transform; validate candidate geometry and render report.
- [x] Write account.md and final part.json only after visual review.

Design choice: model all details as one small parameterized component. Dormers and porch are simple repeated/attached geometry and do not currently merit independent child loops. Pixel annotations guide placement through the locked projection, never camera fitting. Verify the generated artifact structurally and by rendering; no software behavior changes or separate unit-test suite are required.
