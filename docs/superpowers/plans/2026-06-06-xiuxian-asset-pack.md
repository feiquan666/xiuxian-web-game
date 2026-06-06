# Xiuxian Asset Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a standalone deluxe xiuxian visual asset pack with 99 reviewable assets, a sprite file, metadata, and usage documentation.

**Architecture:** Keep asset generation isolated from the game code. Create a self-contained package under `generated-assets/xiuxian-pack-v1/` with individual SVG source files as the source of truth, generated sprite/metadata files for future integration, and a local generator script inside the pack for repeatability. Do not modify `src/`, `index.html`, `styles.css`, or existing `assets/`.

**Tech Stack:** SVG, vanilla Node.js ES modules, JSON metadata, shell verification commands, existing `npm test` smoke check.

---

## File Structure

- Create: `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs`
  - Defines the palette, asset metadata, SVG render helpers, sprite generation, manifest generation, and README generation.
- Create: `generated-assets/xiuxian-pack-v1/icons/actions/*.svg`
  - 9 action icons.
- Create: `generated-assets/xiuxian-pack-v1/icons/resources/*.svg`
  - 19 resource and attribute icons.
- Create: `generated-assets/xiuxian-pack-v1/icons/items/*.svg`
  - 18 inventory item icons, including rare `life-span-pill.svg`.
- Create: `generated-assets/xiuxian-pack-v1/icons/realms/*.svg`
  - 19 realm-stage icons.
- Create: `generated-assets/xiuxian-pack-v1/icons/npc-badges/*.svg`
  - 18 encounter and NPC abstract badges.
- Create: `generated-assets/xiuxian-pack-v1/icons/status-effects/*.svg`
  - 12 effect and feedback symbols.
- Create: `generated-assets/xiuxian-pack-v1/backgrounds/*.svg`
  - 4 wide atmosphere backgrounds.
- Create: `generated-assets/xiuxian-pack-v1/sprites/icons-sprite.svg`
  - Symbol sprite containing all 95 icon assets. Backgrounds are not included in the icon sprite.
- Create: `generated-assets/xiuxian-pack-v1/sprites/sprite-map.json`
  - Sprite lookup metadata for the 95 icon assets.
- Create: `generated-assets/xiuxian-pack-v1/manifest.json`
  - Metadata for all 99 visual assets.
- Create: `generated-assets/xiuxian-pack-v1/README.md`
  - Resource pack overview, naming rules, preview instructions, and future integration notes.

## Asset ID Inventory

Use these exact ids and categories.

Actions:

```text
cultivate
seclusion
travel
explore-secret-realm
breakthrough
refine-pill
heal
suppress-heart-demon
buy-pill
```

Resources:

```text
cultivation
spirit-stones
life-span
combat-power
luck
comprehension
aptitude
dao-heart
heart-demon
injury
reputation
insight
law
origin
tribulation-resistance
alchemy
artifact
technique
sect-contribution
```

Items:

```text
qi-pill
healing-pill
cleansing-pill
breakthrough-pill
life-span-pill
array-flag
thunder-talisman
jade-guard
ancient-fragment
spirit-herb
spirit-ore
law-shard
origin-shard
incense
heaven-defying-shadow
cave-token
soul-lamp
remnant-scroll
```

Realms:

```text
ningqi
foundation-building
core-formation
nascent-soul
spirit-transformation
infant-transformation
ask-ding
yin-xu
yang-shi
peek-nirvana
clean-nirvana
shatter-nirvana
five-declines
empty-nirvana
empty-spirit
empty-mystic
empty-calamity
half-step-heaven-trampling
heaven-trampling
```

NPC badges:

```text
root-test
cave-contest
core-thunder-tribulation
nascent-soul-out-of-body
red-dust-heart-refinement
primordial-spirit-transformation
ask-ding-heaven-gate
void-real-transition
origin-threshold
first-glimpse-of-law
domain-purification
origin-seed
encounter-five-declines
mystic-tribulation
heaven-bridge
senior-discourse
pill-cultivator-gift
causal-chess-game
```

Status effects:

```text
breakthrough-success
special-breakthrough
breakthrough-failure
severe-backlash
heavenly-tribulation
heart-demon-effect
injury-effect
healing-effect
cleansing-mind
tribulation-resistance-effect
law-resonance
origin-awakening
```

Backgrounds:

```text
cave-cultivation
secret-realm-exploration
thunder-tribulation-sky
heaven-trampling-nine-bridge
```

## Task 1: Scaffold Asset Pack And Metadata

