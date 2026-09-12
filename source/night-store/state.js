(function () {
  'use strict';

  function createState() {
    return {version: 1, items: [], met: [], friends: [], stamps: [], endings: [], bellRings: 0, fortuneDraws: 0};
  }

  function add(state, key, id) {
    const fresh = !state[key].includes(id);
    return {state: fresh ? {...state, [key]: [...state[key], id]} : state, fresh};
  }

  function takeItem(state, id) {
    return add(state, 'items', id);
  }

  function meetCreature(state, id) {
    return add(state, 'met', id);
  }

  function offerItem(state, creature, itemId) {
    if (!state.items.includes(itemId)) return {state, reason: 'not-owned'};
    if (!state.met.includes(creature.id)) return {state, reason: 'not-met'};
    if (itemId !== creature.favorite) return {state, reason: 'mismatch'};
    const result = add(state, 'friends', creature.id);
    return {state: result.state, reason: result.fresh ? 'liked' : 'already-friend'};
  }

  function unlockedCreatures(state) {
    const ids = ['cat', 'pigeon', 'moth', 'jelly'];
    if (state.items.includes('pocket-rain')) ids.push('snail');
    if (state.friends.length >= 2) ids.push('hedgehog');
    return ids;
  }

  function isBackroomOpen(state) {
    return state.friends.length >= 3;
  }

  function ringBell(state) {
    const bellRings = Math.min(state.bellRings + 1, 7);
    const next = {...state, bellRings};
    return bellRings === 7 ? add(next, 'stamps', 'bellkeeper') : {state: next, fresh: false};
  }

  function recordEnding(state, id) {
    const result = add(state, 'endings', id);
    return {state: add(result.state, 'stamps', 'after-hours').state, fresh: result.fresh};
  }

  function drawFortune(state) {
    return {state: {...state, fortuneDraws: state.fortuneDraws + 1}, index: state.fortuneDraws};
  }

  const api = {createState, takeItem, meetCreature, offerItem, unlockedCreatures, isBackroomOpen, ringBell, recordEnding, drawFortune};
  globalThis.NightStoreState = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
