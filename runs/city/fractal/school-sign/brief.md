# school-sign

只求解学校屋顶棕色 SCHOOL 招牌：深棕矩形牌体、薄侧边/顶边、白色字母真实几何。不要重建主楼、屋顶、立面、树木、道路或双塔。字母的尺度、粗细、间距、基线和牌面透视需要自己的放大循环，因此由本子节点独立求解。禁止使用参考图作纹理或贴图。

## 目标和继承相机
阅读 ../scene/interface.md。../../camera-contract.json 与本 manifest.json 只读。所有几何输出根世界坐标。crop_px=[441,200,54,47]，864×752，16 倍。本 target.png 严格从父 target.png 的 xyxy=[222,12,546,294] 裁出，再 Lanczos 等比放大。不要重新标定相机。

## 屋顶承接口
父层屋面高 y=1.556，檐口顶 y=1.626；主楼平面为 L 形。只读 parent-context.json 是父层 round4 的全部预览快照，含背景、校地、树木和父层 121 个建筑组件，供渲染遮挡与落脚关系。

建议起始牌面：正面位于 z≈0.825，沿世界 x 轴从 x≈-0.06 延伸到 x≈1.525；底边 y≈1.575、顶边 y≈1.94；厚度约 .035–.055。这只是初值，请以目标眼审修正。对应根像素左下约(444,216.5)、右下约(491.5,242.4)、左上约(444,203.5)。牌面应与屋面接触，正面朝 +z；字符沿 +x 排列，y 向上。可用自绘笔画/轮廓挤出成 triangles/box，也可利用本地字体轮廓转几何；不得把整张招牌变为图片贴面。目标文字为 SCHOOL。

## 渲染及输出
从仓库根执行：
`.render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/school-sign/render.mjs --scene preview.json --view view.json --out round1.png`

preview.json 的 components 由 parent-context 的 components 加本节点几何组成。baseline.png 已提供。每轮与 target.png 保持同 864×752 倍率并排亲眼检查。输出 part.json 的 node=school-sign；camera_contract_sha256 使用 view.json 中完整摘要；组件 id 以 school-sign/ 开头，只含牌体与字母。附 children/child_refs（如有），保留生成器、并排证据和 account.md。

写域仅本 school-sign 目录；不得更改 parent-context、父层文件或相机。按统一递归工单，需要下钻时备料 children.json 后结束，由运行器启动；不要自行启动代理。已批准执行、不停门、禁止 git。
