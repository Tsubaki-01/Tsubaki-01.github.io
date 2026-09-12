const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../../source/night-store/state.js');

test('taking an item makes one persistent keepsake without changing the prior state', () => {
  const before = S.createState();
  const first = S.takeItem(before, 'friday-can');
  const repeat = S.takeItem(first.state, 'friday-can');
  assert.deepEqual(before.items, []);
  assert.deepEqual(repeat.state.items, ['friday-can']);
  assert.equal(first.fresh, true);
  assert.equal(repeat.fresh, false);
});

test('a creature accepts only an owned favorite after meeting, and lending keeps the item', () => {
  const cat = {id: 'cat', favorite: 'friday-can'};
  let state = S.createState();
  assert.equal(S.offerItem(state, cat, 'friday-can').reason, 'not-owned');
  state = S.takeItem(state, 'friday-can').state;
  assert.equal(S.offerItem(state, cat, 'friday-can').reason, 'not-met');
  state = S.meetCreature(state, 'cat').state;
  state = S.takeItem(state, 'quiet-soda').state;
  const wrong = S.offerItem(state, cat, 'quiet-soda');
  assert.equal(wrong.reason, 'mismatch');
  assert.deepEqual(wrong.state.friends, []);
  const right = S.offerItem(state, cat, 'friday-can');
  assert.equal(right.reason, 'liked');
  assert.deepEqual(right.state.friends, ['cat']);
  assert.equal(right.state.items.includes('friday-can'), true);
  assert.equal(S.offerItem(right.state, cat, 'friday-can').reason, 'already-friend');
});

test('rain and friendships open different discoveries, and three friends open the backroom', () => {
  let state = S.createState();
  assert.deepEqual(S.unlockedCreatures(state), ['cat', 'pigeon', 'moth', 'jelly']);
  assert.equal(S.isBackroomOpen(state), false);
  state = S.takeItem(state, 'pocket-rain').state;
  assert.equal(S.unlockedCreatures(state).includes('snail'), true);
  const creatures = [
    {id:'cat', favorite:'friday-can'},
    {id:'pigeon', favorite:'unsent-letter'},
    {id:'moth', favorite:'bubble-eraser'},
  ];
  for (const [i, creature] of creatures.entries()) {
    state = S.meetCreature(state, creature.id).state;
    state = S.takeItem(state, creature.favorite).state;
    state = S.offerItem(state, creature, creature.favorite).state;
    assert.equal(S.unlockedCreatures(state).includes('hedgehog'), i >= 1);
    assert.equal(S.isBackroomOpen(state), i >= 2);
  }
});

test('the seventh bell awards one badge and further rings do not grow the record', () => {
  let state = S.createState();
  for (let i = 0; i < 6; i++) state = S.ringBell(state).state;
  assert.deepEqual(state.stamps, []);
  const seventh = S.ringBell(state);
  assert.equal(seventh.fresh, true);
  state = seventh.state;
  for (let i = 0; i < 10; i++) state = S.ringBell(state).state;
  assert.equal(state.bellRings, 7);
  assert.deepEqual(state.stamps, ['bellkeeper']);
});

test('story endings are unique and JSON round-tripping preserves the visit', () => {
  let state = S.takeItem(S.createState(), 'spare-moon').state;
  state = S.meetCreature(state, 'jelly').state;
  state = S.recordEnding(state, 'dawn').state;
  state = S.recordEnding(state, 'dawn').state;
  state = S.recordEnding(state, 'stay').state;
  assert.deepEqual(state.endings, ['dawn', 'stay']);
  assert.deepEqual(state.stamps, ['after-hours']);
  const restored = JSON.parse(JSON.stringify(state));
  assert.deepEqual(restored, state);
  assert.equal(S.takeItem(restored, 'spare-moon').fresh, false);
});

test('fortune draws advance the counter without retaining an unbounded log', () => {
  const before = S.createState();
  const first = S.drawFortune(before);
  const second = S.drawFortune(first.state);
  assert.equal(first.index, 0);
  assert.equal(second.index, 1);
  assert.equal(before.fortuneDraws, 0);
  assert.equal(second.state.fortuneDraws, 2);
});
