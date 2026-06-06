import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createInitialState,
  defaultEncounters,
  defaultRealms,
  refinePill,
  resolveEncounter,
  tick,
  tryBreakthrough,
} from '../src/game.js';

test('content has playable realms and encounters', () => {
  assert.ok(defaultRealms.length >= 6);
  assert.ok(defaultEncounters.length >= 4);
  assert.ok(defaultEncounters.every((event) => event.choices.length >= 2));
});

test('tick increases spiritual energy and caps offline progress', () => {
  const state = createInitialState(0);

  const tenSeconds = tick(state, 10_000);
  assert.equal(tenSeconds.spiritualEnergy, 10);

  const twentyHours = tick(state, 20 * 60 * 60 * 1000);
  assert.equal(twentyHours.spiritualEnergy, 28_800);
});

test('refinePill increases pills and sets cooldown', () => {
  const state = createInitialState(0);

  const result = refinePill(state, 1_000);

  assert.equal(result.ok, true);
  assert.equal(result.state.pills, 1);
  assert.ok(result.state.pillCooldownUntil > 1_000);
});

test('breakthrough is blocked before enough energy', () => {
  const result = tryBreakthrough(createInitialState(0), 1_000, 0);

  assert.equal(result.ok, false);
  assert.equal(result.state.realmIndex, 0);
});

test('successful breakthrough advances realm', () => {
  const state = {
    ...createInitialState(0),
    spiritualEnergy: defaultRealms[0].energyRequired,
  };

  const result = tryBreakthrough(state, 1_000, 0.01);

  assert.equal(result.ok, true);
  assert.equal(result.state.realmIndex, 1);
  assert.equal(result.state.spiritualEnergy, 0);
});

test('failed breakthrough never lowers realm', () => {
  const state = {
    ...createInitialState(0),
    realmIndex: 1,
    spiritualEnergy: defaultRealms[1].energyRequired,
    pills: 1,
  };

  const result = tryBreakthrough(state, 1_000, 0.99);

  assert.equal(result.ok, false);
  assert.equal(result.state.realmIndex, 1);
  assert.equal(result.state.pills, 0);
  assert.equal(Math.round(result.state.spiritualEnergy), 125);
});

test('resolveEncounter applies effects and clears pending encounter', () => {
  const state = {
    ...createInitialState(0),
    pendingEncounterId: 'mountain-spring',
  };

  const result = resolveEncounter(state, 'drink', 1_000);

  assert.equal(result.ok, true);
  assert.equal(result.state.spiritualEnergy, 45);
  assert.equal(result.state.pendingEncounterId, null);
});
