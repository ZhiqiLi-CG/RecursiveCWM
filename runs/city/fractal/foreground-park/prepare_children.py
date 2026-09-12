import json, hashlib, shutil
from pathlib import Path
from PIL import Image, ImageDraw
D=Path(__file__).resolve().parent
C=D.parent.parent
sha=hashlib.sha256((C/'camera-contract.json').read_bytes()).hexdigest()
view=json.loads((D/'view.json').read_text())
assert sha==view['camera_contract_sha256']
im=Image.open(D/'target.png').convert('RGB')
assert im.size==tuple(view['output_size'])
items=[
 ('foreground-park-red-tree',[208,426,37,65],
  '''只求解图中这一棵红色分层树原型（前景最低的一棵），包括树冠、棕色树干和贴地小阴影。根图树干落地点约 [226,487]。冠约 x212..239,y430..470；四段锯齿式错落轮廓、顶部圆钝，左亮右暗的红色面。请通过真实三维分层/多边形树冠几何表达，不能仅画相机朝向的轮廓片。附近水池、绿草和其他树都是上下文，不归你。原型保留根世界坐标，交付 prototype_anchor_pixel=[226,487] 和 prototype_anchor_world（地面y=0）的元数据，方便父层平移复制为四棵；不要自己放其他红树。'''),
 ('foreground-park-cone-tree',[167,349,36,50],
  '''只求解左上这一棵绿色锥层树原型，包括短棕树干、三至四层由宽到窄的平顶截锥树冠与贴地小阴影。根图树干落地点约 [185,395]，冠约x170..199,y355..388。亮黄绿顶面、橄榄绿侧面、层间暗带是主要特征。几何需有体积；父层会复制为两棵。其它草地、道路是上下文，不归你。保留根世界坐标，交付 prototype_anchor_pixel=[185,395] 和 prototype_anchor_world（地面y=0）元数据；只做一棵。'''),
 ('foreground-park-spread-tree',[262,419,40,42],
  '''只求解下方横展绿色树原型，包括短棕树干、上下错落的宽扁圆盘/有机冠层与贴地小阴影。根图树干落地点约 [282.5,456]，冠约x267..296,y427..449。与锥层绿树不同，冠层有左右偏移、横向分叶、不规则外缘，顶层偏左，明亮顶面与橄榄绿阴面。用有厚度三维几何，不要朝相机贴片。父层会平移复制为五棵并微调尺度。邻近水池/红树/草地是上下文，不归你。保留根世界坐标，交付 prototype_anchor_pixel=[282.5,456] 和 prototype_anchor_world（地面y=0）元数据；只做一棵。'''),
 ('foreground-park-ponds',[150,366,185,115],
  '''求解两片不规则青绿色浅水池与各自上岸的小叶簇/灌木。上池根图约x257..329,y380..421，下池约x155..218,y430..473（部分被红树遮挡）。池边小叶簇分别约[294,377]与[192,429]。按目标精修非对称曲折轮廓、少量尖凹与圆角、无黑边的亮青绿水面，以及深绿和黄绿叶片；全部是真实根世界几何。水面略高于父草地，避免z-fighting，但不加矩形草地覆盖。所有大红树与绿树均由父层树原型实例化，不归你；不要把遮挡树的轮廓误做水池缺口，应合理补全被遮挡水岸。两池可以共享轮廓构造方法，但逐个并排检查。可直接求解此双池对象组，需要进一步独立局部循环再递归。'''),
]
plan='''# foreground-park 执行计划\n\n已批准工单；采用 brainstorming 的范围拆解和 writing-plans 的步骤记录，不重复审批、不使用 git。\n\n设计：三类树原型分别求解冠层形状与材质，两池组成一个湖景对象组。父层只负责树实例的布局、比例、遮挡与湖树关系。比所有对象留在一层更容易独立眼审；比每棵树单独求解更能保持重复形态一致。所有场景均使用继承的锁定相机和根世界坐标。\n\n- [x] 读取 target/view/manifest/interface，相机只读；亲眼检查554×438目标与基线同倍率并排。\n- [x] 记录四棵红树、两棵锥层绿树、五棵横展绿树的暂定地面锚点。\n- [ ] 从本层target裁切并放大四个子目标，复合回根图view；备齐brief/manifest/渲染入口与父基线上下文。\n- [ ] 渲染各子取景基线，检查尺寸、相机哈希、无浏览器错误；亲眼检查同倍率并排。\n- [ ] 写children.json后结束会话，等待运行器。\n- [ ] 唤醒后读取四个part，校验ID/相机/归属，平移复制树原型并扁平合并双池，只含本层对象。\n- [ ] 渲染本层整体并排，调整重复对象比例、落地点及水池遮挡；需要再下钻则再次交回。\n- [ ] 视觉验收后写part.json（children与child_refs标明已经展平）和account.md。\n'''
(D/'plan.md').write_text(plan)
layout={'node':'foreground-park','coordinate_space':'full_reference_pixels','anchor_definition':'trunk-ground contact at world y=0; initial estimates for parent visual refinement','instances':[
 {'prototype':'foreground-park-red-tree','anchors_px':[[242.5,379.5],[344,354.5],[340,440.5],[226,487]]},
 {'prototype':'foreground-park-cone-tree','anchors_px':[[185,395],[224,423.5]]},
 {'prototype':'foreground-park-spread-tree','anchors_px':[[293,342],[309,371.5],[379,395],[146.5,438.5],[282.5,456]]}]}
