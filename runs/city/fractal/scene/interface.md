# Shared scene interface

The inherited camera is locked. All geometry is in ROOT WORLD coordinates. Root reference is 941×520; x projects down-right, z down-left, y up. Reference pixel projection:

    u = 470.5 + 30*(x-z)
    v = 260 + 16.35*(x+z) - V*y
    V = camera.vertical_pixels_per_world_unit

To place a point at root pixel (u,v) at chosen world height y:

    a=(u-470.5)/30
    b=(v-260+V*y)/16.35
    x=(a+b)/2; z=(b-a)/2

For a child pixel (s,t), first convert to ROOT pixel using crop_px and output_size. Descendant crops must compose offsets back to root pixels; do not fit a new camera. Reference crops are enlarged with Lanczos with no aspect distortion.

Deliver part.json with node, camera_contract_sha256, components (nonempty unique IDs prefixed by node/), children, and child_refs if any. Components must contain ONLY owned geometry, never parent base or sibling context. Use flattened composition when including grandchildren and explicitly declare included_in_components=true to avoid duplicate assembly. Keep source generators alongside output.

Supported primitives in scene.js:
- polygon: points [[x,z],...], y, color (flat horizontal polygon).
- triangles: vertices [[x,y,z],...], indices [0,1,2,...], color.
- box: position [x,y,z] CENTER, size [w,h,d], color or colors [top,x-positive-face,z-positive-face].
- cylinder / cone: position center, radius, radiusTop optional, height, segments optional, color.
- ellipsoid: position center, size [rx,ry,rz], color.
All colors hex strings; geometry uses flat MeshBasicMaterial with custom face colors. No textures made from target image. Parameterize actual geometry, including roofs, facade details and signs.

Rendering: copy/use the provided local scene.js and render.mjs. From repository root:

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/NODE/render.mjs --scene preview.json --view view.json --out round0.png

preview.json may combine read-only ../scene/base.json components with your current components to give street context. Your final part.json excludes those parent components. A ready baseline is supplied as baseline.png, rendered at the exact same output size as target.png. During later local iterations render child view with the inherited camera; do not scale render and target independently.

Write only your own fractal/NODE/ plus preparation material in any descendants you declare, as required by recursive work order. Never modify root files, siblings, existing manifests or camera. Root owns all main grass, street geometry, road markings and crossings. District owns its building/paving/lot boundaries and vegetation. Crop overlaps show context, not transfer of ownership. A local y=.02 ground overlay can cover parent grass; avoid extending it over roads.

If own child needs independent solving: prepare target.png/view.json/brief.md in its unique directory, list children.json and END SESSION. Runner dispatches; do not spawn agents yourself. Do not write final part.json until integration and visual review are complete.
