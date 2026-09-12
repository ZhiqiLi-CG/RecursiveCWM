# west-houses 轮次账

状态：等待运行器求解 west-house-prototype；本层尚未完成，不写 part.json。

## 整体 0
亲眼查看 baseline-compare.png（左右均 724×532，根图4倍）。显眼残差为三栋住宅及绿宅地完全缺失；原图同一原型包含双老虎窗、紫檐、烟囱、窗框和细柱前廊，适合独立原型循环。

## 本层直接修 1
用 generate.py 创建根世界坐标宅地平面、三条短步道、六簇低矮灌木，共28个自有组件，保存 local.json。preview.json/base.json 为父 west-civic/base.json 的258个上下文组件与自有组件合成，共286个。父快照不属于最终组件。

亲眼查看 round1-compare.png：宅地斜向关系建立，但灌木偏高，步道距离前界有缝。此时建筑未生成，不能据此判房屋与地坪连续性。

## 本层直接修 2
压低灌木高度，并延伸短步道到前侧宅地边缘。渲染 round2.png 并亲眼查看 round2-compare.png，左右均724×532，根图4倍。低矮灌木与步道终点较第一轮接近目标；草地边界和建筑遮挡仍需在三栋房齐备后整体复核。预览缺失商店和停车场属于兄弟节点的上下文缺失，不在本节点补建。宅地远侧与街道仍有继承地坪的狭窄空隙，接回住宅后评估可见程度，必要时由父整合道路边缘。

## 下钻交接
west-house-prototype：只求左下第一栋住宅，保留参数化实际三维生成器，不拥有绿地、步道或灌木。目标从本 target.png 的 [8,216,272,472] 裁出，以 Lanczos 放大到792×768；根 crop=[209,222,66,64]，12倍。已亲眼查看 child target 与 baseline-compare.png。manifest 锁定相机及本层 base.json 快照。孩子已具备 target/view/brief/manifest、渲染器、同倍率 baseline；由运行器启动，不自行派代理。

接回：保留孩子首栋，另外两栋初始根像素平移约(+52,-26)、(+104,-52)。相机公式换算世界平移；不可将裁图坐标当世界坐标。每栋须逐一调整，再比较本层整体。父实例 ID 用 west-houses/，原型来源声明清楚。最终 part.json 只包含本层自有几何与孩子几何，并声明 child_refs included_in_components=true（如果展开整合）。

## 检查记录
round1 与 round2 WebGL errors=[]；round2 报告36 meshes、1808 triangles。子基线 errors=[]，36 meshes、992 triangles（裁切视图剔除结果）。父子视图相机 SHA256 均为07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。指标仅记录，不作为完成依据。JSON、裁图重现、ID和快照检查见 preparation-checks.json。

仅写本层目录及新孩子准备目录。未运行 git。环境自带 python3 无 Pillow，图像裁切与并排使用仓库 .venv/bin/python；没有改动依赖。

## 孩子返回后的再整体 3

已接入 west-house-prototype/part.json 的44个实际三维组件。assemble.py 深拷贝孩子几何，保留第一栋原 ID，另两栋使用 west-houses/house-2/ 与 west-houses/house-3/ 前缀，按相机的根像素到世界坐标关系平移，未改动孩子文件。

初始偏移为根像素 (+52,-26)、(+104,-52)。与自有28个宅地/步道/灌木组件合成160个交付组件。预览额外使用父快照和已交付 west-shop 的62个组件，仅用于检查第二栋门前遮挡和宅地关系；商店不进入本层交付。context-sources.json 记录读取来源和哈希。

亲眼查看 round3-compare.png（两侧724×532、根图4倍）：数量三栋正确，屋顶和双老虎窗重复关系成立；后两栋略偏右。第一栋原型保留，未为整排统一性重新改写已交付孩子。

## 再整体 4：最终眼审

将第二、第三栋根像素偏移改为 (+51,-25.5)、(+102.5,-51)，对应本层显示坐标 (+204,-102)、(+410,-204)。同步移动各自步道与灌木。以锁定 view 渲染 round4.png，亲眼查看 round4-compare.png，左右等大同倍率。

接受三栋房屋数量、斜向间距、屋顶/前廊轮廓关系、步道与平台接触和绿宅地边缘。第二栋步道被商店遮挡，第三栋步道通向宅地前缘；没有额外增建商店地坪。无需新子问题。

剩余差异：原型屋檐、烟囱和窗框仍有小幅比例/位置差异，几何边缘比源图清晰，灌木较简化。当前上下文主路/人行道和兄弟商店停车区与参考的衔接尚有差异，交由父层整体收关系；没有把这些道路或停车区并入本层来掩盖残差。不宣称像素精确匹配。

## 最终交付

part.json 共160个组件：28个本层环境组件、44个孩子原型组件和88个本层复制组件。children=['west-house-prototype']；child_refs 记录原型文件及 SHA256，included_in_components=true，父装配不得再次追加孩子。instances 记录三个实例的来源与最终平移。生成步骤依次为 python3 generate.py、python3 assemble.py；二者只生成中间文件，最终 part.json 是终审后的 candidate.json 副本。

最后的 round4 渲染无浏览器错误，724×532，110个批次/网格、2837个三角形（含父及商店上下文）。检查结果见 verification.json：相机契约、源图及父子继承快照哈希一致；160个 ID 唯一；孩子组件恰好包含一次；三实例各44个组件；最终组件不含父基底及商店；最终候选与已渲染组件相同。指标仅记账，完成依据是上述亲眼整体复核。

最终状态：本层完成。未新增 children.json（运行器已将已处理列表移为 children.json.prev）；part.json 内保留已完成孩子引用。全程未使用 git，写入仅发生在 west-houses/。
