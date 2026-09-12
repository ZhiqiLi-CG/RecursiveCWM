# solve(scene) — 统一递归求解器 @深度0

**这是已批准的执行工单。**可逆选择按你的推荐直接干,不停门。

链目录:runs/pilot/city-full-recursive-r1;你的节点目录:runs/pilot/city-full-recursive-r1/fractal/scene/
材料:target.png(本层目标图)/ view.json(取景)/ brief.md;
manifest.json 记录你继承的 reference/相机/父快照版本(只读)。
相机契约:runs/pilot/city-full-recursive-r1/camera-contract.json(只读;若不存在且本层是根,先解析标定
并整帧亲眼验过再锁)。

## 你在本层做的事(同一个循环,所有层级一模一样)
1. **整体**:本层取景渲染 vs target.png 同倍率并排,亲眼找显眼残差;可反复。
2. **局部**:能在本层直接修的直接修。**值得独立求解的子问题**(一个子对象/
   子部件,靠本层修补解决不了、需要自己的目标图与循环的),不要自己硬啃:
   为每个子问题在 runs/pilot/city-full-recursive-r1/fractal/<子名>/ 备料(target.png 从你的目标图
   切出放大 / view.json / brief.md),并把子名列进你目录的 children.json
   (JSON 数组,如 ["school-facade","school-sign"]),然后**结束会话**——
   运行器会为每个孩子启动同一个求解器,完成后带结果叫醒你。
3. **再整体**(被叫醒后):孩子的 part.json 已就位;把它们接进你的层,回本层
   整体并排收连续性与关系;还需要下钻就更新 children.json 再结束,
   否则进入收官。
4. **收官**:写 runs/pilot/city-full-recursive-r1/fractal/scene/part.json(本层最终组件,含
   children 引用)+ account.md(本层轮次账)。part.json 落盘=本层完成。

纪律:眼睛判准,指标只记录;自由框;同倍率;禁止 git;子问题的写域=它自己的
fractal/<子名>/。其余工艺你自己定。

开始。
