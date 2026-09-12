# 四栋住宅执行计划

已批准工单；本地串行执行，禁止 git、禁止自行启动代理。

- [x] 读取冻结相机、父快照、取景及接口，亲眼检查同倍率基线。
- [x] 用根世界坐标建立四栋重复住宅，包含墙面、折角屋顶、两个老虎窗、烟囱、门窗、前廊。
- [x] 生成 preview.json，固定相机渲染；与892×580目标并排，按眼审修正。
- [x] 检查四栋/八个老虎窗、ID归属、相机摘要、无父几何混入，记录残差。
- [x] 写 part.json（children为空）与 account.md。

文件：build.py 是几何生成器；candidate.json 是待眼审自有组件；preview.json 合并只读父快照；round*.png 与 compare*.png 为证据。最终仅 part.json 进入父组件。
