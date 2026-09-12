# scene — depth 0, cycle 1

Status: waiting for recursive children. No final part.json has been written.

Approved scope: supplied target.png reconstructed as parameterized Three.js geometry; root camera and connected substrate; runner-managed recursive children; no git.

Round 0: inspected supplied 941×520 reference, then rendered 491 substrate primitives with an initial 30° orthographic camera. Viewed round0-compare.png and camera-overlay0.png. Conspicuous residuals: object geometry absent, overly crude plot placeholders, wrong left road extension, terrain tiles spilling beyond platform, and ground-axis slope too shallow.

Round 1: revised analytic elevation from measured long-edge slopes to asin(0.545), keeping 45° azimuth and a 30 px horizontal world basis. Removed plot placeholders, widened roads, corrected western connection. Viewed full-frame round1 comparison and overlay. Object geometry remains delegated; foreground path bends and outer terrain contour still needed local adjustment.

Round 2: adjusted school-front bend and southeast street branch, constrained lower ground tiles to platform silhouette. Viewed round2-compare.png and camera-overlay2.png in full. Accepted camera framing/orientation convention, then locked ../../camera-contract.json with SHA256 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c. Original root manifest remains unchanged and records the pre-calibration inherited state.

Current base.json: 258 primitives, rendered through local scene.js/render.mjs; round2 report: 10 meshes, 647 triangles, zero browser errors. Flat custom face colors are supported by renderer. Scene image is not used as a texture. Raster operations only produced target crops and comparison evidence.

Children prepared:
- north-housing: four northwest houses, plots and nearby green trees.
- west-civic: grey towers, police, three central purple houses and lower shop, their plots.
- central-school: school, mint towers, plaza/fountain, school trees and paving.
- east-district: upper shop, red houses, northeast purple houses, teal towers and hospital.
- foreground-park: two lakes, plants and red/green trees.

Each has enlarged target.png, a full-reference crop in view.json, immutable inherited manifest, ownership brief, local renderer, baseline.png, baseline.render.json and an equal-scale baseline comparison. Each baseline render used the locked camera; all five match target dimensions and have zero browser errors. Viewed child-coverage.png to check crop coverage and context; reduced contact-sheet scale was not used to grade final object quality. Exact-scale local comparisons remain in each child folder.

On resume: load all delivered child part.json files, inspect schemas/unique IDs/camera hashes and flatten references once. Render full frame against original target before any completion claim. Root must still refine crossings (current stripes are too thin and appear incorrectly oriented), junction markings, the school-front road silhouette, grass tile coverage and outer platform edge thickness after district paving is present. No numerical similarity threshold defines acceptance. Building, roof, facade, vegetation and sign correctness remain unassessed until children return.


# scene — depth 0, cycle 2 (resume)

状态：重新交回五个直接孩子，未完成整城，未写 part.json。

恢复审计：发现 .children_done 标记，但 north-housing、west-civic、central-school、east-district、foreground-park 的 part.json 全部不存在。没有把标记当作成品，也没有将未验收 local.json/preview.json 冒充孩子成品。east-district 和 foreground-park 账本记录此前磁盘满中断；本轮 /tmp 可用约 3.7G，三次试作渲染及基线均成功。保留所有孩子文件，恢复直接孩子登记，由运行器继续递归。

整体：重新渲染 resume-baseline.png，亲眼检查同倍率 941×520 双幅 resume-baseline-compare.png。仍缺全部建筑、地块与植物。根的路网已有大体连接，但人行横道比例、交叉口线条、前景道路轮廓和平台边缘仍有残差。

局部轮次：
- Round 3：尝试转置六处斑马线。整帧加顶端斑马线同框 6× 并排发现方向不符合目标，否决这次试作。先前关于方向反了的判断被更清楚的放大证据纠正。
- Round 4：恢复目标条纹方向，调整条纹长度/宽度，将顶端横道移左4像素、下2像素。亲眼检查完整双幅与放大双幅；车道中心线仍穿过横道，白条过密。
- Round 5：减窄白条，在横道底部加入同色道路几何覆盖车道线。亲眼检查 round5-compare.png 和 round5-crossing-compare.png；方向与间隔比转置试作合适，中心线穿越已消除。目标的横道仍更粗、更柔和，铺装接边及其余五处精确位置留待地块整合时再审，不声称局部像素级一致。

输出：refine_base.py → base-refined.json，264个唯一ID组件。round5.render.json 记录 10 meshes / 659 triangles，errors=[]，941×520，锁定相机哈希一致。未用数值相似度裁决。所有几何都是程序化多边形；图像操作仅用于目标裁切及并排证据。

继承保全：base.json SHA256 仍为 5a9576da3b70d7e2182533793b88a01cbbe1f078332f255c708fffe8221708d9；相机 SHA256 仍为 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。相机、根manifest和全部子层继承manifest未修改。五个直接孩子的 target/view/brief/manifest 均非空，目标哈希符合manifest，目标尺寸匹配view，裁框在根图内且等比例，相机与父快照哈希一致；详见 resume-audit.json。

