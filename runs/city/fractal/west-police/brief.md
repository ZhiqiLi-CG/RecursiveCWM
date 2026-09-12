# west-police — 深度2

重建左下紫蓝色 POLICE 警局整体：主楼与左侧较低附翼、奶黄色檐线、浅色二层窗带、蓝色立面窗门、屋顶灰色停机坪和 H、竖立 POLICE 招牌，以及其右侧相连的空灰紫广场。警局主体约根图 x89..180,y250..341。广场延伸到约 x240，与住宅宅地边缘斜向衔接。不要覆盖办公楼地坪、住宅绿地或主道路；不制作前景树、主路斑马线。文字与屋顶标志要用几何参数表达，不得把目标图贴在模型上；值得独立求解的招牌可继续下钻。

相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。所有几何使用根世界坐标；crop_px 是根图坐标，不是父图坐标。本目标从 west-civic/target.png 裁出，根裁框 [87, 245, 159, 105]，输出 636×420，根图4倍。

上下文快照 ../west-civic/base.json 只供预览，禁止并入最终 part。预览命令（仓库根运行）：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-police/render.mjs --scene ../west-civic/base.json --view view.json --out baseline.png

实际迭代将自己的 components 与上述快照合为本目录 preview.json，使用 --scene preview.json。最终 part.json 按共享接口输出，仅包含自有几何和明确声明的孩子引用；ID 用本节点名前缀。先整体同倍率眼审，再直接修局部或为独立子问题备 target/view/brief 并写 children.json 后结束会话。由运行器启动孩子，不自行启动代理。孩子返回后再整体眼审，完成才写 part.json 与 account.md。

已批准执行，可逆选择直接做，不停门，禁止 git。写域仅本目录及自己声明孩子的准备材料。重叠裁图仅为上下文，不转移相邻对象所有权。禁止目标贴图。
