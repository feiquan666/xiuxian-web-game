import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ATTRIBUTE_KEYS,
  buyPill,
  calculateBreakthroughChance,
  createInitialState,
  defaultItems,
  defaultEncounters,
  defaultRealms,
  getCurrentRealm,
  loadState,
  maybeRollEncounter,
  performAction,
  refinePill,
  resolveEncounter,
  tick,
  tryBreakthrough,
  useInventoryItem,
} from '../src/game.js';

test('content follows the Xian Ni main cultivation chain', () => {
  const majorSequence = [];
  for (const realm of defaultRealms) {
    if (majorSequence.at(-1) !== realm.major) {
      majorSequence.push(realm.major);
    }
  }

  assert.deepEqual(majorSequence, [
    '凝气',
    '筑基',
    '结丹',
    '元婴',
    '化神',
    '婴变',
    '问鼎',
    '阴虚',
    '阳实',
    '窥涅',
    '净涅',
    '碎涅',
    '天人五衰',
    '空涅',
    '空灵',
    '空玄',
    '空劫',
    '半步踏天',
    '踏天',
  ]);
  assert.equal(defaultRealms.filter((realm) => realm.major === '凝气').length, 15);
  assert.ok(defaultRealms.some((realm) => realm.name === '踏天'));
});

test('realm gates introduce insight, law, origin, declines, and heaven bridge requirements', () => {
  const huashen = defaultRealms.find((realm) => realm.major === '化神');
  const kuine = defaultRealms.find((realm) => realm.major === '窥涅');
  const suinie = defaultRealms.find((realm) => realm.major === '碎涅');
  const decline = defaultRealms.find((realm) => realm.major === '天人五衰');
  const bridge = defaultRealms.find((realm) => realm.major === '半步踏天');

  assert.ok(huashen.requirements.insight > 0);
  assert.ok(kuine.requirements.law > 0);
  assert.ok(suinie.requirements.origin > 0);
  assert.equal(decline.special, 'five-decline');
  assert.equal(bridge.special, 'heaven-bridge');
});

test('events are weighted, realm-bound, and cover all required majors plus NPCs', () => {
  const requiredKeys = [
    'id',
    'title',
    'description',
    'realmRange',
    'weight',
    'choices',
    'effects',
    'risk',
    'reward',
    'tags',
  ];

  for (const event of defaultEncounters) {
    for (const key of requiredKeys) {
      assert.ok(Object.hasOwn(event, key), `${event.id} missing ${key}`);
    }
    assert.ok(event.weight > 0);
    assert.ok(event.choices.length >= 2);
  }

  for (const major of [...new Set(defaultRealms.map((realm) => realm.major))]) {
    assert.ok(
      defaultEncounters.some((event) => event.tags.includes(`realm:${major}`)),
      `missing realm event for ${major}`,
    );
  }

  const npcNames = new Set(defaultEncounters.map((event) => event.npc).filter(Boolean));
  assert.ok(npcNames.size >= 8);
  assert.ok(npcNames.has('王林'));
  assert.ok(npcNames.has('司徒南'));
  assert.ok(npcNames.has('李慕婉'));
});

test('tick increases cultivation and caps offline progress', () => {
  const state = createInitialState(0);

  const tenSeconds = tick(state, 10_000);
  assert.ok(tenSeconds.cultivation > 10);

  const twentyHours = tick(state, 20 * 60 * 60 * 1000);
  assert.ok(twentyHours.cultivation <= defaultRealms[0].gainRate * 28_800 * 2);
});

test('initial state contains all core and advanced attributes', () => {
  const state = createInitialState(0);

  for (const key of ATTRIBUTE_KEYS) {
    assert.ok(Object.hasOwn(state, key), `missing ${key}`);
  }
  assert.equal(state.realmIndex, 0);
  assert.equal(getCurrentRealm(state).name, '凝气一层');
  assert.equal(state.saveVersion, 3);
  assert.ok(Object.hasOwn(state, 'inventory'));
  assert.equal(typeof state.inventory, 'object');
});

test('item content provides categorized storage bag entries', () => {
  assert.ok(defaultItems.length >= 12);
  assert.ok(defaultItems.some((item) => item.id === 'cleansing_pill' && item.usable));
  assert.ok(defaultItems.some((item) =>
    item.id === 'longevity_pill' &&
    item.name === '寿元丹' &&
    item.effects.some((effect) => effect.type === 'lifeSpan' && effect.amount > 0)));
  assert.ok(defaultItems.some((item) => item.category === '特殊'));
});

