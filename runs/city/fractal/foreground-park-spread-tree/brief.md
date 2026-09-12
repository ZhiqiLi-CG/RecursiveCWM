# foreground-park-spread-tree

只求解下方横展绿色树原型，包括短棕树干、上下错落的宽扁圆盘/有机冠层与贴地小阴影。根图树干落地点约 [282.5,456]，冠约x267..296,y427..449。与锥层绿树不同，冠层有左右偏移、横向分叶、不规则外缘，顶层偏左，明亮顶面与橄榄绿阴面。用有厚度三维几何，不要朝相机贴片。父层会平移复制为五棵并微调尺度。邻近水池/红树/草地是上下文，不归你。保留根世界坐标，交付 prototype_anchor_pixel=[282.5,456] 和 prototype_anchor_world（地面y=0）元数据；只做一棵。

接口：只读 ../scene/interface.md 与 ../../camera-contract.json。本目标由 ../foreground-park/target.png 裁切等比放大；view.json 已复合为根图crop，禁止重新拟合相机。输出 part.json 使用 components，ID以本节点名/开头，附 camera_contract_sha256、children 和 child_refs。父层基线 ../scene/base.json 只供预览，不能放入最终组件；只写自身目录及明确声明的后代备料目录。

本子节点裁框根坐标 [262, 419, 40, 42]，输出倍率 6。已批准执行，可逆选择直接做，不使用git，不要自行启动代理。需要独立下钻时按同一工单备料、children.json后结束，让运行器启动。无进一步下钻则实际渲染并同倍率并排亲眼验收后写part.json与account.md。

渲染命令（仓库根执行）：
```sh
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park-spread-tree/render.mjs --scene preview.json --view view.json --out round0.png
```
先复制/组合父base.components和自己的components到本地preview.json用于上下文预览。附带baseline.png及baseline-compare.png仅为继承基线。
