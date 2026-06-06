import {
  actionConfigs,
  calculateBreakthroughChance,
  createInitialState,
  defaultEncounters,
  defaultRealms,
  getCurrentRealm,
  loadState,
  maybeRollEncounter,
  performAction,
  refinePill,
  resolveEncounter,
  saveState,
  tick,
  tryBreakthrough,
} from './game.js';

const elements = {
  realmStep: document.querySelector('#realmStep'),
  realmName: document.querySelector('#realmName'),
  realmHint: document.querySelector('#realmHint'),
  cultivationValue: document.querySelector('#cultivationValue'),
  lifeSpanValue: document.querySelector('#lifeSpanValue'),
  heartDemonValue: document.querySelector('#heartDemonValue'),
  injuryValue: document.querySelector('#injuryValue'),
  spiritStoneValue: document.querySelector('#spiritStoneValue'),
  pillValue: document.querySelector('#pillValue'),
  combatValue: document.querySelector('#combatValue'),
  gainRate: document.querySelector('#gainRate'),
  breakthroughChance: document.querySelector('#breakthroughChance'),
  cultivationProgress: document.querySelector('#cultivationProgress'),
  cultivationRequired: document.querySelector('#cultivationRequired'),
  message: document.querySelector('#message'),
  resetButton: document.querySelector('#resetButton'),
  cultivateButton: document.querySelector('#cultivateButton'),
  seclusionButton: document.querySelector('#seclusionButton'),
  travelButton: document.querySelector('#travelButton'),
  exploreButton: document.querySelector('#exploreButton'),
  breakthroughButton: document.querySelector('#breakthroughButton'),
  refineButton: document.querySelector('#refineButton'),
  healButton: document.querySelector('#healButton'),
  suppressButton: document.querySelector('#suppressButton'),
  buyPillButton: document.querySelector('#buyPillButton'),
  encounterEmpty: document.querySelector('#encounterEmpty'),
  encounterCard: document.querySelector('#encounterCard'),
  encounterTitle: document.querySelector('#encounterTitle'),
  encounterDescription: document.querySelector('#encounterDescription'),
  encounterMeta: document.querySelector('#encounterMeta'),
  encounterChoices: document.querySelector('#encounterChoices'),
  advancedStats: document.querySelector('#advancedStats'),
  realmList: document.querySelector('#realmList'),
  npcList: document.querySelector('#npcList'),
  logList: document.querySelector('#logList'),
  tabButtons: document.querySelectorAll('[data-tab]'),
  panels: document.querySelectorAll('.tab-panel'),
};

const actionButtonMap = new Map([
  [elements.cultivateButton, 'cultivate'],
  [elements.seclusionButton, 'seclusion'],
  [elements.travelButton, 'travel'],
  [elements.exploreButton, 'explore'],
  [elements.healButton, 'heal'],
  [elements.suppressButton, 'suppress'],
  [elements.buyPillButton, 'buyPill'],
]);

let state = loadState();
let activeTab = 'practice';

for (const [button, actionId] of actionButtonMap) {
  button.addEventListener('click', () => runAction(actionId));
}

elements.refineButton.addEventListener('click', () => {
  const result = refinePill(state);
  applyResult(result);
});

elements.breakthroughButton.addEventListener('click', () => {
  const result = tryBreakthrough(state);
  applyResult(result);
});

elements.resetButton.addEventListener('click', () => {
  if (!confirm('确定重置存档，重新入山吗？')) {
    return;
  }
  state = createInitialState();
  saveState(state);
  showMessage('重新入山。');
  render();
});

for (const button of elements.tabButtons) {
  button.addEventListener('click', () => {
    activeTab = button.dataset.tab;
    renderTabs();
  });
}

function runAction(actionId) {
  const result = performAction(state, actionId);
  applyResult(result);
  if (state.pendingEncounterId) {
    activeTab = 'encounter';
  }
}

function applyResult(result) {
  state = result.state;
  showMessage(result.message);
  saveState(state);
  render();
}

function gameTick() {
  state = maybeRollEncounter(tick(state));
  saveState(state);
  render();
}

function render() {
  const realm = getCurrentRealm(state);
  const progress = Math.min(1, state.cultivation / realm.energyRequired);
  const cooldownLeft = Math.max(0, Math.ceil((state.pillCooldownUntil - Date.now()) / 1000));
  const gainRate = realm.gainRate * (1 + state.aptitude * 0.018 + state.comprehension * 0.014 + state.technique * 0.018);
  const chance = calculateBreakthroughChance(state);

  elements.realmStep.textContent = realm.step;
  elements.realmName.textContent = realm.name;
  elements.realmHint.textContent = realmHint(realm);
  elements.cultivationValue.textContent = formatNumber(state.cultivation);
  elements.lifeSpanValue.textContent = `${formatNumber(state.lifeSpan)}年`;
  elements.heartDemonValue.textContent = formatNumber(state.heartDemon);
  elements.injuryValue.textContent = formatNumber(state.injury);
  elements.spiritStoneValue.textContent = formatNumber(state.spiritStones);
  elements.pillValue.textContent = formatNumber(state.pills);
  elements.combatValue.textContent = formatNumber(state.combatPower);
  elements.gainRate.textContent = `${gainRate.toFixed(1)}/s`;
  elements.breakthroughChance.textContent = `突破率 ${Math.round(chance * 100)}%`;
  elements.cultivationProgress.style.width = `${progress * 100}%`;
  elements.cultivationRequired.textContent = `${formatNumber(state.cultivation)} / ${formatNumber(realm.energyRequired)} 修为`;

  elements.refineButton.disabled = cooldownLeft > 0 || Boolean(state.ending);
  elements.refineButton.textContent = cooldownLeft > 0 ? `炼丹 ${cooldownLeft}s` : '炼丹';
  elements.breakthroughButton.disabled = state.cultivation < realm.energyRequired || realm.final || Boolean(state.ending);
  elements.healButton.disabled = state.spiritStones < 10 || state.injury <= 0 || Boolean(state.ending);
  elements.suppressButton.disabled = state.cultivation < 20 || state.heartDemon <= 0 || Boolean(state.ending);
  elements.buyPillButton.disabled = state.spiritStones < 20 || Boolean(state.ending);

  renderEncounter();
  renderRealms();
  renderNpcs();
  renderLog();
  renderTabs();
}

