export const SAVE_KEY = 'xiuxian-web-save-v1';
export const SAVE_VERSION = 1;
export const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
export const PILL_COOLDOWN_MS = 30_000;
export const LOG_LIMIT = 40;

export const defaultRealms = [
  {
    id: 'qi-1',
    name: '炼气一层',
    energyRequired: 60,
    gainRate: 1,
    breakthroughChance: 0.78,
    failurePenaltyRate: 0.2,
  },
  {
    id: 'qi-2',
    name: '炼气二层',
    energyRequired: 160,
    gainRate: 1.8,
    breakthroughChance: 0.72,
    failurePenaltyRate: 0.22,
  },
  {
    id: 'qi-3',
    name: '炼气三层',
    energyRequired: 360,
    gainRate: 3,
    breakthroughChance: 0.66,
    failurePenaltyRate: 0.25,
  },
  {
    id: 'foundation-early',
    name: '筑基初期',
    energyRequired: 800,
    gainRate: 5.2,
    breakthroughChance: 0.58,
    failurePenaltyRate: 0.28,
  },
  {
    id: 'foundation-mid',
    name: '筑基中期',
    energyRequired: 1600,
    gainRate: 8.5,
    breakthroughChance: 0.52,
    failurePenaltyRate: 0.3,
  },
  {
    id: 'foundation-late',
    name: '筑基后期',
    energyRequired: 3000,
    gainRate: 13,
    breakthroughChance: 0.46,
    failurePenaltyRate: 0.32,
  },
];

export const defaultEncounters = [
  {
    id: 'mountain-spring',
    title: '山中灵泉',
    description: '雾气散开，一眼灵泉在石缝间微微发光。',
    minRealmIndex: 0,
    choices: [
      {
        id: 'drink',
        label: '汲取灵泉',
        result: '清凉灵意入体，灵气大涨。',
        effects: [{ type: 'energy', amount: 45 }],
      },
      {
        id: 'guard',
        label: '静坐守候',
        result: '你守得一缕泉心，修炼更顺畅了。',
        effects: [{ type: 'buffGain', amount: 0.25, durationMs: 120_000 }],
      },
    ],
  },
  {
    id: 'old-friend',
    title: '旧友求助',
    description: '旧日道友负伤来访，想借一枚丹药稳住气息。',
    minRealmIndex: 0,
    choices: [
      {
        id: 'help',
        label: '赠丹相助',
        result: '道友情分未断，他回赠一段修炼心得。',
        effects: [
          { type: 'pills', amount: -1 },
          { type: 'buffBreakthrough', amount: 0.06, durationMs: 300_000 },
        ],
      },
      {
        id: 'decline',
        label: '婉言谢绝',
        result: '你守住丹药，也守住了清静。',
        effects: [{ type: 'pills', amount: 1 }],
      },
    ],
  },
  {
    id: 'secret-fragment',
    title: '秘境残卷',
    description: '蒲团下露出半页残卷，似乎记载着吐纳诀窍。',
    minRealmIndex: 1,
    choices: [
      {
        id: 'study',
        label: '细读残卷',
        result: '残卷晦涩，却让你摸到一丝门道。',
        effects: [{ type: 'buffGain', amount: 0.35, durationMs: 180_000 }],
      },
      {
        id: 'burn',
        label: '焚卷悟意',
        result: '灰烬如蝶，灵机忽至。',
        effects: [{ type: 'energy', amount: 120 }],
      },
    ],
  },
  {
    id: 'heart-ripple',
    title: '心境微澜',
    description: '夜半风过竹林，心湖忽生波澜。',
    minRealmIndex: 0,
    choices: [
      {
        id: 'meditate',
        label: '观心入定',
        result: '一念澄明，突破把握略增。',
        effects: [{ type: 'buffBreakthrough', amount: 0.04, durationMs: 300_000 }],
      },
      {
        id: 'alchemy',
        label: '开炉炼丹',
        result: '心火入炉，丹香渐起。',
        effects: [{ type: 'pills', amount: 1 }],
      },
    ],
  },
];

export function createInitialState(now = Date.now()) {
  return {
    saveVersion: SAVE_VERSION,
    realmIndex: 0,
    spiritualEnergy: 0,
    pills: 0,
    buffs: [],
    pendingEncounterId: null,
    pillCooldownUntil: 0,
    lastTickAt: now,
    lastSavedAt: now,
    log: [{ at: now, text: '入山结庐，静候灵机。' }],
  };
}

