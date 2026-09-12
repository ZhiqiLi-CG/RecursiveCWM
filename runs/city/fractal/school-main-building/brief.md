# school-main-building

仅重建橙米色学校建筑：主楼、左侧矮翼、退台平屋顶、檐口、立面青色玻璃门窗、棕色 SCHOOL 招牌（含字母几何）。参考根图主要范围 x408..511,y200..313。不要造树、校地、铺地、喷泉或右侧双塔；这些由父层/兄弟负责。学校与双塔局部有遮挡，照参考保持建筑落脚与总高。目标招牌位于根图约 x444..489,y203..239，左矮翼约 x408..438,y241..300。以目标眼审为准，不要把这些粗范围当作测量真值。

相机及接口：阅读 ../scene/interface.md。../../camera-contract.json 和本节点 manifest.json 只读，绝不重拟合相机。所有几何为根世界坐标。根图 crop_px=[404, 198, 113, 120]，输出 678×720（等比例 6 倍）；目标确实从父层 target.png 的像素框 [68, 20, 294, 260] 裁出后 Lanczos 放大。

父层已做四树、青绿校地、白边、两块方形广场与喷泉。parent-context.json 是只读预览快照，已经含根底板和父层自有组件。预览时把它的 components 与自己的 components 合并；最终 part.json 严禁包含这些上下文组件。只在自己的目录写入；如还需下钻，遵照统一递归工单备料、children.json 并结束，由运行器启动孩子。不要自己启动代理。

运行：从仓库根执行 .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/school-main-building/render.mjs --scene preview.json --view view.json --out round1.png。渲染与本节点 target.png 同倍率并排，亲眼检查。

输出 part.json：node="school-main-building"；camera_contract_sha256 使用 view.json 完整摘要；components 每个 id 以 "school-main-building/" 开头；children 数组及必要的 child_refs。几何支持 polygon/triangles/box/cylinder/cone/ellipsoid，参见 interface.md。几何自绘字母允许，禁止参考图纹理/贴图。完成需保留生成器、并排证据与 account.md。

已批准执行，不停门，禁止 git。
