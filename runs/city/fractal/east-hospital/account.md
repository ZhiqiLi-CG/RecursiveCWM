# east-hospital 本层轮次账

完成 depth 2 医院组件；无独立子问题，children=[]，child_refs=[]。

## 眼审与迭代

- 基线：亲眼查看 baseline-compare.png，目标与基线均为 680×492（根图 4 倍）。基线仅含道路/草地，医院缺失。
- 第 1 轮：建立高低奶黄主体、两处浅色内凹屋顶、白招牌、红十字、红侧盒、入口和医院灰紫地坪；亲眼查看 round1-compare.png。发现白招牌厚度使正面向左偏移，入口铺装过宽。
- 第 2 轮：把白招牌厚度移至后侧，收窄入口铺装；亲眼查看 round2-compare.png。发现高部屋顶偏高约 10 个放大像素、侧盒需要开口框形。
- 第 3 轮：降低高部约 0.07 世界单位，调整十字位置、招牌高度、红框和浅蓝小窗；亲眼查看 round3-compare.png。发现招牌侧面与主体共面。
- 第 4 轮：招牌外侧面外移 0.016 世界单位，消除共面遮挡；亲眼查看 final-compare.png 与 final-facade-detail.png。高低体量、红十字、低部红框、内凹屋顶及入口关系已可交父层整合。

## 交付与检查

30 个独占组件，ID 全部以 east-hospital/ 开头。所有几何为根世界坐标，使用盒体和水平多边形，无参考贴图。相机及目标摘要匹配继承 manifest；未修改 manifest、相机或邻居文件。未使用 git。preview.json 的道路与草地只作上下文，draft/part 不包含这些组件。

最终渲染：680×492，固定 crop=[620,207,170,123]；浏览器 errors=[]。预览含上下文共 35 个渲染 mesh、815 三角形，数字仅记录，不作视觉准确度判断。validation.json 记录结构检查。

## 剩余差异与父层整合

目标是柔化的插画边缘；当前参数几何较锐利，屋顶边沿仍有轻微细缝，未引入纹理伪装。当前预览缺少学校、右上塔楼、树和它们的地坪；这些属于其他节点。医院地坪仅含门前及建筑下方的小街块，向学校方向的连续性由父层合并后再验；不扩建去填上下文空白。入口窗框与局部边沿的像素级差异保留，不影响本层可辨识关系。

## 重生成

在仓库根目录运行：

```sh
.venv/bin/python runs/pilot/city-full-recursive-r1/fractal/east-hospital/build.py
.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/east-hospital/render.mjs --scene preview.json --view view.json --out final.png
```

build.py 重生成 draft.json、preview.json、children.json；part.json 是最终眼审后接受的 draft.json 副本。修改源后必须重新渲染眼审再替换 part。

## 唤醒后再整体（第 5 轮）

本次唤醒消息未列出孩子名称。核对 children.json.prev=[] 与已交付 part.json 的 children=[]、child_refs=[]：本层没有实际孩子需要接入。运行器已归档空清单；本轮不创建新的下钻清单。

读取已交付的兄弟 east-teal-towers/part.json，仅作为 resume-preview.json 的上下文加入 100 个组件，未并入医院 part。来源摘要记录在 resume-context.json。重新用锁定相机渲染 resume-whole.png，并亲眼检查同倍率 resume-whole-compare.png（两侧各 680×492，根图 4 倍）。医院与道路另一侧塔楼/树之间保持可见间距，没有相互穿插；医院高低体、招牌、入口与地坪关系保持。学校侧组件尚未在本预览出现，医院小街块到父层道路白边间仍有局部草地细缝，这处跨归属连续性留父层汇总后处理，不据此扩展医院街块。

不需要新增独立子问题，本轮不改几何。复核相机/目标摘要、30 个唯一医院 ID、无上下文混入，浏览器 errors=[]；预览共 82 meshes / 3458 triangles，仅记录。更新本层 part.json，children 与 child_refs 仍为空，完成本次再整体收官。
