# west-civic 轮次账

状态：本层完成。四个孩子已接入，经三轮再整体眼审及局部地坪修正，交付 part.json；以下保留首轮下钻记录。

## 整体眼审

读取 target.png、view.json、brief.md、只读 manifest.json、锁定 camera-contract.json 和 scene/interface.md；沿用既有 plan.md 的四对象拆分。
亲眼查看 round0-compare.png、child-coverage.png，并重新渲染 handoff-baseline.png、生成及亲眼检查 handoff-compare.png。目标与渲染均为 776×458、根图2倍，无独立缩放。
显眼残差是两栋层叠办公高楼及附楼、紫蓝警局、斜排三栋紫顶黄房、红顶商店全部缺失；现有渲染仅为父层道路草地上下文。其楼层、立面、屋顶和招牌需要各自局部目标与渲染循环，不能用本层小修解决。
道路与斑马线的宽度、朝向仍有差异，属 scene；上缘住宅、学校树簇和前景红树属邻居，不转移所有权。此轮没有新增自有几何。

## 下钻划分

- west-offices：两栋办公高楼、小附楼、办公楼宅地；根裁框 [0,137,145,169]，输出 580×676。
- west-police：警局主楼及附翼、停机坪和招牌、右侧灰紫广场；根裁框 [87,245,159,105]，输出 636×420。
- west-houses：三栋住宅及绿宅地、短步道和灌木；根裁框 [207,168,181,133]，输出 724×532。
- west-shop：商店、遮阳篷、招牌及停车场线；根裁框 [304,219,84,91]，输出 336×364。

复用已备好的 target.png/view.json/brief.md/manifest.json 和局部渲染器，没有覆盖既有材料。四图均从本层目标裁出并等比例放大至根图4倍，重叠仅供上下文。各 brief 已明确所属几何、根世界坐标、写域、禁止目标贴图及由运行器继续递归的约定。

## 核验记录

preparation-checks.json：四图逐像素匹配本层裁切放大结果；输出与基线尺寸一致；来源目标、孩子目标、父快照及相机哈希均一致；已有子基线报告 errors=[]。四个孩子均尚无 part.json。
handoff-baseline.render.json：本轮重新运行成功，776×458，errors=[]，camera_contract_sha256=07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c。几何计数仅作记录，不作为视觉验收标准。
系统 python 不存在、python3 缺少 PIL；改用项目 .venv/bin/python 后裁图验证成功，无需安装依赖。

## 返回后的工作

等待四个孩子的 part.json 后验证相机与 ID，按接口把孩子自有 components 仅合并一次，声明 child_refs 与 included_in_components=true；禁止把本层 base.json 的父上下文加入最终组件。再渲染本层同倍率并排，检查办公楼—警局宅地、警局广场—住宅绿地、住宅—商店停车场的边界及遮挡。必要时继续下钻；整体检查后才写本层最终 part.json。

本轮未使用 git，未启动子代理，未修改相机或既有 manifest。children.json 是本次交接给运行器的正式清单。


## 孩子返回后的再整体与收官

读取四份 part.json 与 account.md。west-offices 为113个组件（已包含附楼孩子24个），west-police 为83个，west-houses 为160个（已包含住宅原型及实例），west-shop 为62个。assemble.py 只展开这四份交付一次，child_refs 含完整 SHA256 与 included_in_components=true；不会再追加孙节点。孩子源文件均未改写。

再整体第1轮：渲染 resume-round1.png，亲眼查看 resume-round1-compare.png，目标与渲染各776×458、根图2倍。两塔与附楼、警局、三栋斜排住宅、商店的位置和主要遮挡成立；商店在第二栋住宅前方遮住步道。显眼的关系残差是地坪外围细绿缝，以及警局广场与住宅宅地之间的缺口。相邻学校树、前景红树、上缘另一排住宅未加载到本层预览，属于根层组装上下文，不是本层漏建。

再整体第2轮：build_local.py 创建四片浅色宅地边带，分别对应办公楼、警局广场、住宅及商店。边带放在 y=0，低于孩子地坪和父层人行道/路面，补齐草地缝且不覆盖继承道路。亲眼查看 resume-round2-compare.png，外围白边衔接改善，建筑几何保持原交付。

再整体第3轮：补一片 y=0.014 的灰紫铺装，连接警局广场后缘和住宅绿地左缘，低于相邻绿地和警局铺装。亲眼查看 resume-round3-compare.png，接受宅地连续性、建筑落地与相互位置、三栋住宅数量和间距、商店遮挡关系。没有需要独立目标循环的新对象，不再下钻。

最终组件：423 = 113+83+160+62 个孩子组件 + 5 个 west-civic/ 自有连接组件。part.json 与完成眼审的 candidate.json 逐字节一致；最终组件排除 base.json 的258个父上下文组件。part.json 保留四个已完成孩子的引用；不新写 children.json 调度请求，运行器已有 children.json.prev 归档。

验证：verify.py 检查相机完整哈希、原 manifest 内容、目标哈希、继承父快照哈希、直接孩子及孙节点引用哈希、唯一ID、有限坐标、正尺寸和三角索引、候选与预览组成，以及生成脚本语法。resume-round3.render.json 为776×458、203个网格、3800个三角形（含父上下文）、errors=[]。结果保存 verification.json；计数仅记录，图像验收以同倍率亲眼复核为准。

保留差异：程序几何的边缘和明暗比目标插画硬，办公楼窗格及楼板、住宅屋檐与老虎窗、POLICE/SHOP 字形仍有局部比例和风格差异。整体结构及关系已收齐，但不是逐像素复刻。继承主路的斑马线方向/密度、人行道走向与部分路口边界仍需 scene 根层在全部街区接回后调整；根层也应带齐周围树与上缘住宅再检查边缘。本层未用地坪覆盖主路修补这些差异。

复现：依次运行本目录 build_local.py、assemble.py，随后用 render.mjs --scene preview.json --view view.json --out resume-round3.png；compare.py resume-round3 生成并排；verify.py 校验。Python 使用仓库 .venv/bin/python，渲染器使用 .render-tools/node/bin/node。

本次写入仅在 west-civic/，未使用 git，未启动代理，未修改孩子、相机、已有 manifest 或父快照。
