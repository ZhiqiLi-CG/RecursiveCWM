# foreground-park-spread-tree 本层轮次账

状态：完成；深度 2；无需独立子问题，children=[]，child_refs=[]。

交付一棵横展绿树原型：短棕树干、六组上下错落的扁厚有机冠层、贴地小阴影。只包含本节点组件；父 scene/base.json 仅合入 preview.json 作为预览上下文。父层可围绕 prototype_anchor_world 平移和缩放复制。

- prototype_anchor_pixel = [282.5, 456]
- prototype_anchor_world = [2.8605504587155957, 0, 9.127217125382263]
- camera_contract_sha256 = 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c
- 目标/渲染均为 240×252；根裁框 [262,419,40,42]；倍率 6；全程继承锁定相机。

## 目视迭代

0. 亲眼查看 baseline-compare.png：基线只有草地，树缺失。目标由偏左小顶冠、上冠、中部左右冠、下部左右冠组成，厚边呈橄榄绿。
1. generate.py 生成实际三维多环冠层、树干、阴影，渲染 round1.png 并亲眼检查 round1-compare.png。错位关系成立，但各层偏厚，下冠过低、遮干过多，右中冠略宽，亮面偏黄。
2. 压薄各冠层，收右中冠、调整亮面绿度和树干棕色，缩小阴影。亲眼检查 round2-compare.png，露干长度与整体轮廓改善；左下冠和左中冠仍略低，阴影偏显眼。
3. 左下冠上提 1.1 根像素、左中冠上提 0.6 根像素，树干略收细、阴影减淡。亲眼检查 round3-compare.png，接受本层单树原型；六层高低关系、横向展开、短干与接地连续性可交由父层复制整合。

## 验证与剩余差异

validation.json 已记录：相机摘要一致、组件 ID 唯一且全以本节点名前缀、无父/兄弟组件、children/child_refs 为空、三角形索引有效、顶点有限、输出同尺寸、实际渲染无错误。锚点投影 [123,222]，浮点最大误差约 1.71e-13 输出像素，仅为坐标接口验证，不作为图像质量判定。

最终输出保留清晰网格边缘，目标因原图低分辨率放大更柔和；冠层外缘仍比目标略规则，侧壁色带略硬。邻近水池、草地配色与其他树属于父层或兄弟上下文，未纳入本组件。所有冠层均有三维厚度和封闭上下表面，无相机贴片、无目标贴图。

复现：仓库根执行 `python3 runs/pilot/city-full-recursive-r1/fractal/foreground-park-spread-tree/generate.py`，再执行 brief.md 的渲染命令（输出名可改为 round3.png）。生成器写 owned.json 与 preview.json；经视觉验收后 owned.json 原样交付为 part.json。未使用 git，未启动代理，未改动只读相机、manifest 或其他节点。

## 唤醒后的再整体验收

本次唤醒消息未列出孩子路径；核实 children.json.prev=[]、既有 part.json 的 children=[] / child_refs=[]，本层没有待接入孩子。未从兄弟节点引入组件。

从已交付 part.json 的 1451 个本层组件与只读 scene/base.json 重建 preview.json，重新实际渲染 reintegration.png。亲眼查看 reintegration-compare.png：左右各 240×252、同为 6 倍、根裁框 [262,419,40,42]，没有分别缩放。顶冠偏左、六组厚冠横向错落、下冠与短棕干的遮挡、树根与小阴影关系连续；接受现有单树原型，不新增下钻。目标边缘更柔，渲染冠缘更规则、侧壁色带偏硬；这些残差保留。水池和草地差异仍属父层上下文。

新鲜验证已通过：相机与 manifest 摘要未变，所有组件 ID 唯一且属于本节点，三角索引与顶点有效，目标和渲染尺寸一致，渲染 errors=[]；锚点投影最大误差约 1.71e-13 输出像素，仅验证接口。几何与 owned.json 完全一致，恢复空 children.json 并重新写入 part.json。证据与结果见 reintegration-compare.png、reintegration.render.json、validation.json。

拼图时系统 python3 缺少 Pillow，改用仓库 .venv/bin/python 成功生成；没有安装依赖。全轮未使用 git、未启动代理、只写本节点目录。

## 第二次唤醒复核

本次消息仍未提供孩子路径；children.json.prev 与交付内 children/child_refs 均为空，无孩子可接入。从当前 part.json 重建本层预览并实际渲染 reintegration-check2.png，亲眼检查 reintegration-check2-compare.png（左右各 240×252，同为 6 倍）。冠层错位、露干和接地关系保持连续，接受当前原型；冠缘规则和侧壁色带偏硬的差异仍保留，无需下钻。新渲染与上次像素一致：True。相机摘要、组件唯一性和归属、三角索引、有限顶点、输出尺寸与渲染无错误均已重新检查。更新 validation.json 与本账后重新落盘 part.json，几何未改动。未使用 git、未启动代理，只写本节点目录。
