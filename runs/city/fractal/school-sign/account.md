# school-sign 本层轮次账

本层完成学校屋顶深棕招牌与白色 SCHOOL 六字母。无需下钻，children=[]。所有输出均在 school-sign/；没有使用 git、代理或参考纹理。

## 继承与产物

- 取景：根图 crop_px=[441,200,54,47]；目标、每次渲染均为 864×752，即 16 倍，并排单侧倍率相同。
- 相机摘要：07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c；未重标定。
- parent-context.json 保留父 round4 的 435 个只读上下文组件。preview.json 仅为这些组件加本层 7 个组件。
- 最终 part.json 只含本节点牌体和六字母；一个有顶面、侧面、正面的薄盒体，六个从本地 Helvetiker regular 轮廓挤出的三角网格。字孔保留，挤出深度 .005，不含图片或纹理。
- 参数和生成器：parameters.json、generate.mjs；前两轮参数保存在 parameters-round1.json、parameters-round2.json。重放旧参数时应使用副本，勿覆盖最终 parameters.json。

## 逐轮眼审

0. 亲眼查看 baseline-compare.png：父屋顶完整，但招牌与文字全缺失。目标深棕牌沿 x 方向向右下投影，白字占据中部，下沿靠近屋面。
1. round1-compare.png：加入牌体和字形，整体横向跨度接近。字高偏大、字顶偏高，向右的字基线与目标逐渐偏离；顶边厚度偏重。保持相机，用参数修正本组件。
2. round2-compare.png：牌厚 .045→.025，牌面边界轻微收窄；字高 .222→.182，字底设为 1.665，并沿 x 以 -.041 的 y 斜率调整。亲眼看到基线、字高已更接近目标，C/H 略偏右，部分字宽仍可缩小。
3. final-compare.png：逐字设定 x 偏移，收窄 S/C/第二个 O/L。最终亲眼检查同倍率并排，保留此版；六字母排列、透视、牌面留白和落脚关系在本层收敛。

## 判定依据与剩余差异

以并排眼审为准。辅助观察仅记录目标白字在消除相机 x 投影斜率后，其字顶/字底仍向右下移，据此调整真实字形顶点，未改相机、渲染器或参考。

字形不是参考的精确字体复刻，S/C 曲线与笔画仍有小差异。参考原图的低分辨率和插值导致模糊；本层几何渲染轮廓更锐利，未用模糊后处理伪造一致性。父屋顶、檐口、远处道路及植被在此放大视图中仍有残差，这些保留在父上下文中，不计作本层已修复内容。牌底 y=1.567 比父屋面 y=1.556 高 .011，约 0.39 根像素，视觉上接触，不增加多余支架。

## 验证

final.render.json：864×752，view=[441,200,54,47]，WebGL/页面错误为零。
validation.json：7 个归属正确且唯一的组件；三角网格索引与有限坐标有效；预览精确等于父上下文加本层组件；camera、target 和 parent-context 摘要与只读继承记录一致。part.json 不包含父组件，也无重复装配子引用。

复现命令（仓库根）：

```sh
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/school-sign/generate.mjs
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/school-sign/render.mjs --scene preview.json --view view.json --out final.png
```

主眼审证据：final-compare.png；此前证据：baseline-compare.png、round1-compare.png、round2-compare.png。

## 唤醒后再整体复核

本次唤醒未给出具体孩子路径。磁盘 children.json 已移为 children.json.prev，内容为 []，part.json 的 children 与 child_refs 也为空；本层没有待接入子组件。依据实际引用，从已交付 part.json 的 7 个组件与继承父快照的 435 个组件重建 resume-preview.json。未从其他节点任意引入几何。

重新渲染 resume-whole.png 并亲眼检查 resume-whole-compare.png，两侧均为 864×752、16 倍。牌体与屋面、字形与牌面之间的连续性保持前轮结果；没有新增穿插或重复组件。已知字体轮廓和背景差异仍如上记录，无需继续下钻。

resume-validation.json 验证相机、目标和父快照摘要一致，渲染错误为零，复核图像像素与 final.png 完全一致。更新 part.json 的复核证据并再次收官。无需下钻，因此本次不另建 children.json 调度清单；最终 children=[] 保留于 part.json。
