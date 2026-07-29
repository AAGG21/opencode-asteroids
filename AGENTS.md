# AGENTS.md

## Project

Vanilla JS Asteroids clone — single file `game.js` (542 lines), no dependencies, no build system.

## Run

```bash
npx serve .
```

Or open `index.html` directly in a browser.

## Structure

- `index.html` — canvas setup (800×600), loads `game.js`
- `game.js` — all game logic: input, entities, physics, rendering, game loop
- No modules, no imports, no bundler

## Conventions

- Strict mode (`'use strict'` at top)
- ES6 classes: `Ship`, `Asteroid`, `Bullet`, `Particle`, `PowerUp`
- Constants at top of file: `RADII`, `SPEEDS`, `POINTS` arrays indexed by asteroid size (1=small, 2=medium, 3=large)
- Game state: `state` variable holds `'playing' | 'dead' | 'gameover'`
- All coordinates wrap via `wrap()` helper (toroidal space)
- Canvas context `ctx` is module-level, not passed around

## Gotchas

- No tests, no lint, no typecheck — verify changes manually in browser
- `justPressed` object tracks single-frame key presses (consumed by `pressed()`)
- Ship invincibility lasts 3 seconds after respawn (blinks at 8Hz)
- Asteroid split: size 3→2×size 2, size 2→2×size 1, size 1→destroyed
- Safe spawn distance from center: 130px

## Power-ups (Speed Boost)

- **Spawn**: 15% chance from medium/large asteroids + random every 12s (max 2 on screen)
- **Effect**: THRUST x2 for 5 seconds (260→520 px/s²)
- **Visual**: Cyan diamond with lightning bolt, propulsor turns cyan, HUD shows "SPEED Xs"
- **Pickup**: Ship collision with PowerUp radius (10px)
- **Timer**: `ship.speedTimer` counts down in `update()`, resets on death
