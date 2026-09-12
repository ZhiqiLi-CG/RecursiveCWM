import json,hashlib,shutil
from pathlib import Path
from PIL import Image
D=Path(__file__).resolve().parent;C=D.parent.parent
cam=json.loads((D/'camera-candidate.json').read_text())
cam['locked']=True
cam['lock_rule']='Immutable after root full-frame visual review. All descendant crops use setViewOffset in full 941x520 reference coordinates; never refit camera.'
cam['calibration']={
 'method':'Orthographic analytic orientation from two ground-edge families with slopes approximately +/-0.545. Set arbitrary horizontal basis to 30 px/world unit and vertical ground basis to 16.35. Elevation asin(0.545); azimuth 45 degrees. y remains vertical in image.',
 'reference_edges':[{'a':[0,177],'b':[293,16],'absolute_slope':161/293},{'a':[123,179],'b':[282,92],'absolute_slope':87/159},{'a':[139,358],'b':[261,292],'absolute_slope':66/122}],
 'visual_review':'Personally viewed round0/1/2 equal-scale full-frame target-versus-render comparisons and overlays. Revised initial 30deg to 33.024deg from long ground edges; adjusted left road topology, foreground road and terrain boundary. Full reference framing and two ground-axis families accepted. Buildings absent in substrate render; this does not validate building geometry. Remaining road widths, crossing orientation and intersection details belong to root reintegration.',
 'evidence':['fractal/scene/round2-compare.png','fractal/scene/camera-overlay2.png'],
 'scope':'Camera convention, framing and orientation only. Ground anchors are manually chosen from reference; matching them is not an independent image-accuracy metric.'}
assert not (C/'camera-contract.json').exists(),'Do not overwrite locked camera'
(C/'camera-contract.json').write_text(json.dumps(cam,indent=2)+'\n')
sha=hashlib.sha256((C/'camera-contract.json').read_bytes()).hexdigest()
view={'camera_contract':'../../camera-contract.json','camera_contract_sha256':sha,'crop_px':[0,0,941,520],'output_size':[941,520],'scale':1,'coordinate_space':'full_reference_pixels'}
(D/'view.json').write_text(json.dumps(view,indent=2)+'\n')
base=json.loads((D/'base.json').read_text());base['camera_contract_sha256']=sha;(D/'base.json').write_text(json.dumps(base,indent=2)+'\n')
interface='''# Shared scene interface

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
'''
(D/'interface.md').write_text(interface)
items=[
 ('north-housing',[48,10,319,164],'''重建左上四栋紫屋顶奶黄色独栋住宅，以及它们的前廊、烟囱、窗户、绿色宅地、短步道、零散矮灌木，和这排住宅右端的绿色树簇（约根图 x315..360,y20..85）。四房范围约 x58..270,y20..158。只拥有这排住宅与树；x360以右红顶商店归 east-district；左下灰高楼归 west-civic。住宅可作为重复原型参数化，但各个位置、屋顶轮廓和立面朝向要逐个眼审。'''),
 ('west-civic',[0,130,388,229],'''重建西侧街区：左缘可见两栋灰色层叠办公高楼及小附楼（x0..133,y137..293）、左下紫色 POLICE 警局及屋顶标志/招牌（x89..180,y250..341）、中央斜排三栋紫顶黄房（x211..375,y171..281）、红顶 SHOP 商店（x315..369,y223..282），以及这些建筑的宅地/灰色地坪/步道/停车线/小灌木。左上另一排四栋住宅由 north-housing 负责；学校及校外树簇由 central-school 负责；前景红树和公园由 foreground-park 负责。此街区包含多个值得独立求解的子对象，按同一递归工单下钻，不要一层硬做所有细节。'''),
 ('central-school',[370,188,287,218],'''重建学校街区：SCHOOL 棕招牌的橙米色学校主体/屋顶/门窗（x408..511,y200..313），右侧两栋淡薄荷绿层叠塔楼及小附楼（x506..641,y211..362），学校左前/右前绿色树簇、青绿色校地与入口广场；右下两块灰紫方形广场和小蓝白喷泉（约x547,y366）。自己处理地块的白边/相邻人行道连续性；主道路标记由父层负责。x370左侧红顶商店由 west-civic 负责；x650以右医院由 east-district 负责；下方公园大红树由 foreground-park 负责。学校、层叠楼、喷泉等值得下钻时就备料交回运行器。'''),
 ('east-district',[355,36,586,294],'''重建东北街区：左上红顶 SHOP 商店（x360..417,y45..103），两栋粉红/红屋顶黄房与后方红树（x415..546,y79..159），右上斜排三栋紫顶黄房及其绿宅地（x571..736,y95..217），最右三栋青绿层叠高楼（x731..899,y108..287）和塔间绿色锥层树，右中白/奶油医院、红十字和侧面红盒（x657..737,y218..312）。拥有相应灰地坪、花坛、步道、停车线。根道路和草原由父层负责；左侧x355以内树归north-housing；左下学校楼和薄荷绿楼归central-school。此街区包含多个有自己目标和循环的子对象，请按递归工单分解后结束会话，等运行器叫醒再整合。'''),
 ('foreground-park',[124,288,277,219],'''重建前景公园完整对象集合：两片轮廓不规则青绿色小水池（约x292,y401与x188,y451）、池边小灌木/叶片、约四棵红色分层树和绿色树木群（锥层与横展叠层两种），树干、阴影如参考。公园范围根图约 x138..390,y295..490。最上方红树x344,y321也归你；学校旁x382,y281的小绿树不归你。草地底色与网格归父层；不得用矩形背景盖住道路。水池形状和树冠需要自己的局部循环时，下钻湖景或树原型子节点。'''),
]
im=Image.open(D/'target.png').convert('RGB')
for name,crop,scope in items:
 p=D.parent/name;p.mkdir(exist_ok=True)
 x,y,w,h=crop;im.crop((x,y,x+w,y+h)).resize((w*2,h*2),Image.Resampling.LANCZOS).save(p/'target.png')
 v={**view,'crop_px':crop,'output_size':[w*2,h*2],'scale':2,'parent_node':'scene','coordinate_space':'full_reference_pixels'}
 (p/'view.json').write_text(json.dumps(v,indent=2)+'\n')
 (p/'brief.md').write_text('# '+name+'\n\n'+scope+'\n\n相机与接口：阅读 ../scene/interface.md；../../camera-contract.json 只读。基线父组件 ../scene/base.json 只用于预览上下文，不加入最终 part。目标来自根图 crop_px='+str(crop)+'，等比例放大2倍。\n\n已批准执行，不停门，不使用 git。子节点写域仅自身目录；邻居归属按本说明。所有几何使用根世界坐标。同倍率渲染与目标并排亲眼判准。\n')
 manifest={'interface_version':1,'reference_sha256':hashlib.sha256((p/'target.png').read_bytes()).hexdigest()[:12],'camera_hash':sha[:12],'parent_snapshot':'scene/base.json:'+hashlib.sha256((D/'base.json').read_bytes()).hexdigest()[:12],'solver_hash':'37375ae59bf5','parent_node':'scene'}
 (p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 shutil.copyfile(D/'render.mjs',p/'render.mjs');shutil.copyfile(D/'scene.js',p/'scene.js')
# Leave dispatch signal to a final verification step, after baseline renders exist.
(D/'pending-children.json').write_text(json.dumps([a[0] for a in items],indent=2)+'\n')
print('camera locked sha256',sha)
print('prepared',len(items),'child target/view/brief sets')
