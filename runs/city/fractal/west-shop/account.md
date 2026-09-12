# west-shop 本层轮次账

状态：本层完成，深度 2；没有独立孩子。全部写入限于 west-shop/，未执行 git，未改相机、manifest、父快照或邻居。

## 目标与交付

目标为根框 [304,219,84,91]，输出 336×364，根图 4 倍。统一正交相机和根世界坐标。最终 part.json 含 62 个 west-shop/ 前缀自有组件：灰紫停车铺装及三道停车线、浅灰店体、青色门窗、红色下沿、灰平屋顶与红边、红白 13 条遮阳篷及垂边、红色异形 SHOP 招牌。字形来自 Three.js helvetiker_bold 字体轮廓，已三角化为几何，无目标贴图。children 和 child_refs 为空。

生成器 generate.mjs 写 candidate.json 和 preview.json；preview 仅供整体眼审，包含只读 west-civic/base.json，最终组件不含父快照。使用已有 render.mjs、scene.js，比较图由 compare.py 将目标与渲染原尺寸并排，不分别缩放。

## 整体→局部→再整体

- 基线：亲眼查看 baseline-compare.png，继承快照仅有地面道路，商店和停车场缺失。
- 第一轮：构建完整店体、屋顶、门窗、字牌、篷、停车场。round1-compare.png 眼审：店体底部已就位，屋顶红框和招牌偏高，字过大，篷左探过多，车位线过密。
- 第二轮：降低屋顶、减薄红边、缩矮字牌与字体、缩短篷外伸。round2-compare.png 眼审：主体比例改善；篷的可见斜面不足，停车线仍需改为三道。
- 第三轮：调整篷后缘、铺装后边界、三道车位线。round3-compare.png 眼审发现篷面穿过屋顶边框，在字牌下产生白色细缝。
- 第四轮：将篷明确放到立面外侧并调整横向位置与高度，消除交叠细缝。亲眼查看 round4-compare.png，确认屋顶、字牌、篷、门窗和停车场的局部连续性。留在本层完成，无需独立子目标循环。

## 验证与限度

最终渲染输出 336×364，errors=[]，预览共 43 个材质网格、1058 三角形；这些是记录，不作为视觉评分。validation.json 核验 62 个组件 ID 唯一且全部归属本节点，几何数值有限；相机完整 SHA256 与 view/candidate/render 一致，父快照 SHA256 与 manifest 继承版本一致。

剩余视觉差异：程序几何边缘较目标插画锐利；目标红边、篷垂边具有更柔和的圆角和明暗过渡，字牌字体及弧形轮廓仍有小差异。上方紫屋、绿宅地、右侧学校树、前景红树未在继承预览快照中出现，应由所属兄弟节点和父层整体整合。停车铺装边界需要父层在相邻地块就位后再做关系检查。

复现：仓库根运行 `.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-shop/generate.mjs`，再用本目录 render.mjs 的 `--scene preview.json --view view.json --out round4.png` 渲染。并排图：`/tmp/rp-ppt-venv/bin/python runs/pilot/city-full-recursive-r1/fractal/west-shop/compare.py round4`。

## 唤醒后的第五轮整体复核

本次唤醒消息没有列出孩子名。实际核验 children.json.prev=[]，现有 part.json 的 children=[]、child_refs=[]，因此没有新增孩子交付可接入。运行器已将空清单归档；本次不写新 children.json，避免把空清单再次当作递归请求。

直接从已交付 part.json 的 62 个自有组件与 manifest 指定的原 west-civic/base.json 合成 resume-preview.json，重新渲染 resume-round5.png，并亲眼查看 resume-round5-compare.png：目标左、渲染右，均为 336×364、根图 4 倍。确认字牌、屋顶边框、遮阳篷、墙面、门窗、红色底沿和停车铺装无新增断裂、重复组件或明显穿插。三道停车线与右侧墙面关系保持一致。此前记录的字体、圆角和柔和阴影差异仍在；相邻对象仍由所属节点整合。

第五轮 errors=[]，相机完整哈希一致，所有 62 个组件 ID 唯一且均为 west-shop/，几何数值有限。无需新下钻，保持现有几何，重新落盘 part.json 完成本层。
