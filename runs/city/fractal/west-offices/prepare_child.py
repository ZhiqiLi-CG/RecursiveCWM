import json, hashlib, shutil
from pathlib import Path
from PIL import Image
P=Path(__file__).resolve().parent
C=P.parent/'west-offices-annex'
assert not C.exists(), 'Do not overwrite existing child'
C.mkdir()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
v=json.loads((P/'view.json').read_text()); m=json.loads((P/'manifest.json').read_text())
crop=[0,218,42,74]; local=[0,324,168,620]
im=Image.open(P/'target.png').convert('RGB');im.crop(local).resize((336,592),Image.Resampling.LANCZOS).save(C/'target.png')
dump(C/'view.json',{**v,'crop_px':crop,'output_size':[336,592],'scale':8,'parent_node':'west-offices','source_target':'../west-offices/target.png','source_crop_px_xyxy':local,'source_scale':4})
shutil.copyfile(P/'preview.json',C/'parent-context.json')
dump(C/'manifest.json',{'interface_version':1,'reference_sha256':sha(C/'target.png')[:12],'source_reference_sha256':sha(P/'target.png'),'camera_hash':v['camera_contract_sha256'][:12],'parent_snapshot':'west-offices-annex/parent-context.json:'+sha(C/'parent-context.json')[:12],'solver_hash':m['solver_hash'],'parent_node':'west-offices'})
for filename in ['scene.js','render.mjs']:shutil.copyfile(P/filename,C/filename)
(C/'brief.md').write_text('''# west-offices-annex — 深度3

求解左侧被原始画框截断的低矮灰色附楼，归属 west-offices。只拥有附楼的体块、屋顶围边和深灰凹面、浅色窗、低处小门及其自身立面明暗。不要移动塔楼，不要重新制作地坪或道路。保持左缘自然出画，禁止为了完整露出而平移。目标约根图 x0..35,y224..285；取景还包含相邻塔楼作为遮挡上下文。

父层已经做了两栋塔楼与灰紫宅地。附楼较难确定的是：顶部实际露出的窄深灰屋顶与较宽下部墙体如何通过塔楼遮挡衔接；右上屋顶被塔楼挡住，底部仍在左缘露出。请由自己的整体—局部—再整体循环确定几何。父层试过单一矩形箱体，发现屋顶露出过大或高度不对，因此未把试验附楼并入快照。目标图是唯一视觉依据，父层猜测不是约束。

相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。所有几何使用根世界坐标；根裁框 [0,218,42,74]，输出336×592，根图8倍。target.png 是从 west-offices/target.png 的 [0,324,168,620] 裁出再Lanczos放大2倍。严禁目标贴图。

parent-context.json 是包含父层塔楼、宅地和根道路的只读预览快照，不含附楼。仅作上下文，禁止复制进最终 part.json。

仓库根运行：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-offices-annex/render.mjs --scene parent-context.json --view view.json --out baseline.png

实际迭代合并自己的 components 与 parent-context.json 到本目录 preview.json，再用同一命令 --scene preview.json 渲染。先亲眼同倍率并排，再直接修或备料下钻。最终 part.json 只含自有几何与孩子引用，ID 用 west-offices-annex/ 前缀，另写 account.md。写域只在自己的节点目录和自己声明孩子的准备材料；禁止 git。运行器负责孩子，不自行启动代理。已批准工单，可逆选择直接执行，不停门。
''')
print(C)
