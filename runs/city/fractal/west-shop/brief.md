# west-shop — 深度2

重建中央靠右的红顶 SHOP 小商店，约根图 x315..369,y223..282，包含红色屋顶边框、深灰平屋顶、红底白字 SHOP 招牌、红白条纹遮阳篷、白/浅灰墙、青色玻璃门窗、红色下沿、右侧灰紫停车场与白色停车线。认真处理遮阳篷和招牌的倾斜朝向。上方紫顶房与绿宅地归 west-houses；右侧学校绿地和约 x382,y281 的小绿树归 central-school；前景红树归 foreground-park。只拥有商店停车线，不拥有主道路标线。小商店通常可在本层直接循环完成；若招牌等值得独立目标循环，再按工单下钻。

相机 ../../camera-contract.json 与 manifest.json 只读。共享接口 ../scene/interface.md。所有几何使用根世界坐标；crop_px 是根图坐标，不是父图坐标。本目标从 west-civic/target.png 裁出，根裁框 [304, 219, 84, 91]，输出 336×364，根图4倍。

上下文快照 ../west-civic/base.json 只供预览，禁止并入最终 part。预览命令（仓库根运行）：

    .render-tools/node/bin/node runs/pilot/city-full-recursive-r1/fractal/west-shop/render.mjs --scene ../west-civic/base.json --view view.json --out baseline.png

实际迭代将自己的 components 与上述快照合为本目录 preview.json，使用 --scene preview.json。最终 part.json 按共享接口输出，仅包含自有几何和明确声明的孩子引用；ID 用本节点名前缀。先整体同倍率眼审，再直接修局部或为独立子问题备 target/view/brief 并写 children.json 后结束会话。由运行器启动孩子，不自行启动代理。孩子返回后再整体眼审，完成才写 part.json 与 account.md。

已批准执行，可逆选择直接做，不停门，禁止 git。写域仅本目录及自己声明孩子的准备材料。重叠裁图仅为上下文，不转移相邻对象所有权。禁止目标贴图。
