# west-offices 本层轮次账

状态：本层完成。已接入 west-offices-annex 并完成本层再整体眼审；最终 part.json 包含89个本层组件及24个孩子组件，共113个，明确声明 children 与已展开的 child_refs。

只读继承：camera-contract.json SHA256 为 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c；本层视图 crop_px=[0,137,145,169]，580×676，根图4倍。manifest.json、view.json、target.png 与父快照均未修改。未使用 git，未启动代理。

本层产物：generate.py 参数化两栋办公塔楼（各六道突出楼板、内凹屋顶围边、基座入口与浅色窗）、本层灰紫地坪与宅地细边。owned.json 目前89个自有组件，不含任何附楼试验几何，不含父快照。preview.json 为父快照加本层几何，仅供渲染。

眼审记录：

1. baseline-compare.png：同为根图4倍，办公楼全部缺失；确定两塔、附楼、宅地为本层对象。
2. round1-compare.png：补入两塔、六层楼板、入口、宅地与初试附楼。楼脚与楼板节奏基本吻合；屋顶楼芯遮挡凹面、附楼尺寸偏大、宅地前缘偏低。
3. round2-compare.png：降低楼芯顶面、抬高屋顶，恢复深灰凹面；修正地坪前缘，补入口层斜向明暗。两塔轮廓和重复结构可保留。附楼缩小后仍存在露出范围问题。
4. round3-compare.png：尝试附楼较宽较高体块；露出屋顶与塔楼遮挡关系仍不吻合，且附楼顶面发生共面遮盖。该附楼试验已从当前生成器与 owned.json 移除，不作为完成结果保留。此前图只作轮次证据。
5. 子节点 baseline-compare.png：亲眼检查8倍同倍率并排，目标完整覆盖附楼及相邻塔楼遮挡；渲染上下文仅含父层塔楼与宅地，方便独立求解附楼。

下钻判断：两塔相同楼板结构可由本层参数化完成；附楼的窄露出屋顶、宽下部体块与遮挡关系经过局部尝试仍不稳定，需要独立取景循环。声明 west-offices-annex（深度3）。

子材料：../west-offices-annex/target.png 从本层目标 [0,324,168,620] 裁出并Lanczos放大2倍；view.json 根裁框 [0,218,42,74]，336×592，根图8倍；brief.md 给出所有权、根坐标相机接口与预览命令；manifest.json 固定目标和上下文版本；parent-context.json 为本层89个组件加父快照，排除附楼；附带渲染脚本和 baseline 图。

验证：三轮本层渲染与子基线 errors=[]；两塔当前参数保存在 generate.py。handoff-validation.json 记录哈希、尺寸、组件ID与上下文组成检查。指标未用于判断图像质量。

唤醒后：读取孩子 part.json，将其通过明确 child_refs 接入本层；重渲本层580×676并排检查附楼与塔楼的遮挡、脚线和地坪关系，再决定是否继续局部循环。完成整体眼审后才写本层 part.json。父级道路位置、旁边警局和紫顶住宅不在本节点最终几何内；预览缺失的兄弟建筑与主路边缘偏差交回上层整体整合。


## 孩子返回后的再整体与收官

收到 west-offices-annex/part.json 后读取其 account.md 和几何：24个自有组件，无孙节点。附楼使用上段收窄、下段斜向展开的实体剖面解释窄屋顶与宽下部轮廓；这是单视角重建假设，保留孩子账目中的不唯一性说明。没有改写孩子交付。

assemble.py 将 owned.json 的89个组件与孩子24个组件合成 candidate.json；child_refs 记录孩子路径、完整SHA256及 included_in_components=true。preview.json 另外加入只读 west-civic/base.json，仅供上下文渲染，根道路和其他非自有几何不进入最终组件。

第4轮（唤醒后）：重新渲染 resume-round4.png，并亲眼审视 resume-round4-compare.png，左右各580×676，根图4倍。两塔屋顶、六道楼板和基座关系保持；附楼窄凹屋顶被塔楼遮挡，宽下部墙体接近灰紫地坪，左缘继续自然出画。未见需要新子循环的明显裂缝、重复体块或连接中断，不再下钻。

保留余差：模型楼板、围边和窗比目标更锐利，局部明暗和屋顶遮挡没有逐像素重合。主路与地块之间仍有少量绿色间隙，属于父快照道路边界与宅地的整体关系，交回父层检查；邻接警局和紫顶住宅由各自节点供给，没有复制进本层组件。

完成验证：verify.py 检查相机、目标、manifest与继承父快照哈希，组件113个ID唯一，89+24恰好组成最终组件，孩子只展开一次，无根组件混入；坐标有限、箱体尺寸与三角索引合法；生成和装配脚本语法可解析；本次渲染 errors=[]。part.json 与经过眼审对应的 candidate.json 逐字节一致，详见 verification.json。

复现：先运行本目录 generate.py，再运行 assemble.py，然后使用 render.mjs --scene preview.json --view view.json --out resume-round4.png；compare.py resume-round4 生成同倍率并排。最终 part.json 作为完成标记交付。不新建调度清单；原子清单由运行器归档的状态保持。未使用git，未启动代理，写入只在 west-offices 本目录。
