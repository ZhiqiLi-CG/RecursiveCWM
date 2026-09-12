# west-offices — 深度2

重建左缘两栋灰色层叠办公高楼、最左被根画框截断的小附楼、楼下灰紫色地坪和贴楼细节。重点是前矮后高的轮廓、每层突出浅灰楼板、暗色内凹屋顶、底层立柱和少量浅色窗。大致建筑范围根图 x0..133,y137..293。左侧出画是原始构图，不得为了完整显示而移动楼。只拥有办公楼宅地；右下警局及广场归 west-police；左上露出的紫顶房归 north-housing。楼板重复可参数化，但若独立立面/小附楼仍值得单独求解，按工单备料下钻。

相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。所有几何使用根世界坐标；crop_px 是根图坐标，不是父图坐标。本目标从 west-civic/target.png 裁出，根裁框 [0, 137, 145, 169]，输出 580×676，根图4倍。

上下文快照 ../west-civic/base.json 只供预览，禁止并入最终 part。预览命令（仓库根运行）：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-offices/render.mjs --scene ../west-civic/base.json --view view.json --out baseline.png

实际迭代将自己的 components 与上述快照合为本目录 preview.json，使用 --scene preview.json。最终 part.json 按共享接口输出，仅包含自有几何和明确声明的孩子引用；ID 用本节点名前缀。先整体同倍率眼审，再直接修局部或为独立子问题备 target/view/brief 并写 children.json 后结束会话。由运行器启动孩子，不自行启动代理。孩子返回后再整体眼审，完成才写 part.json 与 account.md。

已批准执行，可逆选择直接做，不停门，禁止 git。写域仅本目录及自己声明孩子的准备材料。重叠裁图仅为上下文，不转移相邻对象所有权。禁止目标贴图。
