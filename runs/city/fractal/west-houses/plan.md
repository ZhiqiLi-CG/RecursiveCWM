# west-houses 执行计划

采用 writing-plans 与 worldgen-techniques；执行授权来自本层已批准工单，禁止 git，不增加确认门。

- [x] 读取只读相机、manifest、接口和参考；亲眼查看 baseline-compare.png。
- [x] generate.py 输出本层宅地、短步道、灌木 local.json，并与父快照合成 preview.json。
- [x] 锁定视图渲染 round1.png，生成同倍率并排并亲眼检查。
- [x] 为 west-house-prototype 准备左下住宅目标、根坐标 view、brief、只读继承 manifest 和预览快照。
- [x] 验证目标裁切、相机哈希、几何 ID、渲染错误及写域；登记 children.json 后结束本会话。
- [x] 被运行器唤醒后接回原型，通过根世界平移实例化另外两栋并逐栋校轮廓、前廊和间距；需要时继续局部循环。
- [x] 终审整体同倍率图，写含子引用的 part.json 与最终 account.md。

设计：用实际世界平面和实体灌木构造自有环境；住宅屋顶、双老虎窗、烟囱、墙窗和廊柱属于原型子问题。原型只拥有左下第一栋房，不含宅地。相邻两栋约各平移根图 (+52,-26) 像素，最终依眼审调整。接回时保留首栋 child ID，复制实例采用 west-houses/ 前缀并声明来源，避免三栋重复装配。父快照仅用于预览。
