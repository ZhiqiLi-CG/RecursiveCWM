# east-pink-housing — depth 2

只拥有两栋斜向排列的粉红/红屋顶奶黄住宅（根图约 x415..546,y79..159）、两株房后红色层叠树、屋前矮灌木、深绿色宅地和两条浅色入口短步道。注意两栋的屋顶坡面、凸起天窗、门窗、奶黄正面/侧面明暗与错位间距。左上商店归 east-shop，右侧紫顶住宅归 east-purple-housing。地块边缘贴主路人行道，不覆盖路面，也不以整个裁剪矩形填地。原型可复用，但须分别眼审两栋投影及遮挡；确需独立局部循环再下钻。

目标由 ../east-district/target.png 裁出再等比放大2倍，根图范围 crop_px=[410, 72, 154, 110]，输出 616×440，相对根图4倍。view.json 中裁剪已经合成为根图坐标，禁止再次叠加父偏移。

阅读 ../scene/interface.md；../../camera-contract.json 与本 manifest 只读。所有实际几何采用根世界坐标。基线上下文 ../east-district/context.json 只用于预览，最终 part.json 不得包含其道路/草地组件。使用当前目录 render.mjs 和 scene.js；运行示例：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-pink-housing/render.mjs --scene preview.json --view view.json --out round0.png

工单已批准，可逆选择直接执行，不停门，不使用 git。先对照同倍率 baseline-compare.png 与目标，局部几何渲染迭代后亲眼验。裁剪内其他对象只是上下文，不能抢邻居归属。仅写自己的 fractal/east-pink-housing/；若递归备料可写自己声明的后代目录，不写父层/兄弟目录。值得独立求解的子问题按工单准备 target/view/brief 和 children.json 后结束会话，由运行器启动；不要自行 spawn。

完成时交 part.json（node、camera_contract_sha256、components、children、必要的 child_refs）和 account.md。自有组件 ID 以 east-pink-housing/ 开头；聚合后代时保留其 ID 并注明 included_in_components=true 防重。维护可重生成的源脚本。最终视觉检查完成前不写 part.json。
