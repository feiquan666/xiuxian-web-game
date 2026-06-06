import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('index uses the module app entry for GitHub Pages', () => {
  const html = readFileSync('index.html', 'utf8');

  assert.match(html, /<script type="module" src="\.\/src\/app\.js\?v=[^"]+"><\/script>/);
  assert.equal(html.includes('game-browser.js'), false);
});

test('mobile shell exposes all expected tabs and action controls', () => {
  const html = readFileSync('index.html', 'utf8');
  const requiredTabs = ['practice', 'encounter', 'bag', 'npc', 'more'];
  const requiredButtons = [
    'topMenuButton',
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
    'fullStatusDashboard',
    'compactStatusHeader',
    'progressStatus',
    'toastMessage',
    'itemGrid',
    'bagFilterBar',
    'resourceCodex',
    'helpContent',
    'characterAvatar',
    'attributeRadar',
    'morePanel',
  ];

  for (const tab of requiredTabs) {
    assert.match(html, new RegExp(`data-tab="${tab}"`));
    assert.match(html, new RegExp(`id="${tab}Panel"`));
  }
  assert.doesNotMatch(html, /data-tab="help"/);
  assert.doesNotMatch(html, /data-tab="realm"/);
  for (const id of requiredButtons) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const id of requiredPanels) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, />储物<\/button>/);
  assert.match(html, /id="topMenuButton"[^>]*>菜单<\/button>/);
  assert.doesNotMatch(html, />\.\.\.<\/button>/);
});

test('app script imports game engine and wires tabbed gameplay actions', () => {
  const app = readFileSync('src/app.js', 'utf8');
  const css = readFileSync('styles.css', 'utf8');

  assert.match(app, /import\s+\{/);
  assert.match(app, /performAction/);
  assert.match(app, /tryBreakthrough/);
  assert.match(app, /data-tab/);
  assert.match(app, /bag-category-title/);
  assert.match(app, /formatChineseNumber/);
  assert.match(app, /mergeLogEntries/);
  assert.match(app, /已满足突破条件/);
  assert.match(app, /flow-arrow/);
  assert.match(app, /return 'avatar-core'/);
  assert.match(css, /\.avatar-core\s+\.avatar-halo/);
  assert.match(css, /calc\(88px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /\.compact-status-header/);
  assert.match(css, /body\[data-active-tab\]:not\(\[data-active-tab="practice"\]\)\s+\.compact-status-header/);
  assert.doesNotMatch(css, /body:not\(\[data-active-tab="practice"\]\)\s+\.compact-status-header/);
  assert.match(css, /\.resource-codex/);
});

test('GitHub Pages static site uses branch-deploy friendly relative assets', () => {
  const html = readFileSync('index.html', 'utf8');

  assert.equal(existsSync('.nojekyll'), true);
  assert.match(html, /href="\.\/styles\.css\?v=[^"]+"/);
  assert.match(html, /src="\.\/src\/app\.js\?v=[^"]+"/);
  assert.match(html, /href="\.\/manifest\.webmanifest"/);
});