唤醒后：必须先确认五个真实 part.json 已到位，再逐一校验组件/子引用并去重整合。根采用 base-refined.json；base.json 继续保留为孩子继承快照。整帧收连续性、道路/地块接边、交叉口标线和平台边缘后才能写最终 part.json。若孩子仍缺失，按真实磁盘状态处理，勿以 .children_done 推断完成。本轮不改运行器控制标记，不用git。

# scene — 五个孩子真实交付后的再整体与收官

状态：本层完成。最终 part.json 已包含五个直接孩子及其展平后的全部后代；不创建新的 children.json。前面的等待/中断记录作为历史保留。

本轮读取五份实际 part.json 和对应轮次账，核对锁定相机摘要、直接孩子引用以及其直接后代的源文件摘要。1052（north-housing）+423（west-civic）+313（central-school）+583（east-district）+8323（foreground-park）=10694 个孩子组件。assemble.py 将其原值原位装配一次，不改变孩子坐标、材质、ID 或源文件。每条最终 child_refs 均声明 included_in_components=true 并保存 SHA256；消费者不得再次展开。

## 再整体轮次

- integrated0：采用 base-refined.json 264 个根组件接回五区，实际渲染941×520。亲眼检查 integrated0-compare.png，并检查西侧、医院、学校前场的同倍率2倍局部并排。所有主要对象、住宅数量、楼群、树群与双池均已到位；西北住宅被灰塔遮挡、商店遮住住宅步道、学校被薄荷楼遮挡、公园树遮住水池东岸等关系成立。显眼根残差为车道虚线太细、四个路口缺连接标记、医院与学校之间草地缺口、平台右下厚度缺失。
- integrated1：finish_root.py 只修改根自有道路/地面，增宽道路与浅色路缘，增强虚线/中心线，添加路口标记和医院—学校地坪连接及平台边缘。重新整帧及医院局部并排，发现虚线偏粗、路口旧虚线穿插、连接处还有一个小草地孔。
- integrated2：虚线收细，路口先清除旧标记再画黄色连接与蓝色转角区域；草地棋盘格扩展到平台内更多区域。亲眼查看整帧、西侧与医院局部。大块草地缺口已消除，医院/塔楼灰地坪接通，但小路口黄色区域偏大，西侧有多余延伸线。
- final：增大小路口蓝色区域，去掉三处多余黄色延伸线，再补医院旁最后一处露草孔。实际重渲染 final.png，亲眼检查 final-compare.png（左右均941×520，1倍）和 final-east.png（相同裁框、2倍）。接受整城可见对象覆盖、街区落地、主要遮挡、树池关系、道路与地坪连接，无需新的独立子问题。

## 最终交付与验证

part.json 为已眼审且已验证 candidate.json 的逐字节副本，共11063个组件：369个根组件 + 10694个孩子组件。所有组件可由本地 Three.js 渲染器支持的 polygon/triangles/box/cylinder/ellipsoid 等参数化几何构成；没有把目标作为纹理或图片平面。父快照 base.json、相机契约、原 manifest 和所有孩子文件未改。

validate_final.py 新鲜运行通过，记录 final-validation.json：唯一ID、有限数值、正尺寸、有效三角索引、孩子源摘要、展平组件逐项相等、相机摘要和继承base摘要保全、渲染无浏览器错误、目标/渲染尺寸相等，以及无新的待运行孩子清单。最终渲染为1063 meshes、48797 triangles、errors=[]。计数仅记录，不定义视觉通过阈值。运行器 check_part.py 另检交付的非空组件和唯一ID。

## 保留差异

画面并非逐像素复刻：模型轮廓和色带比柔化参考硬，住宅局部比例、学校立面及招牌字形、树冠层次、喷泉水柱和池岸均有简化；部分道路转角、斑马线间距、路口黄色区域及草地网格还与目标不同。整帧没有缺失需要新孩子独立求解的对象。本轮明确收整的是街区连续性与组合关系，没有用数值指标覆盖这些可见差异。

## 复现

从仓库根依次运行：

    .venv/bin/python runs/pilot/city-full-recursive-r1/fractal/scene/finish_root.py
    .venv/bin/python runs/pilot/city-full-recursive-r1/fractal/scene/assemble.py
    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/scene/render.mjs --scene candidate.json --out final.png
    .venv/bin/python runs/pilot/city-full-recursive-r1/fractal/scene/compare.py final
    .venv/bin/python runs/pilot/city-full-recursive-r1/fractal/scene/validate_final.py

最终已交付组件可直接用 render.mjs --scene part.json 渲染。不要重跑历史 prepare_children.py 或 build_base.py：它们属于首次备料阶段；当前根修改来自 finish_root.py，继承base保持原版本。全部本轮写入仅在scene目录，未使用git，未自行启动代理。
