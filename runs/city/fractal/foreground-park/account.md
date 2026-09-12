# foreground-park 本层轮次账

状态：深度1，本层完成；四个孩子已接入，无需继续下钻。

## 本轮交付

part.json 含8323个自有组件，实例化4棵红色分层树、2棵绿色锥层树、5棵横展绿树，并接入2片青绿色不规则水池和两组岸边叶簇。children 引用 foreground-park-red-tree、foreground-park-cone-tree、foreground-park-spread-tree、foreground-park-ponds；child_refs 均声明 included_in_components=true，记录源文件SHA256及树原型锚点、实例缩放和目标落地点。父层直接读取展平 components，不要再次展开孩子。

三个树孩子保持原文件不变，本层通过 integrate.py 读取 part.json、以 prototype_anchor_world 为中心缩放并平移，统一重命名为 foreground-park/实例/部件。双池按根世界坐标原位接入。preview.json 额外加入只读 scene/base.json 作为街道上下文；最终交付不含父草地、道路、网格或兄弟建筑。上缘学校旁的小绿树不归本层。

## 整体 → 局部 → 再整体

首轮备料历史保存于 account-cycle1.md。亲眼查看继承的 baseline-compare.png，确认公园对象完全缺失；将三种树冠原型和双池叶簇拆成四个独立求解循环，target均从本层裁切放大，并按继承相机复合取景。子任务由运行器启动，本会话未自行启动代理。

唤醒后读取四个孩子的 part.json 和账本，再读本层目标。integrated0：按 layout.json 放置11棵树，接入双池，实际渲染554×438并亲眼查看 integrated0-compare.png，左右同为2倍。四棵红树的队形、两池间距、红树对两池东岸的遮挡连续。绿树和岸边叶簇无明显冲突。两棵锥层树落地点稍低，中间一棵略宽，属于本层实例关系，可直接调整。

integrated1：左锥层树地面锚点从[185,395]改为[184.5,393.5]，统一缩放0.99；中央锥层树从[224,423.5]改为[224,422]，水平两轴缩放0.97，高度保留。实际重渲染并亲眼查看 integrated1-compare.png。接受11棵树的尺度、落地点、上下层次与两池遮挡；两池的东岸在红树背后连续，没有矩形补底或树形缺口。无需进一步独立子问题。

## 验证

validate.py 新鲜验证通过，记录见 validation.json。8323个ID唯一且均以foreground-park/开头；几何数值有限、三角索引有效；11个树实例与4条展平引用齐全；子源SHA256匹配，父背景未混入交付，preview恰为父base加本层组件。目标和最终渲染均554×438，根裁框[124,288,277,219]。integrated1.render.json 报告503 meshes、19953 triangles（含父预览背景）、errors=[]。

相机SHA256始终为07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c，与view、组件和实际渲染报告一致。相机、原manifest、父快照与孩子交付未修改；未使用git。指标只作为接口/执行记录，不作为画面验收阈值。

## 剩余差异与父层交接

目标源图采样柔化，当前几何树冠与水岸边缘更清晰，绿色冠层外缘更规则、侧壁色带偏硬。接受本层主要形态和关系，不宣称逐像素复刻。目标背景中警局、学校旁小绿树未进入当前父base预览；道路与斑马线、草地细网格和色块仍有差异，均由父scene及对应兄弟节点在根层整合，不在公园part内补画。

复现（仓库根）：
```sh
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/foreground-park/integrate.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park/render.mjs --scene preview.json --view view.json --out integrated1.png
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/foreground-park/compare.py integrated1
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/foreground-park/validate.py
```

最终part与已验证candidate逐字节一致。保留children.json.prev作为已完成调度历史；不创建新children.json调度信号，最终孩子引用保存在part.json。
