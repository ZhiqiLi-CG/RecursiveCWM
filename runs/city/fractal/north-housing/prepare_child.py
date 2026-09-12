"""Prepare the housing subproblem; the external runner owns dispatch."""
import hashlib
import json
import shutil
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
NAME = 'north-housing-buildings'
CHILD = HERE.parent / NAME
CHILD.mkdir(exist_ok=True)
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
dump = lambda p, data: p.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
# Freeze the parent's own vegetation/lot plus root substrate for previews.
shutil.copyfile(HERE/'preview.json', HERE/'base.json')
parent_view = json.loads((HERE/'view.json').read_text())
crop = [54, 16, 223, 145]
rect = [12, 12, 458, 302]
Image.open(HERE/'target.png').crop(rect).resize((892,580),Image.Resampling.LANCZOS).save(CHILD/'target.png')
view = dict(camera_contract='../../camera-contract.json',
            camera_contract_sha256=parent_view['camera_contract_sha256'],
            crop_px=crop, output_size=[892,580], scale=4,
            coordinate_space='full_reference_pixels', parent_node='north-housing',
            source_target='../north-housing/target.png',
            source_crop_px_xyxy=rect, source_scale=2)
dump(CHILD/'view.json', view)
manifest = dict(interface_version=1, reference_sha256=sha(CHILD/'target.png')[:12],
                source_reference_sha256=sha(HERE/'target.png'),
                camera_hash=parent_view['camera_contract_sha256'][:12],
                parent_snapshot='north-housing/base.json:'+sha(HERE/'base.json')[:12],
                solver_hash=json.loads((HERE/'manifest.json').read_text())['solver_hash'],
                parent_node='north-housing')
dump(CHILD/'manifest.json', manifest)
for name in ['render.mjs','scene.js']:
    shutil.copyfile(HERE/name,CHILD/name)
(CHILD/'brief.md').write_text('''# north-housing-buildings — 深度2

独立求解左上斜排的四栋紫屋顶奶黄色住宅。只拥有四栋建筑本体：屋顶、每栋两个老虎窗、烟囱、黄色墙面、侧面两扇竖窗、正面窗组、门、紫色前廊平台与细柱、贴墙基础和台阶。数量严格四栋，约根图 x58..270,y20..151，向右上依次排列。建立重复的实际三维原型，但每栋位置、屋顶轮廓、朝向、前廊与短步道的连接须分别眼审。住宅左下角受到灰高楼遮挡；灰高楼归 west-civic，不重建。树、草坪、灌木、独立短步道由 north-housing 拥有，禁止重复加入 part。

目标来自父 target.png 裁框 [12,12,458,302]，再等比放大2倍；对应根图 crop_px=[54,16,223,145]、output_size=[892,580]，总倍率4倍。view.json 使用根图坐标，禁止改相机。相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。所有几何使用根世界坐标，不得使用目标图贴图。

冻结父快照 ../north-housing/base.json 仅供预览，包含根基底及父草坪/树/步道。自己的组件与此快照合并成自己的 preview.json；最终 part.json 仅包含自有几何及声明的孩子引用，ID 以 north-housing-buildings/ 开头。渲染命令（仓库根）：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/north-housing-buildings/render.mjs --scene preview.json --view view.json --out round1.png

基线 baseline.png 与 target.png 均892×580，可直接并排。先整体亲眼找残差，本层能修的直接修；需要独立目标和循环的子部件，按统一递归工单在其唯一子目录备料、写 children.json 后结束会话，由运行器启动，禁止自行启动代理。孩子返回后再整体眼审，完成才写 part.json 与 account.md。

本工单已批准，可逆选择直接执行，不停门，禁止 git。写域限本节点及声明后代备料。住宅返回父层时，父层将再收住宅、草坪、步道及树簇关系。
''')
dump(HERE/'children.json',[NAME])
print(json.dumps({'child':NAME,'crop':crop,'output_size':[892,580],'snapshot':manifest['parent_snapshot']}))
