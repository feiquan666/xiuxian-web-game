export const SAVE_KEY = 'xiuxian-web-save-v1';
export const SAVE_VERSION = 3;
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
export const PILL_COOLDOWN_MS = 18_000;
export const LOG_LIMIT = 60;

export const ATTRIBUTE_KEYS = [
  'cultivation',
  'spiritStones',
  'lifeSpan',
  'combatPower',
  'luck',
  'comprehension',
  'aptitude',
  'daoHeart',
  'heartDemon',
  'injury',
  'reputation',
  'insight',
  'law',
  'origin',
  'tribulationResistance',
  'alchemy',
  'artifact',
  'technique',
  'sectContribution',
];

const REQUIREMENT_LABELS = {
  spiritStones: '灵石',
  pills: '丹药',
  lifeSpan: '寿元',
  combatPower: '战力',
  luck: '气运',
  comprehension: '悟性',
  aptitude: '根骨',
  daoHeart: '道心',
  insight: '意境',
  law: '法则感悟',
  origin: '本源',
  tribulationResistance: '天劫抗性',
  artifact: '法宝',
  technique: '功法',
  sectContribution: '宗门贡献',
};

const COST_RESOURCE_KEYS = new Set(['spiritStones', 'pills', 'lifeSpan', 'sectContribution']);

