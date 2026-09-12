# east-hospital — depth 2

只拥有右中医院白/奶黄色高低组合体（根图约 x657..737,y218..312）、高部正面的红十字、左低部的红色侧盒及浅蓝小窗、门口和浅色平屋顶内凹；同时拥有医院紧邻的灰紫地坪与白边。注意高低体量左右关系、立面朝向、红十字形状与位置。裁剪左侧薄荷绿学校塔楼和它们的基座归 central-school，右上青绿塔楼与树归 east-teal-towers。医院地坪只画参考中的医院所在小街块，避免吞并学校基座；所有主路、黄线、斑马线归根层。红十字可用参数化盒/面几何，不用参考纹理。

目标由 ../east-district/target.png 裁出再等比放大2倍，根图范围 crop_px=[620, 207, 170, 123]，输出 680×492，相对根图4倍。view.json 中裁剪已经合成为根图坐标，禁止再次叠加父偏移。

阅读 ../scene/interface.md；../../camera-contract.json 与本 manifest 只读。所有实际几何采用根世界坐标。基线上下文 ../east-district/context.json 只用于预览，最终 part.json 不得包含其道路/草地组件。使用当前目录 render.mjs 和 scene.js；运行示例：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-hospital/render.mjs --scene preview.json --view view.json --out round0.png

工单已批准，可逆选择直接执行，不停门，不使用 git。先对照同倍率 baseline-compare.png 与目标，局部几何渲染迭代后亲眼验。裁剪内其他对象只是上下文，不能抢邻居归属。仅写自己的 fractal/east-hospital/；若递归备料可写自己声明的后代目录，不写父层/兄弟目录。值得独立求解的子问题按工单准备 target/view/brief 和 children.json 后结束会话，由运行器启动；不要自行 spawn。

完成时交 part.json（node、camera_contract_sha256、components、children、必要的 child_refs）和 account.md。自有组件 ID 以 east-hospital/ 开头；聚合后代时保留其 ID 并注明 included_in_components=true 防重。维护可重生成的源脚本。最终视觉检查完成前不写 part.json。