**Files:**
- Create: `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs`
- Create directories under: `generated-assets/xiuxian-pack-v1/`

- [ ] **Step 1: Create the package directory tree**

Run:

```bash
mkdir -p generated-assets/xiuxian-pack-v1/{tools,backgrounds,sprites}
mkdir -p generated-assets/xiuxian-pack-v1/icons/{actions,resources,items,realms,npc-badges,status-effects}
```

Expected: all directories exist; no files under `src/` are changed.

- [ ] **Step 2: Create the generator script header**

Create `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs` with:

```js
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACK_ROOT = join(__dirname, '..');

const palette = {
  ink: '#17241f',
  muted: '#65706b',
  paper: '#fffefa',
  mist: '#eaf2ee',
  jade: '#2f735f',
  pine: '#264f46',
  amber: '#b9872c',
  cinnabar: '#9a3f3f',
  indigo: '#4f587a',
  blue: '#375e91',
  gold: '#d5a84b',
  violet: '#5c517f',
};
```

- [ ] **Step 3: Add exact asset metadata**

Add arrays named `actions`, `resources`, `items`, `realms`, `npcBadges`, `statusEffects`, and `backgrounds`. Each entry must have:

```js
{
  id: 'life-span-pill',
  zh: '寿元丹',
  category: 'items',
  path: 'icons/items/life-span-pill.svg',
  motif: 'life-pill',
  tone: 'gold',
  usage: '珍稀丹药图标，中后期补寿元。'
}
```

Rules:

- Use the exact ids from "Asset ID Inventory".
- Use Chinese `zh` names matching the game UI where possible.
- `items` must include `life-span-pill` with `motif: 'life-pill'`.
- `backgrounds` paths go under `backgrounds/<id>.svg`.

- [ ] **Step 4: Add a count assertion**

Add:

```js
const iconAssets = [...actions, ...resources, ...items, ...realms, ...npcBadges, ...statusEffects];
const allAssets = [...iconAssets, ...backgrounds];

if (iconAssets.length !== 95) {
  throw new Error(`Expected 95 icon assets, got ${iconAssets.length}`);
}
if (allAssets.length !== 99) {
  throw new Error(`Expected 99 visual assets, got ${allAssets.length}`);
}
```

- [ ] **Step 5: Run the incomplete generator and verify it fails only because renderers are missing**

Run:

```bash
node generated-assets/xiuxian-pack-v1/tools/build-assets.mjs
```

Expected: either no output yet or a clear renderer-not-implemented error. The count assertions must not fail.

## Task 2: Implement SVG Render Helpers

**Files:**
- Modify: `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs`

- [ ] **Step 1: Add XML escape and write helpers**

Add:

```js
function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function writePackFile(relativePath, contents) {
  const target = join(PACK_ROOT, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}
```

- [ ] **Step 2: Add shared SVG shell helpers**

Add `iconSvg(asset, body)` and `backgroundSvg(asset, body)`:

```js
function iconSvg(asset, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(asset.zh)}</title>
  <desc id="desc">${escapeXml(asset.usage)}</desc>
  <defs>
    <radialGradient id="paperGlow" cx="50%" cy="42%" r="62%">
      <stop offset="0" stop-color="${palette.paper}" stop-opacity="0.96"/>
      <stop offset="1" stop-color="${toneColor(asset)}" stop-opacity="0.18"/>
    </radialGradient>
  </defs>
  <circle cx="64" cy="64" r="56" fill="url(#paperGlow)" opacity="0.95"/>
  <circle cx="64" cy="64" r="50" fill="none" stroke="${palette.ink}" stroke-opacity="0.16" stroke-width="2"/>
  ${body}
</svg>
`;
}

function backgroundSvg(asset, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(asset.zh)}</title>
  <desc id="desc">${escapeXml(asset.usage)}</desc>
  <rect width="1200" height="520" fill="${palette.mist}"/>
  ${body}
</svg>
`;
}
```

- [ ] **Step 3: Add tone and motif renderer routing**

Add:

```js
function toneColor(asset) {
  return ({
    jade: palette.jade,
    amber: palette.amber,
    cinnabar: palette.cinnabar,
    indigo: palette.indigo,
    blue: palette.blue,
    gold: palette.gold,
    violet: palette.violet,
  })[asset.tone] ?? palette.jade;
}

function renderIcon(asset) {
  return iconSvg(asset, renderMotif(asset));
}

function renderMotif(asset) {
  switch (asset.motif) {
    case 'life-pill':
      return lifePillMotif(asset);
    case 'pill':
      return pillMotif(asset);
    case 'flag':
      return flagMotif(asset);
    case 'talisman':
      return talismanMotif(asset);
    case 'shard':
      return shardMotif(asset);
    case 'realm':
      return realmMotif(asset);
    case 'badge':
      return badgeMotif(asset);
    case 'effect':
      return effectMotif(asset);
    default:
      return genericMotif(asset);
  }
}
```

