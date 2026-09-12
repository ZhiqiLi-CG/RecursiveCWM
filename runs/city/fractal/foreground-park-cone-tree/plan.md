# 四层锥冠树执行计划

已批准工单；使用 brainstorming、writing-plans、executing-plans 的设计—实施—验证顺序。用户指定不设审批门、不使用 git、不自行启动代理；所有输出限本节点。

设计：在根世界坐标 [185,395] 对应地面锚点上生成短棕色八面树干、四层由宽到窄的矮截锥，每层有独立亮顶面、橄榄侧面和底沿暗带。选择 32 面截锥，兼顾圆润轮廓和真实体积；单色圆锥不能表现阶层，贴图不能满足体积要求，均不采用。贴地椭圆阴影使用薄多边形。无需子节点。

- [x] 阅读接口、brief、view、manifest、相机；目视继承基线与目标。
- [x] 用 generate.py 生成 owned.json 和仅供预览的 preview.json（父 base + owned）。不修改本地标准渲染器。
- [x] 用继承相机运行 render.mjs，输出 round1.png；以 216×300 同倍率与 target.png 并排检查树冠轮廓、分层、色面、落地点。
- [x] 依据眼审改生成参数并重渲染，记录每轮证据。背景差异归父层。
- [x] 验证相机 SHA、组件 ID、根坐标锚点、无父组件混入、渲染无错误；保存 account.md、children.json=[]，最后写 part.json。

执行命令（仓库根）：
```
python3 runs/pilot/city-full-recursive-r1/fractal/foreground-park-cone-tree/generate.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park-cone-tree/render.mjs --scene preview.json --view view.json --out round1.png
```
