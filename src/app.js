import {
  actionConfigs,
  calculateBreakthroughChance,
  createInitialState,
  defaultEncounters,
  defaultItems,
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
  useInventoryItem,
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
  immersiveButton: document.querySelector('#immersiveButton'),
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
  resourceCodex: document.querySelector('#resourceCodex'),
  itemGrid: document.querySelector('#itemGrid'),
  characterAvatar: document.querySelector('#characterAvatar'),
  attributeRadar: document.querySelector('#attributeRadar'),
  helpContent: document.querySelector('#helpContent'),
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

elements.immersiveButton.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
      showMessage('已入沉浸模式。');
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
      showMessage('已退出沉浸模式。');
    } else {
      showMessage('当前浏览器不支持全屏。');
    }
  } catch {
    showMessage('全屏需要浏览器允许。');
  }
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
  renderResourceCodex(realm);
  renderInventory();
  renderCharacter(realm);
  renderRadar(realm);
  renderHelp();
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

function renderResourceCodex(realm) {
  const resourceEntries = [
    ['灵石', state.spiritStones, '坊市、疗伤、避劫'],
    ['丹药', state.pills, '突破准备'],
    ['法宝', state.artifact, '战力与护身'],
    ['功法', state.technique, '产速与根基'],
    ['意境', state.insight, '化神后破境'],
    ['法则', state.law, '涅境门槛'],
    ['本源', state.origin, '空境核心'],
    ['香火', state.inventory?.incense ?? 0, realm.index >= 55 ? '信念与杂音' : '高阶材料'],
  ];

  elements.resourceCodex.replaceChildren(
    ...resourceEntries.map(([label, value, hint]) => {
      const item = document.createElement('article');
      item.className = 'resource-chip';
      item.innerHTML = `<span>${label}</span><strong>${formatNumber(value)}</strong><small>${hint}</small>`;
      return item;
    }),
  );
}

