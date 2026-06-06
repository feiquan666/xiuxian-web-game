# Xiuxian Idle Web Game Design

## Overview

Build a single-player web-based xiuxian idle game with a light ink-wash Chinese fantasy style. The first playable version focuses on a calm cultivation loop: gain spiritual energy over time, refine pills, attempt breakthroughs, handle occasional text encounters, and keep progress through local autosave.

The game is intentionally single-page and offline-first. There is no backend, account system, leaderboard, combat system, sect management, or multiplayer in the first version.

## Product Goals

- Give the player a satisfying "cultivate, prepare, break through" loop within the first minute.
- Make the game feel like xiuxian through realm names, breakthrough tension, pills, encounters, and atmospheric presentation.
- Keep content data-driven so realms, encounters, and pill effects can be expanded without rewriting core game logic.
- Persist progress automatically in the browser.

## Core Loop

1. The player starts at `炼气一层`.
2. Spiritual energy increases automatically over time.
3. The player can refine pills through a lightweight action with a short cooldown.
4. Pills improve breakthrough odds or provide small temporary cultivation benefits.
5. When spiritual energy reaches the current realm requirement, the player can attempt a breakthrough.
6. A successful breakthrough advances the realm, improves spiritual energy gain, and increases later requirements.
7. A failed breakthrough applies a light penalty: partial spiritual energy and/or pill loss, with no realm loss.
8. Occasional encounters appear and offer 2-3 text choices with rewards, costs, or temporary effects.
9. The game autosaves and restores progress after refresh.

## First Version Scope

Included:

- Single-page web game.
- Ink-wash inspired visual style with a cultivation panel, resource display, breakthrough area, encounter modal, and activity log.
- Spiritual energy resource.
- Pill resource.
- Realm progression.
- Pill refinement.
- Breakthrough success and failure.
- Low-frequency random encounters.
- Local autosave using `localStorage`.
- Data tables for realms, encounters, and pills/effects.

Excluded:

- Backend services.
- Accounts or cloud saves.
- Leaderboards.
- Sect management.
- Disciples.
- Combat.
- Map exploration.
- Complex inventory.
- Monetization.

## Player Interface

The first screen is the game itself, not a landing page.

Primary regions:

- Header/status area: current realm, spiritual energy, pills, spiritual energy gain rate, autosave state.
- Main cultivation area: spiritual energy progress, meditate/cultivate state, refine pill action, breakthrough action.
- Encounter modal or side panel: current pending encounter, choices, and results.
- Activity log: recent cultivation events, pill results, breakthroughs, encounter outcomes, and save/load messages.

Visual tone:

- Ink-wash Chinese fantasy atmosphere.
- Quiet, readable panel layout.
- Subtle motion for energy gain and breakthrough feedback.
- No dense onboarding text in the interface.

## Data Model

The game should be driven by configuration objects.

`realms`:

- `id`
- `name`
- `energyRequired`
- `baseGainRate`
- `breakthroughChance`
- `failurePenalty`

`encounters`:

- `id`
- `title`
- `description`
- `weight`
- `minRealm`
- `choices`

Each encounter choice includes:

- `label`
- `resultText`
- `effects`

`pills`:

- `id`
- `name`
- `description`
- `effect`

`gameState`:

- `realmId`
- `spiritualEnergy`
- `pills`
- `activeBuffs`
- `pendingEncounterId`
- `log`
- `saveVersion`
- `lastSavedAt`
- `lastTickAt`

## System Design

Suggested modules:

- Game engine: applies time ticks, resource gain, buffs, breakthrough results, and encounter rolls.
- Content data: realm, encounter, and item configuration.
- Persistence: serializes and restores `gameState` from `localStorage`.
- UI rendering: displays state and dispatches player actions.
- Log service: keeps recent readable game events capped to a manageable length.

The implementation can be framework-light, but the code should preserve clear boundaries between content data, state transitions, persistence, and rendering.

## Rules And Balance Defaults

- Breakthrough failure never drops the player to a lower realm.
- Failure consumes a partial amount of spiritual energy and may consume one pill if used.
- Pill refinement has a short cooldown and grants pills directly in the first version.
- Encounters are low-frequency and should not interrupt constantly.
- At most one pending encounter exists at a time.
- Offline progress may be calculated from the saved `lastTickAt`, with a reasonable cap to avoid runaway resource gains.
- Logs are capped so saves stay small and the UI remains readable.

## Error Handling

- If saved data is missing, start a new game.
- If saved data is malformed or from an unsupported version, fall back to a new game and log a recovery message.
- If content references are missing, ignore the invalid encounter or realm transition and keep the current state stable.
- Player actions that cannot be performed should be disabled in the UI and guarded in game logic.

## Testing Strategy

Cover the core rules with focused tests:

- Spiritual energy increases over time.
- Realm requirements gate breakthrough attempts.
- Breakthrough success advances the realm and updates gain rate.
- Breakthrough failure applies only light penalties and never lowers realm.
- Pill refinement changes pill count correctly.
- Encounter choices apply configured effects.
- Autosave and restore preserve core state.
- Malformed saves recover without crashing.

For UI verification, run the app locally and check desktop/mobile layouts for readable panels, non-overlapping text, functional buttons, encounter display, and persistence after refresh.

## Acceptance Criteria

- A player can open the webpage and immediately play.
- Spiritual energy increases automatically.
- The player can refine pills.
- The player can attempt breakthroughs when requirements are met.
- Breakthroughs can succeed or fail with the agreed light failure penalty.
- Random encounters can appear and resolve through choices.
- The browser refresh restores progress.
- Realm, encounter, and pill content live in configuration data rather than being hardcoded inside UI event handlers.
