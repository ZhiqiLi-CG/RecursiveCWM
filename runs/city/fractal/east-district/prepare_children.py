import hashlib,json,shutil
from pathlib import Path
from PIL import Image,ImageDraw
D=Path(__file__).resolve().parent
C=D.parent.parent
j=lambda p: json.loads(p.read_text())
sha=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
write=lambda p,v: p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
view=j(D/'view.json'); camsha=sha(C/'camera-contract.json')
assert camsha==view['camera_contract_sha256']
im=Image.open(D/'target.png').convert('RGB')
assert im.size==tuple(view['output_size'])
context=j(D.parent/'scene/base.json')
write(D/'context.json',context)
items=[
('east-shop',[355,38,88,86],'''只拥有东北最左的红顶 SHOP 小商店（根图约 x360..417,y45..103），以及商店正下方的灰紫停车坪、白停车线。建立青绿玻璃、浅灰墙、红色檐边、深色平屋面、红白条纹遮雨棚和正面 SHOP 招牌，保持屋顶/招牌/雨棚遮挡关系。左边绿色树属于 north-housing；右侧两栋粉红顶房与深绿地块属于 east-pink-housing。商店坪终止于相邻住宅地块，主路白人行道由根层负责。招牌等若确需自己的目标与循环，再下钻。'''),
('east-pink-housing',[410,72,154,110],'''只拥有两栋斜向排列的粉红/红屋顶奶黄住宅（根图约 x415..546,y79..159）、两株房后红色层叠树、屋前矮灌木、深绿色宅地和两条浅色入口短步道。注意两栋的屋顶坡面、凸起天窗、门窗、奶黄正面/侧面明暗与错位间距。左上商店归 east-shop，右侧紫顶住宅归 east-purple-housing。地块边缘贴主路人行道，不覆盖路面，也不以整个裁剪矩形填地。原型可复用，但须分别眼审两栋投影及遮挡；确需独立局部循环再下钻。'''),
('east-purple-housing',[562,91,184,145],'''只拥有右上斜排三栋紫屋顶奶黄住宅（根图约 x571..736,y95..217）、各自小门廊/廊柱、两个屋顶凸窗、烟囱、门窗，以及绿色宅地、灰白入口步道、低矮花灌木。三栋必须按本图分别定位和检查间距。右侧青绿高楼前的所有大型绿色锥层树归 east-teal-towers，含遮挡第三栋住宅右下角的第一株，勿重复建造。左侧红树/粉红屋顶归 east-pink-housing，马路及道路白边由根层负责。允许统一住宅原型，但不要把重复关系变成三栋无需眼审的复制。'''),
('east-teal-towers',[704,101,237,202],'''只拥有最右三栋青绿色层叠高楼（根图约 x731..899,y108..287）、三株楼前大型绿色锥形分层树（第一株约 x724,y218，后两株沿道路向右下递进）、树干，以及塔楼群的整片灰紫色地坪，含最右延伸到画面 x941 附近的坪。逐栋检查高度、层数、楼板厚度、层间暗条、屋面深色内凹与亮青边框、底层白色门窗；勿以单色实心盒替代层叠轮廓。左边紫顶房及其宅地归 east-purple-housing，医院在路对面归 east-hospital。地坪前沿应跟随参考路边，远端边缘按参考收束。三塔与三树是一个有重复和遮挡关系的组；细部若需要自己的目标和循环再下钻。'''),
('east-hospital',[620,207,170,123],'''只拥有右中医院白/奶黄色高低组合体（根图约 x657..737,y218..312）、高部正面的红十字、左低部的红色侧盒及浅蓝小窗、门口和浅色平屋顶内凹；同时拥有医院紧邻的灰紫地坪与白边。注意高低体量左右关系、立面朝向、红十字形状与位置。裁剪左侧薄荷绿学校塔楼和它们的基座归 central-school，右上青绿塔楼与树归 east-teal-towers。医院地坪只画参考中的医院所在小街块，避免吞并学校基座；所有主路、黄线、斑马线归根层。红十字可用参数化盒/面几何，不用参考纹理。'''),
]
for name,crop,scope in items:
 p=D.parent/name
 assert not p.exists(),f'Refusing to overwrite existing child {name}'
 p.mkdir()
 x,y,w,h=crop; px,py,pw,ph=view['crop_px']
 assert x>=px and y>=py and x+w<=px+pw and y+h<=py+ph
 parent_box=((x-px)*2,(y-py)*2,(x+w-px)*2,(y+h-py)*2)
 im.crop(parent_box).resize((w*4,h*4),Image.Resampling.LANCZOS).save(p/'target.png')
 v={**view,'crop_px':crop,'output_size':[w*4,h*4],'scale':4,'parent_node':'east-district','parent_crop_px':list(parent_box),'parent_scale':2}
 write(p/'view.json',v)
 (p/'brief.md').write_text(f'''# {name} — depth 2\n\n{scope}\n\n目标由 ../east-district/target.png 裁出再等比放大2倍，根图范围 crop_px={crop}，输出 {w*4}×{h*4}，相对根图4倍。view.json 中裁剪已经合成为根图坐标，禁止再次叠加父偏移。\n\n阅读 ../scene/interface.md；../../camera-contract.json 与本 manifest 只读。所有实际几何采用根世界坐标。基线上下文 ../east-district/context.json 只用于预览，最终 part.json 不得包含其道路/草地组件。使用当前目录 render.mjs 和 scene.js；运行示例：\n\n    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/{name}/render.mjs --scene preview.json --view view.json --out round0.png\n\n工单已批准，可逆选择直接执行，不停门，不使用 git。先对照同倍率 baseline-compare.png 与目标，局部几何渲染迭代后亲眼验。裁剪内其他对象只是上下文，不能抢邻居归属。仅写自己的 fractal/{name}/；若递归备料可写自己声明的后代目录，不写父层/兄弟目录。值得独立求解的子问题按工单准备 target/view/brief 和 children.json 后结束会话，由运行器启动；不要自行 spawn。\n\n完成时交 part.json（node、camera_contract_sha256、components、children、必要的 child_refs）和 account.md。自有组件 ID 以 {name}/ 开头；聚合后代时保留其 ID 并注明 included_in_components=true 防重。维护可重生成的源脚本。最终视觉检查完成前不写 part.json。\n''')
 write(p/'manifest.json',{'interface_version':1,'reference_sha256':sha(p/'target.png')[:12],'camera_hash':camsha[:12],'parent_snapshot':'east-district/context.json:'+sha(D/'context.json')[:12],'solver_hash':j(D/'manifest.json')['solver_hash'],'parent_node':'east-district','camera_contract_sha256':camsha,'parent_target_sha256':sha(D/'target.png'),'target_sha256':sha(p/'target.png')})
 for f in ['render.mjs','scene.js']: shutil.copyfile(D/f,p/f)
write(D/'pending-children.json',[i[0] for i in items])
print('Prepared children:',[i[0] for i in items])