export function tick(state, now = Date.now()) {
  const elapsedSeconds = Math.max(
    0,
    Math.min(MAX_OFFLINE_SECONDS, Math.floor((now - state.lastTickAt) / 1000)),
  );
  const buffs = activeBuffs(state.buffs, now);
  const gainMultiplier = 1 + buffs
    .filter((buff) => buff.type === 'buffGain')
    .reduce((sum, buff) => sum + buff.amount, 0);
  const realm = defaultRealms[state.realmIndex] ?? defaultRealms[0];

  return {
    ...state,
    buffs,
    spiritualEnergy: state.spiritualEnergy + realm.gainRate * gainMultiplier * elapsedSeconds,
    lastTickAt: now,
  };
}

export function maybeRollEncounter(state, now = Date.now(), roll = Math.random()) {
  if (state.pendingEncounterId || roll > 0.035) {
    return state;
  }

  const available = defaultEncounters.filter(
    (event) => event.minRealmIndex <= state.realmIndex,
  );
  const encounter = available[Math.floor(Math.random() * available.length)];
  return addLog(
    { ...state, pendingEncounterId: encounter.id },
    `奇遇：${encounter.title}`,
    now,
  );
}

export function refinePill(state, now = Date.now()) {
  if (state.pillCooldownUntil > now) {
    return { ok: false, message: '丹炉尚温，稍后再炼。', state };
  }

  const next = addLog(
    {
      ...state,
      pills: state.pills + 1,
      pillCooldownUntil: now + PILL_COOLDOWN_MS,
    },
    '炉火一转，得聚气丹一枚。',
    now,
  );
  return { ok: true, message: '得聚气丹一枚。', state: next };
}

export function tryBreakthrough(state, now = Date.now(), roll = Math.random()) {
  const realm = defaultRealms[state.realmIndex] ?? defaultRealms[0];
  if (state.spiritualEnergy < realm.energyRequired) {
    return { ok: false, message: '灵气未满，尚不可突破。', state };
  }
  if (state.realmIndex >= defaultRealms.length - 1) {
    return { ok: false, message: '当前已至首版最高境界。', state };
  }

  const usesPill = state.pills > 0;
  const pillBonus = usesPill ? 0.1 : 0;
  const buffBonus = activeBuffs(state.buffs, now)
    .filter((buff) => buff.type === 'buffBreakthrough')
    .reduce((sum, buff) => sum + buff.amount, 0);
  const chance = Math.min(0.95, realm.breakthroughChance + pillBonus + buffBonus);

  if (roll <= chance) {
    const nextRealm = defaultRealms[state.realmIndex + 1];
    const next = addLog(
      {
        ...state,
        realmIndex: state.realmIndex + 1,
        spiritualEnergy: 0,
        pills: usesPill ? state.pills - 1 : state.pills,
      },
      `灵气贯通，突破至${nextRealm.name}。`,
      now,
    );
    return { ok: true, message: '突破成功。', state: next };
  }

  const next = addLog(
    {
      ...state,
      spiritualEnergy: state.spiritualEnergy * (1 - realm.failurePenaltyRate),
      pills: usesPill ? state.pills - 1 : state.pills,
    },
    '冲关未稳，损了些灵气。',
    now,
  );
  return { ok: false, message: '突破失败。', state: next };
}

export function resolveEncounter(state, choiceId, now = Date.now()) {
  const encounter = defaultEncounters.find((event) => event.id === state.pendingEncounterId);
  const choice = encounter?.choices.find((item) => item.id === choiceId);
  if (!choice) {
    return { ok: false, message: '当前无奇遇。', state };
  }

  const next = addLog(
    applyEffects({ ...state, pendingEncounterId: null }, choice.effects, now),
    choice.result,
    now,
  );
  return { ok: true, message: choice.result, state: next };
}

export function saveState(state, storage = globalThis.localStorage) {
  const saved = { ...state, lastSavedAt: Date.now() };
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
    if (parsed.saveVersion !== SAVE_VERSION) {
      return addLog(createInitialState(now), '存档版本不兼容，已重新入山。', now);
    }
    return { ...createInitialState(now), ...parsed };
  } catch {
    return addLog(createInitialState(now), '存档损坏，已重新入山。', now);
  }
}

export function addLog(state, text, now = Date.now()) {
  return {
    ...state,
    log: [{ at: now, text }, ...state.log].slice(0, LOG_LIMIT),
  };
}

function applyEffects(state, effects, now) {
  return effects.reduce((next, effect) => {
    if (effect.durationMs) {
      return {
        ...next,
        buffs: [
          ...next.buffs,
          {
            type: effect.type,
            amount: effect.amount,
            expiresAt: now + effect.durationMs,
          },
        ],
      };
    }
    if (effect.type === 'energy') {
      return { ...next, spiritualEnergy: Math.max(0, next.spiritualEnergy + effect.amount) };
    }
    if (effect.type === 'pills') {
      return { ...next, pills: Math.max(0, next.pills + effect.amount) };
    }
    return next;
  }, state);
}

function activeBuffs(buffs, now) {
  return buffs.filter((buff) => buff.expiresAt > now);
}