- [ ] **Step 4: Implement motif functions**

Implement these focused functions:

- `genericMotif(asset)`.
- `pillMotif(asset)`.
- `lifePillMotif(asset)`.
- `flagMotif(asset)`.
- `talismanMotif(asset)`.
- `shardMotif(asset)`.
- `realmMotif(asset)`.
- `badgeMotif(asset)`.
- `effectMotif(asset)`.

Requirements:

- No text glyphs inside icons.
- Use basic SVG shapes: `path`, `circle`, `ellipse`, `line`, `polygon`.
- Every motif uses `toneColor(asset)` plus at least one neutral ink/mist accent.
- `lifePillMotif()` must visibly differ from regular pills with a life-wheel ring and golden trail.

- [ ] **Step 5: Run a syntax check**

Run:

```bash
node --check generated-assets/xiuxian-pack-v1/tools/build-assets.mjs
```

Expected: no output and exit code 0.

## Task 3: Generate Individual SVG Assets

**Files:**
- Modify: `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs`
- Create: all individual SVG files under `generated-assets/xiuxian-pack-v1/icons/`
- Create: all background SVG files under `generated-assets/xiuxian-pack-v1/backgrounds/`

- [ ] **Step 1: Add wide background rendering**

Implement `renderBackground(asset)` with four branches:

- `cave-cultivation`: layered ink mountains, cave doorway, spiritual glow.
- `secret-realm-exploration`: mist, stone gate, floating shards, winding path.
- `thunder-tribulation-sky`: dark cloud bands, lightning paths, distant mountain.
- `heaven-trampling-nine-bridge`: nine arcing bridges, sky path, origin wheel.

- [ ] **Step 2: Add the main build function**

Add:

