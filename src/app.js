const {
  createInitialState,
  defaultEncounters,
  defaultRealms,
  loadState,
  maybeRollEncounter,
  refinePill,
  resolveEncounter,
  saveState,
  tick,
  tryBreakthrough,
} = window.XiuxianGame;

const elements = {
  realmName: document.querySelector('#realmName'),
  realmTitle: document.querySelector('#realmTitle'),
  energyValue: document.querySelector('#energyValue'),
  pillValue: document.querySelector('#pillValue'),
  gainRate: document.querySelector('#gainRate'),
  breakthroughChance: document.querySelector('#breakthroughChance'),
  energyProgress: document.querySelector('#energyProgress'),
  energyRequired: document.querySelector('#energyRequired'),
  refineButton: document.querySelector('#refineButton'),
  breakthroughButton: document.querySelector('#breakthroughButton'),
  resetButton: document.querySelector('#resetButton'),
  message: document.querySelector('#message'),
  encounterPanel: document.querySelector('#encounterPanel'),
  encounterTitle: document.querySelector('#encounterTitle'),
  encounterDescription: document.querySelector('#encounterDescription'),
  encounterChoices: document.querySelector('#encounterChoices'),
  logList: document.querySelector('#logList'),
};

let state = loadState();

elements.refineButton.addEventListener('click', () => {
  const result = refinePill(state);
  state = result.state;
  showMessage(result.message);
  saveState(state);
  render();
});

elements.breakthroughButton.addEventListener('click', () => {
  const result = tryBreakthrough(state);
  state = result.state;
  showMessage(result.message);
  saveState(state);
  render();
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

function gameTick() {
  state = maybeRollEncounter(tick(state));
  saveState(state);
  render();
}

function render() {
  const realm = defaultRealms[state.realmIndex] ?? defaultRealms[0];
  const progress = Math.min(1, state.spiritualEnergy / realm.energyRequired);
  const cooldownLeft = Math.max(0, Math.ceil((state.pillCooldownUntil - Date.now()) / 1000));

  elements.realmName.textContent = realm.name;
  elements.realmTitle.textContent = realm.name;
  elements.energyValue.textContent = formatNumber(state.spiritualEnergy);
  elements.pillValue.textContent = String(state.pills);
  elements.gainRate.textContent = `${realm.gainRate.toFixed(1)}/s`;
  elements.breakthroughChance.textContent = `突破率 ${Math.round(realm.breakthroughChance * 100)}%`;
  elements.energyProgress.style.width = `${progress * 100}%`;
  elements.energyRequired.textContent = `${formatNumber(state.spiritualEnergy)} / ${formatNumber(realm.energyRequired)} 灵气`;

  elements.refineButton.disabled = cooldownLeft > 0;
  elements.refineButton.textContent = cooldownLeft > 0 ? `${cooldownLeft}s` : '炼丹';
  elements.breakthroughButton.disabled = state.spiritualEnergy < realm.energyRequired;

  renderEncounter();
  renderLog();
}

function renderEncounter() {
  const encounter = defaultEncounters.find((event) => event.id === state.pendingEncounterId);
  elements.encounterPanel.classList.toggle('hidden', !encounter);
  elements.encounterChoices.replaceChildren();

  if (!encounter) {
    return;
  }

  elements.encounterTitle.textContent = encounter.title;
  elements.encounterDescription.textContent = encounter.description;

  for (const choice of encounter.choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      const result = resolveEncounter(state, choice.id);
      state = result.state;
      showMessage(result.message);
      saveState(state);
      render();
    });
    elements.encounterChoices.append(button);
  }
}

function renderLog() {
  elements.logList.replaceChildren(
    ...state.log.slice(0, 10).map((entry) => {
      const item = document.createElement('li');
      item.textContent = entry.text;
      return item;
    }),
  );
}

function showMessage(message) {
  elements.message.textContent = message;
}

function formatNumber(value) {
  return Math.floor(value).toLocaleString('zh-CN');
}

render();
setInterval(gameTick, 1000);
setInterval(() => saveState(state), 5000);