const MAJOR_STEPS = [
  { major: '凝气', phases: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层', '十层', '十一层', '十二层', '十三层', '十四层', '十五层'] },
  { major: '筑基', phases: ['初期', '中期', '后期'] },
  { major: '结丹', phases: ['初期', '中期', '后期', '圆满'] },
  { major: '元婴', phases: ['初期', '中期', '后期', '圆满'] },
  { major: '化神', phases: ['初期', '中期', '后期', '大圆满'] },
  { major: '婴变', phases: ['初期', '中期', '后期', '大圆满'] },
  { major: '问鼎', phases: ['初期', '中期', '后期', '大圆满'] },
  { major: '阴虚', phases: ['阴虚'] },
  { major: '阳实', phases: ['阳实'] },
  { major: '窥涅', phases: ['初期', '中期', '后期', '圆满'] },
  { major: '净涅', phases: ['初期', '中期', '后期', '圆满'] },
  { major: '碎涅', phases: ['初期', '中期', '后期', '圆满'] },
  { major: '天人五衰', phases: ['第一衰', '第二衰', '第三衰', '第四衰', '第五衰'], special: 'five-decline' },
  { major: '空涅', phases: ['空涅'] },
  { major: '空灵', phases: ['空灵'] },
  { major: '空玄', phases: ['初期', '中期', '后期', '大圆满', '玄劫'], special: 'mystic-tribulation' },
  { major: '空劫', phases: ['初期', '中期', '后期', '巅峰'] },
  {
    major: '半步踏天',
    phases: ['第一桥', '第二桥', '第三桥', '第四桥', '第五桥', '第六桥', '第七桥', '第八桥', '第九桥'],
    special: 'heaven-bridge',
  },
  { major: '踏天', phases: ['踏天'], final: true },
];

const MAJOR_START_INDEX = MAJOR_STEPS.reduce((result, step) => {
  const current = result.cursor;
  return {
    ...result,
    [step.major]: current,
    cursor: current + step.phases.length,
  };
}, { cursor: 0 });

export const defaultRealms = buildRealms();

export const actionConfigs = {
  cultivate: {
    label: '修炼',
    risk: 'low',
    description: '运转周天，稳定获得修为。',
  },
  seclusion: {
    label: '闭关',
    risk: 'medium',
    description: '消耗寿元换取大量修为，高境界可得到感悟。',
  },
  travel: {
    label: '外出历练',
    risk: 'medium',
    description: '更容易触发奇遇，也可能受伤。',
  },
  explore: {
    label: '探索秘境',
    risk: 'high',
    description: '收益更高，但秘境崩塌和心魔反噬也更常见。',
  },
  heal: {
    label: '疗伤',
    risk: 'low',
    description: '消耗灵石压低伤势。',
  },
  suppress: {
    label: '压制心魔',
    risk: 'low',
    description: '消耗修为稳住道心。',
  },
  buyPill: {
    label: '购买丹药',
    risk: 'low',
    description: '用灵石换丹药，为突破做准备。',
  },
};

export const defaultEncounters = buildEncounters();

export const defaultItems = [
  item('qi_pill', '聚气丹', '丹药', '灵', '突破时添一分把握。', ['突破', '丹药'], [{ type: 'pills', amount: 1 }], false),
  item('healing_pill', '疗伤丹', '丹药', '灵', '温养经脉，缓解伤势。', ['疗伤'], [{ type: 'injury', amount: -18 }]),
  item('cleansing_pill', '清心丹', '丹药', '玄', '清心压念，削去心魔。', ['心魔'], [{ type: 'heartDemon', amount: -14 }]),
  item('breakthrough_pill', '破境丹', '丹药', '地', '短时提高突破把握。', ['突破'], [{ type: 'breakthroughBoost', amount: 0.08, durationMs: 180_000 }]),
  item('array_flag', '阵旗', '法宝', '玄', '避开部分劫锋。', ['抗劫'], [{ type: 'tribulationResistance', amount: 2 }]),
  item('thunder_talisman', '雷劫符', '法宝', '地', '引雷入阵，换取抗劫之力。', ['雷劫'], [{ type: 'tribulationResistance', amount: 4 }, { type: 'injury', amount: 5 }]),
  item('jade_guard', '护身玉简', '法宝', '玄', '危急时护住根基。', ['防护'], [{ type: 'injury', amount: -10 }, { type: 'daoHeart', amount: 1 }]),
  item('ancient_fragment', '古宝残片', '法宝', '地', '残破古宝仍有灵压。', ['战力'], [{ type: 'artifact', amount: 1 }, { type: 'combatPower', amount: 8 }]),
  item('spirit_herb', '灵草', '材料', '凡', '炼丹常用灵材。', ['材料'], [{ type: 'alchemy', amount: 1 }], false),
  item('spirit_ore', '灵矿', '材料', '灵', '炼器与阵旗材料。', ['材料'], [{ type: 'spiritStones', amount: 12 }]),
  item('law_shard', '规则残片', '材料', '天', '隐有天地规则回声。', ['法则'], [{ type: 'law', amount: 4 }]),
  item('origin_shard', '本源碎片', '材料', '天', '本源之力凝成微光。', ['本源'], [{ type: 'origin', amount: 3 }]),
  item('incense', '香火', '材料', '玄', '信念杂音与愿力并存。', ['香火'], [{ type: 'cultivation', amount: 700, variance: 0.15 }, { type: 'heartDemon', amount: 2 }]),
  item('heaven_defying_shadow', '天逆珠碎影', '特殊', '逆', '似能逆转一线命数。', ['气运', '逆修'], [{ type: 'luck', amount: 2 }, { type: 'daoHeart', amount: 2 }]),
  item('cave_token', '洞府令', '特殊', '玄', '可换一处短暂清修之地。', ['洞府'], [{ type: 'cultivation', amount: 900, variance: 0.12 }]),
  item('soul_lamp', '命魂灯', '特殊', '地', '灯火不灭，道心不散。', ['寿元'], [{ type: 'lifeSpan', amount: 20 }, { type: 'heartDemon', amount: -5 }]),
  item('remnant_scroll', '残卷', '特殊', '地', '半页残卷藏着入道门径。', ['功法'], [{ type: 'technique', amount: 1 }, { type: 'comprehension', amount: 1 }]),
];

export function createInitialState(now = Date.now()) {
  return {
    saveVersion: SAVE_VERSION,
    realmIndex: 0,
    cultivation: 0,
    spiritStones: 20,
    lifeSpan: 80,
    combatPower: 12,
    luck: 10,
    comprehension: 11,
    aptitude: 10,
    daoHeart: 12,
    heartDemon: 0,
    injury: 0,
    reputation: 0,
    insight: 0,
    law: 0,
    origin: 0,
    tribulationResistance: 0,
    alchemy: 0,
    artifact: 0,
    technique: 1,
    sectContribution: 0,
    pills: 0,
    inventory: {
      cleansing_pill: 1,
      cave_token: 1,
    },
    titles: [],
    buffs: [],
    npcBonds: {},
    npcRecords: [],
    pendingEncounterId: null,
    pillCooldownUntil: 0,
    ending: null,
    lastTickAt: now,
    lastSavedAt: now,
    log: [{ at: now, text: '入山结庐，静候灵机。' }],
  };
}

export function getCurrentRealm(state) {
  return defaultRealms[state.realmIndex] ?? defaultRealms[0];
}

export function tick(state, now = Date.now()) {
  if (state.ending) {
    return { ...state, lastTickAt: now };
  }

  const elapsedSeconds = Math.max(
    0,
    Math.min(MAX_OFFLINE_SECONDS, Math.floor((now - state.lastTickAt) / 1000)),
  );
  const buffs = activeBuffs(state.buffs, now);
  const realm = getCurrentRealm(state);
  const gainMultiplier = getGainMultiplier({ ...state, buffs });
  const passiveGain = realm.gainRate * gainMultiplier * elapsedSeconds;

  return ensureLiving({
    ...state,
    buffs,
    cultivation: Math.max(0, state.cultivation + passiveGain),
    lastTickAt: now,
  }, now);
}

export function performAction(state, actionId, now = Date.now(), roll = Math.random()) {
  if (state.ending) {
    return { ok: false, message: state.ending, state };
  }

  const realm = getCurrentRealm(state);
  const action = actionConfigs[actionId];
  if (!action) {
    return { ok: false, message: '此法尚未参透。', state };
  }

  if (actionId === 'cultivate') {
    const amount = Math.round(realm.gainRate * (14 + state.aptitude * 0.7));
    const insightGain = realm.index >= firstIndexOf('化神') && roll > 0.72 ? 1 : 0;
    const next = applyEffects(state, [
      { type: 'cultivation', amount },
      { type: 'insight', amount: insightGain },
    ], now, roll);
    return actionResult(next, insightGain ? '静坐观心，修为与意境皆有寸进。' : '周天一转，修为稳步增长。', now);
  }

  if (actionId === 'seclusion') {
    const effects = [
      { type: 'cultivation', amount: Math.round(realm.energyRequired * 0.14 + realm.gainRate * 35), variance: 0.18 },
      { type: 'lifeSpan', amount: -1 },
      { type: 'daoHeart', amount: roll > 0.55 ? 1 : 0 },
    ];
    if (realm.index >= firstIndexOf('化神')) effects.push({ type: 'insight', amount: 2, variance: 0.3 });
    if (realm.index >= firstIndexOf('窥涅')) effects.push({ type: 'law', amount: 2, variance: 0.3 });
    if (realm.index >= firstIndexOf('碎涅')) effects.push({ type: 'origin', amount: 1, variance: 0.2 });
    if (roll < 0.16) effects.push({ type: 'heartDemon', amount: 5 }, { type: 'injury', amount: 3 });
    const next = applyEffects(state, effects, now, roll);
    return actionResult(next, roll < 0.16 ? '闭关过深，修为大涨，心魔也借隙而生。' : '洞府闭关有成，根基更厚。', now);
  }

  if (actionId === 'travel') {
    const effects = [
      { type: 'cultivation', amount: Math.round(realm.gainRate * 18), variance: 0.35 },
      { type: 'spiritStones', amount: 6, variance: 0.4 },
      { type: 'reputation', amount: 1 },
      { type: 'injury', amount: roll < 0.18 ? 6 : 0 },
    ];
    if (roll > 0.56) effects.push({ type: 'item', itemId: 'spirit_ore', amount: 1 });
    if (roll > 0.74) effects.push({ type: 'item', itemId: 'cave_token', amount: 1 });
    const base = applyEffects(state, effects, now, roll);
    const withEncounter = roll < 0.22 ? maybeRollEncounter(base, now, 0, roll) : base;
    return actionResult(withEncounter, withEncounter.pendingEncounterId ? '外出历练时撞见一桩奇遇。' : '历练归来，行囊与见识都重了些。', now);
  }

  if (actionId === 'explore') {
    const effects = [
      { type: 'cultivation', amount: Math.round(realm.energyRequired * 0.1), variance: 0.5 },
      { type: 'spiritStones', amount: 18, variance: 0.55 },
      { type: 'pills', amount: roll > 0.58 ? 1 : 0 },
      { type: 'artifact', amount: roll > 0.78 ? 1 : 0 },
      { type: 'lifeSpan', amount: -1 },
    ];
    if (realm.index >= firstIndexOf('窥涅')) effects.push({ type: 'law', amount: 1 });
    if (realm.index >= firstIndexOf('碎涅')) effects.push({ type: 'origin', amount: 1 });
    if (realm.index >= firstIndexOf('窥涅') && roll > 0.44) effects.push({ type: 'item', itemId: 'law_shard', amount: 1 });
    if (realm.index >= firstIndexOf('碎涅') && roll > 0.62) effects.push({ type: 'item', itemId: 'origin_shard', amount: 1 });
    if (realm.special && roll > 0.7) effects.push({ type: 'item', itemId: 'heaven_defying_shadow', amount: 1 });
    if (roll < 0.28) effects.push({ type: 'injury', amount: 12 }, { type: 'heartDemon', amount: 7 });
    const next = maybeRollEncounter(applyEffects(state, effects, now, roll), now, 0.01, roll);
    return actionResult(next, roll < 0.28 ? '秘境崩塌前夺路而出，机缘到手，伤势也不轻。' : '秘境深处有所得。', now);
  }

  if (actionId === 'heal') {
    if (state.spiritStones < 10) {
      return { ok: false, message: '灵石不足，疗伤难继。', state };
    }
    const next = applyEffects(state, [
      { type: 'spiritStones', amount: -10 },
      { type: 'injury', amount: -18 },
      { type: 'lifeSpan', amount: 1 },
    ], now, roll);
    return actionResult(next, '丹火温养经脉，伤势明显缓和。', now);
  }

  if (actionId === 'suppress') {
    if (state.cultivation < 20) {
      return { ok: false, message: '修为太浅，压不住心魔。', state };
    }
    const next = applyEffects(state, [
      { type: 'cultivation', amount: -20 },
      { type: 'heartDemon', amount: -16 },
      { type: 'daoHeart', amount: 1 },
    ], now, roll);
    return actionResult(next, '一念守中，心魔退去几分。', now);
  }

  if (actionId === 'buyPill') {
    if (state.spiritStones < 20) {
      return { ok: false, message: '灵石不足，坊市摊主不肯赊账。', state };
    }
    const next = applyEffects(state, [
      { type: 'spiritStones', amount: -20 },
      { type: 'pills', amount: 1 },
      { type: 'alchemy', amount: roll > 0.82 ? 1 : 0 },
    ], now, roll);
    return actionResult(next, '换得丹药一枚，突破时可添几分把握。', now);
  }

  return { ok: false, message: '此法尚未参透。', state };
}

export function refinePill(state, now = Date.now(), roll = Math.random()) {
  if (state.ending) {
    return { ok: false, message: state.ending, state };
  }
  if (state.pillCooldownUntil > now) {
    return { ok: false, message: '丹炉尚温，稍后再炼。', state };
  }

  const bonus = roll > 0.86 ? 1 : 0;
  const next = addLog(
    applyEffects(
      {
        ...state,
        pillCooldownUntil: now + PILL_COOLDOWN_MS,
      },
      [
        { type: 'pills', amount: 1 + bonus },
        { type: 'item', itemId: 'qi_pill', amount: 1 + bonus },
        { type: 'item', itemId: 'spirit_herb', amount: roll > 0.68 ? 1 : 0 },
        { type: 'alchemy', amount: 1 },
        { type: 'sectContribution', amount: 1 },
      ],
      now,
      roll,
    ),
    bonus ? '炉火生纹，多成一枚聚气丹。' : '炉火一转，得聚气丹一枚。',
    now,
  );
  return { ok: true, message: bonus ? '多成一枚聚气丹。' : '得聚气丹一枚。', state: next };
}

export function useInventoryItem(state, itemId, now = Date.now(), varianceRoll = Math.random()) {
  if (state.ending) {
    return { ok: false, message: state.ending, state };
  }

  const selected = defaultItems.find((itemConfig) => itemConfig.id === itemId);
  if (!selected) {
    return { ok: false, message: '此物尚未入袋。', state };
  }
  if (!selected.usable) {
    return { ok: false, message: `${selected.name}暂不可直接使用。`, state };
  }
  if (inventoryCount(state, itemId) <= 0) {
    return { ok: false, message: '储物袋中暂无此物。', state };
  }

  const withConsumed = addInventory(state, itemId, -1);
  const withEffects = applyEffects(withConsumed, selected.effects, now, varianceRoll);
  const next = addLog(ensureLiving(withEffects, now), `使用${selected.name}。`, now);
  return { ok: true, message: `使用${selected.name}。`, state: next };
}

export function calculateBreakthroughChance(state) {
  const realm = getCurrentRealm(state);
  if (realm.final) return 0;

  const statBonus =
    (state.comprehension - 10) * 0.008 +
    (state.aptitude - 10) * 0.01 +
    (state.daoHeart - 10) * 0.008 +
    state.luck * 0.0035;
  const preparationBonus =
    (state.pills > 0 ? 0.06 + state.alchemy * 0.002 : 0) +
    state.technique * 0.004 +
    state.artifact * 0.003 +
    state.tribulationResistance * 0.004 +
    activeBuffs(state.buffs, Date.now())
      .filter((buff) => buff.type === 'breakthroughBoost')
      .reduce((sum, buff) => sum + buff.amount, 0);
  const penalty = state.heartDemon * 0.006 + state.injury * 0.007;
  const specialPenalty =
    (realm.special === 'five-decline' ? 0.08 : 0) +
    (realm.special === 'mystic-tribulation' ? 0.05 : 0) +
    (realm.special === 'heaven-bridge' ? 0.06 : 0);

  return clamp(realm.breakthroughChance + statBonus + preparationBonus - penalty - specialPenalty, 0.05, 0.95);
}

export function tryBreakthrough(state, now = Date.now(), roll = Math.random()) {
  if (state.ending) {
    return { ok: false, message: state.ending, state };
  }

  const realm = getCurrentRealm(state);
  if (realm.final || state.realmIndex >= defaultRealms.length - 1) {
    return { ok: false, message: '已立踏天之巅，此版本暂无更高境界。', state };
  }
  if (state.cultivation < realm.energyRequired) {
    return { ok: false, message: '修为未满，尚不可突破。', state };
  }

  const missing = missingRequirements(state, realm);
  if (missing.length > 0) {
    return { ok: false, message: `${missing[0].label}不足，冲关只会自损根基。`, state };
  }

  const chance = calculateBreakthroughChance(state);
  const usesPill = state.pills > 0;
  const nextBase = usesPill ? { ...state, pills: state.pills - 1 } : state;
  const specialSuccessThreshold = Math.min(0.1, chance * 0.14 + Math.max(0, state.luck - 12) * 0.003);

  if (roll <= chance) {
    const nextRealm = defaultRealms[state.realmIndex + 1];
    const rewardScale = realm.special === 'five-decline' ? 2.2 : realm.special === 'heaven-bridge' ? 1.8 : 1;
    const effects = [
      { type: 'lifeSpan', amount: Math.ceil(realm.rewards.lifeSpan * rewardScale) },
      { type: 'combatPower', amount: Math.ceil(realm.rewards.combatPower * rewardScale) },
      { type: 'reputation', amount: Math.ceil(realm.rewards.reputation * rewardScale) },
      { type: 'heartDemon', amount: realm.special ? -8 : -3 },
      { type: 'injury', amount: -6 },
    ];
    if (roll <= specialSuccessThreshold) {
      effects.push(
        { type: 'luck', amount: 1 },
        { type: 'daoHeart', amount: 1 },
        { type: 'insight', amount: nextRealm.index >= firstIndexOf('化神') ? 2 : 0 },
        { type: 'law', amount: nextRealm.index >= firstIndexOf('窥涅') ? 2 : 0 },
        { type: 'origin', amount: nextRealm.index >= firstIndexOf('碎涅') ? 1 : 0 },
      );
    }

    const next = addLog(
      applyEffects({
        ...nextBase,
        realmIndex: state.realmIndex + 1,
        cultivation: 0,
      }, effects, now, roll),
      roll <= specialSuccessThreshold
        ? `天机回响，特殊突破至${nextRealm.name}。`
        : `灵机贯通，突破至${nextRealm.name}。`,
      now,
    );
    return {
      ok: true,
      special: roll <= specialSuccessThreshold,
      message: roll <= specialSuccessThreshold ? '特殊突破成功。' : '突破成功。',
      state: next,
    };
  }

  const severe = roll > chance + (realm.special ? 0.28 : 0.18);
  const specialMultiplier = realm.special === 'five-decline' ? 2.8 : realm.special === 'heaven-bridge' ? 2.1 : 1;
  const effects = severe
    ? [
      { type: 'cultivation', amount: -Math.round(realm.energyRequired * 0.55) },
      { type: 'lifeSpan', amount: -Math.ceil(8 * specialMultiplier) },
      { type: 'heartDemon', amount: Math.ceil(10 * specialMultiplier) },
      { type: 'injury', amount: Math.ceil(12 * specialMultiplier) },
    ]
    : [
      { type: 'cultivation', amount: -Math.round(realm.energyRequired * 0.25) },
      { type: 'lifeSpan', amount: -Math.ceil(2 * specialMultiplier) },
      { type: 'heartDemon', amount: Math.ceil(4 * specialMultiplier) },
      { type: 'injury', amount: Math.ceil(5 * specialMultiplier) },
    ];
  const next = addLog(
    ensureLiving(applyEffects(nextBase, effects, now, roll), now),
    severe ? `${realm.name}冲关大败，心魔与伤势一同反噬。` : `${realm.name}冲关未稳，损了些修为。`,
    now,
  );

  return { ok: false, severe, message: severe ? '突破大失败。' : '突破失败。', state: next };
}

export function maybeRollEncounter(state, now = Date.now(), roll = Math.random(), pickRoll = Math.random()) {
  if (state.ending || state.pendingEncounterId) {
    return state;
  }

  const chance = 0.035 + Math.min(0.09, state.luck * 0.0015);
  if (roll > chance) {
    return state;
  }

  const available = defaultEncounters.filter((event) => isEventAvailable(event, state.realmIndex));
  if (available.length === 0) {
    return state;
  }

  const encounter = pickWeighted(available, pickRoll);
  return addLog({ ...state, pendingEncounterId: encounter.id }, `奇遇：${encounter.title}`, now);
}

export function resolveEncounter(state, choiceId, now = Date.now(), varianceRoll = Math.random()) {
  const encounter = defaultEncounters.find((event) => event.id === state.pendingEncounterId);
  const choice = encounter?.choices.find((item) => item.id === choiceId);
  if (!choice) {
    return { ok: false, message: '当前无奇遇。', state };
  }

  const missingCost = choice.effects.find((effect) =>
    COST_RESOURCE_KEYS.has(effect.type) &&
    effect.amount < 0 &&
    (state[effect.type] ?? 0) < Math.abs(effect.amount));
  if (missingCost && missingCost.type !== 'cultivation') {
    return { ok: false, message: `${REQUIREMENT_LABELS[missingCost.type] ?? '资源'}不足。`, state };
  }

  const withChoice = applyEffects({ ...state, pendingEncounterId: null }, choice.effects, now, varianceRoll);
  const withNpc = encounter.npc
    ? applyNpcBond(withChoice, encounter.npc, choice.npcBond ?? 1, now)
    : withChoice;
  const next = addLog(ensureLiving(withNpc, now), choice.result, now);
  return { ok: true, message: choice.result, state: next };
}

export function saveState(state, storage = globalThis.localStorage) {
  const saved = { ...state, saveVersion: SAVE_VERSION, lastSavedAt: Date.now() };
  storage.setItem(SAVE_KEY, JSON.stringify(saved));
  return saved;
}

export function loadState(storage = globalThis.localStorage, now = Date.now()) {
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) {
      return createInitialState(now);
    }
    const parsed = JSON.parse(raw);
    if (parsed.saveVersion === 1) {
      return migrateV1Save(parsed, now);
    }
    if (parsed.saveVersion === 2) {
      return addLog(normalizeState(parsed, now), '储物袋已开，旧物归位。', now);
    }
    if (parsed.saveVersion !== SAVE_VERSION) {
      return addLog(createInitialState(now), '存档版本不兼容，已重新入山。', now);
    }
    return normalizeState({ ...createInitialState(now), ...parsed }, now);
  } catch {
    return addLog(createInitialState(now), '存档损坏，已重新入山。', now);
  }
}

