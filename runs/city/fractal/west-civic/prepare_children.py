"""Prepare runner-managed depth-2 inputs; never dispatch or finalize the parent."""
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw

D = Path(__file__).resolve().parent
F = D.parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
dump = lambda p, data: p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
view = json.loads((D / 'view.json').read_text())
manifest = json.loads((D / 'manifest.json').read_text())
camera_sha = sha(D.parent.parent / 'camera-contract.json')
assert camera_sha == view['camera_contract_sha256']
assert not (D / 'part.json').exists()

# Context-only snapshot; no owned west-civic geometry exists before child solving.
shutil.copyfile(F / 'scene/base.json', D / 'base.json')
items = [
    ('west-offices', [0, 137, 145, 169],
     '重建左缘两栋灰色层叠办公高楼、最左被根画框截断的小附楼、楼下灰紫色地坪和贴楼细节。'
     '重点是前矮后高的轮廓、每层突出浅灰楼板、暗色内凹屋顶、底层立柱和少量浅色窗。'
     '大致建筑范围根图 x0..133,y137..293。左侧出画是原始构图，不得为了完整显示而移动楼。'
     '只拥有办公楼宅地；右下警局及广场归 west-police；左上露出的紫顶房归 north-housing。'
     '楼板重复可参数化，但若独立立面/小附楼仍值得单独求解，按工单备料下钻。'),
    ('west-police', [87, 245, 159, 105],
     '重建左下紫蓝色 POLICE 警局整体：主楼与左侧较低附翼、奶黄色檐线、浅色二层窗带、'
     '蓝色立面窗门、屋顶灰色停机坪和 H、竖立 POLICE 招牌，以及其右侧相连的空灰紫广场。'
     '警局主体约根图 x89..180,y250..341。广场延伸到约 x240，与住宅宅地边缘斜向衔接。'
     '不要覆盖办公楼地坪、住宅绿地或主道路；不制作前景树、主路斑马线。'
     '文字与屋顶标志要用几何参数表达，不得把目标图贴在模型上；值得独立求解的招牌可继续下钻。'),
    ('west-houses', [207, 168, 181, 133],
     '重建中央从左下到右上斜排的三栋紫屋顶奶黄色住宅、各自绿宅地、门前短灰步道和小灌木。'
     '建筑大致 x211..375,y171..281；注意每栋屋顶两个黄色老虎窗、紫檐、烟囱、侧面竖窗、'
     '正面浅色窗框与紫色前廊细柱。可建立一个实际三维原型然后逐栋调整，保持数量三栋。'
     '这不是 north-housing 负责的左上另一排四栋房。红顶 SHOP 及停车场归 west-shop，'
     '不要把商店遮挡处重复建成外露地坪；学校旁绿树、前景红树与道路均不归本节点。'
     '若房屋原型或立面仍需自己的目标和循环，继续按统一工单下钻。'),
    ('west-shop', [304, 219, 84, 91],
     '重建中央靠右的红顶 SHOP 小商店，约根图 x315..369,y223..282，包含红色屋顶边框、'
     '深灰平屋顶、红底白字 SHOP 招牌、红白条纹遮阳篷、白/浅灰墙、青色玻璃门窗、'
     '红色下沿、右侧灰紫停车场与白色停车线。认真处理遮阳篷和招牌的倾斜朝向。'
     '上方紫顶房与绿宅地归 west-houses；右侧学校绿地和约 x382,y281 的小绿树归 central-school；'
     '前景红树归 foreground-park。只拥有商店停车线，不拥有主道路标线。'
     '小商店通常可在本层直接循环完成；若招牌等值得独立目标循环，再按工单下钻。'),
]
source = Image.open(D / 'target.png').convert('RGB')
sx, sy, sw, sh = view['crop_px']
source_scale = view['scale']
assert source.size == (sw * source_scale, sh * source_scale)
coverage = source.copy()
draw = ImageDraw.Draw(coverage)
colors = ['#e23b30', '#2055f0', '#9221c4', '#f09300']
for (name, crop, scope), color in zip(items, colors):
    p = F / name
    assert not p.exists(), f'Refusing to replace existing child {name}'
    p.mkdir()
    x, y, w, h = crop
    assert sx <= x and sy <= y and x + w <= sx + sw and y + h <= sy + sh
    local = [(x-sx)*source_scale, (y-sy)*source_scale,
             (x+w-sx)*source_scale, (y+h-sy)*source_scale]
    source.crop(local).resize((w*4, h*4), Image.Resampling.LANCZOS).save(p/'target.png')
    child_view = {**view, 'crop_px': crop, 'output_size': [w*4, h*4], 'scale': 4,
                  'parent_node': 'west-civic', 'source_target': '../west-civic/target.png',
                  'source_crop_px_xyxy': local, 'source_scale': source_scale}
    dump(p/'view.json', child_view)
    dump(p/'manifest.json', {
        'interface_version': 1, 'reference_sha256': sha(p/'target.png')[:12],
        'source_reference_sha256': sha(D/'target.png'), 'camera_hash': camera_sha[:12],
        'parent_snapshot': 'west-civic/base.json:' + sha(D/'base.json')[:12],
        'solver_hash': manifest['solver_hash'], 'parent_node': 'west-civic',
    })
    (p/'brief.md').write_text(
        '# '+name+' — 深度2\n\n'+scope+'\n\n'
        '相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。'
        '所有几何使用根世界坐标；crop_px 是根图坐标，不是父图坐标。'
        f'本目标从 west-civic/target.png 裁出，根裁框 {crop}，输出 {w*4}×{h*4}，根图4倍。\n\n'
        '上下文快照 ../west-civic/base.json 只供预览，禁止并入最终 part。'
        '预览命令（仓库根运行）：\n\n'
        f'    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/{name}/render.mjs'
        ' --scene ../west-civic/base.json --view view.json --out baseline.png\n\n'
        '实际迭代将自己的 components 与上述快照合为本目录 preview.json，使用 --scene preview.json。'
        '最终 part.json 按共享接口输出，仅包含自有几何和明确声明的孩子引用；ID 用本节点名前缀。'
        '先整体同倍率眼审，再直接修局部或为独立子问题备 target/view/brief 并写 children.json 后结束会话。'
        '由运行器启动孩子，不自行启动代理。孩子返回后再整体眼审，完成才写 part.json 与 account.md。\n\n'
        '已批准执行，可逆选择直接做，不停门，禁止 git。写域仅本目录及自己声明孩子的准备材料。'
        '重叠裁图仅为上下文，不转移相邻对象所有权。禁止目标贴图。\n')
    for filename in ['render.mjs', 'scene.js']:
        shutil.copyfile(D/filename, p/filename)
    draw.rectangle(local, outline=color, width=3)
    draw.text((local[0]+4, local[1]+4), name, fill=color, stroke_width=1, stroke_fill='white')
coverage.save(D/'child-coverage.png')
dump(D/'pending-children.json', [item[0] for item in items])
print('Prepared', [item[0] for item in items])
