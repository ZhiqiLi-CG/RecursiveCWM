# north-housing 轮次账

状态：孩子已接入并完成本层再整体；本层收官，最终交付 part.json。

继承：manifest.json 与 camera-contract.json 保持只读；相机 SHA256 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。所有几何为根世界坐标。未使用 git，未启动代理。

## 整体与本层修正

- 继承 baseline、round0、round1 及 local 构建脚本；亲眼检查 target 与 round1-compare，主要缺失为四栋住宅；已有树冠过宽且矮树呈塔形。
- round2：缩小树冠、压扁灌木。亲眼检查同倍率树簇放大图，确认两棵矮树实际为横向错落枝冠。
- round3：两棵矮树分别改为六个错位扁树冠；后方高树保留四层塔形并修正高度、宽度。
- round4：抬高两棵矮树的最低冠层，使树干重新露出；亲眼检查 round4-compare.png（左右638×328、根图2倍）。绿地、四条短步道、矮灌木与三棵树保存在 local.json，共812个自有组件。树冠细节与草地边界留待房屋整合后再审；当前不能据此声称整区匹配完成。
- 执行环境：系统 python 不存在，系统 python3 无 Pillow；改用仓库 .venv/bin/python 后生成、裁图、并排均成功。round2 最终图已重新生成，不使用早期失败调用产生的旧预览。

## 下钻交接

children.json = ["north-housing-buildings"]。孩子拥有四栋建筑本体，父层保留宅地、独立步道、灌木与树。重复住宅的屋顶、老虎窗、烟囱、窗组、前廊值得独立目标与循环，当前不在父层硬补。

孩子材料：target.png 从本层目标裁 [12,12,458,302] 后等比放大2倍；根裁框 [54,16,223,145]，输出892×580、根图4倍。view.json、brief.md、manifest.json、render.mjs、scene.js、baseline.png 与 baseline-compare.png 已生成。孩子 baseline-compare 已亲眼检查，四栋目标均在框内。冻结上下文为本层 base.json，仅供预览，不能并入孩子最终组件。

## 验证与回收

round4 与孩子 baseline 渲染 errors=[]；目标与渲染尺寸相同；组件 ID 唯一且归属 north-housing；相机 SHA、孩子裁框倍率、目标 SHA、父快照 SHA 均断言通过。指标仅记录，不作为视觉验收阈值。

孩子返回后：读取 part.json 并验证哈希/归属；与本层 local.json 合成，声明 children 和 child_refs，若扁平合并则 included_in_components=true。重新渲染本层638×328整体，逐栋审屋顶/朝向/间距、前廊对步道、宅地后沿与树簇连续性；有残差直接修或继续下钻，最终通过眼审才写本层 part.json。


## 孩子返回后的再整体与收官

- round5：读取孩子最终 part.json，相机摘要一致。与本层812个自有组件及只读根基底组合，亲眼检查638×328、根图2倍并排图。四栋住宅的排布、朝向、屋顶和立面可接入；旧步道与门廊错开，地块后沿露出深绿尖角。
- round6：保持孩子240个组件的几何不变，在本层重接四条短步道。各步道从实际台阶投影位置沿根世界+x方向延伸至宅地临街边界，宽度保持一致。亲眼并排确认台阶—步道—临街边缘连续。
- round7：收窄宅地后沿，消除屋顶间的深绿尖角；临街边界保持原位置。亲眼检查 round7-compare.png，接受本层四房斜排、前廊步道关系、宅地和右端三株树簇，无需新的独立子问题。

最终 part.json 共1052个组件：本层812个、住宅孩子240个。孩子组件只重命名为 north-housing/buildings/... 并保留 source_id，实际几何与孩子交付逐项一致。children=["north-housing-buildings"]；child_refs记录交付文件SHA256并声明 included_in_components=true，根层不得重复装配孩子。未新增待运行孩子清单。

最终验证：round7渲染errors=[]；相机SHA、父快照版本、孩子交付SHA、组件ID唯一性与归属、孩子几何一致性、预览与交付几何一致性、所有数值有限、目标与渲染同尺寸均通过。详见verification.json。integrate.py从local.json和孩子part生成candidate与整体预览；finalize.py在验证后写part.json。build_local.py和本层base.json保留孩子继承的原始上下文，避免改变继承版本。

剩余视觉差异：屋檐、窗框、树冠具有比目标更锐利的多边形边缘；少量房屋细节位置和灌木轮廓仍有小幅差异，不声称逐像素一致。左下第一栋在此预览完整露出，目标中的灰高楼遮挡归west-civic，应由根层合并邻区恢复。道路宽度/标线以及其他裁框上下文归根层，不含于本层最终组件。

本次只写north-housing目录，没有改写孩子、父级、manifest或相机，没有使用git。