export function addLog(state, text, now = Date.now()) {
  return {
    ...state,
    log: [{ at: now, text }, ...(state.log ?? [])].slice(0, LOG_LIMIT),
  };
}

export function formatEffect(effect) {
  const label = REQUIREMENT_LABELS[effect.type] ?? effect.type;
  const sign = effect.amount > 0 ? '+' : '';
  return `${label}${sign}${effect.amount}`;
}

function buildRealms() {
  const realms = [];
  for (const step of MAJOR_STEPS) {
    for (const phase of step.phases) {
      const index = realms.length;
      const name = phase === step.major || phase === '踏天' ? phase : `${step.major}${phase}`;
      const difficulty = 1 + index * 0.08 + (step.special ? 0.3 : 0);
      const requirements = buildRequirements(step.major, index);
      const energyRequired = Math.round(60 * Math.pow(1.31, index) * (step.special ? 1.16 : 1));
      realms.push({
        id: slugify(`${step.major}-${phase}`),
        name,
        major: step.major,
        phase,
        index,
        step: getCultivationStep(step.major),
        energyRequired,
        gainRate: round(1 + index * 0.82 + Math.pow(index + 1, 1.08) * 0.28, 2),
        breakthroughChance: clamp(round(0.78 - index * 0.006 - (step.special ? 0.04 : 0), 3), 0.2, 0.82),
        failurePenaltyRate: clamp(round(0.2 + index * 0.003 + (step.special ? 0.08 : 0), 3), 0.2, 0.58),
        difficulty,
        requirements: { cultivation: energyRequired, ...requirements },
        rewards: {
          lifeSpan: index % 4 === 0 ? 8 + Math.floor(index / 3) : 2 + Math.floor(index / 10),
          combatPower: Math.ceil(8 + index * 2.7),
          reputation: index % 3 === 0 ? 2 : 1,
        },
        special: step.special ?? null,
        final: Boolean(step.final),
      });
    }
  }
  return realms;
}

