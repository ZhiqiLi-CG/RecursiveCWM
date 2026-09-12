# school-sign 执行方案

目标：锁定相机下恢复深棕薄牌及 SCHOOL 白色真实字形几何，只输出本节点组件。

方案：牌体使用有厚度盒体；字形用本地 Helvetiker regular 轮廓挤出，分别控制六字母横向尺度与间距。比手工折线更保留 S/C/O 曲线；无需纹理。根坐标、父快照和相机不变。

- [x] 阅读接口、取景、快照与目标；亲眼查看 baseline-compare.png。
- [x] generate.mjs 生成 candidate.json 和带只读父背景的 preview.json。
- [x] 原取景渲染，864×752 对 864×752 并排眼审，按残差迭代。
- [x] 校验组件范围、唯一 id、相机摘要、渲染错误及父快照摘要。
- [x] 写 account.md、children.json=[]，最后落盘 part.json。

执行方式：依照已批准工单在本会话直接执行；不使用 git，不启动代理，不追加审批。字形和牌体是本节点同一小组件，预期不需再下钻。
