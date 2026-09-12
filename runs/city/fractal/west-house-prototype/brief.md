# west-house-prototype — 深度3

独立求解三栋住宅中的左下第一栋，作为可复用的实际三维原型。只建这一栋：紫色双坡屋顶、两只奶黄老虎窗及其深紫小顶、后方烟囱、奶黄色主体、左侧两个狭长竖窗、正面浅窗框横窗、暗门洞、右前凸出的紫顶前廊及紫色台基、细廊柱。目标屋顶约根图 x211..269,y225..261；墙脚约 x213..248,y271..281；前廊约 x245..266,y262..277。按目标亲眼确定，不将这些粗框当硬指标。

本层输出仅含这栋房的几何，不含草地、步道、灌木、街道、第二栋房或商店。父 west-houses 已负责宅地。重叠裁图中的右上第二栋及周边仅为上下文。不要为了避开裁框而移动房。禁止目标贴图，使用实际 3D 体块与几何细节。

共享接口 ../scene/interface.md；相机 ../../camera-contract.json 和 manifest.json 只读。使用根世界坐标和本层 view.json 的根裁框 [209,222,66,64]，输出 792×768（根图12倍）。目标从父 target.png 的 [8,216,272,472] 裁出再放大，禁止独立重标定相机。

父上下文快照 ../west-houses/base.json 只供预览，禁止并入 part.json。本层原型返回后，父层会保留原型并复制世界坐标几何到另两栋（根图大致每次 +52,-26 像素），因此请保留易用的参数化生成脚本和每栋原型中心/参考锚点说明；不要自己生成第二第三栋。

初始预览（仓库根运行）：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-house-prototype/render.mjs --scene ../west-houses/base.json --view view.json --out baseline.png

迭代时在自己目录合成 preview.json=父快照 components+自己的 components，然后 --scene preview.json。同倍率并排 target 与 render，亲眼判残差。若仍有值得独立求解的部件，按统一工单在 fractal/<新子名>/ 备 target/view/brief，登记 children.json 后结束，由运行器启动，禁止自行启动代理。

收官按共享接口写 part.json：node、camera_contract_sha256、非空 components（ID 前缀 west-house-prototype/）、children 及适用的 child_refs；保留 generator 和 account.md。只拥有本目录写域及声明孩子的备料。已批准执行，可逆选择直接做，不停门，禁止 git。
