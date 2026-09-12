import json,hashlib,shutil
from pathlib import Path
from PIL import Image,ImageDraw
P=Path(__file__).resolve().parent
im=Image.open(P/'target.png');view=json.loads((P/'view.json').read_text());man=json.loads((P/'manifest.json').read_text())
children=[('school-main-building',[404,198,113,120],6,
'''仅重建橙米色学校建筑：主楼、左侧矮翼、退台平屋顶、檐口、立面青色玻璃门窗、棕色 SCHOOL 招牌（含字母几何）。参考根图主要范围 x408..511,y200..313。不要造树、校地、铺地、喷泉或右侧双塔；这些由父层/兄弟负责。学校与双塔局部有遮挡，照参考保持建筑落脚与总高。目标招牌位于根图约 x444..489,y203..239，左矮翼约 x408..438,y241..300。以目标眼审为准，不要把这些粗范围当作测量真值。'''),
('school-tiered-towers',[504,207,139,154],5,
'''仅重建右侧两栋淡薄荷绿层叠塔楼与右下小附楼。第一栋靠左、图上更高，约根图 x506..574,y211..334；第二栋靠右前，约 x557..623,y246..359；附楼约 x602..641,y305..362。逐层辨认深绿色屋面、浅绿厚檐板、浅立面、底层细长门窗。两栋重复构造可参数化，但前后位置、顶部高度和底座不应相同。不要造橙色学校、树、校地、灰紫地坪或喷泉；由父层/兄弟负责。范围只是导航，目标眼审为准。''')]
for name,crop,scale,scope in children:
 d=P.parent/name;d.mkdir(exist_ok=True)
 x,y,w,h=crop;px,py,_,_=view['crop_px'];s=view['scale']
 box=(int((x-px)*s),int((y-py)*s),int((x+w-px)*s),int((y+h-py)*s))
 target=im.crop(box).resize((w*scale,h*scale),Image.Resampling.LANCZOS);target.save(d/'target.png')
 v=dict(camera_contract='../../camera-contract.json',camera_contract_sha256=view['camera_contract_sha256'],crop_px=crop,output_size=[w*scale,h*scale],scale=scale,coordinate_space='full_reference_pixels',parent_node='central-school',target_source='../central-school/target.png',source_crop_px=list(box))
 (d/'view.json').write_text(json.dumps(v,indent=2)+'\n')
 snapshot=(P/'preview.json').read_bytes();(d/'parent-context.json').write_bytes(snapshot)
 m=dict(interface_version=1,reference_sha256=man['reference_sha256'],camera_hash=man['camera_hash'],parent_snapshot='central-school/preview.json:'+hashlib.sha256(snapshot).hexdigest()[:12],solver_hash=man['solver_hash'],parent_node='central-school',target_sha256=hashlib.sha256((d/'target.png').read_bytes()).hexdigest())
 (d/'manifest.json').write_text(json.dumps(m,indent=2)+'\n')
 for f in ['scene.js','render.mjs']:shutil.copyfile(P/f,d/f)
 brief=f'''# {name}\n\n{scope}\n\n相机及接口：阅读 ../scene/interface.md。../../camera-contract.json 和本节点 manifest.json 只读，绝不重拟合相机。所有几何为根世界坐标。根图 crop_px={crop}，输出 {w*scale}×{h*scale}（等比例 {scale} 倍）；目标确实从父层 target.png 的像素框 {list(box)} 裁出后 Lanczos 放大。\n\n父层已做四树、青绿校地、白边、两块方形广场与喷泉。parent-context.json 是只读预览快照，已经含根底板和父层自有组件。预览时把它的 components 与自己的 components 合并；最终 part.json 严禁包含这些上下文组件。只在自己的目录写入；如还需下钻，遵照统一递归工单备料、children.json 并结束，由运行器启动孩子。不要自己启动代理。\n\n运行：从仓库根执行 .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/{name}/render.mjs --scene preview.json --view view.json --out round1.png。渲染与本节点 target.png 同倍率并排，亲眼检查。\n\n输出 part.json：node="{name}"；camera_contract_sha256 使用 view.json 完整摘要；components 每个 id 以 "{name}/" 开头；children 数组及必要的 child_refs。几何支持 polygon/triangles/box/cylinder/cone/ellipsoid，参见 interface.md。几何自绘字母允许，禁止参考图纹理/贴图。完成需保留生成器、并排证据与 account.md。\n\n已批准执行，不停门，禁止 git。\n'''
 (d/'brief.md').write_text(brief)
(P/'children.json').write_text(json.dumps([q[0] for q in children],indent=2)+'\n')
a=Image.open(P/'target.png');b=Image.open(P/'round2.png');out=Image.new('RGB',(a.width*2,a.height+24),'white');out.paste(a,(0,24));out.paste(b,(a.width,24));ImageDraw.Draw(out).text((4,5),'target | round2 : same 574 x 436 view',fill='black');out.save(P/'round2-compare.png')
print('Prepared',*[c[0] for c in children])
