# AGENTS.md

## Project

Vanilla JS Asteroids clone — single file `game.js`, no dependencies, no build system.

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
- ES6 classes: `Ship`, `Asteroid`, `Bullet`, `Particle`, `PowerUp`, `ShootingStar`
- Constants at top of file: `RADII`, `SPEEDS`, `POINTS` arrays indexed by asteroid size (1=small, 2=medium, 3=large)
- Game state: `state` variable holds `'menu' | 'playing' | 'dead' | 'gameover'`
- All coordinates wrap via `wrap()` helper (toroidal space)
- Canvas context `ctx` is module-level, not passed around

## Gotchas

- No tests, no lint, no typecheck — verify changes manually in browser
- `justPressed` object tracks single-frame key presses (consumed by `pressed()`)
- Ship invincibility lasts 3 seconds after respawn (blinks at 8Hz)
- Asteroid split: size 3→2×size 2, size 2→2×size 1, size 1→destroyed
- Safe spawn distance from center: 130px
- Game starts at skin selection menu, not directly in gameplay

## Skins (6 naves)

- **Selection**: Menu al inicio con flechas ↑↓, ESPACIO para jugar
- **Persistencia**: `localStorage('asteroids-skin')` guarda selección
- **Stats variados**: Cada skin tiene radius, thrust, rotSpeed, bulletSpeed, extraLife diferentes
- **Visual**: Cada skin tiene su propio color, forma de nave, llama e ícono de vida
- **HUD**: Muestra `SKIN: nombre` abajo a la derecha

| Skin | Radius | Thrust | RotSpeed | BulletSpeed | ExtraLife | Color |
|------|--------|--------|----------|-------------|-----------|-------|
| CLASSIC | 12 | 260 | 3.5 | 520 | 0 | #fff |
| ARROW | 9 | 240 | 4.2 | 520 | 0 | #00ff88 |
| DIAMOND | 10 | 220 | 3.2 | 600 | 0 | #ff44ff |
| V-WING | 14 | 300 | 3.5 | 520 | 0 | #ff8800 |
| PHOENIX | 12 | 250 | 3.3 | 480 | 1 | #ffaa00 |
| STEALTH | 13 | 280 | 3.8 | 550 | 0 | #4488ff |

## Power-ups

Spawn: 25% de asteroides medianos/grandes + cada 5s aleatorio (máx 2 en pantalla).
Tipos seleccionados aleatoriamente entre speed, triple, shield.

### Speed Boost

- **Efecto**: THRUST x2 por 5 segundos
- **Visual**: Diamante cyan con rayo, propulsor cyan
- **Timer**: `ship.speedTimer`

### Triple Shot

- **Efecto**: Dispara 3 balas en cono por 5 segundos
- **Visual**: Diamante rosa con icono de 3 líneas, balas rosas
- **Timer**: `ship.tripleTimer`
- **Spread**: 0.12 radianes entre balas

### Shield (Escudo)

- **Efecto**: Absorbe 1 hit de asteroide o estrella fugaz, dura 8 segundos
- **Cada hit**: Reduce timer en 1 segundo
- **Visual**: Círculo verde pulsante alrededor de la nave
- **Timer**: `ship.shieldTimer`

## Shooting Star (Estrella Fugaz)

- **Spawn**: Cada 20s desde borde aleatorio (máx 1 en pantalla)
- **Velocidad**: 250-300 px/s (3-5x más rápido que asteroides)
- **TTL**: 6 segundos, se desvanece en últimos 1.5s
- **Puntos**: 250 al ser destruida
- **Visual**: Núcleo amarillo/blanco con cola brillante
- **HUD**: Muestra "* SHOOTING STAR *" cuando está activa
- **Colisión**: Mata a la nave al contactar
- **Escudo**: Absorbe hit (reduce 1s de timer)

## HUD Order (power-ups activos)

Cuando hay múltiples power-ups activos, se muestran en este orden:
`Shield → Speed → Triple → Shooting Star`

## Game Over

- **Reiniciar**: ESPACIO
- **Volver al menú**: M

## Control del Menú

- **↑↓**: Seleccionar skin
- **ESPACIO**: Jugar con skin seleccionada