test('player actions provide feedback and affect different risk tracks', () => {
  const state = createInitialState(0);

  const cultivate = performAction(state, 'cultivate', 1_000, 0.5);
  assert.equal(cultivate.ok, true);
  assert.ok(cultivate.state.cultivation > state.cultivation);

  const travel = performAction(cultivate.state, 'travel', 2_000, 0.01);
  assert.equal(travel.ok, true);
  assert.ok(travel.state.pendingEncounterId);

  const heal = performAction({ ...travel.state, injury: 20, spiritStones: 50 }, 'heal', 3_000, 0.5);
  assert.ok(heal.state.injury < 20);
  assert.ok(heal.state.spiritStones < 50);
});

test('refinePill increases pills and sets cooldown', () => {
  const state = createInitialState(0);

  const result = refinePill(state, 1_000, 0.5);

  assert.equal(result.ok, true);
  assert.equal(result.state.pills, 1);
  assert.ok(result.state.pillCooldownUntil > 1_000);
});

test('refinePill can craft a longevity pill for life span recovery', () => {
  const state = createInitialState(0);

  const result = refinePill(state, 1_000, 0.5, 'longevity_pill');

  assert.equal(result.ok, true);
  assert.equal(result.state.inventory.longevity_pill, 1);
  assert.equal(result.state.pills, 0);
  assert.match(result.message, /寿元丹/);
});

test('buyPill can buy a selected longevity pill', () => {
  const state = {
    ...createInitialState(0),
    spiritStones: 80,
  };

  const result = buyPill(state, 'longevity_pill', 1_000, 0.5);

  assert.equal(result.ok, true);
  assert.equal(result.state.spiritStones, 20);
  assert.equal(result.state.inventory.longevity_pill, 1);
  assert.equal(result.state.pills, 0);
});

test('breakthrough is blocked before enough cultivation', () => {
  const result = tryBreakthrough(createInitialState(0), 1_000, 0);

  assert.equal(result.ok, false);
  assert.equal(result.state.realmIndex, 0);
});

test('successful breakthrough advances realm', () => {
  const state = {
    ...createInitialState(0),
    cultivation: defaultRealms[0].energyRequired,
  };

  const result = tryBreakthrough(state, 1_000, 0.01);

  assert.equal(result.ok, true);
  assert.equal(result.state.realmIndex, 1);
  assert.equal(result.state.cultivation, 0);
});

test('breakthrough chance responds to stats, injuries, demons, and preparation', () => {
  const base = {
    ...createInitialState(0),
    cultivation: defaultRealms[0].energyRequired,
  };
  const prepared = {
    ...base,
    comprehension: 18,
    aptitude: 18,
    daoHeart: 18,
    luck: 18,
    pills: 2,
    technique: 4,
    artifact: 4,
  };
  const damaged = {
    ...base,
    heartDemon: 40,
    injury: 35,
  };

  assert.ok(calculateBreakthroughChance(prepared) > calculateBreakthroughChance(base));
  assert.ok(calculateBreakthroughChance(damaged) < calculateBreakthroughChance(base));
});

test('advanced breakthroughs require insight, law, and origin gates', () => {
  const huashenIndex = defaultRealms.findIndex((realm) => realm.major === '化神');
  const state = {
    ...createInitialState(0),
    realmIndex: huashenIndex,
    cultivation: defaultRealms[huashenIndex].energyRequired,
    insight: 0,
  };

  const result = tryBreakthrough(state, 1_000, 0);

  assert.equal(result.ok, false);
  assert.match(result.message, /意境/);
});

test('failed breakthrough applies heavier penalties during heavenly decline', () => {
  const declineIndex = defaultRealms.findIndex((realm) => realm.major === '天人五衰');
  const state = {
    ...createInitialState(0),
    realmIndex: declineIndex,
    cultivation: defaultRealms[declineIndex].energyRequired,
    spiritStones: 200,
    pills: 1,
    daoHeart: 30,
    insight: 200,
    law: 200,
    origin: 200,
    tribulationResistance: 20,
    lifeSpan: 600,
  };

  const result = tryBreakthrough(state, 1_000, 0.99);

  assert.equal(result.ok, false);
  assert.equal(result.state.realmIndex, declineIndex);
  assert.ok(result.state.lifeSpan < 600);
  assert.ok(result.state.injury > state.injury);
  assert.ok(result.state.heartDemon > state.heartDemon);
});