(D/'layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for name,crop,scope in items:
 p=D.parent/name
 assert not p.exists(),f'Existing child must not be overwritten: {p}'
 p.mkdir()
 x,y,w,h=crop
 px,py,_,_=view['crop_px'];scale=view['scale']
 box=((x-px)*scale,(y-py)*scale,(x+w-px)*scale,(y+h-py)*scale)
 assert min(box)>=0 and box[2]<=im.width and box[3]<=im.height
 outscale=6 if name!='foreground-park-ponds' else 4
 im.crop(box).resize((w*outscale,h*outscale),Image.Resampling.LANCZOS).save(p/'target.png')
 cv={**view,'crop_px':crop,'output_size':[w*outscale,h*outscale],'scale':outscale,'parent_node':'foreground-park','source_target':'../foreground-park/target.png','source_crop_px':list(box)}
 (p/'view.json').write_text(json.dumps(cv,indent=2)+'\n')
 (p/'brief.md').write_text('# '+name+'\n\n'+scope+'\n\n接口：只读 ../scene/interface.md 与 ../../camera-contract.json。本目标由 ../foreground-park/target.png 裁切等比放大；view.json 已复合为根图crop，禁止重新拟合相机。输出 part.json 使用 components，ID以本节点名/开头，附 camera_contract_sha256、children 和 child_refs。父层基线 ../scene/base.json 只供预览，不能放入最终组件；只写自身目录及明确声明的后代备料目录。\n\n本子节点裁框根坐标 '+str(crop)+'，输出倍率 '+str(outscale)+'。已批准执行，可逆选择直接做，不使用git，不要自行启动代理。需要独立下钻时按同一工单备料、children.json后结束，让运行器启动。无进一步下钻则实际渲染并同倍率并排亲眼验收后写part.json与account.md。\n\n渲染命令（仓库根执行）：\n```sh\n.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/'+name+'/render.mjs --scene preview.json --view view.json --out round0.png\n```\n先复制/组合父base.components和自己的components到本地preview.json用于上下文预览。附带baseline.png及baseline-compare.png仅为继承基线。\n')
 manifest={'interface_version':1,'reference_sha256':hashlib.sha256((p/'target.png').read_bytes()).hexdigest()[:12], 'source_reference_sha256':hashlib.sha256((D/'target.png').read_bytes()).hexdigest(),'camera_hash':sha[:12],'camera_contract_sha256':sha,'parent_snapshot':'scene/base.json:'+hashlib.sha256((D.parent/'scene/base.json').read_bytes()).hexdigest()[:12],'parent_layout_sha256':hashlib.sha256((D/'layout.json').read_bytes()).hexdigest(),'solver_hash':'37375ae59bf5','parent_node':'foreground-park'}
 (p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 for f in ['render.mjs','scene.js']:shutil.copyfile(D/f,p/f)
(D/'pending-children.json').write_text(json.dumps([i[0] for i in items],indent=2)+'\n')
print(json.dumps({'prepared':[i[0] for i in items],'camera_sha256':sha}))
