# Xiuxian Asset Pack Design

## Overview

Create a standalone visual asset pack for the current xiuxian idle web game. The pack should support the existing mobile game UI, inventory, realm progression, encounters, NPC bonds, and breakthrough feedback without modifying application code during asset generation.

The first asset pass is a deluxe modular SVG pack with a light ink-wash Chinese fantasy style and subtle mobile-game readability. Assets are generated into the workspace outside the code folders so they can be reviewed, selected, and integrated later.

## Confirmed Direction

- Asset strategy: modular SVG deluxe pack.
- Visual style: ink-wash flat illustration with light mobile-game polish.
- Main format: individual SVG files on transparent `128x128` artboards for icons.
- Secondary format: SVG backgrounds, with optional PNG exports only if a background benefits from bitmap texture.
- NPC handling: abstract bond and encounter badges, not concrete character portraits.
- Output directory: `generated-assets/xiuxian-pack-v1/`.
- Code constraint: do not place generated resources in `src/` and do not modify code while generating the pack.

## Output Structure

```text
generated-assets/xiuxian-pack-v1/
  manifest.json
  README.md
  icons/
    actions/
    resources/
    items/
    realms/
    npc-badges/
    status-effects/
  backgrounds/
  sprites/
    icons-sprite.svg
    sprite-map.json
```

The individual SVG files remain the source of truth. The sprite file is a convenience artifact for later web integration.

## Asset Counts

- Action icons: 9.
- Resource and attribute icons: 19.
- Inventory item icons: 18.
- Realm icons or avatar emblems: 19.
- Encounter and NPC abstract badges: 18.
- Status and effect symbols: 12.
- Backgrounds: 4.

Target total: 99 visual assets plus `icons-sprite.svg`, `sprite-map.json`, `manifest.json`, and `README.md`.

## Action Icons

Create one icon for each existing action:

- Cultivate: `cultivate.svg`.
- Seclusion: `seclusion.svg`.
- Travel: `travel.svg`.
- Explore secret realm: `explore-secret-realm.svg`.
- Breakthrough: `breakthrough.svg`.
- Refine pill: `refine-pill.svg`.
- Heal: `heal.svg`.
- Suppress heart demon: `suppress-heart-demon.svg`.
- Buy pill: `buy-pill.svg`.

These should read clearly at small button size. Use simple silhouettes, strong central shapes, and limited detail.

## Resource And Attribute Icons

Create icons for the resources and attributes currently represented by game state:

- Cultivation.
- Spirit stones.
- Life span.
- Combat power.
- Luck.
- Comprehension.
- Aptitude.
- Dao heart.
- Heart demon.
- Injury.
- Reputation.
- Insight.
- Law.
- Origin.
- Tribulation resistance.
- Alchemy.
- Artifact.
- Technique.
- Sect contribution.

These icons should be reusable in resource cards, codex chips, help pages, and future tooltips.

## Inventory Item Icons

Create icons for the existing items plus one new requested rare pill:

Pills:

- Qi pill.
- Healing pill.
- Cleansing pill.
- Breakthrough pill.
- Life span pill.

Artifacts:

- Array flag.
- Thunder talisman.
- Jade guard.
- Ancient fragment.

Materials:

- Spirit herb.
- Spirit ore.
- Law shard.
- Origin shard.
- Incense.

Special:

- Heaven-defying shadow.
- Cave token.
- Soul lamp.
- Remnant scroll.

The life span pill is a rare pill. Its visual direction is a blue-green and gold pill, a life-wheel pattern, and a thin golden life-force trail. It should feel more precious than healing or cleansing pills but less strange than a forbidden fate-changing object.

## Realm Icons

Create one realm-stage icon or avatar emblem for each major realm:

