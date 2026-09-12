# east-shop execution plan

Approved scope: only shop and its parking apron. No git, no sibling or parent writes; locked camera and manifest remain read-only. Apply brainstorming/context review and writing-plans within this approved execution order, without new permission gates.

- [x] Inspect target and baseline at identical 352×344 scale; read camera/interface/ownership.
- [x] Generate world-space body, red parapet, turquoise glazing, sloped striped canopy, raised lettered sign and parking marks in generate.py. Keep preview context separate.
- [x] Render round0 using local render.mjs and inspect equal-scale comparison. Refine visible owned residuals.
- [x] If an independently difficult object emerges, prepare child crop/view/brief and end for runner. Otherwise validate geometry IDs, camera hash and renderer errors, then write final part.json and account.md.

Architecture: supported box/polygon/triangles primitives, explicit face colors, analytic locked-camera inversion for initial anchors; reproducible Python generator. Validation is rendered visual inspection and output schema checks; no application behavior is changed.
