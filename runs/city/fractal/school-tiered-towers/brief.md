# school-tiered-towers

仅重建右侧两栋淡薄荷绿层叠塔楼与右下小附楼。第一栋靠左、图上更高，约根图 x506..574,y211..334；第二栋靠右前，约 x557..623,y246..359；附楼约 x602..641,y305..362。逐层辨认深绿色屋面、浅绿厚檐板、浅立面、底层细长门窗。两栋重复构造可参数化，但前后位置、顶部高度和底座不应相同。不要造橙色学校、树、校地、灰紫地坪或喷泉；由父层/兄弟负责。范围只是导航，目标眼审为准。

相机及接口：阅读 ../scene/interface.md。../../camera-contract.json 和本节点 manifest.json 只读，绝不重拟合相机。所有几何为根世界坐标。根图 crop_px=[504, 207, 139, 154]，输出 695×770（等比例 5 倍）；目标确实从父层 target.png 的像素框 [268, 38, 546, 346] 裁出后 Lanczos 放大。

父层已做四树、青绿校地、白边、两块方形广场与喷泉。parent-context.json 是只读预览快照，已经含根底板和父层自有组件。预览时把它的 components 与自己的 components 合并；最终 part.json 严禁包含这些上下文组件。只在自己的目录写入；如还需下钻，遵照统一递归工单备料、children.json 并结束，由运行器启动孩子。不要自己启动代理。

运行：从仓库根执行 .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/school-tiered-towers/render.mjs --scene preview.json --view view.json --out round1.png。渲染与本节点 target.png 同倍率并排，亲眼检查。

输出 part.json：node="school-tiered-towers"；camera_contract_sha256 使用 view.json 完整摘要；components 每个 id 以 "school-tiered-towers/" 开头；children 数组及必要的 child_refs。几何支持 polygon/triangles/box/cylinder/cone/ellipsoid，参见 interface.md。几何自绘字母允许，禁止参考图纹理/贴图。完成需保留生成器、并排证据与 account.md。

已批准执行，不停门，禁止 git。
