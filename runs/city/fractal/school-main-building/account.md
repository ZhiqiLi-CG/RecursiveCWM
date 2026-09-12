# school-main-building 轮次账

状态：school-sign 已接回并完成本层再整体眼审；最终交付 part.json，children=[school-sign]，无需新增下钻。

## 本轮
- round0：继承只读 parent-context，678×720、6 倍取景；与目标同倍率并排眼审，确认本层学校建筑缺失。
- round1：生成 L 形两层楼体、左翼、檐口、青色门窗和浅色窗框，共 110 个本层组件。眼审主体轮廓接近，发现层间檐口偏高、左翼缺高后沿。
- round2：下移层间檐口 .055 世界单位，加高左翼屋顶后女儿墙。发现深色下沉屋面被檐口全顶面遮住，本轮未接受。
- round3：删除檐口遮挡顶面，保留下沉深灰屋面，渲染亲眼确认深色恢复。发现边框外侧小开口。
- round4：补齐屋顶边框外侧竖面，保留 121 个自有组件；同倍率并排眼审。当前楼体、退台关系与窗带可作为子节点稳定上下文。

## 证据及验证
- round0/1/2/3/4-compare.png 为目标左、渲染右，双方始终 678×720，6 倍。
- round4.render.json：errors=[]，2262 个渲染三角形（包含只读上下文），相机摘要等于继承契约。
- own.json 121 个唯一 school-main-building/ ID，与父上下文 ID 无交集。preview.json 包含只读父上下文加本层几何，仅用于渲染。
- target.png 的 SHA256 与继承 manifest 一致；相机完整 SHA256 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。
- 无图像误差指标用于裁决；使用亲眼并排检查。未使用 git、未自行启动代理。

## 子节点交接
- school-sign：负责深棕牌体、边厚与白色 SCHOOL 字母几何。独立目标从本层 target.png 的 xyxy=[222,12,546,294] 裁出放大至 864×752（根图 16 倍）；根 crop=[441,200,54,47]。
- 已备好 target/view/brief/manifest、冻结的 parent-context、render.mjs、scene.js 和 baseline 及并排图；目标像素、相机摘要、上下文快照均校验。
- 准备脚本 prepare_child.py 已保留；孩子启动后不要再运行覆盖其继承材料。

## 回唤时的检查清单（已执行）
1. 读取 ../school-sign/part.json，校验摘要与 ID，合入 own.json 的 components；children=[school-sign]，child_refs 声明路径 ../school-sign/part.json、included_in_components=true，避免重复装配。
2. 更新 generate.py 支持保留本层几何并引入孩子输出，然后合并只读父上下文再渲染本层取景；同倍率并排收招牌大小、与屋面接触及整体关系。
3. 仍需眼审：主楼檐口厚度偏宽、左翼窗框/女儿墙略硬，玻璃色调与原图柔化边缘仍有差别；右侧塔楼不在本只读快照内，父层整合时收遮挡。树形与校地差异属父层，不在本层改动。
4. 只有孩子整合并整体眼审通过后写最终 part.json，更新本账。

## 回唤后轮次与最终裁决

- round5：读取孩子最终 part.json，核对完整相机摘要。按根世界坐标原位接入 7 个组件，无变换；为满足本层 ID 归属统一加 school-main-building/ 前缀，几何与材质保持孩子交付值。亲眼查看 round5-compare.png，牌底与深色屋面相接，牌体沿建筑横轴延伸，六字母完整可读，没有檐口遮字或重复装配。
- final（第 6 次修整）：在整楼对照中发现左翼两扇窗和主楼左侧底层窗偏大，直接缩小玻璃和随附窗框，并把左翼右窗向外角移动。generate-round5.py 保留整合后、局部修整前参数。再次渲染并亲眼检查 final-compare.png，窗墙比例较 round5 接近目标，屋顶、主楼退台与矮翼关系连续，招牌仍贴合。
- 两侧始终 678×720，根图 6 倍；比较画布 1356×750（额外 30 像素标签栏）。以眼审裁决，未用误差指标替代视觉。
- 最终保留 121 个本层组件和 7 个孩子组件，共 128 个。child_refs 记录 ../school-sign/part.json、SHA256、id_prefix 与 included_in_components=true；父层直接使用扁平 components，不能再次加入 child_refs 的几何。
- 无需新 children.json 调度。本目录 children.json.prev 是已消费的历史调度清单，part.json 的 children 保留实际组成关系。

## 最终验证与范围

validation.json 验证通过：相机、目标、父快照摘要均与继承材料一致；128 个 ID 唯一且归属正确；孩子几何除 ID 前缀外与源文件完全相等；314 个父上下文组件只在 preview.json，未泄漏进交付；几何有限、三角索引有效。final.render.json 错误为零，共 6820 个三角形（含上下文）。

已知差异：原图插值模糊，本几何边缘更锐；檐口与左翼女儿墙仍偏硬，玻璃色调及个别窗位并非逐像素复刻。招牌字体保留孩子记录的曲线差异。树、校地、铺地属父层；右侧双塔不在冻结父快照内，整体遮挡须由父层接回兄弟后检查。本层不改相机或用目标纹理掩盖这些残差。

执行环境说明：系统 python 不存在、python3 无 Pillow，已切换仓库 .venv/bin/python。首次 round5 渲染曾读到旧 preview，随后成功生成整合文件并覆盖重渲染，最终证据使用 6820 三角形版本。

复现（仓库根）：
```sh
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/school-main-building/generate.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/school-main-building/render.mjs --scene preview.json --view view.json --out final.png
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/school-main-building/compare.py final
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/school-main-building/validate.py
```
generate.py 生成 own.json（只含楼体）、assembly.json（含孩子）及 preview.json（含上下文）；最终 part.json 是眼审和验证通过的 assembly.json 副本。使用 validate.py part.json 可复核交付。