function buildRequirements(major, index) {
  const requirements = {
    spiritStones: index < firstIndexOf('结丹') ? Math.max(0, Math.floor(index / 2)) : Math.floor(index * 1.4),
    pills: index < 15 ? 0 : index % 4 === 0 ? 1 : 0,
    daoHeart: index >= firstIndexOf('问鼎') ? 12 + Math.floor(index / 7) : 0,
  };

  if (index >= firstIndexOf('化神')) requirements.insight = 6 + Math.floor((index - firstIndexOf('化神')) * 1.2);
  if (index >= firstIndexOf('窥涅')) requirements.law = 8 + Math.floor((index - firstIndexOf('窥涅')) * 1.3);
  if (index >= firstIndexOf('碎涅')) requirements.origin = 5 + Math.floor((index - firstIndexOf('碎涅')) * 1.1);
  if (major === '天人五衰') {
    requirements.daoHeart += 8;
    requirements.tribulationResistance = 8;
    requirements.lifeSpan = 400;
  }
  if (major === '空玄' || major === '空劫') {
    requirements.origin += 8;
    requirements.daoHeart += 4;
  }
  if (major === '半步踏天') {
    requirements.origin += 14;
    requirements.daoHeart += 12;
    requirements.luck = 16;
    requirements.lifeSpan = 800;
  }
  if (major === '踏天') {
    requirements.origin += 28;
    requirements.daoHeart += 28;
    requirements.luck = 22;
  }

  return Object.fromEntries(Object.entries(requirements).filter(([, value]) => value > 0));
}

