import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

  assert.match(app, /import\s+\{/);
  assert.match(app, /performAction/);
  assert.match(app, /tryBreakthrough/);
  assert.match(app, /data-tab/);
});

test('GitHub Pages workflow deploys the static site through Actions', () => {
  const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');

  assert.match(workflow, /actions\/configure-pages/);
  assert.match(workflow, /actions\/upload-pages-artifact/);
  assert.match(workflow, /actions\/deploy-pages/);
  assert.match(workflow, /github-pages/);
});
