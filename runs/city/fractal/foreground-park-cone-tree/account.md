# foreground-park-cone-tree 本层轮次账

完成范围：一棵可由父层复制的四层绿色截锥树；短棕树干、四层带斜肩与底沿的实体树冠、贴地小阴影。无独立子问题，children 与 child_refs 为空。只写本节点目录，未使用 git 或自行启动代理。

## 继承与交付

- 相机契约 SHA256：`07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c`，从读取到最终校验保持一致。
- 继承根图裁框 `[167,349,36,50]`，输出 `[216,300]`，统一倍率 6。每张并排图左右图像均为 216×300，标题不进入图像内容。不重拟相机。
- 根像素锚点 `[185,395]`；地面世界锚点 `[-0.629892966360857,0,8.88677370030581]`。最终预览实际投影为 `[108,276]`，与本层期望一致（浮点误差约 1e-12 像素）。
- `generate.py` 是几何参数来源；`owned.json` 是交付候选；`preview.json` 加入只读父 base 供上下文预览。`part.json` 只含本节点 424 个组件，无父组件或背景。
- `scene.js` 与 `render.mjs` 沿用继承版本。所有冠层均为封闭分面实体；使用根世界坐标的椭圆平面截面，沿视线方向厚度为横向的 0.5。树干厚度比例 0.45。无需材质贴图。

## 目视循环

| 轮次 | 同倍率证据 | 目视判断与后续动作 |
|---|---|---|
| 基线 | baseline-compare.png | 父预览只有草地/道路，树缺失。确认本层对象范围。 |
| 1 | round1-compare.png | 四层完整但顶面椭圆过深，树整体显得过高。压缩冠层沿视线方向厚度，重排高度。 |
| 2 | round2-compare.png | 顶、底轮廓趋近目标，但最低两层之间露出树干，几何未接合。修正层间高度连接。 |
| 3 | round3-compare.png | 消除露干；水平顶面只形成细线，目标有更宽的黄绿亮带。改成独立上收斜肩。 |
| 4 | round4-compare.png | 斜肩形成宽亮带，底冠与中冠关系改善；最高两层侧面仍偏高。缩短上部层高。 |
| 5 | round5-compare.png | 四层阶梯与冠顶、冠底基本吻合；树干色偏黄，脚部圆截面投影略长。调棕色分面、树干厚度。 |
| 6 | round6-compare.png | 最终亲眼验收：四层比例、亮顶与暗侧、短树干、接地小影符合本层主要特征。 |

目视残差：参考为放大的低分辨率图，轮廓和色界较柔；渲染保留硬几何边缘，未后处理模糊。目标冠中心比本组件约偏左半个根像素；保持明确约定的复制锚点。背景道路边界与参考有残差，由父层处理。冠层并非精确像素复刻，但没有需要独立循环的子对象。

## 验证

最终渲染 `round6.render.json`：216×300，浏览器 errors=[]；预览共 2291 三角形（含父背景），锁定相机位置与裁框一致。已核对组件非空、ID 唯一且均以本节点名开头、几何数值有限、世界锚点 y=0、父 base 组件未混入交付。指标只作为记录，验收依据是实际查看 round6-compare.png。

重现命令（仓库根）：
```sh
python3 runs/pilot/city-full-recursive-r1/fractal/foreground-park-cone-tree/generate.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/foreground-park-cone-tree/render.mjs --scene preview.json --view view.json --out round6.png
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/foreground-park-cone-tree/compare.py round6
```

## 唤醒后再整体复核

本次唤醒未指定孩子名称；实际读取 `children.json.prev=[]` 及交付的 `children=[]`、`child_refs=[]`，确认本层无孩子需要接入，不引入兄弟节点组件。

从实际 `part.json` 的 424 个自有组件与只读 `../scene/base.json` 重建 `recheck-preview.json`，重新运行锁定相机渲染，生成 `recheck.png` 和 `recheck-compare.png`。左右均为 216×300、6 倍率，已亲眼复核：四层树冠顺次衔接，亮肩与暗侧清晰，短棕树干接地，无层间露干或新的连续性问题；保留前述硬边缘、约半根像素横向差异及父背景残差。无需继续下钻。

新鲜验证通过：相机文件 SHA256 与 manifest/view/part/render 四处一致；424 个 ID 唯一、前缀正确、无父组件混入；数值有限；复制锚点地面 y=0，投影 [108,276] 误差小于 1e-8 像素；渲染 errors=[]，2291 三角形含预览背景。恢复 `children.json=[]`，更新交付目视证据后再次落盘 `part.json`。本次没有改变几何。

## 第二次唤醒复核

再次确认：运行器保留的 children.json.prev 为 []，part 的 children 和 child_refs 也均为空，没有新增孩子交付需要集成。从当前 part 与父 base 重建预览，实际渲染 recheck2.png，并亲眼查看 recheck2-compare.png（左右同为 216×300、6 倍率）。四层冠之间衔接正常，树干和脚部阴影连续；参考柔边与渲染硬边、背景道路差异仍如前述，无新增残差需要下钻。几何保持不变。

新鲜检查通过：424 个唯一自有组件且不混入父组件，相机 SHA 在 manifest/view/part/render 一致，渲染 errors=[]，锚点投影误差小于 1e-8 像素。无需新孩子，因此不生成新的 children.json 调度请求；最终 part 内 children=[]、child_refs=[]。再次写出 part.json 完成本层。
