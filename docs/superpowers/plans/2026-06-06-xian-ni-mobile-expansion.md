# Xian Ni Mobile Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix encounter cost validation and upgrade the GitHub Pages xiuxian game into a mobile-first, more visual cultivation game with inventory, help, character art, and radar attributes.

**Architecture:** Keep the static no-build web architecture. Extend `src/game.js` as the pure rules/content layer, keep `src/app.js` as the DOM renderer/controller, and keep `styles.css` as the visual system. Add only static assets and metadata so GitHub Pages direct deployment remains stable.

**Tech Stack:** Vanilla JavaScript ES modules, HTML, CSS, SVG/Canvas-free inline DOM rendering, Node test runner.

---

## File Structure

- Modify: `src/game.js`
  - Cost validation fix.
  - Item definitions, inventory helpers, use-item action, save migration to version 3.
  - Additional item rewards integrated into existing action/encounter effects.
- Modify: `src/app.js`
  - New DOM bindings.
  - Inventory rendering and item use handlers.
  - Help page rendering.
  - Character visual and radar chart rendering.
  - Fullscreen button behavior.
- Modify: `index.html`
  - Mobile app metadata.
  - Immersive button.
  - Inventory and help tabs.
  - Character visual/radar containers.
- Modify: `styles.css`
  - Mobile-first app shell using `100dvh`, safe-area padding, fixed bottom nav, internal scrolling.
  - Inventory grid, help flow, character visual, radar chart, rarity styling.
- Modify: `test/game.test.js`
  - Cost validation regression tests.
  - Inventory/migration/use-item tests.
- Modify: `test/browser-entry.test.js`
  - DOM smoke checks for new tabs and containers.
- Create: `manifest.webmanifest`
  - PWA metadata for GitHub Pages.

## Task 1: Fix Encounter Cost Validation

**Files:**
- Modify: `src/game.js`
- Modify: `test/game.test.js`

- [ ] **Step 1: Add failing regression tests**

Add tests near the existing encounter tests:

```js
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
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test`

Expected before fix: the first new test fails with `资源不足。`.

- [ ] **Step 3: Implement minimal cost whitelist**

In `src/game.js`, add:

```js
const COST_RESOURCE_KEYS = new Set(['spiritStones', 'pills', 'lifeSpan', 'sectContribution']);
```

Change missing cost lookup to:

```js
const missingCost = choice.effects.find((effect) =>
  COST_RESOURCE_KEYS.has(effect.type) &&
  effect.amount < 0 &&
  (state[effect.type] ?? 0) < Math.abs(effect.amount)
);
```

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: all tests pass.

## Task 2: Add Inventory Model, Migration, and Item Use

**Files:**
- Modify: `src/game.js`
- Modify: `test/game.test.js`

- [ ] **Step 1: Add failing inventory tests**

Add tests for version 3 migration and item usage:

```js
test('new saves include an inventory bag', () => {
  const state = createInitialState(0);

  assert.equal(state.saveVersion, 3);
  assert.ok(Object.hasOwn(state, 'inventory'));
  assert.equal(typeof state.inventory, 'object');
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
```

Import `defaultItems` and `useInventoryItem`.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test`

Expected: import or assertion failures because inventory is not implemented yet.

- [ ] **Step 3: Add item data**

In `src/game.js`, add `defaultItems` near content config:

```js
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
```

- [ ] **Step 4: Add helpers and state shape**

Add:

```js
function item(id, name, category, rarity, description, tags, effects, usable = true) {
  return { id, name, category, rarity, description, tags, effects, usable };
}
```

Add `inventory: { qi_pill: 1 }` or `{}` to `createInitialState`.

Add `inventory` normalization in `normalizeState`.

Add helpers:

```js
function addInventory(state, itemId, amount) { ... }
function inventoryCount(state, itemId) { ... }
export function useInventoryItem(state, itemId, now = Date.now(), varianceRoll = Math.random()) { ... }
```

`useInventoryItem` should reject missing/non-usable items, decrement quantity, apply item effects, log the result, and call `ensureLiving`.

- [ ] **Step 5: Add item effects support**

Extend `applyEffects()` to support:

```js
{ type: 'item', itemId: 'healing_pill', amount: 1 }
```

This lets actions and encounters grant inventory items.

- [ ] **Step 6: Integrate light item rewards**

Add a small number of item rewards to existing actions/events:

- `refinePill`: add one `qi_pill` or keep `pills` plus add `spirit_herb` chance if minimal.
- `travel` or NPC events: grant materials/specials.
- High-realm events: grant `law_shard`, `origin_shard`, or `heaven_defying_shadow`.

- [ ] **Step 7: Run tests**

Run: `npm test`

Expected: all tests pass.

## Task 3: Add HTML Structure for Inventory, Help, Character, and Fullscreen

**Files:**
- Modify: `index.html`
- Modify: `test/browser-entry.test.js`

- [ ] **Step 1: Add failing DOM smoke test**

Update required tabs in `test/browser-entry.test.js` to include:

```js
const requiredTabs = ['practice', 'encounter', 'bag', 'npc', 'realm', 'help'];
```

Add checks for:

```js
['immersiveButton', 'bagPanel', 'itemGrid', 'helpPanel', 'characterAvatar', 'attributeRadar']
```

- [ ] **Step 2: Run tests**

Run: `npm test`

Expected: browser-entry test fails because elements do not exist.

- [ ] **Step 3: Update `index.html`**

Add:

- `theme-color` meta.
- `apple-mobile-web-app-capable` meta.
- `link rel="manifest" href="./manifest.webmanifest"`.
- `immersiveButton` in topbar.
- `bag` and `help` tab buttons.
- `bagPanel` with `itemGrid`.
- Character visual container and radar SVG in `npcPanel`.
- `helpPanel` with empty container that `app.js` can render.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: DOM smoke tests pass once the elements exist.

## Task 4: Render Inventory and Item Use

**Files:**
- Modify: `src/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Add imports and element bindings**

