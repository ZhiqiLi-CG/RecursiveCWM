# foreground-park-red-tree

只求解图中这一棵红色分层树原型（前景最低的一棵），包括树冠、棕色树干和贴地小阴影。根图树干落地点约 [226,487]。冠约 x212..239,y430..470；四段锯齿式错落轮廓、顶部圆钝，左亮右暗的红色面。请通过真实三维分层/多边形树冠几何表达，不能仅画相机朝向的轮廓片。附近水池、绿草和其他树都是上下文，不归你。原型保留根世界坐标，交付 prototype_anchor_pixel=[226,487] 和 prototype_anchor_world（地面y=0）的元数据，方便父层平移复制为四棵；不要自己放其他红树。

接口：只读 ../scene/interface.md 与 ../../camera-contract.json。本目标由 ../foreground-park/target.png 裁切等比放大；view.json 已复合为根图crop，禁止重新拟合相机。输出 part.json 使用 components，ID以本节点名/开头，附 camera_contract_sha256、children 和 child_refs。父层基线 ../scene/base.json 只供预览，不能放入最终组件；只写自身目录及明确声明的后代备料目录。

本子节点裁框根坐标 [208, 426, 37, 65]，输出倍率 6。已批准执行，可逆选择直接做，不使用git，不要自行启动代理。需要独立下钻时按同一工单备料、children.json后结束，让运行器启动。无进一步下钻则实际渲染并同倍率并排亲眼验收后写part.json与account.md。

渲染命令（仓库根执行）：
```sh
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park-red-tree/render.mjs --scene preview.json --view view.json --out round0.png
```
先复制/组合父base.components和自己的components到本地preview.json用于上下文预览。附带baseline.png及baseline-compare.png仅为继承基线。
