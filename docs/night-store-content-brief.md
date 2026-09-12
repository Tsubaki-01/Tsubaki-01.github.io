# Content task: 两点半便利店

Own only `source/night-store/content.js`. No other implementation files; no dependencies or network. You are not alone in this repo: do not revert other edits or commit their files. No subagents. No deletion, cleanup, force pushes or publishing. Report to `.superpowers/sdd/2026-09-12-night-store/task-1-report.md`.

Write funny, specific, warm original Chinese fiction. The store sells useless impossible things and shelters strange creatures. No career, study, productivity, therapy advice, boilerplate AI copy, monetization, real transactions or copyrighted quotations. Every product should contain a small scene or incident worth reading. Include sly cross-references between goods, creatures, receipts and news. Avoid endlessly repeating the same joke.

Use an IIFE exporting `globalThis.NightStoreContent = data; if (typeof module !== 'undefined' && module.exports) module.exports = data;`. Only plain serializable data. UI will escape text.

## Exact schema

`data.items`: 12 entries, each `{id,name,subtitle,category,color,price,description,instructions,warning,receipt,art}`. category is an original short shelf category; color is a valid hex color; description/instructions/warning/receipt are strings; art uses the exact IDs below. Name should remain brief (roughly 4-9 Chinese characters), description 60-120 Chinese characters, instructions 20-50, warning 15-40, receipt one memorable short line.

IDs/art and suggested concepts (can refine names but keep IDs):
1. `friday-can`: 周五下午罐头
2. `unsent-letter`: 没发出的消息
3. `bubble-eraser`: 气泡橡皮
4. `spare-moon`: 备用月亮
5. `pocket-rain`: 口袋雨云
6. `courage-candy`: 勇气柠檬糖
7. `yesterday-bread`: 昨日面包
8. `quiet-soda`: 小声汽水
9. `borrowed-summer`: 借来的夏天
10. `lost-sock`: 袜子寻亲包
11. `slow-clock`: 慢半拍闹钟
12. `blank-ticket`: 去哪都行车票

`data.creatures`: 6 entries, each `{id,name,alias,color,favorite,habitat,diet,habit,rumor,intro,chat,hint,thanks,friendNote,wrong,unlockHint}`. favorite is one exact item id. intro/hint/thanks/friendNote etc are strings. chat is 4 different short lines. wrong is 3 different whimsical polite responses, array of strings. Each creature has a distinct voice; no stress/decay mechanics.

Exact pairings: `cat` (偷走周末的猫) loves `friday-can`; `pigeon` (未读鸽) loves `unsent-letter`; `moth` (尴尬吞吞毛球, despite id moth) loves `bubble-eraser`; `jelly` (困意水母) loves `spare-moon`; `snail` (雨靴蜗牛) loves `pocket-rain`; `hedgehog` (星期三刺猬) loves `courage-candy`.

Initially visible: cat/pigeon/moth/jelly. Snail appears after pocket-rain is taken. Hedgehog appears after 2 friendships. Backroom story opens after 3 friendships. unlockHint must reflect that. Tiny observation prose rather than abstract trait labels.

`data.fortunes`: 16 objects `{title,text,lucky}`. Entirely absurd fictional fortunes, no financial/medical advice.

`data.news`: 5 objects `{title,date,body}`. Date is fictional issue label, e.g. '第 02:30 期'. Body 100-180 Chinese characters. At least one on cat/weekend, one on pigeons/unread notices and one tiny classified ad.

`data.radio`: 10 short written radio broadcasts. No audio files.

`data.bell`: 7 distinct lines; seventh awards honorary doorbell status.

`data.story`: `{title,start,nodes}`. nodes is an object keyed by id; each node `{text,choices:[{label,next}]}` or ending `{text,ending:{id,title,note}}`. Exactly 3 ending IDs `dawn`,`stay`,`weekend`. Finite branching short fiction set behind store's hidden door (e.g. missing time depot), approx 8-12 nodes. Every route terminates, 2-4 choices per non-ending node, each ending reachable. Text strings about 70-140 Chinese characters, no HTML. Story stays fun and gentle, no horror violence. Title and other content original.

## Validation and report

Run Node to load the data, verify 12 distinct item ids, six exact favorites and story reachability/termination. These checks concern content links consumed by UI, not a broad validation framework. Write a short report with status, owned files, executed check results, and any concerns. Commit only `source/night-store/content.js` using `git add -- source/night-store/content.js`, then a concise commit message. Source checkout is `publication/git-src` under current workspace. Return only status, commit and a short result.
