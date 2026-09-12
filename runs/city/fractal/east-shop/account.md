# east-shop — depth 2 轮次账

本层完成商店和自有停车坪，164 个 east-shop/ 前缀组件；children=[]，无待运行后代。所有几何为根世界坐标，采用共享 polygon/box/triangles 接口，无目标图贴图。相机、manifest、target 和父 context 均未改写；没有使用 git。

## 眼审与轮次

- 基线：亲眼检查 baseline-compare.png、target.png。基线只有父层地面/道路，商店与停车坪缺失。
- round0：建立浅灰店体、青绿门窗、红色底脚与屋顶檐边、深灰屋面、拱形招牌及白色 SHOP 几何字、红白条纹斜雨棚、灰紫停车坪和三道停车分隔线。渲染后亲眼检查 round0-compare.png；招牌过高、文字偏大、侧窗偏高、屋顶稍高。
- round1：招牌向右下调整，文字压缩，侧窗降低，檐边下调，雨棚收短。亲眼检查 round1-compare.png，结构关系改善。
- 收官修正：调整雨棚上沿，沿停车坪与住宅交界收紧边界，保留住宅位置缺口。最终重新渲染并亲眼检查 final-compare.png；左右各 352×344，均为根图四倍，没有独立缩放或重拟合相机。

## 判定及残差

商店轮廓、红顶深灰屋面、两面青绿玻璃、SHOP 招牌在屋面前方、条纹雨棚在招牌下方，以及门窗/雨棚的遮挡关系均已形成。部件依附关系可在本层统一参数化处理，没有值得独立启动目标图循环的子问题。

保留残差：几何边缘较原图硬，招牌弧线为分段近似，SHOP 字体为几何像素字，雨棚下沿缺少原图圆润过渡，个别窗框与雨棚边缘仍有数像素偏差。目标左侧树木、右侧粉顶住宅和住宅地块没有作为自有组件写入；它们在预览中缺席。顶部背景草地和底部主路采用继承 context，差异交父层整体整合，不以扩大本层写域修补。停车坪右界需在父层接入住宅后复看连续性。

## 验证与复现

最终渲染：errors=[]，1421 triangles（含父层预览）；锁定相机摘要 07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。validation.json 记录相机、目标、父快照哈希，以及唯一组件 ID、几何有限值、三角索引和边长检查。数值用于审计；视觉判定依据并排图。

从仓库根执行：

```bash
python3 runs/pilot/city-full-recursive-r1/fractal/east-shop/generate.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-shop/render.mjs --scene preview.json --view view.json --out final.png
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/east-shop/compare.py final
# 亲眼检查 final-compare.png 后发布
python3 runs/pilot/city-full-recursive-r1/fractal/east-shop/finalize.py
```

生成器只生成 candidate.json 与含父层 context 的 preview.json；finalize.py 才发布 part.json。环境曾遇到 python 命令不存在、系统 python3 无 Pillow，已改用 python3 生成几何、仓库 .venv/bin/python 生成并排证据。最终流程全部成功。

## 唤醒后再整体（2026-09-08）

本次唤醒通知的孩子清单为空。检查发现运行器已将原 children.json 移为 children.json.prev，内容为 []，既有 part.json 的 children 和 child_refs 也均为空；没有实际后代交付需要聚合，没有将兄弟节点误作孩子接入。

重新运行 generate.py，以不变父快照生成整体 preview；重新渲染 final.png，生成并亲眼检查 final-compare.png。商店的屋顶—招牌—雨棚及雨棚—门窗关系保持连续，停车坪保持对相邻住宅的避让。没有出现新增的独立求解问题，保留前述字形/边缘近似及父层整合检查事项。本轮几何不变，164 个自有组件，渲染 errors=[]、1421 triangles；重新验证哈希和组件结构后再次发布 part.json。

复现脚本已适配收官状态：generate.py 不再生成空 children.json，finalize.py 可读取运行器归档的 children.json.prev。本轮不创建新的下钻请求；part.json 内仍显式保留 children=[]、child_refs=[]。
