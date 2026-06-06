import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('index uses classic scripts so it can run from file protocol', () => {
  const html = readFileSync('index.html', 'utf8');

  assert.equal(html.includes('type="module"'), false);
  assert.match(html, /<script src="\.\/src\/game-browser\.js"><\/script>/);
  assert.match(html, /<script src="\.\/src\/app\.js"><\/script>/);
});

test('browser app script has no module imports', () => {
  const app = readFileSync('src/app.js', 'utf8');

  assert.equal(app.includes('import '), false);
  assert.equal(app.includes('export '), false);
});