function buildEncounters() {
  const realmEvents = [
    realmEvent('qigong-root-test', '凝气', '灵根测试', '宗门执事以灵盘照骨，光芒虽浅，却有一线可修之机。', [
      choice('steady', '稳住心神', '你守住呼吸，根骨略有显露。', [{ type: 'aptitude', amount: 1 }, { type: 'sectContribution', amount: 2 }]),
      choice('ask', '询问功法', '执事丢来半卷入门口诀。', [{ type: 'technique', amount: 1 }, { type: 'cultivation', amount: 45, variance: 0.2 }]),
    ]),
    realmEvent('foundation-cave', '筑基', '洞府争夺', '山腰洞府灵气充足，几名同门都盯上了此处。', [
      choice('compete', '出手争洞府', '你夺下洞府，也留下几道暗伤。', [{ type: 'spiritStones', amount: 18 }, { type: 'injury', amount: 5 }, { type: 'combatPower', amount: 3 }]),
      choice('trade', '贡献换取', '你以贡献换来临时洞府，根基稳了些。', [{ type: 'sectContribution', amount: -2 }, { type: 'cultivation', amount: 180, variance: 0.2 }, { type: 'daoHeart', amount: 1 }]),
    ]),
    realmEvent('core-thunder', '结丹', '金丹雷劫', '丹海翻腾，云中第一道雷光已然垂落。', [
      choice('face', '正面渡劫', '雷光淬丹，金丹更凝。', [{ type: 'tribulationResistance', amount: 2 }, { type: 'combatPower', amount: 8 }, { type: 'injury', amount: 8 }]),
      choice('array', '布阵避锋', '阵旗折损大半，你却保住根基。', [{ type: 'spiritStones', amount: -15 }, { type: 'injury', amount: -6 }, { type: 'daoHeart', amount: 1 }]),
    ]),
    realmEvent('nascent-out', '元婴', '元婴出窍', '月色清寒，元婴第一次离体，远处却有陌生神识扫来。', [
      choice('return', '即刻归窍', '你避开窥探，元婴安稳。', [{ type: 'daoHeart', amount: 1 }, { type: 'heartDemon', amount: -3 }]),
      choice('probe', '反探来意', '神识碰撞，你识海刺痛，却摸到一件古宝线索。', [{ type: 'artifact', amount: 1 }, { type: 'injury', amount: 7 }, { type: 'reputation', amount: 2 }]),
    ]),
    realmEvent('spirit-red-dust', '化神', '红尘炼心', '一城灯火映入心湖，生死离合忽然有了重量。', [
      choice('feel', '入世观心', '意境生出枝芽。', [{ type: 'insight', amount: 4 }, { type: 'daoHeart', amount: 2 }]),
      choice('cut', '斩念归山', '你压下杂念，修为更纯，心魔也不甘散去。', [{ type: 'cultivation', amount: 600, variance: 0.2 }, { type: 'heartDemon', amount: 3 }]),
    ]),
    realmEvent('infant-transform', '婴变', '元神蜕变', '元婴与肉身之间生出微妙牵引，仙灵之气在经脉间游走。', [
      choice('temper', '重塑肉身', '肉身受淬，战力拔高。', [{ type: 'combatPower', amount: 18 }, { type: 'injury', amount: 10 }]),
      choice('guard', '护住元神', '元神安稳，意境更实。', [{ type: 'insight', amount: 5 }, { type: 'heartDemon', amount: -6 }]),
    ]),
    realmEvent('ask-ding', '问鼎', '问鼎天门', '虚空深处似有一门，一念问天，一念问己。', [
      choice('self', '问己道心', '道心如铁，问鼎之晶更凝。', [{ type: 'daoHeart', amount: 4 }, { type: 'insight', amount: 5 }]),
      choice('world', '问天地势', '星域之力压来，你窥见更高规则。', [{ type: 'law', amount: 2 }, { type: 'injury', amount: 8 }]),
    ]),
    realmEvent('yin-empty', '阴虚', '虚实转换', '元神一呼一吸间，虚与实互相映照。', [
      choice('empty', '守虚', '元神更轻，心魔难近。', [{ type: 'heartDemon', amount: -8 }, { type: 'daoHeart', amount: 2 }]),
      choice('real', '炼实', '元力初成，战力上扬。', [{ type: 'combatPower', amount: 20 }, { type: 'law', amount: 2 }]),
    ]),
    realmEvent('yang-real', '阳实', '本源门槛', '仙力一点点化作元力，天地规则似在门外低鸣。', [
      choice('listen', '听规则回声', '你听见一丝法则。', [{ type: 'law', amount: 5 }, { type: 'daoHeart', amount: 1 }]),
      choice('store', '稳固元力', '根基厚重，突破风险降低。', [{ type: 'tribulationResistance', amount: 2 }, { type: 'cultivation', amount: 900, variance: 0.25 }]),
    ]),
    realmEvent('peek-nirvana', '窥涅', '法则初窥', '星光在掌心折转，你第一次看见规则的缝隙。', [
      choice('study', '细察缝隙', '法则感悟增加。', [{ type: 'law', amount: 6 }, { type: 'comprehension', amount: 1 }]),
      choice('force', '强行撬动', '规则反震，却留下可用痕迹。', [{ type: 'law', amount: 8 }, { type: 'injury', amount: 10 }]),
    ]),
    realmEvent('clean-nirvana', '净涅', '领域净化', '浑浊元力被法则一遍遍洗过，领域边缘逐渐清明。', [
      choice('clean', '净化修为', '法则更纯。', [{ type: 'law', amount: 7 }, { type: 'heartDemon', amount: -5 }]),
      choice('expand', '扩张领域', '领域压迫感提升。', [{ type: 'combatPower', amount: 28 }, { type: 'reputation', amount: 3 }]),
    ]),
    realmEvent('shatter-nirvana', '碎涅', '本源种子', '一缕规则碎后重组，在识海深处凝成微光。', [
      choice('nurture', '温养本源', '本源种子更稳。', [{ type: 'origin', amount: 6 }, { type: 'law', amount: 4 }]),
      choice('break', '碎法重组', '法则碎裂重凝，代价沉重。', [{ type: 'origin', amount: 8 }, { type: 'injury', amount: 14 }, { type: 'heartDemon', amount: 6 }]),
    ]),
    realmEvent('five-decline', '天人五衰', '天人五衰', '衰气从命轮上落下，这一劫不是修为能独自压住的。', [
      choice('endure', '以道心硬渡', '你扛过一阵衰气，道心与抗劫之力同时增强。', [{ type: 'daoHeart', amount: 5 }, { type: 'tribulationResistance', amount: 4 }, { type: 'lifeSpan', amount: -30 }]),
      choice('avoid', '舍资源避劫', '你耗尽诸多资源，换得衰气暂缓。', [{ type: 'spiritStones', amount: -80 }, { type: 'heartDemon', amount: -10 }, { type: 'tribulationResistance', amount: 2 }]),
    ], { weight: 14 }),
    realmEvent('empty-nirvana', '空涅', '本源证道', '空门轰鸣，本源之力第一次真正反哺天地。', [
      choice('prove', '以本源证道', '本源稳固，涅力初成。', [{ type: 'origin', amount: 9 }, { type: 'combatPower', amount: 45 }]),
      choice('absorb', '吸纳天地', '天地浩荡入体，伤势也被冲刷。', [{ type: 'cultivation', amount: 2200, variance: 0.25 }, { type: 'injury', amount: -10 }]),
    ]),
    realmEvent('empty-spirit', '空灵', '内天地初开', '心神深处有一方天地亮起，信念开始有了回声。', [
      choice('belief', '凝聚信念', '信念入体，道心厚重。', [{ type: 'daoHeart', amount: 6 }, { type: 'origin', amount: 5 }]),
      choice('incense', '借香火温养', '香火可用，却让心神杂音增多。', [{ type: 'cultivation', amount: 2600, variance: 0.2 }, { type: 'heartDemon', amount: 7 }]),
    ]),
    realmEvent('empty-mystic', '空玄', '玄劫压顶', '外劫、内劫、魂劫轮转，天地像一张将落未落的网。', [
      choice('nine', '迎九玄劫', '劫中藏造化，本源更深。', [{ type: 'origin', amount: 10 }, { type: 'tribulationResistance', amount: 6 }, { type: 'injury', amount: 20 }]),
      choice('three', '先渡三劫', '你稳稳渡过三劫，根基未乱。', [{ type: 'tribulationResistance', amount: 4 }, { type: 'heartDemon', amount: -6 }]),
    ]),
    realmEvent('empty-calamity', '空劫', '大道压制', '大道如海，身在其中，连呼吸都像在承受规则。', [
      choice('merge', '融道于身', '举手投足皆有道意。', [{ type: 'combatPower', amount: 70 }, { type: 'origin', amount: 8 }]),
      choice('retreat', '退守道心', '你守住自己，没有被大道同化。', [{ type: 'daoHeart', amount: 7 }, { type: 'heartDemon', amount: -9 }]),
    ]),
    realmEvent('half-heaven', '半步踏天', '踏天桥', '九座桥浮在轮回尽头，每一步都在问你是否仍是自己。', [
      choice('ask-heart', '过桥问心', '一桥问心，一桥证道。', [{ type: 'daoHeart', amount: 8 }, { type: 'origin', amount: 6 }, { type: 'lifeSpan', amount: -40 }]),
      choice('gather', '退一步蓄势', '你暂不踏桥，转而积蓄本源与气运。', [{ type: 'origin', amount: 4 }, { type: 'luck', amount: 2 }]),
    ], { weight: 12 }),
    realmEvent('heaven-trampling', '踏天', '终局突破', '第九桥之后，轮回里有真我回望。', [
      choice('step', '踏出最后一步', '天地无声，你在轮回外留下自己的道号。', [{ type: 'reputation', amount: 100 }, { type: 'daoHeart', amount: 20 }]),
      choice('remain', '回望此生', '你回望来路，诸多机缘化作新周目的底蕴。', [{ type: 'luck', amount: 5 }, { type: 'comprehension', amount: 5 }]),
    ], { weight: 4 }),
  ];

  const npcEvents = [
    npcEvent('npc-wanglin-daoxin', '王林', '化神', '神秘前辈立在山雨中，只问你一句：逆境临头时，还认不认自己的道？', [
      choice('listen', '听他论道', '你没有学他的路，却借这一问稳住了自己的道。', [{ type: 'daoHeart', amount: 4 }, { type: 'insight', amount: 3 }], 2),
      choice('challenge', '请他试道', '一缕杀机压身，你狼狈退后，却看清了生死边界。', [{ type: 'combatPower', amount: 18 }, { type: 'injury', amount: 10 }, { type: 'insight', amount: 4 }], 2),
    ]),
    npcEvent('npc-situnan-remnant', '司徒南', '凝气', '一个残魂在破旧珠影里大笑，说你胆子若够，便拿命换机缘。', [
      choice('deal', '与残魂交易', '他嘴上刻薄，仍塞给你一段逃命诀窍。', [{ type: 'luck', amount: 2 }, { type: 'technique', amount: 1 }, { type: 'heartDemon', amount: 2 }], 2),
      choice('ignore', '装作没听见', '残魂骂骂咧咧，你却保住清静。', [{ type: 'daoHeart', amount: 1 }, { type: 'heartDemon', amount: -2 }], 1),
    ]),
    npcEvent('npc-li-muwan-pill', '李慕婉', '筑基', '温和女修递来一枚丹药，说伤势若拖久，会伤到根基。', [
      choice('accept', '收下丹药', '丹香温润，伤势被压下。', [{ type: 'pills', amount: 1 }, { type: 'injury', amount: -12 }, { type: 'alchemy', amount: 1 }], 2),
      choice('learn', '请教丹道', '你记下一味药性的变化。', [{ type: 'alchemy', amount: 3 }, { type: 'comprehension', amount: 1 }], 2),
    ]),
    npcEvent('npc-liu-mei-illusion', '柳眉', '元婴', '一场似真似假的幻境铺开，所有选择都像照见欲念。', [
      choice('break', '破幻而出', '你斩断幻念，道心更稳。', [{ type: 'daoHeart', amount: 3 }, { type: 'heartDemon', amount: -8 }], 2),
      choice('observe', '观幻悟情', '幻境未必全假，你从情念里悟出一丝意境。', [{ type: 'insight', amount: 4 }, { type: 'heartDemon', amount: 4 }], 1),
    ]),
    npcEvent('npc-li-qianmei-song', '李倩梅', '问鼎', '琴声从雪夜里传来，每一声都像替你抚平躁动的心湖。', [
      choice('listen', '听完一曲', '余音散去，道心澄明。', [{ type: 'daoHeart', amount: 4 }, { type: 'heartDemon', amount: -10 }], 2),
      choice('answer', '以道回应', '你以自身意境应和，声名渐起。', [{ type: 'insight', amount: 5 }, { type: 'reputation', amount: 4 }], 2),
    ]),
    npcEvent('npc-qingshui-sword', '清水', '化神', '冷冽剑意一闪而过，像把执念磨成锋刃。', [
      choice('sword', '承受剑意', '杀伐意境更利，身上也添新伤。', [{ type: 'insight', amount: 5 }, { type: 'combatPower', amount: 22 }, { type: 'injury', amount: 9 }], 2),
      choice('guard', '守住本心', '你未被杀意带偏。', [{ type: 'daoHeart', amount: 3 }, { type: 'heartDemon', amount: -6 }], 1),
    ]),
    npcEvent('npc-tianyunzi-cause', '天运子', '窥涅', '白衣老者摆下一局棋，棋盘里每条路都像提前写好的因果。', [
      choice('play', '落下一子', '你赢得法则机缘，也沾上因果暗线。', [{ type: 'law', amount: 8 }, { type: 'luck', amount: 2 }, { type: 'heartDemon', amount: 8 }], 2),
      choice('leave', '掀袖离局', '你不入局，反倒看清一角命运。', [{ type: 'daoHeart', amount: 5 }, { type: 'law', amount: 3 }], 2),
    ]),
    npcEvent('npc-zhuque-trial', '朱雀子', '结丹', '朱雀试炼开启，赤色火纹照亮试炼台。', [
      choice('trial', '登台试炼', '朱雀火意淬体，抗劫之力提升。', [{ type: 'tribulationResistance', amount: 4 }, { type: 'combatPower', amount: 14 }, { type: 'injury', amount: 6 }], 2),
      choice('assist', '协助守阵', '你守住阵脚，宗门声望增加。', [{ type: 'sectContribution', amount: 6 }, { type: 'reputation', amount: 3 }], 1),
    ]),
    npcEvent('npc-tanlang-treasure', '贪狼', '婴变', '一个贼眉鼠眼的强者从秘境边缘钻出，手里抓着不知真假的古宝图。', [
      choice('buy', '买下残图', '残图半真半假，但确有古宝气息。', [{ type: 'spiritStones', amount: -30 }, { type: 'artifact', amount: 2 }, { type: 'luck', amount: 1 }], 1),
      choice('follow', '暗中跟随', '你捡到漏，也差点被反算。', [{ type: 'spiritStones', amount: 40 }, { type: 'injury', amount: 8 }, { type: 'artifact', amount: 1 }], 2),
    ]),
    npcEvent('npc-mu-bingmei-oath', '木冰眉', '净涅', '一位清冷女修谈及誓言与因果，语气平静，却字字压心。', [
      choice('promise', '立下小誓', '誓言束心，道心更坚。', [{ type: 'daoHeart', amount: 5 }, { type: 'law', amount: 3 }], 2),
      choice('refuse', '不受因果', '你避开牵连，气运微涨。', [{ type: 'luck', amount: 2 }, { type: 'heartDemon', amount: -4 }], 1),
    ]),
    npcEvent('npc-wangping-dream', '王平', '空灵', '梦中有个孩子问你，长生之后，还会不会记得凡人的一日三餐。', [
      choice('remember', '记住人间', '内天地多了一点温度。', [{ type: 'daoHeart', amount: 6 }, { type: 'origin', amount: 5 }, { type: 'heartDemon', amount: -8 }], 2),
      choice('wake', '醒来修炼', '梦醒之后，信念更清。', [{ type: 'cultivation', amount: 3000, variance: 0.25 }, { type: 'origin', amount: 3 }], 1),
    ]),
  ];

  return [...realmEvents, ...npcEvents].map((event) => ({
    effects: [],
    ...event,
  }));
}

