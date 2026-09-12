# west-offices 本层执行方案

已批准工单；本会话内执行，可逆参数直接决定，禁止 git。写域只在 west-offices，必要时只为声明孩子备料。

目标：按锁定正交相机重建两栋灰色层叠办公楼、左缘截断小附楼及灰紫宅地。

设计：采用根世界坐标的真实 box / polygon / triangles 几何。两塔共用可调楼板、内凹屋顶、基座柱和窗的参数化生成器。保留原始出画关系。相较逐面手工多边形，共用生成器能保持重复节奏；相较现在下钻，两楼结构足够简单，先在本层完成一次整体循环后决定。

- [x] 读取只读 brief/view/manifest/camera 和共享接口，眼审 baseline-compare。
- [x] generate.py 输出 owned.json 和含父快照的 preview.json；用目标屋顶、楼脚角点推导尺寸与高度。
- [x] render.mjs 输出 round1.png；生成 target 与 render 同为 580×676 的并排图并亲眼检查。
- [x] 按轮廓、楼板间隔、屋顶凹陷、立柱窗和宅地边界继续迭代；若出现需要独立求解对象，备料下钻并结束。
- [x] 最终整体眼审后写 part.json（只含本层 components，children=[]）和 account.md；校验 ID、相机哈希、有限坐标、无上下文混入及渲染错误。

证据保存于本目录；指标只记录，目视判断优先。最终组件为普通接口几何，无目标贴图。

当前检查点：三轮后备料 west-offices-annex；待孩子返回再执行最终整合与交付。

收官：west-offices-annex 已接入，第4轮再整体眼审通过；113组件与明确孩子引用完成交付。