test('resolveEncounter applies effects and clears pending encounter', () => {
  const event = defaultEncounters.find((item) => item.id === 'npc-wanglin-daoxin');
  const state = {
    ...createInitialState(0),
    pendingEncounterId: event.id,
  };

  const result = resolveEncounter(state, 'listen', 1_000, 0.5);

  assert.equal(result.ok, true);
  assert.ok(result.state.daoHeart > state.daoHeart);
  assert.ok(result.state.insight > state.insight);
  assert.ok(result.state.npcBonds['王林'] > 0);
  assert.equal(result.state.pendingEncounterId, null);
});

test('encounter costs only block true consumable resources', () => {
  const state = {
    ...createInitialState(0),
    pendingEncounterId: 'five-decline',
    spiritStones: 100,
    heartDemon: 0,
  };

  const result = resolveEncounter(state, 'avoid', 1_000, 0.5);

  assert.equal(result.ok, true);
  assert.equal(result.state.heartDemon, 0);
  assert.equal(result.state.spiritStones, 20);
});

test('encounter still blocks true resource shortages', () => {
  const state = {
    ...createInitialState(0),
    pendingEncounterId: 'five-decline',
    spiritStones: 20,
    heartDemon: 0,
  };

  const result = resolveEncounter(state, 'avoid', 1_000, 0.5);

  assert.equal(result.ok, false);
  assert.match(result.message, /灵石不足/);
});

test('encounter still blocks life span shortages', () => {
  const state = {
    ...createInitialState(0),
    pendingEncounterId: 'five-decline',
    lifeSpan: 7,
  };

  const result = resolveEncounter(state, 'endure', 1_000, 0.5);

  assert.equal(result.ok, false);
  assert.match(result.message, /寿元不足/);
});

test('using a cleansing pill lowers heart demon and consumes inventory', () => {
  const state = {
    ...createInitialState(0),
    heartDemon: 18,
    inventory: { cleansing_pill: 1 },
  };

  const result = useInventoryItem(state, 'cleansing_pill', 1_000);

  assert.equal(result.ok, true);
  assert.equal(result.state.inventory.cleansing_pill, 0);
  assert.ok(result.state.heartDemon < 18);
});

test('using a longevity pill increases life span and consumes inventory', () => {
  const state = {
    ...createInitialState(0),
    lifeSpan: 7,
    inventory: { longevity_pill: 1 },
  };

  const result = useInventoryItem(state, 'longevity_pill', 1_000);

  assert.equal(result.ok, true);
  assert.equal(result.state.inventory.longevity_pill, 0);
  assert.ok(result.state.lifeSpan > 7);
});

test('using an injury reducing item works at zero injury', () => {
  const state = {
    ...createInitialState(0),
    injury: 0,
    inventory: { jade_guard: 1 },
  };

  const result = useInventoryItem(state, 'jade_guard', 1_000);

  assert.equal(result.ok, true);
  assert.equal(result.state.inventory.jade_guard, 0);
  assert.equal(result.state.injury, 0);
  assert.ok(result.state.daoHeart > state.daoHeart);
});

test('using a missing item is blocked', () => {
  const state = {
    ...createInitialState(0),
    inventory: {},
  };

  const result = useInventoryItem(state, 'cleansing_pill', 1_000);

  assert.equal(result.ok, false);
  assert.match(result.message, /储物袋/);
});

test('weighted encounter rolls respect realm ranges and luck', () => {
  const state = {
    ...createInitialState(0),
    realmIndex: defaultRealms.findIndex((realm) => realm.major === '空涅'),
    luck: 30,
  };

  const rolled = maybeRollEncounter(state, 1_000, 0.001, 0.99);

  assert.ok(rolled.pendingEncounterId);
  assert.notEqual(rolled.pendingEncounterId, 'qigong-root-test');
});

test('loadState migrates v1 browser saves into the expanded v2 state', () => {
  const storage = new Map();
  storage.set(
    'xiuxian-web-save-v1',
    JSON.stringify({
      saveVersion: 1,
      realmIndex: 2,
      spiritualEnergy: 123,
      pills: 2,
      log: [],
    }),
  );
  const api = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };

  const state = loadState(api, 1_000);

  assert.equal(state.saveVersion, 3);
  assert.equal(state.realmIndex, 2);
  assert.equal(state.cultivation, 123);
  assert.equal(state.pills, 2);
  assert.equal(state.lifeSpan, 80);
  assert.ok(Object.hasOwn(state, 'inventory'));
});