function realmEvent(id, major, title, description, choices, options = {}) {
  return {
    id,
    title,
    description,
    realmRange: majorRange(major),
    weight: options.weight ?? 20,
    choices,
    risk: options.risk ?? 'medium',
    reward: options.reward ?? '境界专属机缘',
    tags: [`realm:${major}`, ...(options.tags ?? [])],
  };
}

function npcEvent(id, npc, major, description, choices) {
  return {
    id,
    title: `偶遇${npc}`,
    description,
    realmRange: majorRange(major),
    weight: 8,
    choices,
    risk: 'rare',
    reward: `${npc}羁绊`,
    npc,
    tags: [`realm:${major}`, 'npc', `npc:${npc}`],
  };
}

function choice(id, label, result, effects, npcBond = 0) {
  return { id, label, result, effects, npcBond };
}

function item(id, name, category, rarity, description, tags, effects, usable = true) {
  return { id, name, category, rarity, description, tags, effects, usable };
}

function addInventory(state, itemId, amount) {
  const current = inventoryCount(state, itemId);
  const nextCount = Math.max(0, current + Math.round(amount));
  return {
    ...state,
    inventory: {
      ...(state.inventory ?? {}),
      [itemId]: nextCount,
    },
  };
}

function inventoryCount(state, itemId) {
  return Math.max(0, Math.floor(Number(state.inventory?.[itemId] ?? 0)));
}

