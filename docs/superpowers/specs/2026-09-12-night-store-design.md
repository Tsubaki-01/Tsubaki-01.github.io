# 两点半便利店

用户已选择“便利店 + 奇怪生物”，授权自由实现、部署到现有 GitHub Pages，并在博客首页增加便利店和 Hot 100 入口。目标是好逛、有趣、温暖和略微荒诞，不做求职作品集或学习仪表盘。

## 体验

入口 `/night-store/`。雨夜中的插画便利店：奶油色招牌、苔绿色门窗、暖黄灯光、珊瑚色包装，背景为深蓝街角。完整 SVG 场景占首屏主要面积；所有热点有真正的按钮、可见提示和键盘入口。手机端场景保持可读，另有等价的快捷探索入口。

货架包含 12 件原创奇物。免费带走，第一次领取产生一张荒诞小票；再次领取不会无限叠加。口袋中的物品可借给 6 种生物，喜欢与不喜欢的回应不同。物品一直保留，因此试错没有惩罚。生物有多句闲聊、喜好提示、观察记录和交朋友后的新描述。2 种生物通过探索出现。

货架、猫店长、收音机、深夜小报、摇签机、门铃和后门均可交互。交到 3 位朋友后开启后门短篇，3 个结局可以收集。门铃按到第 7 次有彩蛋。图鉴、口袋、小票和结局保存在浏览器本地，下次回来继续。

默认静音，可点击开启轻量合成雨声；页面隐藏时暂停音频和动画。尊重减少动态效果的系统设置。无自动播放音频、后台请求、第三方字体、游戏引擎、账号或服务端。

## 文件与接口

- `source/night-store/index.html`：页面语义、顶部入口、场景容器和原生 dialog。
- `source/night-store/style.css`：插画页面、响应式布局与少量动画。
- `source/night-store/scene.js`：轻量 SVG 店铺和生物/商品插画函数。
- `source/night-store/content.js`：原创商品、生物、新闻、签文、短篇数据，导出 `NightStoreContent`。
- `source/night-store/state.js`：独立状态转移，导出 `NightStoreState`，同时支持 Node 测试。
- `source/night-store/app.js`：点击、对话框、物品借用、小票和本地保存。
- `tests/night-store/state.test.cjs`：领取去重、借物条件、朋友/生物/隐藏门解锁、彩蛋和恢复数据等行为测试。
- `themes/next/layout/_partials/side-quests.swig`：博客首页两张入口卡，自带局部样式。
- `themes/next/layout/index.swig`：首页文章之前引用入口卡。
- `themes/next/_config.yml`：导航增加两点半便利店与 Hot 100。
- `_config.yml`：追加 `night-store/**` 到 skip_render。

浏览器脚本按 content、state、scene、app 的顺序 defer 加载，不依赖打包器。构建产物总量目标小于 250 KB（不含原站已有资源），不使用图片大图或字体下载。

## 状态规则

初始状态 `{version:1, items:[], met:[], friends:[], stamps:[], endings:[], bellRings:0, fortuneDraws:0}`。

`createState()`、`takeItem(state,id)`、`meetCreature(state,id)`、`offerItem(state,creature,itemId)`、`ringBell(state)`、`recordEnding(state,id)`、`drawFortune(state)` 返回新状态或 `{state,...结果}`。借物需要物品已领取，且生物已见过；喜好来自 creature.favorite。基础生物 `cat,pigeon,moth,jelly`；取得 `pocket-rain` 出现 `snail`；交到 2 位朋友出现 `hedgehog`。3 位朋友开启后门。第 7 次门铃得到 `bellkeeper`，铃声计数最多 7。结局记录去重。

## 发布与验收

复用工作区中的独立源码检出 `publication/git-src` 和发布检出 `publication/git-pages-cache`。不修改 J 盘原仓库的未提交内容。源分支基线 91ad685，发布基线 928c2fc，已实时核对。

运行相关 Node 行为测试，检查桌面和窄屏完整交互、键盘对话框、持久化恢复和所有入口。以文件大小、浏览器实际加载和交互资源情况评估轻量性；不把下载体积冒充内存使用量。

在新构建目录运行 Hexo generate，发布仅需新站点资源和首页入口相关产物。普通 Git 提交并分别推送 src、main，验证 Pages 运行和真实在线地址。禁止删除、清空目录、强制推送；所有旧页面保留。
