# east-shop — depth 2

只拥有东北最左的红顶 SHOP 小商店（根图约 x360..417,y45..103），以及商店正下方的灰紫停车坪、白停车线。建立青绿玻璃、浅灰墙、红色檐边、深色平屋面、红白条纹遮雨棚和正面 SHOP 招牌，保持屋顶/招牌/雨棚遮挡关系。左边绿色树属于 north-housing；右侧两栋粉红顶房与深绿地块属于 east-pink-housing。商店坪终止于相邻住宅地块，主路白人行道由根层负责。招牌等若确需自己的目标与循环，再下钻。

目标由 ../east-district/target.png 裁出再等比放大2倍，根图范围 crop_px=[355, 38, 88, 86]，输出 352×344，相对根图4倍。view.json 中裁剪已经合成为根图坐标，禁止再次叠加父偏移。

阅读 ../scene/interface.md；../../camera-contract.json 与本 manifest 只读。所有实际几何采用根世界坐标。基线上下文 ../east-district/context.json 只用于预览，最终 part.json 不得包含其道路/草地组件。使用当前目录 render.mjs 和 scene.js；运行示例：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-shop/render.mjs --scene preview.json --view view.json --out round0.png

工单已批准，可逆选择直接执行，不停门，不使用 git。先对照同倍率 baseline-compare.png 与目标，局部几何渲染迭代后亲眼验。裁剪内其他对象只是上下文，不能抢邻居归属。仅写自己的 fractal/east-shop/；若递归备料可写自己声明的后代目录，不写父层/兄弟目录。值得独立求解的子问题按工单准备 target/view/brief 和 children.json 后结束会话，由运行器启动；不要自行 spawn。

完成时交 part.json（node、camera_contract_sha256、components、children、必要的 child_refs）和 account.md。自有组件 ID 以 east-shop/ 开头；聚合后代时保留其 ID 并注明 included_in_components=true 防重。维护可重生成的源脚本。最终视觉检查完成前不写 part.json。