function actionResult(state, message, now) {
  return { ok: true, message, state: addLog(ensureLiving(state, now), message, now) };
}

function applyEffects(state, effects, now, varianceRoll = 0.5) {
  return effects.reduce((next, effect) => {
    const amount = variedAmount(effect, varianceRoll);
    if (!amount && !effect.durationMs) return next;
    if (effect.durationMs) {
      return {
        ...next,
        buffs: [
          ...next.buffs,
          {
            type: effect.type,
            amount,
            expiresAt: now + effect.durationMs,
          },
        ],
      };
    }
    if (effect.type === 'item') {
      return addInventory(next, effect.itemId, amount);
    }
    if (ATTRIBUTE_KEYS.includes(effect.type) || effect.type === 'pills') {
      return setNumeric(next, effect.type, amount);
    }
    return next;
  }, state);
}

function setNumeric(state, key, delta) {
  const current = Number(state[key] ?? 0);
  let value = current + delta;
  if (['cultivation', 'spiritStones', 'pills', 'lifeSpan', 'combatPower', 'reputation', 'insight', 'law', 'origin', 'tribulationResistance', 'alchemy', 'artifact', 'technique', 'sectContribution'].includes(key)) {
    value = Math.max(0, value);
  }
  if (['heartDemon', 'injury'].includes(key)) {
    value = clamp(value, 0, 100);
  }
  return { ...state, [key]: round(value, 2) };
}

