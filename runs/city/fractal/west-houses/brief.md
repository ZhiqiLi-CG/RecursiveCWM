# west-houses — 深度2

重建中央从左下到右上斜排的三栋紫屋顶奶黄色住宅、各自绿宅地、门前短灰步道和小灌木。建筑大致 x211..375,y171..281；注意每栋屋顶两个黄色老虎窗、紫檐、烟囱、侧面竖窗、正面浅色窗框与紫色前廊细柱。可建立一个实际三维原型然后逐栋调整，保持数量三栋。这不是 north-housing 负责的左上另一排四栋房。红顶 SHOP 及停车场归 west-shop，不要把商店遮挡处重复建成外露地坪；学校旁绿树、前景红树与道路均不归本节点。若房屋原型或立面仍需自己的目标和循环，继续按统一工单下钻。

相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。所有几何使用根世界坐标；crop_px 是根图坐标，不是父图坐标。本目标从 west-civic/target.png 裁出，根裁框 [207, 168, 181, 133]，输出 724×532，根图4倍。

上下文快照 ../west-civic/base.json 只供预览，禁止并入最终 part。预览命令（仓库根运行）：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-houses/render.mjs --scene ../west-civic/base.json --view view.json --out baseline.png

实际迭代将自己的 components 与上述快照合为本目录 preview.json，使用 --scene preview.json。最终 part.json 按共享接口输出，仅包含自有几何和明确声明的孩子引用；ID 用本节点名前缀。先整体同倍率眼审，再直接修局部或为独立子问题备 target/view/brief 并写 children.json 后结束会话。由运行器启动孩子，不自行启动代理。孩子返回后再整体眼审，完成才写 part.json 与 account.md。

已批准执行，可逆选择直接做，不停门，禁止 git。写域仅本目录及自己声明孩子的准备材料。重叠裁图仅为上下文，不转移相邻对象所有权。禁止目标贴图。