- Ningqi.
- Foundation building.
- Core formation.
- Nascent soul.
- Spirit transformation.
- Infant transformation.
- Ask Ding.
- Yin Xu.
- Yang Shi.
- Peek Nirvana.
- Clean Nirvana.
- Shatter Nirvana.
- Five declines.
- Empty Nirvana.
- Empty Spirit.
- Empty Mystic.
- Empty Calamity.
- Half-step Heaven Trampling.
- Heaven Trampling.

The realm icons should align with the existing visual phases in the UI:

- Early realms: cave, robe, weak spiritual glow.
- Core and nascent soul: golden core, nascent shadow, protective light.
- Spirit and Ask Ding: red-dust mindscape, star-field, heaven-gate shape.
- Nirvana and empty realms: law lines, origin wheel, void fissure.
- Five declines: decline aura, cracked life-wheel, danger tone.
- Heaven bridge and finale: nine bridges, reincarnation pressure, skyward step.

## Encounter And NPC Badges

Create abstract badges for important encounter themes:

- Root test.
- Cave contest.
- Core thunder tribulation.
- Nascent soul out-of-body.
- Red-dust heart refinement.
- Primordial spirit transformation.
- Ask Ding heaven gate.
- Void-real transition.
- Origin threshold.
- First glimpse of law.
- Domain purification.
- Origin seed.
- Five declines.
- Mystic tribulation.
- Heaven bridge.
- Senior discourse.
- Pill cultivator gift.
- Causal chess game.

Do not depict recognizable portraits or direct adaptations of existing literary characters. Use symbolic forms such as a rain-side figure silhouette, pill fragrance, illusion veil, sword intent mark, chess grid, or doctrine seal.

## Status And Effect Symbols

Create small effect symbols for feedback states:

- Breakthrough success.
- Special breakthrough.
- Breakthrough failure.
- Severe backlash.
- Heavenly tribulation.
- Heart demon.
- Injury.
- Healing.
- Cleansing mind.
- Tribulation resistance.
- Law resonance.
- Origin awakening.

These should work as badges, toast icons, log embellishments, or future animation frames.

## Backgrounds

Create four wider atmosphere assets:

- Cave cultivation background.
- Secret realm exploration background.
- Thunder tribulation sky background.
- Heaven-trampling nine-bridge background.

The current game already uses `assets/ink-mountain.svg`. The new backgrounds should complement that asset rather than replace the whole visual language. Backgrounds may use larger SVG viewboxes, such as `1200x520`, and optional PNG exports may be produced if texture quality requires it.

## Sprite And Metadata

Create `sprites/icons-sprite.svg` containing symbol definitions for the icon assets. The sprite should be generated from or match the individual SVGs.

Create `sprites/sprite-map.json` with:

- `id`.
- Chinese display name.
- English slug.
- Category.
- Source path.
- Suggested game usage.

Create root `manifest.json` with equivalent metadata for all assets, including dimensions and format.

Create `README.md` explaining:

- Asset categories.
- Naming rules.
- Style rules.
- How to preview or integrate individual files.
- How to use the sprite in future code changes.

## Quality Bar

- SVGs should be valid XML and render without external dependencies.
- Icons should remain readable at 32px and polished at 64px.
- Use transparent backgrounds for icon files.
- Avoid dense text inside icons.
- Keep palettes aligned with the current UI: jade, pine, amber, cinnabar, indigo, mist, and paper.
- Keep the style varied enough that pills, artifacts, materials, realms, and effects are distinguishable.
- Do not use copyrighted character likenesses or direct scene recreations from existing novels.
- Do not place generated files in `src/` or overwrite existing `assets/ink-mountain.svg`.

## Acceptance Criteria

- The output directory exists at `generated-assets/xiuxian-pack-v1/`.
- The pack includes the confirmed 99 visual assets.
- Every icon has an individual SVG file in the expected category folder.
- Background files are present under `backgrounds/`.
- `manifest.json`, `README.md`, `sprites/icons-sprite.svg`, and `sprites/sprite-map.json` are present.
- The manifest references all generated assets with stable ids and paths.
- Files are ready for review without requiring code changes.
