# central-school 本轮方案与执行账

目标：在锁定相机下建立校地、树簇、前场铺地及喷泉，并拆分两个需要独立放大循环的建筑子问题。

约束：不使用 git；写入仅本节点及声明孩子的目录；根相机、manifest 和父快照只读。所有组件为真实世界坐标几何，禁止目标图贴图。子节点由运行器启动。

方案比较：整体粗建会丢失学校退台和楼层关系；一次手工精修全部建筑会绕过递归流程。采用本层处理街区关系，学校主体与双塔分别递归求解。

- [x] 读取接口、目标、相机，亲眼检查 574×436 同倍率 baseline-compare.png。
- [x] generate.py 输出 owned.json（本层校地/铺地/树/喷泉）与 preview.json（只读父快照+本层）。
- [x] render.mjs --scene preview.json --view view.json --out round1.png；生成同倍率 round1-compare.png 并亲眼复查。
- [x] prepare_children.py 从本层目标裁切放大到 school-main-building 与 school-tiered-towers；输出 view.json、brief.md、manifest.json、render.mjs、scene.js 和上下文。
- [x] 检查子图尺寸、相机摘要和声明；写 children.json 与 account.md，结束本轮，不写 part.json。

唤醒后：读取两个孩子的 part.json，去重扁平合并 owned.json+子组件，整体渲染与 target.png 并排检查连续性，修正后再写最终 part.json（显式 children/child_refs）。


2026-09-08 恢复轮（执行 existing plan，应用 executing-plans）：
- [x] 检查实际交付：两个孩子均无 part.json，不能据 .children_done 判断已完成。
- [x] 新渲染 resume-round3.png；亲眼检查 resume-round3-compare.png，同倍率 574×436。
- [x] 验证现有孩子裁图内容、尺寸、相机摘要、目标摘要、父快照摘要和辅助材料，保留已有只读 manifest。
- [x] 记录 account.md、handoff-validation.json，恢复 children.json 请求运行器执行这两个孩子，结束本轮。
- [ ] 孩子实际交付后，按上述合并流程做再整体并收官。


- [x] 两个孩子已返回并原位扁平合并。
- [x] integrated-round4/5 同倍率并排眼审；直接修树冠和塔后铺地。
- [x] 最终组件、相机、源图、子引用、上下文隔离与渲染验证通过。
- [x] account.md 更新，最终 part.json 交付，无新下钻。
