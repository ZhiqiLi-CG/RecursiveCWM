# west-shop 本层执行计划

已批准工单；按 writing-plans 整理，在本会话执行，不使用 git 或自行启动孩子。

- [x] 读取只读相机、manifest、共享接口，亲眼查看 baseline-compare.png。
- [x] 在 generate.mjs 参数化生成根世界坐标商店实体：墙体、屋面红框、青色玻璃、红白篷、几何字牌、停车场及自有车位线。
- [x] 写 candidate.json 与含父快照的 preview.json；用继承 render.mjs 渲染，生成 target 左/render 右同倍率比较，亲眼循环。
- [x] 验证零渲染错误、相机哈希、组件 ID 与所有权，写 account.md、children.json，最后落盘 part.json。

设计选择：规则店体使用 box，篷及弧顶牌使用真实三角面，SHOP 使用字体轮廓三角化，所有点采用统一世界坐标。无需贴图或独立孩子。若局部需要独立循环，则按工单备料并结束。
