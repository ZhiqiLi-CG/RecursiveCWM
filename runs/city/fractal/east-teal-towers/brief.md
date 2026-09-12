# east-teal-towers — depth 2

只拥有最右三栋青绿色层叠高楼（根图约 x731..899,y108..287）、三株楼前大型绿色锥形分层树（第一株约 x724,y218，后两株沿道路向右下递进）、树干，以及塔楼群的整片灰紫色地坪，含最右延伸到画面 x941 附近的坪。逐栋检查高度、层数、楼板厚度、层间暗条、屋面深色内凹与亮青边框、底层白色门窗；勿以单色实心盒替代层叠轮廓。左边紫顶房及其宅地归 east-purple-housing，医院在路对面归 east-hospital。地坪前沿应跟随参考路边，远端边缘按参考收束。三塔与三树是一个有重复和遮挡关系的组；细部若需要自己的目标和循环再下钻。

目标由 ../east-district/target.png 裁出再等比放大2倍，根图范围 crop_px=[704, 101, 237, 202]，输出 948×808，相对根图4倍。view.json 中裁剪已经合成为根图坐标，禁止再次叠加父偏移。

阅读 ../scene/interface.md；../../camera-contract.json 与本 manifest 只读。所有实际几何采用根世界坐标。基线上下文 ../east-district/context.json 只用于预览，最终 part.json 不得包含其道路/草地组件。使用当前目录 render.mjs 和 scene.js；运行示例：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-teal-towers/render.mjs --scene preview.json --view view.json --out round0.png

工单已批准，可逆选择直接执行，不停门，不使用 git。先对照同倍率 baseline-compare.png 与目标，局部几何渲染迭代后亲眼验。裁剪内其他对象只是上下文，不能抢邻居归属。仅写自己的 fractal/east-teal-towers/；若递归备料可写自己声明的后代目录，不写父层/兄弟目录。值得独立求解的子问题按工单准备 target/view/brief 和 children.json 后结束会话，由运行器启动；不要自行 spawn。

完成时交 part.json（node、camera_contract_sha256、components、children、必要的 child_refs）和 account.md。自有组件 ID 以 east-teal-towers/ 开头；聚合后代时保留其 ID 并注明 included_in_components=true 防重。维护可重生成的源脚本。最终视觉检查完成前不写 part.json。
