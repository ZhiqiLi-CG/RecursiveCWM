# west-offices-annex 本层轮次账

状态：本层完成；无独立孩子，原空清单已由运行器归档为 children.json.prev=[]。最终 part.json 为24个自有几何组件，children=[]、child_refs=[]。父层快照只用于 preview.json，不进入交付组件。

## 眼审与迭代

所有对照左右各336×592，均为根图8倍，裁框[0,218,42,74]。相机继承锁定契约，未拟合新相机。亲眼看过 baseline-compare.png、round1.png、round2-compare.png、round3-compare.png、round4-compare.png、final-compare.png。第1轮并排图另已保存，但该轮眼审使用渲染单图与已看过的同倍率目标；第2轮起均直接审视并排图。

| 轮次 | 眼睛判断及行动 | 全裁框RGB MAE，仅记录 |
|---|---|---:|
| 基线 | 附楼完全缺失，蓝道路和塔楼墙暴露在目标附楼区域 | 27.1469 |
| 1 | 建有体积的剖面墙、凹屋顶、围边、两窗与小门；下部展开正确，屋顶一向进深过大 | 18.3329 |
| 2 | 缩短上部进深，屋顶回到左缘小体量；窗和围边偏高 | 16.1366 |
| 3 | 降低围边/上部墙顶，压缩窗高并下移，缩窄门洞；屋顶后部凹面仍偏短 | 16.0904 |
| 4 | 延展屋顶后侧两向进深，由塔楼遮挡右部；保留下部墙体宽度，屋顶与墙体关系成立 | 14.5521 |
| 最终 | 围边前面改灰绿色，门洞顶上提；眼审认为局部明暗更贴近，虽全框指标略回升仍采用 | 14.6550 |

## 几何与连接

使用根世界坐标。墙体为沿z挤出的真实剖面：上段收窄、下段斜向展开，再接近地面的短直墙。前角地面投影约(21.5,284.5)，上部退后约15根像素；屋顶托盘、四面围边、内缘暗条均为几何。窗玻璃、暖色块、窗台、门阴影和门边为独立浅厚度箱体，无目标贴图。左边自然出画，没有为露完整而平移。

采用该剖面是单视角轮廓重建假设，参考图并不能唯一确定斜边究竟是实体斜墙还是投影阴影；最终是在锁定相机下能保留窄屋顶和宽下部轮廓的可编辑几何解释。屋顶向塔楼侧延展的一段由现有塔楼遮挡。不复制或改动塔楼、地坪、道路。没有值得另立目标图的局部子问题，因此未下钻。

## 余差与验证

最终并排确认附楼主体、屋顶凹面、浅窗、门洞与出画边界已建立。围边和窗口仍比模糊目标锐利；父层塔楼楼板与参考在邻接处有少量位置差，导致屋顶右后边露出关系并非逐像素相同。这些残差如实保留，没有修改上下文去遮掩。

最终渲染 final.png / final.render.json：336×592，WebGL errors=[]。verification.json 已检查相机完整SHA256一致、父快照哈希与manifest一致、preview恰为父组件+本层组件、24个ID唯一且均有本节点前缀、无父组件混入、箱体尺寸和三角索引有效、生成器语法有效。最终交付前对 part.json 与已审视 candidate.json 逐字节核验。

生成：python3 runs/pilot/city-full-recursive-r1/fractal/west-offices-annex/generate.py

渲染：.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-offices-annex/render.mjs --scene preview.json --view view.json --out final.png

仅在本节点目录写入。未运行git；未启动代理；相机、manifest、view、target及父快照保持只读。静态几何以真实渲染和接口检查验证，不新增软件单测。

## 唤醒后再整体

本次通知未列出孩子名称；核对运行器归档 children.json.prev=[]，现有 part.json 的 children 和 child_refs 也均为空，因此没有可接入的孩子，未虚构引用。

从交付 part.json 的24个自有组件重新与只读 parent-context.json 组装 resume-preview.json，重新渲染 resume-final.png，并亲眼审视 resume-final-compare.png（左右各336×592，根图8倍）。附楼左缘出画、屋顶与塔楼遮挡、斜向墙面到地面门洞的连接仍成立，无新增裂缝或重复几何；保留已记载的轮廓与锐度余差，不需要下钻。

新渲染 errors=[]，图像SHA256与上轮final.png一致。再次验证锁定相机、父快照、目标及manifest等输入哈希未变，预览恰为父组件加本层组件。更新account.md并重写本层part.json作为收官交付；不新建children.json调度清单。验证详见verification.json的resumed_whole_review。
