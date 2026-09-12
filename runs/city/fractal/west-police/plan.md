# west-police 本层执行计划

目标：在锁定相机下重建警局与自有广场，用根图四倍的同倍率对照判断。
采用 writing-plans / executing-plans 的分步验证方式；已批准工单优先，不使用 git、不另派代理、不重复审批。

- [x] 读取材料、共享接口、只读相机并眼审 baseline-compare.png。
- [x] build_local.py 生成主楼、附翼、檐线、窗门、停机坪 H、POLICE 几何文字和广场；local.json 只存本层构件，preview.json 加只读父快照。
- [x] 用原 render.mjs 输出 round1.png 和同尺寸并排图，眼审轮廓、层高、立面与广场边界，修正明显残差后再次渲染。
- [x] 如发现需要独立循环的子部件，准备孩子 target/view/brief，写 children.json 后结束；否则以空 children 直接收官。
- [x] 检查 ID、几何数值、相机与 manifest 哈希、渲染错误及文件引用，写 account.md 和最终 part.json。

设计：主楼和附翼共享地坪但分别控制高度，主楼上下层紫蓝色立面配浅色窗带，奶黄檐条构成层次。屋顶用真实圆盘与 H 条形几何，招牌用竖直平面的字形几何。只读父快照用于上下文，不交付入 part。
