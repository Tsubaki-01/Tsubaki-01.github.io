(function () {
  'use strict';
  const D = NightStoreContent, S = NightStoreState, A = NightStoreArt;
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const itemById = Object.fromEntries(D.items.map(item => [item.id, item]));
  const creatureById = Object.fromEntries(D.creatures.map(creature => [creature.id, creature]));
  const dialog = $('#shop-dialog'), content = $('#dialog-content'), backButton = $('#dialog-back');
  const STORE_KEY = 'night-store-v1';
  let state = S.createState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved && saved.version === 1) state = {...state, ...saved};
  } catch (_) { /* A visit still works when browser storage is unavailable. */ }
  let trail = [], returnFocus = null, toastTimer, speechTimer;
  let radioIndex = 0, soundOn = false, audioContext = null, rainSource = null;
  const chats = {}, wrongOffers = {};

  $('#scene-art').innerHTML = A.store();

  function commit(next) {
    state = next;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) { /* Keep this visit in memory. */ }
    updateVisit();
  }

  function updateVisit() {
    $('#met-count').textContent = state.met.length;
    $('#pocket-count').textContent = state.items.length;
    const unlocked = S.unlockedCreatures(state);
    document.querySelectorAll('[data-unlock]').forEach(button => { button.hidden = !unlocked.includes(button.dataset.unlock); });
    document.querySelectorAll('[data-scene-creature]').forEach(figure => {
      figure.classList.toggle('ns-creature-locked', !unlocked.includes(figure.dataset.sceneCreature));
    });
    $('#door-label').textContent = S.isBackroomOpen(state) ? '后门为你留着' : '后门没上锁？';
    const notes = state.endings.length ? '你去过后门的那一边。猫看你的眼神有点不一样了。'
      : state.friends.length >= 3 ? '有三位街坊替你说好话。后门好像亮了一点。'
      : state.friends.length ? '有小生物记住你了。下次来，不用再自我介绍。'
      : state.items.length ? '口袋鼓了一点。也许店里的谁会喜欢这些东西。'
      : '你口袋里有空位，今晚也有。';
    $('#visit-note').textContent = notes;
  }

  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').classList.remove('show');
    $('#dialog-toast').hidden = true;
    const box = $(dialog.open ? '#dialog-toast' : '#toast');
    box.textContent = message;
    if (dialog.open) box.hidden = false;
    else box.classList.add('show');
    toastTimer = setTimeout(() => {
      $('#toast').classList.remove('show');
      $('#dialog-toast').hidden = true;
    }, 3700);
  }

  function say(message) {
    clearTimeout(speechTimer);
    $('#cat-bubble').textContent = message;
    speechTimer = setTimeout(() => { $('#cat-bubble').textContent = state.friends.includes('cat') ? '你的周末，我替你看着。' : '随便看看。别碰我的周末。'; }, 6500);
  }

  function heading(title, subtitle = '') {
    return `<h2 id="dialog-title" tabindex="-1">${esc(title)}</h2>${subtitle ? `<p class="dialog-subtitle">${esc(subtitle)}</p>` : ''}`;
  }

  function openRoot(view, data = {}) {
    if (!dialog.open) returnFocus = document.activeElement;
    if (view === 'fortune') {
      const result = S.drawFortune(state); commit(result.state); data = {index: result.index};
    }
    trail = [{view, data}];
    render();
    if (!dialog.open) dialog.showModal();
    $('#dialog-title', dialog)?.focus({preventScroll: true});
  }

  function push(view, data = {}) {
    trail.push({view, data}); render();
    $('#dialog-title', dialog)?.focus({preventScroll: true});
  }

  function render() {
    const current = trail[trail.length - 1];
    backButton.hidden = trail.length < 2;
    const renders = {shelf: renderShelf, product: renderProduct, receipt: renderReceipt, bestiary: renderBestiary,
      creature: renderCreature, pocket: renderPocket, fortune: renderFortune, news: renderNews,
      radio: renderRadio, backroom: renderBackroom, story: renderStory, about: renderAbout};
    content.innerHTML = renders[current.view](current.data);
    dialog.scrollTop = 0;
  }

  function renderShelf() {
    return heading('这些，今天都刚到。', '价格写在标签上，猫会替你结账。每样拿一份就好。') +
      `<div class="shelf-grid">${D.items.map(item => `<button class="shelf-item" data-item="${item.id}" aria-label="看看${esc(item.name)}">${state.items.includes(item.id) ? '<span class="owned-dot">已在口袋 ·</span>' : ''}${A.item(item.id)}<strong>${esc(item.name)}</strong><small>${esc(item.category)}</small></button>`).join('')}</div>` +
      '<p class="dialog-footnote">“如果你知道这些东西该怎么用，请务必告诉我。” —— 猫店长</p>';
  }

  function renderProduct({id}) {
    const item = itemById[id], owned = state.items.includes(id);
    return `<div class="product-layout"><div class="product-poster" style="--poster:${item.color}27">${A.item(id)}<small>两点半便利店 · ${esc(item.category)}<br>THIS IS NOT AN ORDINARY THING.</small></div><div class="product-copy"><p class="category-label">货架 ${String(D.items.indexOf(item)+1).padStart(2,'0')} / ${esc(item.category)}</p>${heading(item.name)}<p class="product-subtitle">${esc(item.subtitle)}</p><p class="story-copy">${esc(item.description)}</p><div class="product-instructions"><p><b>使用方法</b>　${esc(item.instructions)}</p><p><b>包装背面的小字</b>　${esc(item.warning)}</p></div><p class="price-note">标价：${esc(item.price)}<br>实际付款：不用。今晚记在猫的账上。</p><div class="button-row"><button class="button-primary" data-take="${id}">${owned ? '翻翻它的小票' : '拿一份，放进口袋'}</button>${owned ? '<button class="button-secondary" data-open="bestiary">谁会喜欢它？</button>' : ''}</div></div></div>`;
  }

  function receiptMarkup(item) {
    const number = D.items.indexOf(item) + 1;
    return `<article class="receipt"><p class="receipt-logo">两点半便利店</p><small>ODD RECEIPT / 02:30-${String(number).padStart(3,'0')}</small><hr class="receipt-rule"><div class="receipt-line"><span>${esc(item.name)}</span><span>× 1</span></div><div class="receipt-line"><span>原标价</span><span>${esc(item.price)}</span></div><div class="receipt-line"><span>猫店长抹零</span><span>全部</span></div><hr class="receipt-rule"><div class="receipt-line"><strong>实付</strong><strong>来过就算</strong></div><p class="receipt-message">${esc(item.receipt)}</p><div class="receipt-stamp">猫已垫付</div><small>物品请收好，尴尬可以落在店里。</small><div class="barcode" aria-hidden="true"></div><small>本小票不证明任何事，除了你来过。</small></article>`;
  }

  function renderReceipt({id}) {
    return heading('喏，小票。', '它也收进口袋了。下次想看，随时可以翻出来。') + receiptMarkup(itemById[id]) +
      '<div class="receipt-actions button-row"><button class="button-primary" data-open="bestiary">找个小生物，借它看看</button><button class="button-secondary" data-open="shelf">继续逛货架</button></div>';
  }

  function renderBestiary() {
    const unlocked = S.unlockedCreatures(state);
    return heading('它们也在躲雨。', '靠近一点，听听它的事。借对了东西，也许就成了朋友。') +
      `<div class="bestiary-grid">${D.creatures.map(creature => {
        const available = unlocked.includes(creature.id), friend = state.friends.includes(creature.id);
        return `<button class="creature-card${available?'':' locked'}" ${available?`data-creature="${creature.id}"`:'disabled'} aria-label="${available?`认识${esc(creature.name)}`:esc(creature.unlockHint)}">${A.creature(creature.id)}<strong>${available?esc(creature.name):'还没来串门'}</strong><small>${available?esc(creature.alias):esc(creature.unlockHint)}</small>${friend?'<span class="friend-mark">已经是朋友了</span>':''}</button>`;
      }).join('')}</div><p class="dialog-footnote">已打过招呼 ${state.met.length} / 6　·　它们不需要每天喂食，也不会因为你忙而生气。</p>`;
  }

  function renderCreature({id, speech}) {
    const creature = creatureById[id], friend = state.friends.includes(id);
    return `<div class="creature-layout"><div class="creature-portrait" style="--poster:${creature.color}25">${A.creature(id)}<small>观察记录 NO. ${String(D.creatures.indexOf(creature)+1).padStart(2,'0')}<br>${esc(creature.alias)}</small>${friend?'<span class="friend-mark">它认得你了</span>':''}</div><div>${heading(creature.name)}<p class="story-copy">${esc(creature.intro)}</p><div class="creature-dialogue" role="status">${esc(speech || creature.chat[0])}</div><div class="button-row"><button class="button-secondary" data-chat="${id}">再聊一句</button><button class="button-secondary" data-hint="${id}">看看它喜欢什么</button></div><div class="creature-facts"><div><b>常出没于</b>${esc(creature.habitat)}</div><div><b>奇怪的习惯</b>${esc(creature.habit)}</div></div>${friend?`<p class="friend-note">新观察：${esc(creature.friendNote)}</p>`:''}<div class="offer-picker"><p>从口袋里借它一样东西。物品会一直替你留着。</p>${state.items.length?`<div class="offer-options">${state.items.map(itemId=>`<button data-offer="${itemId}" data-to="${id}">${esc(itemById[itemId].name)}</button>`).join('')}</div>`:'<p>口袋暂时空空的。货架上也许有它喜欢的东西。</p><button class="button-primary" data-open="shelf">去逛货架</button>'}</div></div></div>`;
  }

  function renderPocket() {
    const endingNames = Object.fromEntries(Object.values(D.story.nodes).filter(node => node.ending).map(node => [node.ending.id, node.ending.title]));
    return heading('口袋里的小事。', '物品、小票，还有几枚来过的印记，都在这里。') +
      (state.items.length ? `<div class="pocket-grid">${state.items.map(id=>`<button class="pocket-item" data-item="${id}">${A.item(id)}${esc(itemById[id].name)}</button>`).join('')}</div><p class="dialog-footnote">点开物品，可以翻它的小票。借给生物看过的东西也一直在。</p>` : `<div class="empty-note">${A.item('blank-ticket')}目前只有一点空气。<br>货架上的东西可以免费带走。</div><div class="center-actions"><button class="button-primary" data-open="shelf">去货架看看</button></div>`) +
      `<h3 class="section-label">衣角上的印章</h3><div class="badge-list">${state.stamps.includes('bellkeeper')?'<span class="badge">名誉门铃 · 叮咚七级</span>':''}${state.friends.map(id=>`<span class="badge">${esc(creatureById[id].alias)}的朋友</span>`).join('')}${state.endings.map(id=>`<span class="badge">${endingNames[id]}</span>`).join('')}</div>${!state.stamps.length&&!state.friends.length?'<p class="dialog-subtitle">还没有印章。不过衣服干干净净也很好。</p>':''}`;
  }

  function renderFortune({index}) {
    const fortune = D.fortunes[index % D.fortunes.length];
    return heading('摇一个莫名其妙。', '这台机器不预测未来。它只负责把纸条摇出来。') +
      `<div class="fortune-layout"><div class="fortune-art">${A.fortune()}</div><article class="fortune-paper"><h3>${esc(fortune.title)}</h3><p>${esc(fortune.text)}</p><small>${esc(fortune.lucky)}</small></article></div><div class="center-actions"><button class="button-primary" data-action="fortune-again">不够莫名其妙，再摇一个</button></div><p class="dialog-footnote">第 ${index+1} 次摇动。机器对自己的胡说八道非常满意。</p>`;
  }

  function renderNews({index = 0}) {
    const news = D.news[index];
    return heading('深夜小报。', '街坊编的，猫审的。真实性请自行和鸽子商量。') +
      `<div class="news-tabs" aria-label="选择报纸期数">${D.news.map((_, i)=>`<button data-news="${i}" aria-pressed="${i===index}">第 ${String(i+1).padStart(2,'0')} 份</button>`).join('')}</div><article class="newspaper"><div class="newspaper-masthead">不太日报</div><small>${esc(news.date)} · 今天也没什么大不了</small><h3>${esc(news.title)}</h3><p class="story-copy">${esc(news.body)}</p><footer>主编：不愿透露姓名的猫　/　发行：未读鸽<br>读完可垫桌脚，请勿用来包裹正在发光的水母。</footer></article>`;
  }

  function renderRadio() {
    return heading('没有点歌台的电台。', '旋钮有点松。下一句会播什么，连主持人也不知道。') +
      `<div class="radio-display"><div class="frequency">FM 02.30 / 深夜街坊频道</div><div class="radio-dial"></div><p id="radio-line">${esc(D.radio[radioIndex%D.radio.length])}</p></div><div class="center-actions button-row"><button class="button-primary" data-action="radio-next">拧一下旋钮</button><button class="button-secondary" data-action="audio">${soundOn?'把雨声调小到没有':'配一点雨声'}</button></div><p class="dialog-footnote">小报负责胡说，电台负责把胡说念得很温柔。</p>`;
  }

  function renderBackroom() {
    if (S.isBackroomOpen(state)) {
      return heading('门给你留着。', '门把手有一点温热。里面传来翻日历的声音。') + `<div class="story-scene">${A.backroom()}<p class="story-copy">猫递来一把并不存在的钥匙。“三位街坊说你可以。进去吧，回来时别忘了你是来买什么的。虽然我也忘了。”</p><div class="story-choices"><button data-story="${esc(D.story.start)}">轻轻推开门 <span>→</span></button></div></div>`;
    }
    return heading('门好像在认人。', '门牌上写着：“有三个朋友替你作证，就请进。”') + `<div class="story-scene">${A.backroom()}<p class="story-copy">你试着转了转门把手。门里有人小声说：“再认识几位街坊吧。它们喜欢什么，问问就知道了。”</p><p class="dialog-subtitle">现在有 ${state.friends.length} 位小生物愿意替你说好话。</p><button class="button-primary" data-open="bestiary">去和街坊打个招呼</button></div>`;
  }

  function renderStory({node: nodeId}) {
    const node = D.story.nodes[nodeId];
    return heading(D.story.title, '这里的时间偶尔走错路。你可以慢一点选。') +
      `<div class="story-scene"><div class="story-art">${A.backroom()}</div><p class="story-copy">${esc(node.text)}</p>${node.ending?`<div class="ending-stamp">${esc(node.ending.title)}</div><p class="dialog-subtitle">${esc(node.ending.note)}</p><div class="button-row"><button class="button-primary" data-action="close">回到亮着灯的小店</button><button class="button-secondary" data-story="${esc(D.story.start)}">再走进另一条岔路</button></div>`:`<div class="story-choices">${node.choices.map(choice=>`<button data-story="${esc(choice.next)}">${esc(choice.label)} <span>→</span></button>`).join('')}</div>`}</div>`;
  }

  function renderAbout() {
    return heading('猫写的店规。', '字有点歪，主要因为它坚持用爪子写。') + `<div class="rules-list"><p><b>01 / 欢迎光临</b>看到亮着的小圆点，就可以碰一碰。货架、收音机和报纸都归你随便翻。</p><p><b>02 / 关于结账</b>每样奇物可以免费带走一份。猫说不用钱，问多了它会改口。</p><p><b>03 / 关于街坊</b>和小生物聊聊天，看看它的喜好，再从口袋里借一样东西给它。猜错没有关系，物品也不会少。</p><p><b>04 / 关于后门</b>认识三个愿意和你交朋友的街坊，再去试试那扇门。门里的时间有一点多。</p><p><b>05 / 关于下次</b>口袋和观察册会留在当前浏览器里。没有签到，没有过期，没有谁等着你按时来。</p><p><b>06 / 最后一条</b>没有必须完成的事。不买东西也可以待着。</p></div><div class="center-actions"><button class="button-primary" data-action="close">知道了，猫店长</button></div>`;
  }

  function visitCreature(id) {
    commit(S.meetCreature(state, id).state);
    if (dialog.open) push('creature', {id}); else openRoot('creature', {id});
  }

  function enterStory(nodeId) {
    const node = D.story.nodes[nodeId];
    if (node.ending) {
      const result = S.recordEnding(state, node.ending.id); commit(result.state);
      if (result.fresh) toast('这个结局变成了一枚印章，收在口袋里了。');
    }
    if (trail[trail.length-1].view === 'story') { trail[trail.length-1] = {view:'story',data:{node:nodeId}}; render(); }
    else push('story', {node:nodeId});
    $('#dialog-title', dialog)?.focus({preventScroll: true});
  }

  async function toggleAudio() {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = (Math.random()*2-1)*.5;
        rainSource = audioContext.createBufferSource(); rainSource.buffer = buffer; rainSource.loop = true;
        const filter = audioContext.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1900;
        const gain = audioContext.createGain(); gain.gain.value = .085;
        rainSource.connect(filter).connect(gain).connect(audioContext.destination); rainSource.start();
      }
      soundOn = !soundOn;
      await (soundOn ? audioContext.resume() : audioContext.suspend());
      const button = $('.audio-toggle');
      button.setAttribute('aria-pressed', String(soundOn));
      button.setAttribute('aria-label', soundOn ? '关闭雨声' : '开启雨声');
      $('.sound-label', button).textContent = soundOn ? '雨声开着' : '听一点雨';
      if (dialog.open && trail[trail.length-1].view === 'radio') render();
      else toast(soundOn ? '雨声调好了。今天的雨不收钱。' : '雨还在下，只是安静了一点。');
    } catch (_) { toast('收音机今天有点接触不良，先安静坐一会儿。'); }
  }

  function bellTone() {
    if (!soundOn || !audioContext || audioContext.state !== 'running') return;
    const tone = audioContext.createOscillator(), gain = audioContext.createGain();
    const now = audioContext.currentTime;
    tone.type = 'sine'; tone.frequency.setValueAtTime(880, now); tone.frequency.setValueAtTime(659, now+.19);
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.065, now+.015); gain.gain.exponentialRampToValueAtTime(.0001, now+.55);
    tone.connect(gain).connect(audioContext.destination); tone.start(now); tone.stop(now+.56);
    tone.onended = () => { tone.disconnect(); gain.disconnect(); };
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    const data = button.dataset;
    if (data.open) {
      if (dialog.open && data.open !== 'fortune') push(data.open, {}); else openRoot(data.open);
    } else if (data.item) push('product', {id:data.item});
    else if (data.creature) visitCreature(data.creature);
    else if (data.take) {
      const result = S.takeItem(state, data.take); commit(result.state);
      push('receipt', {id:data.take});
      if (result.fresh) {
        if (data.take === 'pocket-rain') toast('门口有谁穿着雨靴来了。快去观察册看看。');
        else toast('放进口袋了。猫说它已经结过账。');
      }
    } else if (data.chat) {
      const creature = creatureById[data.chat]; chats[data.chat] = (chats[data.chat] || 0) + 1;
      $('.creature-dialogue', dialog).textContent = creature.chat[chats[data.chat] % creature.chat.length];
    } else if (data.hint) $('.creature-dialogue', dialog).textContent = creatureById[data.hint].hint;
    else if (data.offer) {
      const creature = creatureById[data.to], beforeFriends = state.friends.length;
      const result = S.offerItem(state, creature, data.offer); commit(result.state);
      let speech;
      if (result.reason === 'liked') {
        speech = creature.thanks;
        toast(beforeFriends === 1 ? '星期三刺猬听说你来了，也出来串门了。' : beforeFriends === 2 ? '后门传来咔哒一声。好像是在叫你。' : '它记住你了。观察册里多了一条新记录。');
      } else if (result.reason === 'already-friend') speech = creature.friendNote;
      else {
        const n = wrongOffers[data.to] || 0; wrongOffers[data.to] = n + 1;
        speech = creature.wrong[n % creature.wrong.length];
      }
      trail[trail.length-1].data.speech = speech; render();
      $(`[data-offer="${data.offer}"]`, dialog)?.focus({preventScroll:true});
    } else if (data.news) {
      trail[trail.length-1].data.index = Number(data.news); render();
      $(`[data-news="${data.news}"]`, dialog)?.focus({preventScroll:true});
    } else if (data.story) enterStory(data.story);
    else if (data.action === 'close') dialog.close();
    else if (data.action === 'bell') {
      const result = S.ringBell(state); commit(result.state); bellTone();
      say(D.bell[Math.min(state.bellRings, 7)-1]);
      if (result.fresh) toast('猫给你盖了一个“名誉门铃”的章。收在口袋里了。');
    } else if (data.action === 'fortune-again') {
      const result = S.drawFortune(state); commit(result.state);
      trail[trail.length-1].data.index = result.index; render();
      $('[data-action="fortune-again"]', dialog).focus({preventScroll:true});
    } else if (data.action === 'radio-next') {
      radioIndex++; $('#radio-line').textContent = D.radio[radioIndex % D.radio.length]; bellTone();
    } else if (data.action === 'audio') toggleAudio();
  });

  backButton.addEventListener('click', () => { trail.pop(); render(); $('#dialog-title', dialog)?.focus({preventScroll:true}); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll:true}); trail = []; });
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-asleep', document.hidden);
    if (audioContext && soundOn) (document.hidden ? audioContext.suspend() : audioContext.resume()).catch(() => {});
  });
  updateVisit();
  if (state.friends.includes('cat')) say('回来啦？你的周末，我替你看着呢。');
})();
