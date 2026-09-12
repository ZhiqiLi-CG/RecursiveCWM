# foreground-park-cone-tree

只求解左上这一棵绿色锥层树原型，包括短棕树干、三至四层由宽到窄的平顶截锥树冠与贴地小阴影。根图树干落地点约 [185,395]，冠约x170..199,y355..388。亮黄绿顶面、橄榄绿侧面、层间暗带是主要特征。几何需有体积；父层会复制为两棵。其它草地、道路是上下文，不归你。保留根世界坐标，交付 prototype_anchor_pixel=[185,395] 和 prototype_anchor_world（地面y=0）元数据；只做一棵。

接口：只读 ../scene/interface.md 与 ../../camera-contract.json。本目标由 ../foreground-park/target.png 裁切等比放大；view.json 已复合为根图crop，禁止重新拟合相机。输出 part.json 使用 components，ID以本节点名/开头，附 camera_contract_sha256、children 和 child_refs。父层基线 ../scene/base.json 只供预览，不能放入最终组件；只写自身目录及明确声明的后代备料目录。

本子节点裁框根坐标 [167, 349, 36, 50]，输出倍率 6。已批准执行，可逆选择直接做，不使用git，不要自行启动代理。需要独立下钻时按同一工单备料、children.json后结束，让运行器启动。无进一步下钻则实际渲染并同倍率并排亲眼验收后写part.json与account.md。

渲染命令（仓库根执行）：
```sh
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park-cone-tree/render.mjs --scene preview.json --view view.json --out round0.png
```
先复制/组合父base.components和自己的components到本地preview.json用于上下文预览。附带baseline.png及baseline-compare.png仅为继承基线。