function renderEncounter() {
  const encounter = defaultEncounters.find((event) => event.id === state.pendingEncounterId);
  elements.encounterEmpty.classList.toggle('hidden', Boolean(encounter));
  elements.encounterCard.classList.toggle('hidden', !encounter);
  elements.encounterChoices.replaceChildren();
  elements.encounterMeta.replaceChildren();

  if (!encounter) {
    return;
  }

  elements.encounterTitle.textContent = encounter.title;
  elements.encounterDescription.textContent = encounter.description;
  elements.encounterMeta.replaceChildren(
    metaChip(`风险 ${riskLabel(encounter.risk)}`),
    metaChip(encounter.reward),
  );

  for (const choice of encounter.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      const result = resolveEncounter(state, choice.id);
      applyResult(result);
    });
    elements.encounterChoices.append(button);
  }
}

function renderRealms() {
  const currentIndex = state.realmIndex;
  const start = Math.max(0, currentIndex - 3);
  const end = Math.min(defaultRealms.length, currentIndex + 12);
  const visible = defaultRealms.slice(start, end);

  elements.advancedStats.textContent = `悟性 ${formatNumber(state.comprehension)} · 根骨 ${formatNumber(state.aptitude)} · 道心 ${formatNumber(state.daoHeart)} · 意境 ${formatNumber(state.insight)} · 法则 ${formatNumber(state.law)} · 本源 ${formatNumber(state.origin)}`;
  elements.realmList.replaceChildren(
    ...visible.map((realm) => {
      const item = document.createElement('li');
      item.className = realm.index === currentIndex ? 'is-current' : realm.index < currentIndex ? 'is-past' : '';
      item.innerHTML = `<span>${realm.name}</span><small>${realm.step}</small>`;
      return item;
    }),
  );
}

function renderNpcs() {
  const npcNames = [...new Set(defaultEncounters.map((event) => event.npc).filter(Boolean))];
  elements.npcList.replaceChildren(
    ...npcNames.map((name) => {
      const item = document.createElement('li');
      const bond = state.npcBonds[name] ?? 0;
      item.innerHTML = `<span>${name}</span><strong>${bond}</strong>`;
      return item;
    }),
  );
}

function renderLog() {
  elements.logList.replaceChildren(
    ...state.log.slice(0, 14).map((entry) => {
      const item = document.createElement('li');
      item.textContent = entry.text;
      return item;
    }),
  );
}

function renderTabs() {
  for (const button of elements.tabButtons) {
    button.classList.toggle('is-active', button.dataset.tab === activeTab);
  }
  for (const panel of elements.panels) {
    panel.classList.toggle('is-active', panel.id === `${activeTab}Panel`);
  }
}

function showMessage(message) {
  elements.message.textContent = message;
}

function metaChip(text) {
  const item = document.createElement('span');
  item.textContent = text;
  return item;
}

function realmHint(realm) {
  if (realm.major === '凝气') return '吸纳灵气，打磨入门根基。';
  if (['筑基', '结丹', '元婴'].includes(realm.major)) return '丹药、灵石、法宝与根基缺一不可。';
  if (['化神', '婴变', '问鼎'].includes(realm.major)) return '意境与道心开始左右修行。';
  if (['窥涅', '净涅', '碎涅'].includes(realm.major)) return '法则感悟成为破境关键。';
  if (realm.major === '天人五衰') return '衰劫高危，成则收益暴增，败则寿元受损。';
  if (['空涅', '空灵', '空玄', '空劫'].includes(realm.major)) return '本源、道心与劫数共同决定前路。';
  if (realm.major === '半步踏天') return '九桥问心证道，不可只靠修为硬闯。';
  return '踏天终局，轮回之外见真我。';
}

function riskLabel(risk) {
  return {
    low: '低',
    medium: '中',
    high: '高',
    rare: '奇',
  }[risk] ?? risk;
}

function formatNumber(value) {
  return Math.floor(Number(value) || 0).toLocaleString('zh-CN');
}

render();
setInterval(gameTick, 1000);
setInterval(() => saveState(state), 5000);

window.XiuxianDebug = {
  get state() {
    return state;
  },
  setState(nextState) {
    state = nextState;
    saveState(state);
    render();
  },
  actionConfigs,
};
