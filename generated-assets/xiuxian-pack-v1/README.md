# Xiuxian Visual Asset Pack V1

Standalone generated assets for the xiuxian idle web game.

## Summary

- Style: ink-wash flat illustration with light mobile-game polish.
- Visual assets: 99.
- Icon assets: 95.
- Background assets: 4.
- Source of truth: individual SVG files.
- Code impact: this pack does not modify game code.

## Categories

- actions: 9
- resources: 19
- items: 18
- realms: 19
- npc-badges: 18
- status-effects: 12
- backgrounds: 4

## Directory Map

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
  tools/
    build-assets.mjs
```

## Palette

- Ink: #17241f
- Paper: #fffefa
- Jade: #2f735f
- Pine: #264f46
- Amber: #b9872c
- Cinnabar: #9a3f3f
- Indigo: #4f587a
- Mist: #eaf2ee

## Preview

Open any SVG file directly in a browser, for example:

```text
generated-assets/xiuxian-pack-v1/icons/items/life-span-pill.svg
```

## Sprite Usage Later

`sprites/icons-sprite.svg` contains one symbol per icon. A future UI integration can inline the sprite and reference:

```html
<svg aria-hidden="true">
  <use href="#icon-life-span-pill"></use>
</svg>
```

`sprites/sprite-map.json` maps each symbol id to its category, source file, Chinese name, and suggested usage.

## Regeneration

Run:

```bash
node generated-assets/xiuxian-pack-v1/tools/build-assets.mjs
```
