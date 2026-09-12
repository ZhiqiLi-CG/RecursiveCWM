# central-school 本层轮次账

状态：两个孩子已接入，本层再整体检查与局部修正完成，交付 part.json；无需新增下钻。历史交接记录保留如下。

## 继承轮次

已有 baseline、round1、round2 及并排证据，generate.py 生成本层 56 个自有组件：校地白边、青绿地面、入口铺地、塔楼地坪、两块灰紫广场、四棵树和蓝白喷泉。已有学校与双塔两套子材料。恢复时 children.json 已变为 children.json.prev，.children_done 为空；两个孩子的 part.json 均不存在。历史渲染并不证明孩子已交付。

## 恢复轮 resume-round3（2026-09-08）

读取只读相机、manifest、接口及既有计划；本轮没有改几何、相机、父快照或孩子材料。重新渲染 preview.json，输出 resume-round3.png 和 resume-round3.render.json。目标与渲染均为 574×436，根取景 [370,188,287,218]；生成并亲眼查看 resume-round3-compare.png。

眼审：学校主楼、SCHOOL 招牌、双塔和附楼完全缺失，是压倒性的残差，继续采用两个独立建筑子问题。校地与铺地的大体关系已建立；树冠较目标偏尖、层次偏整齐，喷泉水柱形状及盆体尺度仍有差异。待建筑交付，检查校地遮挡、入口与建筑落脚、塔基与白边连续性，再校这些本层局部。左上商店、右侧医院及下方公园为邻居上下文，主路归父层。当前图不能作为最终相似度验收。

验证事实：渲染无浏览器错误，60 meshes / 4556 triangles（含父层上下文）；owned.json 有 56 个唯一、central-school/ 前缀的自有组件。孩子 target.png 与从本层目标按 source_crop_px 裁切并 Lanczos 放大的结果逐像素一致；输出分别为 678×720 和 695×770。完整相机 SHA256、目标摘要、父快照摘要均核对通过。机器记录见 handoff-validation.json，指标仅记录。初次比较脚本因系统无 python 命令未运行，随后使用仓库 .venv/bin/python 成功完成检查。

## 交回运行器

children.json 请求 school-main-building、school-tiered-towers；复用已验证的 target.png / view.json / brief.md / parent-context.json / 渲染工具，未覆盖 manifest。按工单结束会话，由运行器启动孩子；本会话没有启动代理，也没有使用 git。

唤醒后：先确认两个 part.json 实际存在并验证 ID 和相机契约，再把 owned.json 与孩子 components 去重扁平合并，声明 children 与 child_refs、included_in_components=true。父层 base.json 仅用于预览，排除在最终组件之外。重新整体同倍率渲染、眼审连续性并完成本层修正后，写最终 part.json。


## 孩子交付后再整体（integrated-round4 / integrated-round5）

读取 school-main-building/part.json（128 个组件，已含 school-sign 的 7 个组件）与 school-tiered-towers/part.json（95 个组件）。assemble.py 原位使用孩子的根世界坐标，仅给 ID 增加 central-school/ 前缀；child_refs 显式 included_in_components=true，包含源文件 SHA256。不能再递归叠加这些引用的几何，以免重复。

integrated-round4：56 个本层组件加 223 个孩子组件，共 279 个。重新渲染 574×436 取景并亲眼检查 integrated-round4-compare.png。学校退台、招牌、双塔前后错位、附楼和底座落地关系成立；学校右侧被后塔正常遮挡，前场喷泉留空。显眼的本层残差是树冠偏尖以及塔后灰紫铺地缺失。

integrated-round5：本层直接调整四棵树的分层树冠，沿相机深度方向压扁并对各层横向错位；补塔后灰紫地面和白边。自有组件从 56 增至 90，合并总数 313。亲眼检查 integrated-round5-compare.png，铺地连续，分层树冠更接近目标，建筑与地块的相对位置保留。无需新的独立子问题。

final.png / final.render.json 是 integrated-round5 对应证据的相同副本；final-compare.png 重新排版标签，目标左、渲染右，双方 574×436，2 倍，比较画布 1148×460。最终渲染 errors=[]，97 meshes、9940 triangles（含 258 个根底板上下文组件）。指标只记录，视觉裁决来自并排眼审。

## 最终验证与差异

validate.py 核对本层目标摘要与 manifest、根相机完整摘要、父快照版本、根目标裁切放大后的 RGB 像素一致性、313 个 ID 唯一、全部为 central-school/ 前缀、孩子几何和材质逐项未改、父上下文未进入交付、数值有限、正尺寸、三角索引有效、渲染零错误及相同分辨率。验证记录 validation.json。验证脚本初稿误把 manifest 的本层目标摘要当作根图摘要，且直接比较 RGBA 与 RGB 字节；检查文件摘要、模式与 RGB 差分后修正验证对象和通道规范化，未改动任何参考材料。

保留残差：几何边缘比柔化参考锐利，树冠仍较规则，喷泉水柱和盆沿有所简化；学校檐口和塔楼檐板的厚度、色带及局部窗位有小差异。道路标记、邻居商店/医院/公园缺失属于只读预览上下文，交由父层整合；本层最终组件不包含根底板或邻居。相机、manifest、目标图和孩子文件保持只读，未使用 git 或另行启动代理。

children.json.prev 是运行器已消费的历史调度单；本轮不重新生成 children.json。part.json 保留实际 children 与 child_refs，account.md 与生成器均已就位。

复现（仓库根，使用仓库 Python）：

```sh
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/central-school/generate.py
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/central-school/assemble.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/central-school/render.mjs --scene preview.json --view view.json --out final.png
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/central-school/compare.py final
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/central-school/validate.py part.json
```

不要再执行 prepare_children.py：它是历史备料生成器，会覆盖孩子的继承材料。本次交付使用 assembly.json 的已验证副本。