function renderInventory() {
  const rarityOrder = ['凡', '灵', '玄', '地', '天', '逆'];
  const items = [...defaultItems].sort((left, right) => {
    if (left.category !== right.category) return left.category.localeCompare(right.category, 'zh-CN');
    return rarityOrder.indexOf(right.rarity) - rarityOrder.indexOf(left.rarity);
  });

  const categories = ['丹药', '法宝', '材料', '特殊'];
  const nodes = [];
  for (const category of categories) {
    const categoryItems = items.filter((item) => item.category === category);
    if (categoryItems.length === 0) continue;

    const heading = document.createElement('div');
    heading.className = 'bag-category-title';
    heading.innerHTML = `<span>${category}</span><small>${categoryHint(category)}</small>`;
    nodes.push(heading);

    nodes.push(...categoryItems.map((item) => {
      const count = Math.floor(Number(state.inventory?.[item.id] ?? 0));
      const card = document.createElement('article');
      card.className = `item-card rarity-${rarityClass(item.rarity)}${count <= 0 ? ' is-empty' : ''}`;
      card.dataset.itemId = item.id;

      const icon = document.createElement('div');
      icon.className = 'item-icon';
      icon.textContent = itemIcon(item);

      const body = document.createElement('div');
      body.className = 'item-body';

      const titleRow = document.createElement('div');
      titleRow.className = 'item-title-row';
      const title = document.createElement('strong');
      title.textContent = item.name;
      const amount = document.createElement('span');
      amount.textContent = `x${count}`;
      titleRow.append(title, amount);

      const meta = document.createElement('p');
      meta.className = 'item-meta';
      meta.textContent = `${item.category} · ${item.rarity}`;

      const desc = document.createElement('p');
      desc.className = 'item-desc';
      desc.textContent = item.description;

      const tags = document.createElement('div');
      tags.className = 'tag-row';
      tags.replaceChildren(...item.tags.map((tag) => {
        const chip = document.createElement('span');
        chip.textContent = tag;
        return chip;
      }));

      body.append(titleRow, meta, desc, tags);

      const useButton = document.createElement('button');
      useButton.type = 'button';
      useButton.textContent = item.usable ? '使用' : '收纳';
      useButton.disabled = !item.usable || count <= 0 || Boolean(state.ending);
      useButton.addEventListener('click', () => {
        const result = useInventoryItem(state, item.id);
        applyResult(result);
      });

      card.append(icon, body, useButton);
      return card;
    }));
  }

  elements.itemGrid.replaceChildren(...nodes);
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

function renderCharacter(realm) {
  elements.characterAvatar.className = [
    'character-avatar',
    avatarClass(realm),
    state.injury > 20 ? 'has-injury' : '',
    state.heartDemon > 20 ? 'has-demon' : '',
    state.artifact > 0 ? 'has-artifact' : '',
  ].filter(Boolean).join(' ');

  const figure = document.createElement('div');
  figure.className = 'avatar-figure';
  const halo = document.createElement('div');
  halo.className = 'avatar-halo';
  const robe = document.createElement('div');
  robe.className = 'avatar-robe';
  const core = document.createElement('div');
  core.className = 'avatar-core-orb';
  const bridge = document.createElement('div');
  bridge.className = 'avatar-bridge';
  const domain = document.createElement('div');
  domain.className = 'avatar-domain';
  const runes = document.createElement('div');
  runes.className = 'avatar-runes';
  const caption = document.createElement('div');
  caption.className = 'avatar-caption';
  caption.textContent = avatarCaption(realm);
  figure.append(domain, halo, robe, core, bridge, runes);
  elements.characterAvatar.replaceChildren(figure, caption);
}

function renderRadar(realm) {
  const svg = elements.attributeRadar;
  svg.replaceChildren();

  const stats = radarStats(realm);
  const center = 110;
  const radius = 78;
  const ns = 'http://www.w3.org/2000/svg';

  for (const scale of [0.25, 0.5, 0.75, 1]) {
    const ring = document.createElementNS(ns, 'polygon');
    ring.setAttribute('points', radarPoints(stats.map(() => scale), center, radius));
    ring.setAttribute('class', 'radar-ring');
    svg.append(ring);
  }

  for (const [index, stat] of stats.entries()) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / stats.length;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', center);
    line.setAttribute('y1', center);
    line.setAttribute('x2', center + Math.cos(angle) * radius);
    line.setAttribute('y2', center + Math.sin(angle) * radius);
    line.setAttribute('class', 'radar-axis');
    svg.append(line);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', center + Math.cos(angle) * (radius + 18));
    label.setAttribute('y', center + Math.sin(angle) * (radius + 18));
    label.setAttribute('text-anchor', Math.cos(angle) > 0.2 ? 'start' : Math.cos(angle) < -0.2 ? 'end' : 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('class', 'radar-label');
    label.textContent = stat.label;
    svg.append(label);
  }

  const shape = document.createElementNS(ns, 'polygon');
  shape.setAttribute('points', radarPoints(stats.map((stat) => stat.value / 100), center, radius));
  shape.setAttribute('class', 'radar-shape');
  svg.append(shape);
}

function renderHelp() {
  const steps = [
    ['修', '修炼', '积累修为，产速受根骨、悟性、功法影响。'],
    ['破', '突破', '修为满后看丹药、道心、伤势、心魔和高阶资源。'],
    ['险', '奇遇', '选择会带来奖励或代价，境界越高事件越专属。'],
    ['袋', '储物袋', '丹药、法宝、材料和特殊物能改变修行状态。'],
    ['劫', '风险', '心魔、伤势和寿元会压低突破把握。'],
    ['图', '属性', '雷达图展示战力、道心、悟性、根骨、气运和境界核心。'],
  ];

  elements.helpContent.replaceChildren(
    ...steps.flatMap(([iconText, title, body], index) => {
      const card = document.createElement('article');
      card.className = 'help-step';
      const icon = document.createElement('span');
      icon.className = 'help-icon';
      icon.textContent = iconText;
      const text = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = title;
      const description = document.createElement('p');
      description.textContent = body;
      text.append(heading, description);
      card.append(icon, text);
      if (index >= steps.length - 1) return [card];

      const arrow = document.createElement('div');
      arrow.className = 'flow-arrow';
      arrow.textContent = '↓';
      return [card, arrow];
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

function itemIcon(item) {
  return {
    丹药: '丹',
    法宝: '器',
    材料: '材',
    特殊: '逆',
  }[item.category] ?? '物';
}

function rarityClass(rarity) {
  return {
    凡: 'common',
    灵: 'spirit',
    玄: 'mystic',
    地: 'earth',
    天: 'heaven',
    逆: 'defy',
  }[rarity] ?? 'common';
}

function categoryHint(category) {
  return {
    丹药: '入炉成丹，救急破境',
    法宝: '护身抗劫，古宝压阵',
    材料: '灵草灵矿，法则本源',
    特殊: '逆修机缘，命数暗线',
  }[category] ?? '行囊杂物';
}

function avatarClass(realm) {
  if (realm.major === '天人五衰') return 'avatar-decline';
  if (['半步踏天', '踏天'].includes(realm.major)) return 'avatar-heaven';
  if (['窥涅', '净涅', '碎涅', '空涅', '空灵', '空玄', '空劫'].includes(realm.major)) return 'avatar-law';
  if (['化神', '婴变', '问鼎'].includes(realm.major)) return 'avatar-spirit';
  if (['结丹', '元婴'].includes(realm.major)) return 'avatar-core';
  return 'avatar-qigong';
}

function avatarCaption(realm) {
  if (realm.major === '天人五衰') return '命轮承衰，衰气缠身';
  if (['半步踏天', '踏天'].includes(realm.major)) return '桥临轮回，踏天问道';
  if (['窥涅', '净涅', '碎涅', '空涅', '空灵', '空玄', '空劫'].includes(realm.major)) return '法则成纹，本源照体';
  if (['化神', '婴变', '问鼎'].includes(realm.major)) return '红尘入心，星域问鼎';
  if (['结丹', '元婴'].includes(realm.major)) return '丹光护体，元婴初成';
  return '洞府清修，灵光初聚';
}

function radarStats(realm) {
  let coreLabel = '准备';
  let coreValue = state.pills * 14 + state.artifact * 10 + state.tribulationResistance * 8;
  if (['化神', '婴变', '问鼎'].includes(realm.major)) {
    coreLabel = '意境';
    coreValue = state.insight * 5;
  } else if (['窥涅', '净涅', '碎涅'].includes(realm.major)) {
    coreLabel = '法则';
    coreValue = state.law * 4;
  } else if (['天人五衰', '空涅', '空灵', '空玄', '空劫', '半步踏天', '踏天'].includes(realm.major)) {
    coreLabel = '本源';
    coreValue = state.origin * 5;
  }

  return [
    { label: '战力', value: normalizeStat(state.combatPower, 900) },
    { label: '道心', value: normalizeStat(state.daoHeart, 40) },
    { label: '悟性', value: normalizeStat(state.comprehension, 35) },
    { label: '根骨', value: normalizeStat(state.aptitude, 35) },
    { label: '气运', value: normalizeStat(state.luck, 35) },
    { label: coreLabel, value: normalizeStat(coreValue, 100) },
  ];
}

function radarPoints(values, center, radius) {
  return values.map((value, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / values.length;
    const scaledRadius = radius * clamp(value, 0, 1);
    return `${center + Math.cos(angle) * scaledRadius},${center + Math.sin(angle) * scaledRadius}`;
  }).join(' ');
}

function normalizeStat(value, cap) {
  return clamp((Number(value) || 0) / cap * 100, 8, 100);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