```js
async function main() {
  for (const asset of iconAssets) {
    await writePackFile(asset.path, renderIcon(asset));
  }
  for (const asset of backgrounds) {
    await writePackFile(asset.path, renderBackground(asset));
  }
  await writeManifest();
  await writeSprite();
  await writeReadme();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- [ ] **Step 3: Run generation**

Run:

```bash
node generated-assets/xiuxian-pack-v1/tools/build-assets.mjs
```

Expected: files are generated with no error.

- [ ] **Step 4: Verify individual asset counts**

Run:

```bash
find generated-assets/xiuxian-pack-v1/icons -name '*.svg' | wc -l
find generated-assets/xiuxian-pack-v1/backgrounds -name '*.svg' | wc -l
```

Expected:

```text
95
4
```

- [ ] **Step 5: Verify no code folders were touched**

Run:

```bash
git status --short src index.html styles.css assets
```

Expected: no output.

## Task 4: Generate Manifest, Sprite, Sprite Map, And README

**Files:**
- Modify: `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs`
- Create: `generated-assets/xiuxian-pack-v1/manifest.json`
- Create: `generated-assets/xiuxian-pack-v1/sprites/icons-sprite.svg`
- Create: `generated-assets/xiuxian-pack-v1/sprites/sprite-map.json`
- Create: `generated-assets/xiuxian-pack-v1/README.md`

- [ ] **Step 1: Implement `writeManifest()`**

Manifest format:

```json
{
  "packId": "xiuxian-pack-v1",
  "style": "ink-wash-flat-mobile",
  "assetCount": 99,
  "generatedAt": "2026-06-06",
  "assets": []
}
```

Each asset entry must include:

```json
{
  "id": "life-span-pill",
  "name": "寿元丹",
  "category": "items",
  "format": "svg",
  "width": 128,
  "height": 128,
  "path": "icons/items/life-span-pill.svg",
  "usage": "珍稀丹药图标，中后期补寿元。"
}
```

Background entries use `width: 1200` and `height: 520`.

- [ ] **Step 2: Implement `writeSprite()`**

Create `sprites/icons-sprite.svg` with:

- Hidden root SVG.
- One `<symbol id="icon-<asset.id>" viewBox="0 0 128 128">` per icon asset.
- No background assets in the sprite.

Create `sprites/sprite-map.json` as an array of icon metadata:

```json
{
  "id": "icon-life-span-pill",
  "assetId": "life-span-pill",
  "name": "寿元丹",
  "category": "items",
  "path": "icons/items/life-span-pill.svg",
  "symbol": "#icon-life-span-pill",
  "usage": "珍稀丹药图标，中后期补寿元。"
}
```

- [ ] **Step 3: Implement `writeReadme()`**

README must include:

- Asset count summary.
- Directory map.
- Style palette.
- How to preview an individual SVG in a browser.
- How to use `icons-sprite.svg` later.
- Explicit note: this pack does not modify game code.

- [ ] **Step 4: Regenerate package**

Run:

```bash
node generated-assets/xiuxian-pack-v1/tools/build-assets.mjs
```

Expected: manifest, sprite, sprite map, and README exist.

- [ ] **Step 5: Verify metadata counts**

Run:

```bash
node -e "const fs=require('fs'); const m=JSON.parse(fs.readFileSync('generated-assets/xiuxian-pack-v1/manifest.json','utf8')); if(m.assetCount!==99||m.assets.length!==99) throw new Error('bad manifest count'); const s=JSON.parse(fs.readFileSync('generated-assets/xiuxian-pack-v1/sprites/sprite-map.json','utf8')); if(s.length!==95) throw new Error('bad sprite count'); console.log('metadata ok')"
```

Expected:

```text
metadata ok
```

## Task 5: Validate SVGs And Pack Integrity

**Files:**
- Read/verify: `generated-assets/xiuxian-pack-v1/**`
- Do not modify game code.

- [ ] **Step 1: Validate XML syntax**

Run:

```bash
find generated-assets/xiuxian-pack-v1 -name '*.svg' -print0 | xargs -0 xmllint --noout
```

Expected: no output and exit code 0.

- [ ] **Step 2: Verify manifest paths exist**

Run:

```bash
node -e "const fs=require('fs'); const path=require('path'); const root='generated-assets/xiuxian-pack-v1'; const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8')); for (const a of m.assets) { if (!fs.existsSync(path.join(root,a.path))) throw new Error(a.path); } console.log('paths ok')"
```

Expected:

```text
paths ok
```

- [ ] **Step 3: Verify total SVG count**

Run:

```bash
find generated-assets/xiuxian-pack-v1 -name '*.svg' | wc -l
```

Expected: `100`, because the pack has 99 visual SVG assets plus `sprites/icons-sprite.svg`.

- [ ] **Step 4: Run existing app tests**

Run:

```bash
npm test
```

Expected: all existing tests pass. This is a guard that resource generation did not accidentally touch app behavior.

- [ ] **Step 5: Inspect git status**

Run:

```bash
git status --short
```

Expected: only `generated-assets/xiuxian-pack-v1/` is untracked or modified.

## Task 6: Review And Commit Resource Pack

**Files:**
- Add: `generated-assets/xiuxian-pack-v1/**`

- [ ] **Step 1: Spot-check representative files**

Open or inspect:

```bash
sed -n '1,80p' generated-assets/xiuxian-pack-v1/icons/items/life-span-pill.svg
sed -n '1,80p' generated-assets/xiuxian-pack-v1/icons/realms/heaven-trampling.svg
sed -n '1,80p' generated-assets/xiuxian-pack-v1/backgrounds/thunder-tribulation-sky.svg
```

Expected:

- Each file has a `<title>` and `<desc>`.
- No icon relies on Chinese text inside the drawing.
- `life-span-pill.svg` is visually distinct from generic pill icons by markup structure.

- [ ] **Step 2: Stage generated assets only**

Run:

```bash
git add generated-assets/xiuxian-pack-v1
```

Expected: only resource pack files are staged.

- [ ] **Step 3: Confirm staged scope**

Run:

```bash
git diff --cached --name-only
```

Expected: every path starts with `generated-assets/xiuxian-pack-v1/`.

- [ ] **Step 4: Commit**

Run:

```bash
git commit -m "assets: add xiuxian visual resource pack"
```

Expected: commit succeeds.

- [ ] **Step 5: Final status**

Run:

```bash
git status --short
```

Expected: no output.

## Execution Notes

- Use `generated-assets/xiuxian-pack-v1/tools/build-assets.mjs` to generate the pack in one repeatable pass.
- Keep generated resources reviewable as plain SVG files.
- Do not integrate these assets into the game UI in this implementation plan. Integration should be a separate plan after visual review.
- If `xmllint` is unavailable, use this fallback for XML parse sanity:

```bash
ruby -r rexml/document -e "Dir['generated-assets/xiuxian-pack-v1/**/*.svg'].each { |f| REXML::Document.new(File.read(f)); puts f }"
```
