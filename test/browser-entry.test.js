import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('index uses the module app entry for GitHub Pages', () => {
  const html = readFileSync('index.html', 'utf8');

  assert.match(html, /<script type="module" src="\.\/src\/app\.js"><\/script>/);
  assert.equal(html.includes('game-browser.js'), false);
});

test('mobile shell exposes all expected tabs and action controls', () => {
  const html = readFileSync('index.html', 'utf8');
  const requiredTabs = ['practice', 'encounter', 'bag', 'npc', 'realm', 'help'];
  const requiredButtons = [
    'immersiveButton',
    'cultivateButton',
    'seclusionButton',
    'travelButton',
    'exploreButton',
    'breakthroughButton',
    'healButton',
    'suppressButton',
    'buyPillButton',
  ];
  const requiredPanels = [
    'itemGrid',
    'resourceCodex',
    'helpContent',
    'characterAvatar',
    'attributeRadar',
  ];

  for (const tab of requiredTabs) {
    assert.match(html, new RegExp(`data-tab="${tab}"`));
    assert.match(html, new RegExp(`id="${tab}Panel"`));
  }
  for (const id of requiredButtons) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const id of requiredPanels) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('app script imports game engine and wires tabbed gameplay actions', () => {
  const app = readFileSync('src/app.js', 'utf8');
  const css = readFileSync('styles.css', 'utf8');

  assert.match(app, /import\s+\{/);
  assert.match(app, /performAction/);
  assert.match(app, /tryBreakthrough/);
  assert.match(app, /data-tab/);
  assert.match(app, /bag-category-title/);
  assert.match(app, /flow-arrow/);
  assert.match(app, /return 'avatar-core'/);
  assert.match(css, /\.avatar-core\s+\.avatar-halo/);
  assert.match(css, /\.resource-codex/);
});

test('GitHub Pages static site uses branch-deploy friendly relative assets', () => {
  const html = readFileSync('index.html', 'utf8');

  assert.equal(existsSync('.nojekyll'), true);
  assert.match(html, /href="\.\/styles\.css"/);
  assert.match(html, /src="\.\/src\/app\.js"/);
  assert.match(html, /href="\.\/manifest\.webmanifest"/);
});

test('generated asset pack is wired into the static UI shell', () => {
  const html = readFileSync('index.html', 'utf8');
  const app = readFileSync('src/app.js', 'utf8');
  const css = readFileSync('styles.css', 'utf8');
  const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));

  assert.equal(existsSync('generated-assets/xiuxian-pack-v1/manifest.json'), true);
  assert.match(html, /generated-assets\/xiuxian-pack-v1\/sprites\/icons-sprite\.svg/);
  assert.match(html, /id="encounterBadge"/);
  assert.match(app, /ASSET_BASE/);
  assert.match(app, /life_span_pill/);
  assert.match(app, /encounterBadgePath/);
  assert.match(app, /realmIconPath/);
  assert.match(css, /generated-assets\/xiuxian-pack-v1\/icons\/actions\/cultivate\.svg/);
  assert.match(css, /generated-assets\/xiuxian-pack-v1\/backgrounds\/cave-cultivation\.svg/);
  assert.ok(manifest.icons.length >= 2);
  assert.ok(manifest.icons.every((icon) => icon.src.includes('generated-assets/xiuxian-pack-v1')));
});
