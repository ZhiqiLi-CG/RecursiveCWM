# school-tiered-towers local plan

Use the approved fixed orthographic camera and root world coordinates. Build two separately placed mint towers with five projecting shelves, parapet roofs, ground doors/windows, and a single-storey annex. Shared tower parameters preserve repeated architecture while anchors/heights differ. Solid block approximation loses the dominant horizontal edges; individually solving identical shelves adds no independent visual problem, so parameterized geometry is selected.

1. Render inherited context and compare at 695×770 against target.
2. Generate owned geometry in generate.py; save candidate.json and merged preview.json.
3. Render successive candidates, inspect equal-size side-by-side images, tune silhouette/levels/colors/window layout.
4. Validate camera digest, IDs, geometry ownership, renderer report, and preserve evidence. Write account.md and only then final part.json. No children needed unless the visual loop exposes an independently difficult object.

Only write this directory. No git, no camera edits, no parent/sibling edits, no texture from reference. Visual output is the acceptance check for this reversible asset work.
