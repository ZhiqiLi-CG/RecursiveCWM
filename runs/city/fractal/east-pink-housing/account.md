# east-pink-housing 本层轮次账

状态：完成。深度 2，无需新增子问题，part.json.children 为 []；空孩子清单已由运行器归档到 children.json.prev。最终 part.json 含 82 个自有组件；不含父层道路、基础草地、商店或紫顶住宅。所有组件采用根世界坐标与实有无纹理几何；generate.py 可重生成。

## 继承与约束

相机使用只读 ../../camera-contract.json，SHA256 为 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。view 为根图 crop_px=[410,72,154,110]，616×440，根图 4 倍；不重复叠加父偏移。target 与 manifest 摘要一致。父快照只在 preview.json 里拼接。没有使用 git；修改仅限本节点目录。

## 轮次

- 基线：亲眼检查 baseline-compare.png；住宅、宅地与植被均缺失，只有父层底图。
- round1：建立两栋住宅、凹入口墙体、交叉粉红屋顶、凸起天窗、门窗、宅地、入口步道与红树。眼审发现门窗落入墙内、树冠偏高且柱状。
- round2：检查窗面与墙面的有符号距离，定位到独立高度估计造成遮挡。将门窗沿相机射线投到其支承墙面；同倍率眼审发现叠层共面闪烁。
- round3：明确门框、门板、窗框与窗格的前后层次；加厚屋檐饰边，收回屋后裸露宅地尖角。门窗恢复，树冠仍尖锥。
- round4：红树改为圆钝核心及三层重叠叶冠。屋体投影基本稳定。
- round5：叶冠增加曲面分段，调整红树深浅和住宅粉顶、奶黄墙面的配色。并排目检两栋屋顶、窗格、入口与前庭。
- round6：单独校南侧较高红树的尺寸与落地位置，让树干落在灌木后。亲眼检查最终 round6-compare.png，接受本层整体关系后才生成 part.json。

## 最终眼审与限制

两栋住宅可分别辨认粉色主坡面、较浅右坡、暗红屋檐、凸起天窗、奶黄凹入入口、左门、正门和侧面三格紫窗。两栋错位、前庭与树木关系连续；宅地使用不规则斜向边界，未填满裁剪矩形。

目标中南树比北树更高，已分别处理。树冠仍是简化几何，细小分枝/轮廓和目标柔化边缘存在残差。目标的路沿和父层基线道路有偏移，预览有窄草带及局部道路空隙；属于父层整体整合项，没有用本层组件覆盖主路。左侧商店和右侧邻地在该父上下文中未装配，不计作本层对象遗漏。两栋住宅各保留两个可见入口的短步道。

## 验证与复现

- 最终渲染 616×440，固定根图 4 倍；目标与渲染均未独立缩放。
- 渲染无错误，含父上下文合计 4265 三角形；组件非空、ID 唯一、所有 ID 属本节点、父组件混入数量为 0。
- 校验目标摘要、相机摘要、三角形索引、有限坐标以及 preview=context+part；结果见 verification.json。
- 没有用像素指标代替目视裁决。

从仓库根运行：

```bash
python3 runs/pilot/city-full-recursive-r1/fractal/east-pink-housing/generate.py --final
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-pink-housing/render.mjs --scene preview.json --view view.json --out round6.png
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/east-pink-housing/compare.py round6
python3 scripts/check_part.py runs/pilot/city-full-recursive-r1/fractal/east-pink-housing/part.json
```


## 唤醒后的再整体：resume-round7

本次唤醒消息没有列出孩子名称。核对 children.json.prev=[]、part.json.children=[]、无 child_refs，确认本层没有实际子交付需要合入；未将其他节点误作孩子。保留 82 个自有组件，以当前只读父上下文重新组合 resume-preview.json，并按原 view 与相机渲染。

亲眼检查 resume-round7-compare.png：两栋住宅的错位间距、入口凹口、屋檐和天窗遮挡保持连续；南侧树干位于灌木后方，宅地与入口步道的连接保持上一轮结果。屋顶、窗格与植被的简化程度、父层路沿偏差仍按上文记录，没有新增必须独立求解的局部。

本次渲染无错误，输出 616×440，含上下文 4265 三角形；相机与 target 摘要一致，组件 ID 唯一且均为本节点所有，父上下文未进入 part。已重新写入 part.json 收官。无新 children.json；generate.py --final 仅生成最终组件，避免空孩子请求再次触发唤醒。最终证据更新为 resume-round7-compare.png，详细校验见 verification.json。
