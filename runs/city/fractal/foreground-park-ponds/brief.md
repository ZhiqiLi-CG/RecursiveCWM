# foreground-park-ponds

求解两片不规则青绿色浅水池与各自上岸的小叶簇/灌木。上池根图约x257..329,y380..421，下池约x155..218,y430..473（部分被红树遮挡）。池边小叶簇分别约[294,377]与[192,429]。按目标精修非对称曲折轮廓、少量尖凹与圆角、无黑边的亮青绿水面，以及深绿和黄绿叶片；全部是真实根世界几何。水面略高于父草地，避免z-fighting，但不加矩形草地覆盖。所有大红树与绿树均由父层树原型实例化，不归你；不要把遮挡树的轮廓误做水池缺口，应合理补全被遮挡水岸。两池可以共享轮廓构造方法，但逐个并排检查。可直接求解此双池对象组，需要进一步独立局部循环再递归。

接口：只读 ../scene/interface.md 与 ../../camera-contract.json。本目标由 ../foreground-park/target.png 裁切等比放大；view.json 已复合为根图crop，禁止重新拟合相机。输出 part.json 使用 components，ID以本节点名/开头，附 camera_contract_sha256、children 和 child_refs。父层基线 ../scene/base.json 只供预览，不能放入最终组件；只写自身目录及明确声明的后代备料目录。

本子节点裁框根坐标 [150, 366, 185, 115]，输出倍率 4。已批准执行，可逆选择直接做，不使用git，不要自行启动代理。需要独立下钻时按同一工单备料、children.json后结束，让运行器启动。无进一步下钻则实际渲染并同倍率并排亲眼验收后写part.json与account.md。

渲染命令（仓库根执行）：
```sh
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park-ponds/render.mjs --scene preview.json --view view.json --out round0.png
```
先复制/组合父base.components和自己的components到本地preview.json用于上下文预览。附带baseline.png及baseline-compare.png仅为继承基线。