Import:

```js
defaultItems,
useInventoryItem,
```

Bind:

```js
immersiveButton,
itemGrid,
characterAvatar,
attributeRadar,
helpContent,
```

- [ ] **Step 2: Add item use handler**

Render each item as a button/card. On usable items:

```js
const result = useInventoryItem(state, item.id);
applyResult(result);
```

Disable use button if quantity is 0 or item is not usable.

- [ ] **Step 3: Render inventory**

`renderInventory()` should group categories visually by item cards. Each card shows:

- Icon glyph.
- Name.
- Rarity.
- Count.
- Tags.
- Short description.
- Use button for usable items.

- [ ] **Step 4: Add CSS**

Add classes:

- `.bag-grid`
- `.item-card`
- `.item-icon`
- `.rarity-*`
- `.tag-row`

- [ ] **Step 5: Run tests**

Run: `npm test`

Expected: all automated tests pass. Manual item button behavior will be verified later in browser.

## Task 5: Add Character Visual and Radar Chart

**Files:**
- Modify: `src/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Add render functions**

Add:

```js
function renderCharacter(realm, state) { ... }
function renderRadar(state, realm) { ... }
function radarStats(state, realm) { ... }
```

Use SVG polygons for the radar chart. Keep values normalized to 0-100.

- [ ] **Step 2: Add visual state classes**

The character visual should set classes by realm major:

- `avatar-qigong`
- `avatar-core`
- `avatar-spirit`
- `avatar-law`
- `avatar-decline`
- `avatar-heaven`

Also add state classes:

- `has-injury`
- `has-demon`
- `has-artifact`

- [ ] **Step 3: Add CSS visuals**

Use CSS gradients, pseudo-elements, rings, bridges, runes, and shadows. No external image dependency.

- [ ] **Step 4: Wire into render**

Call `renderCharacter(realm, state)` and `renderRadar(state, realm)` from `render()`.

- [ ] **Step 5: Manual visual check**

Run local server and inspect mobile width. Expected: character visual and radar render without text overlap.

## Task 6: Add Game Help Page

**Files:**
- Modify: `src/app.js`
- Modify: `styles.css`

- [ ] **Step 1: Add help renderer**

Add `renderHelp()` with sections:

- 修炼循环
- 风险状态
- 奇遇选择
- 储物袋
- 属性雷达
- 境界突破

Use short text and icon-like glyphs.

- [ ] **Step 2: Add CSS**

Add:

- `.help-flow`
- `.help-step`
- `.help-icon`
- `.flow-arrow`

- [ ] **Step 3: Wire into render**

Call `renderHelp()` once on startup or from `render()`.

- [ ] **Step 4: Manual content check**

Expected: help is visual and short, not a wall of text.

## Task 7: Mobile Shell and PWA Polish

**Files:**
- Modify: `styles.css`
- Modify: `src/app.js`
- Create: `manifest.webmanifest`

- [ ] **Step 1: Create manifest**

Create `manifest.webmanifest`:

```json
{
  "name": "修仙小游戏",
  "short_name": "修仙",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#eef4ef",
  "theme_color": "#2f7d68",
  "icons": []
}
```

- [ ] **Step 2: Add fullscreen handler**

In `app.js`:

```js
elements.immersiveButton.addEventListener('click', async () => {
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    await document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    await document.exitFullscreen();
  }
});
```

Catch errors and show a short message.

- [ ] **Step 3: Rewrite mobile shell CSS**

Ensure:

- `.game-shell` uses `height: 100dvh`.
- `.tabbar` is fixed/sticky at bottom with safe-area padding.
- Main tab content scrolls internally.
- Desktop still looks acceptable with a centered max-width shell.

- [ ] **Step 4: Visual check**

Run local server and inspect:

- iPhone-sized viewport.
- Desktop viewport.

Expected: bottom nav stays visible; content does not sit behind safe area; text does not overlap.

## Task 8: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run automated tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Start local server**

Run:

```bash
python3 -m http.server 4173
```

- [ ] **Step 3: Browser verification**

Open: `http://localhost:4173`

Check:

- Initial load.
- Tab switching.
- Encounter bug regression.
- Inventory item use.
- Character/radar display.
- Help page.
- Fullscreen button.
- Mobile viewport layout.

- [ ] **Step 4: GitHub Pages path check**

Confirm all asset links are relative:

- `./styles.css`
- `./src/app.js`
- `./manifest.webmanifest`
- `./assets/...`

- [ ] **Step 5: Commit implementation**

```bash
git add index.html styles.css src/app.js src/game.js test/game.test.js test/browser-entry.test.js manifest.webmanifest
git commit -m "feat: expand mobile cultivation game"
```