function applyNpcBond(state, npc, amount, now) {
  const current = state.npcBonds[npc] ?? 0;
  const nextBond = Math.max(0, current + amount);
  const record = { at: now, npc, text: `${npc}羁绊 ${current} -> ${nextBond}` };
  return {
    ...state,
    npcBonds: { ...state.npcBonds, [npc]: nextBond },
    npcRecords: [record, ...state.npcRecords].slice(0, 30),
  };
}

function missingRequirements(state, realm) {
  const order = ['insight', 'law', 'origin', 'daoHeart', 'tribulationResistance', 'luck', 'lifeSpan', 'spiritStones', 'pills'];
  return Object.entries(realm.requirements)
    .filter(([key]) => key !== 'cultivation')
    .filter(([key, needed]) => Number(state[key] ?? 0) < needed)
    .sort(([left], [right]) => order.indexOf(left) - order.indexOf(right))
    .map(([key, needed]) => ({ key, needed, label: REQUIREMENT_LABELS[key] ?? key }));
}

function normalizeState(state, now) {
  const initial = createInitialState(now);
  const next = { ...initial, ...state, saveVersion: SAVE_VERSION };
  for (const key of ATTRIBUTE_KEYS) {
    next[key] = Number.isFinite(Number(next[key])) ? Number(next[key]) : initial[key];
  }
  next.pills = Number.isFinite(Number(next.pills)) ? Math.max(0, Number(next.pills)) : 0;
  next.realmIndex = clamp(Math.floor(Number(next.realmIndex) || 0), 0, defaultRealms.length - 1);
  next.inventory = normalizeInventory(next.inventory);
  next.buffs = Array.isArray(next.buffs) ? next.buffs : [];
  next.log = Array.isArray(next.log) ? next.log.slice(0, LOG_LIMIT) : initial.log;
  next.npcBonds = next.npcBonds && typeof next.npcBonds === 'object' ? next.npcBonds : {};
  next.npcRecords = Array.isArray(next.npcRecords) ? next.npcRecords : [];
  return ensureLiving(next, now);
}

function normalizeInventory(inventory) {
  if (!inventory || typeof inventory !== 'object' || Array.isArray(inventory)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(inventory)
      .map(([itemId, count]) => [itemId, Math.max(0, Math.floor(Number(count) || 0))])
      .filter(([, count]) => count > 0),
  );
}

function migrateV1Save(parsed, now) {
  return addLog(normalizeState({
    ...createInitialState(now),
    realmIndex: parsed.realmIndex ?? 0,
    cultivation: parsed.cultivation ?? parsed.spiritualEnergy ?? 0,
    pills: parsed.pills ?? 0,
    buffs: parsed.buffs ?? [],
    pendingEncounterId: null,
    pillCooldownUntil: parsed.pillCooldownUntil ?? 0,
    lastTickAt: parsed.lastTickAt ?? now,
    lastSavedAt: parsed.lastSavedAt ?? now,
    log: parsed.log ?? [],
  }, now), '旧存档已转化为新版修行体系。', now);
}

function ensureLiving(state, now) {
  if (state.lifeSpan > 0 || state.ending) {
    return state;
  }
  return addLog({ ...state, lifeSpan: 0, ending: '寿元已尽，坐化重来。' }, '寿元已尽，坐化重来。', now);
}

function getGainMultiplier(state) {
  const buffBonus = (state.buffs ?? [])
    .filter((buff) => buff.type === 'buffGain')
    .reduce((sum, buff) => sum + buff.amount, 0);
  return 1 + buffBonus + state.aptitude * 0.018 + state.comprehension * 0.014 + state.technique * 0.018 - state.injury * 0.004 - state.heartDemon * 0.003;
}

function activeBuffs(buffs, now) {
  return (buffs ?? []).filter((buff) => buff.expiresAt > now);
}

function isEventAvailable(event, realmIndex) {
  return realmIndex >= event.realmRange.min && realmIndex <= event.realmRange.max;
}

function pickWeighted(events, roll) {
  const total = events.reduce((sum, event) => sum + event.weight, 0);
  let cursor = clamp(roll, 0, 0.999999) * total;
  for (const event of events) {
    cursor -= event.weight;
    if (cursor <= 0) return event;
  }
  return events.at(-1);
}

function majorRange(major) {
  const indexes = defaultRealms
    .filter((realm) => realm.major === major)
    .map((realm) => realm.index);
  return { min: Math.min(...indexes), max: Math.max(...indexes), majors: [major] };
}

function firstIndexOf(major) {
  return MAJOR_START_INDEX[major] ?? Number.MAX_SAFE_INTEGER;
}

function getCultivationStep(major) {
  if (['凝气', '筑基', '结丹', '元婴', '化神', '婴变', '问鼎'].includes(major)) return '修仙第一步';
  if (['阴虚', '阳实'].includes(major)) return '第一二步过渡';
  if (['窥涅', '净涅', '碎涅'].includes(major)) return '修仙第二步';
  if (major === '天人五衰') return '第二三步过渡';
  if (['空涅', '空灵', '空玄', '空劫'].includes(major)) return '修仙第三步';
  if (major === '半步踏天') return '踏天过渡';
  return '修仙第四步';
}

function variedAmount(effect, roll) {
  const base = Number(effect.amount ?? 0);
  if (!effect.variance || base === 0) return base;
  const factor = 1 + (roll - 0.5) * 2 * effect.variance;
  return Math.round(base * factor);
}

function slugify(text) {
  return text
    .replaceAll('凝气', 'qi')
    .replaceAll('筑基', 'foundation')
    .replaceAll('结丹', 'core')
    .replaceAll('元婴', 'nascent')
    .replaceAll('化神', 'spirit')
    .replaceAll('婴变', 'infant-change')
    .replaceAll('问鼎', 'ask-ding')
    .replaceAll('阴虚', 'yin-empty')
    .replaceAll('阳实', 'yang-real')
    .replaceAll('窥涅', 'peek-nirvana')
    .replaceAll('净涅', 'clean-nirvana')
    .replaceAll('碎涅', 'shatter-nirvana')
    .replaceAll('天人五衰', 'five-decline')
    .replaceAll('空涅', 'empty-nirvana')
    .replaceAll('空灵', 'empty-spirit')
    .replaceAll('空玄', 'empty-mystic')
    .replaceAll('空劫', 'empty-calamity')
    .replaceAll('半步踏天', 'half-heaven')
    .replaceAll('踏天', 'heaven-trampling')
    .replace(/[^\w-]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
