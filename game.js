'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = 800;
const H = 600;

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = {};
const justPressed = {};

window.addEventListener('keydown', e => {
  justPressed[e.code] = !keys[e.code];
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code))
    e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function pressed(code) {
  const val = justPressed[code];
  justPressed[code] = false;
  return val;
}

// ── Utils ─────────────────────────────────────────────────────────────────────
const wrap  = (v, max) => ((v % max) + max) % max;
const dist  = (a, b)   => Math.hypot(a.x - b.x, a.y - b.y);
const rand  = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// ── Skins ─────────────────────────────────────────────────────────────────────
const SKINS = [
  {
    name: 'CLASSIC',
    radius: 12, thrust: 260, rotSpeed: 3.5, bulletSpeed: 520, extraLife: 0,
    color: '#fff',
    drawShip(ctx, ship) {
      ctx.beginPath();
      ctx.moveTo( 20,  0);
      ctx.lineTo(-12, -9);
      ctx.lineTo( -7,  0);
      ctx.lineTo(-12,  9);
      ctx.closePath();
      ctx.stroke();
    },
    drawFlame(ctx, ship, boosted) {
      ctx.beginPath();
      ctx.moveTo(-8, -4);
      ctx.lineTo(-8 - rand(6, 14), 0);
      ctx.lineTo(-8,  4);
      ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.85)' : 'rgba(255, 130, 0, 0.85)';
      ctx.stroke();
    },
    drawIcon(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo( 9,  0);
      ctx.lineTo(-6, -5);
      ctx.lineTo(-3,  0);
      ctx.lineTo(-6,  5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: 'ARROW',
    radius: 9, thrust: 240, rotSpeed: 4.2, bulletSpeed: 520, extraLife: 0,
    color: '#00ff88',
    drawShip(ctx, ship) {
      ctx.beginPath();
      ctx.moveTo( 22,  0);
      ctx.lineTo( -8, -7);
      ctx.lineTo( -4,  0);
      ctx.lineTo( -8,  7);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo( 10,  0);
      ctx.lineTo( -2, -5);
      ctx.lineTo( -2,  5);
      ctx.closePath();
      ctx.stroke();
    },
    drawFlame(ctx, ship, boosted) {
      ctx.beginPath();
      ctx.moveTo(-5, -3);
      ctx.lineTo(-5 - rand(5, 12), 0);
      ctx.lineTo(-5,  3);
      ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.85)' : 'rgba(0, 255, 136, 0.85)';
      ctx.stroke();
    },
    drawIcon(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo( 9,  0);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-3,  0);
      ctx.lineTo(-6,  4);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: 'DIAMOND',
    radius: 10, thrust: 220, rotSpeed: 3.2, bulletSpeed: 600, extraLife: 0,
    color: '#ff44ff',
    drawShip(ctx, ship) {
      ctx.beginPath();
      ctx.moveTo( 20,  0);
      ctx.lineTo(  0, -11);
      ctx.lineTo(-14,  0);
      ctx.lineTo(  0,  11);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo( 12,  0);
      ctx.lineTo(  0, -6);
      ctx.lineTo( -6,  0);
      ctx.lineTo(  0,  6);
      ctx.closePath();
      ctx.stroke();
    },
    drawFlame(ctx, ship, boosted) {
      ctx.beginPath();
      ctx.moveTo(-10, -3);
      ctx.lineTo(-10 - rand(5, 11), 0);
      ctx.lineTo(-10,  3);
      ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.85)' : 'rgba(255, 68, 255, 0.85)';
      ctx.stroke();
    },
    drawIcon(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = '#ff44ff';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo( 8,  0);
      ctx.lineTo(  0, -5);
      ctx.lineTo(-6,  0);
      ctx.lineTo(  0,  5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: 'V-WING',
    radius: 14, thrust: 300, rotSpeed: 3.5, bulletSpeed: 520, extraLife: 0,
    color: '#ff8800',
    drawShip(ctx, ship) {
      ctx.beginPath();
      ctx.moveTo( 18,  0);
      ctx.lineTo( -4, -14);
      ctx.lineTo( -8, -6);
      ctx.lineTo(-10,  0);
      ctx.lineTo( -8,  6);
      ctx.lineTo( -4, 14);
      ctx.closePath();
      ctx.stroke();
    },
    drawFlame(ctx, ship, boosted) {
      ctx.beginPath();
      ctx.moveTo(-10, -5);
      ctx.lineTo(-10 - rand(8, 16), 0);
      ctx.lineTo(-10,  5);
      ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.85)' : 'rgba(255, 136, 0, 0.85)';
      ctx.stroke();
    },
    drawIcon(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo( 8,  0);
      ctx.lineTo(-2, -7);
      ctx.lineTo(-5,  0);
      ctx.lineTo(-2,  7);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: 'PHOENIX',
    radius: 12, thrust: 250, rotSpeed: 3.3, bulletSpeed: 480, extraLife: 1,
    color: '#ffaa00',
    drawShip(ctx, ship) {
      ctx.beginPath();
      ctx.moveTo( 22,  0);
      ctx.bezierCurveTo( 12, -12,  -2, -14, -14, -6);
      ctx.lineTo( -8,  0);
      ctx.lineTo(-14,  6);
      ctx.bezierCurveTo( -2, 14, 12, 12, 22, 0);
      ctx.closePath();
      ctx.stroke();
    },
    drawFlame(ctx, ship, boosted) {
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.quadraticCurveTo(-14 - rand(4, 10), 0, -10, 4);
      ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.85)' : 'rgba(255, 170, 0, 0.85)';
      ctx.stroke();
      if (Math.random() > 0.5) {
        ctx.beginPath();
        ctx.moveTo(-10, -2);
        ctx.quadraticCurveTo(-18 - rand(2, 6), 0, -10, 2);
        ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 200, 0, 0.4)';
        ctx.stroke();
      }
    },
    drawIcon(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo( 9,  0);
      ctx.bezierCurveTo( 5, -5, -1, -5, -5, -3);
      ctx.lineTo(-3,  0);
      ctx.lineTo(-5,  3);
      ctx.bezierCurveTo( -1, 5, 5, 5, 9, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: 'STEALTH',
    radius: 13, thrust: 280, rotSpeed: 3.8, bulletSpeed: 550, extraLife: 0,
    color: '#4488ff',
    drawShip(ctx, ship) {
      ctx.beginPath();
      ctx.moveTo( 20,  0);
      ctx.lineTo(  4, -12);
      ctx.lineTo( -6, -8);
      ctx.lineTo(-14,  0);
      ctx.lineTo( -6,  8);
      ctx.lineTo(  4, 12);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo( 14,  0);
      ctx.lineTo(  6, -5);
      ctx.lineTo(  6,  5);
      ctx.closePath();
      ctx.stroke();
    },
    drawFlame(ctx, ship, boosted) {
      ctx.beginPath();
      ctx.moveTo(-12, -3);
      ctx.lineTo(-12 - rand(6, 13), 0);
      ctx.lineTo(-12,  3);
      ctx.strokeStyle = boosted ? 'rgba(0, 229, 255, 0.85)' : 'rgba(68, 136, 255, 0.85)';
      ctx.stroke();
    },
    drawIcon(ctx, x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = '#4488ff';
      ctx.lineWidth = 1.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo( 8,  0);
      ctx.lineTo( 2, -5);
      ctx.lineTo(-5,  0);
      ctx.lineTo( 2,  5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }
];

// ── Bullet ────────────────────────────────────────────────────────────────────
class Bullet {
  constructor(x, y, angle, color = '#fff', speed = 520) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.ttl  = 1.1;
    this.radius = 2;
    this.dead = false;
  }

  update(dt) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Asteroid ──────────────────────────────────────────────────────────────────
const RADII  = [0, 16, 30, 50];
const SPEEDS = [0, 85, 55, 32];
const POINTS = [0, 100, 50, 20];

class Asteroid {
  constructor(x, y, size = 3) {
    this.x    = x;
    this.y    = y;
    this.size = size;
    this.radius = RADII[size];
    this.dead = false;

    const angle = rand(0, Math.PI * 2);
    const speed = SPEEDS[size] + rand(-15, 15);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.rotSpeed = rand(-1.2, 1.2);
    this.rot = rand(0, Math.PI * 2);

    const n = randInt(8, 13);
    this.verts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = this.radius * rand(0.6, 1.0);
      this.verts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }

  update(dt) {
    this.x   = wrap(this.x + this.vx * dt, W);
    this.y   = wrap(this.y + this.vy * dt, H);
    this.rot += this.rotSpeed * dt;
  }

  split() {
    if (this.size <= 1) return [];
    return [
      new Asteroid(this.x, this.y, this.size - 1),
      new Asteroid(this.x, this.y, this.size - 1),
    ];
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(this.verts[0][0], this.verts[0][1]);
    for (let i = 1; i < this.verts.length; i++)
      ctx.lineTo(this.verts[i][0], this.verts[i][1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

// ── Ship ──────────────────────────────────────────────────────────────────────
class Ship {
  constructor() { this.reset(); }

  reset() {
    this.x      = W / 2;
    this.y      = H / 2;
    this.angle  = -Math.PI / 2;
    this.vx     = 0;
    this.vy     = 0;
    this.radius = currentSkin.radius;
    this.thrusting     = false;
    this.invincible    = 3;
    this.shootCooldown = 0;
    this.dead          = false;
    this.speedTimer    = 0;
    this.tripleTimer   = 0;
    this.shieldTimer   = 0;
  }

  update(dt) {
    if (this.dead) return;
    if (this.invincible    > 0) this.invincible    -= dt;
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.speedTimer    > 0) this.speedTimer    -= dt;
    if (this.tripleTimer   > 0) this.tripleTimer   -= dt;
    if (this.shieldTimer   > 0) this.shieldTimer   -= dt;

    const ROT   = currentSkin.rotSpeed;
    const baseThrust = currentSkin.thrust;
    const THRUST = this.speedTimer > 0 ? baseThrust * 2 : baseThrust;
    const DRAG   = 0.987;

    if (keys['ArrowLeft'])  this.angle -= ROT * dt;
    if (keys['ArrowRight']) this.angle += ROT * dt;

    this.thrusting = !!keys['ArrowUp'];
    if (this.thrusting) {
      this.vx += Math.cos(this.angle) * THRUST * dt;
      this.vy += Math.sin(this.angle) * THRUST * dt;
    }

    this.vx *= DRAG;
    this.vy *= DRAG;
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
  }

  tryShoot() {
    if (this.shootCooldown > 0 || this.dead) return [];
    this.shootCooldown = 0.2;
    const NOSE = 21;
    const ox = this.x + Math.cos(this.angle) * NOSE;
    const oy = this.y + Math.sin(this.angle) * NOSE;
    if (this.tripleTimer > 0) {
      const SPREAD = 0.12;
      const c = POWERUP_COLORS.triple;
      return [
        new Bullet(ox, oy, this.angle - SPREAD, c, currentSkin.bulletSpeed),
        new Bullet(ox, oy, this.angle, c, currentSkin.bulletSpeed),
        new Bullet(ox, oy, this.angle + SPREAD, c, currentSkin.bulletSpeed),
      ];
    }
    return [new Bullet(ox, oy, this.angle, '#fff', currentSkin.bulletSpeed)];
  }

  draw() {
    if (this.dead) return;
    if (this.invincible > 0 && Math.floor(this.invincible * 8) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = currentSkin.color;
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';

    currentSkin.drawShip(ctx, this);

    if (this.thrusting && Math.random() > 0.35) {
      currentSkin.drawFlame(ctx, this, this.speedTimer > 0);
    }

    ctx.restore();

    // Escudo activo
    if (this.shieldTimer > 0) {
      const pulse = 0.6 + Math.sin(performance.now() * 0.008) * 0.15;
      const shieldR = this.radius * 2.2;
      ctx.save();
      ctx.globalAlpha = pulse * 0.35;
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(this.x, this.y, shieldR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = pulse * 0.8;
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, shieldR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
}

// ── Particulas ────────────────────────────────────────────────────────────────
class Particle {
  constructor(x, y) {
    this.x  = x;
    this.y  = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(30, 130);
    this.vx   = Math.cos(angle) * speed;
    this.vy   = Math.sin(angle) * speed;
    this.life = rand(0.4, 1.1);
    this.ttl  = this.life;
    this.dead = false;
  }

  update(dt) {
    this.x  += this.vx * dt;
    this.y  += this.vy * dt;
    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    const alpha = this.ttl / this.life;
    ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.05, this.y - this.vy * 0.05);
    ctx.stroke();
  }
}

// ── PowerUp ──────────────────────────────────────────────────────────────────
const POWERUP_TYPES = ['speed', 'triple', 'shield'];
const POWERUP_COLORS = { speed: '#00e5ff', triple: '#ff4081', shield: '#00ff88' };

class PowerUp {
  constructor(x, y, type = 'speed') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 14;
    this.dead = false;
    this.ttl = 10;
    this.rot = 0;
    this.spawnAnim = 1;

    const angle = rand(0, Math.PI * 2);
    const speed = 40;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(dt) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);
    this.rot += 2 * dt;
    this.ttl -= dt;
    if (this.spawnAnim > 0) this.spawnAnim -= dt * 2;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    const color = POWERUP_COLORS[this.type];
    const alpha = this.ttl < 2 ? (this.ttl / 2) * 0.8 + 0.2 : 1;
    const scale = this.spawnAnim > 0 ? 1 + this.spawnAnim * 2 : 1;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;

    // Halo
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2.5);
    glow.addColorStop(0, color + '66');
    glow.addColorStop(1, color + '00');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(this.rot);

    // Diamante exterior
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, 0);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();

    // Icono interior
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    if (this.type === 'speed') {
      ctx.beginPath();
      ctx.moveTo(-2, -5);
      ctx.lineTo(1, -1);
      ctx.lineTo(-1, 0);
      ctx.lineTo(2, 5);
      ctx.moveTo(1, -1);
      ctx.lineTo(-1, 0);
      ctx.stroke();
    } else if (this.type === 'triple') {
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(0, -2);
      ctx.moveTo(0, -2);
      ctx.lineTo(-4, -5);
      ctx.moveTo(0, -2);
      ctx.lineTo(0, -5);
      ctx.moveTo(0, -2);
      ctx.lineTo(4, -5);
      ctx.stroke();
    } else if (this.type === 'shield') {
      ctx.beginPath();
      ctx.arc(0, 0, 5, Math.PI * 0.8, Math.PI * 2.2);
      ctx.lineTo(0, 5);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ── ShootingStar ─────────────────────────────────────────────────────────────
class ShootingStar {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.dead = false;
    this.ttl = 6;
    this.maxTtl = 6;

    const speed = rand(250, 300);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.trail = [];
    this.trailTimer = 0;
    this.maxTrail = 10;
  }

  update(dt) {
    this.x = wrap(this.x + this.vx * dt, W);
    this.y = wrap(this.y + this.vy * dt, H);

    this.trailTimer += dt;
    if (this.trailTimer >= 0.04) {
      this.trailTimer = 0;
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) this.trail.shift();
    }

    this.ttl -= dt;
    if (this.ttl <= 0) this.dead = true;
  }

  draw() {
    const fadeAlpha = this.ttl < 1.5 ? this.ttl / 1.5 : 1;

    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const alpha = ((i + 1) / this.trail.length) * 0.5 * fadeAlpha;
      const size = (i / this.trail.length) * this.radius * 0.6;
      ctx.fillStyle = `rgba(255, 255, 150, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.globalAlpha = fadeAlpha;

    ctx.fillStyle = 'rgba(255, 255, 200, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffaa';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ── Estado del juego ──────────────────────────────────────────────────────────
let ship, bullets, asteroids, particles, powerUps, shootingStars;
let score, lives, level;
let state;
let deadTimer;
let shootingStarTimer = 0;
const SHOOTING_STAR_INTERVAL = 20;
let powerUpSpawnTimer = 0;
let powerUpNotification = 0;
const POWERUP_SPAWN_INTERVAL = 5;

// ── Skins: selección y persistencia ──────────────────────────────────────────
let selectedSkinIndex = parseInt(localStorage.getItem('asteroids-skin')) || 0;
if (selectedSkinIndex < 0 || selectedSkinIndex >= SKINS.length) selectedSkinIndex = 0;
let currentSkin = SKINS[selectedSkinIndex];
let menuBlinkTimer = 0;

function spawnAsteroids(count) {
  const SAFE_DIST = 130;
  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = rand(0, W);
      y = rand(0, H);
    } while (Math.hypot(x - W / 2, y - H / 2) < SAFE_DIST);
    asteroids.push(new Asteroid(x, y, 3));
  }
}

function initGame() {
  currentSkin = SKINS[selectedSkinIndex];
  ship          = new Ship();
  bullets   = [];
  asteroids = [];
  particles = [];
  powerUps  = [];
  shootingStars = [];
  shootingStarTimer = 0;
  powerUpSpawnTimer = 0;
  powerUpNotification = 0;
  score  = 0;
  lives  = 3 + currentSkin.extraLife;
  level  = 1;
  state  = 'playing';
  spawnAsteroids(4);
}

function nextLevel() {
  level++;
  bullets   = [];
  particles = [];
  powerUps  = [];
  shootingStars = [];
  shootingStarTimer = 0;
  powerUpSpawnTimer = 0;
  ship.reset();
  spawnAsteroids(3 + level);
}

function spawnPowerUp(x, y, type) {
  if (!type) type = POWERUP_TYPES[randInt(0, POWERUP_TYPES.length - 1)];
  powerUps.push(new PowerUp(x, y, type));
  powerUpNotification = 2;
}

function trySpawnPowerUpFromAsteroid(x, y, size) {
  if (size >= 2 && Math.random() < 0.25) {
    spawnPowerUp(x, y);
  }
}

function trySpawnRandomPowerUp(dt) {
  powerUpSpawnTimer += dt;
  if (powerUpSpawnTimer >= POWERUP_SPAWN_INTERVAL) {
    powerUpSpawnTimer = 0;
    if (powerUps.length < 2) {
      spawnPowerUp(rand(100, W - 100), rand(100, H - 100));
    }
  }
}

function trySpawnShootingStar(dt) {
  shootingStarTimer += dt;
  if (shootingStarTimer >= SHOOTING_STAR_INTERVAL && shootingStars.length < 1) {
    shootingStarTimer = 0;
    const side = randInt(0, 3);
    let x, y, angle;
    switch (side) {
      case 0: x = -20; y = rand(0, H); angle = rand(-0.4, 0.4); break;
      case 1: x = W + 20; y = rand(0, H); angle = Math.PI + rand(-0.4, 0.4); break;
      case 2: x = rand(0, W); y = -20; angle = Math.PI / 2 + rand(-0.4, 0.4); break;
      case 3: x = rand(0, W); y = H + 20; angle = -Math.PI / 2 + rand(-0.4, 0.4); break;
    }
    shootingStars.push(new ShootingStar(x, y, angle));
  }
}

function explode(x, y, count = 8) {
  for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
}

function killShip() {
  explode(ship.x, ship.y, 14);
  ship.dead = true;
  lives--;
  if (lives <= 0) {
    state = 'gameover';
  } else {
    state     = 'dead';
    deadTimer = 2;
  }
}

// ── Menú de selección de skins ────────────────────────────────────────────────
function updateMenu(dt) {
  menuBlinkTimer += dt;
  if (pressed('ArrowUp')) {
    selectedSkinIndex = (selectedSkinIndex - 1 + SKINS.length) % SKINS.length;
  }
  if (pressed('ArrowDown')) {
    selectedSkinIndex = (selectedSkinIndex + 1) % SKINS.length;
  }
  if (pressed('Space')) {
    localStorage.setItem('asteroids-skin', selectedSkinIndex);
    currentSkin = SKINS[selectedSkinIndex];
    initGame();
  }
}

function drawSkinMenu() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px monospace';
  ctx.fillText('ASTEROIDS', W / 2, 60);
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('SELECT YOUR SKIN', W / 2, 90);

  const startY = 140;
  const rowH = 52;

  for (let i = 0; i < SKINS.length; i++) {
    const skin = SKINS[i];
    const y = startY + i * rowH;
    const isSelected = i === selectedSkinIndex;

    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(W / 2 - 170, y - 16, 340, 40);
      ctx.fillStyle = skin.color;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('>', W / 2 - 175, y + 6);
    }

    ctx.fillStyle = isSelected ? skin.color : 'rgba(255,255,255,0.5)';
    ctx.font = isSelected ? 'bold 16px monospace' : '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(skin.name, W / 2 - 155, y + 6);

    ctx.font = '11px monospace';
    ctx.fillStyle = isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)';
    const stats = `R:${skin.radius}  T:${skin.thrust}  ROT:${skin.rotSpeed}  B:${skin.bulletSpeed}`;
    ctx.fillText(stats, W / 2 - 50, y + 6);

    if (skin.extraLife > 0) {
      ctx.fillStyle = '#ffaa00';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`+${skin.extraLife} LIFE`, W / 2 + 165, y + 6);
    }

    ctx.save();
    ctx.translate(W / 2 + 140, y);
    ctx.rotate(-Math.PI / 2);
    ctx.strokeStyle = skin.color;
    ctx.lineWidth = 1.3;
    ctx.lineJoin = 'round';
    skin.drawShip(ctx, {});
    ctx.restore();
  }

  const blink = Math.floor(menuBlinkTimer * 2.5) % 2 === 0;
  if (blink) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('[ESPACIO PARA JUGAR]', W / 2, H - 30);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '12px monospace';
  ctx.fillText('\u2191\u2193 Seleccionar  \u00b7  ESPACIO Jugar', W / 2, H - 10);
}

// ── Update ────────────────────────────────────────────────────────────────────
function update(dt) {
  if (state === 'menu') {
    updateMenu(dt);
    return;
  }

  if (state === 'gameover') {
    if (pressed('Space')) initGame();
    if (pressed('KeyM')) state = 'menu';
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    return;
  }

  if (state === 'dead') {
    deadTimer -= dt;
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.dead);
    asteroids.forEach(a => a.update(dt));
    shootingStars.forEach(s => s.update(dt));
    shootingStars = shootingStars.filter(s => !s.dead);
    if (deadTimer <= 0) { state = 'playing'; ship.reset(); }
    return;
  }

  if (powerUpNotification > 0) powerUpNotification -= dt;

  if (pressed('Space')) {
    bullets.push(...ship.tryShoot());
  }

  ship.update(dt);
  bullets.forEach(b => b.update(dt));
  asteroids.forEach(a => a.update(dt));
  particles.forEach(p => p.update(dt));
  powerUps.forEach(p => p.update(dt));
  shootingStars.forEach(s => s.update(dt));

  bullets = bullets.filter(b => !b.dead);
  particles = particles.filter(p => !p.dead);
  shootingStars = shootingStars.filter(s => !s.dead);

  // Bala vs asteroide
  const newAsteroids = [];
  for (const b of bullets) {
    for (const a of asteroids) {
      if (!a.dead && !b.dead && dist(b, a) < a.radius) {
        b.dead = true;
        a.dead = true;
        score += POINTS[a.size];
        explode(a.x, a.y, a.size * 5);
        newAsteroids.push(...a.split());
        trySpawnPowerUpFromAsteroid(a.x, a.y, a.size);
      }
    }
  }
  asteroids = asteroids.filter(a => !a.dead).concat(newAsteroids);
  bullets   = bullets.filter(b => !b.dead);

  // Bala vs estrella fugaz
  for (const b of bullets) {
    for (const s of shootingStars) {
      if (!s.dead && !b.dead && dist(b, s) < s.radius) {
        b.dead = true;
        s.dead = true;
        score += 250;
        explode(s.x, s.y, 12);
      }
    }
  }
  shootingStars = shootingStars.filter(s => !s.dead);
  bullets = bullets.filter(b => !b.dead);

  // Nave vs asteroide + escudo
  if (ship.invincible <= 0) {
    for (const a of asteroids) {
      if (dist(ship, a) < ship.radius + a.radius * 0.82) {
        if (ship.shieldTimer > 0) {
          a.dead = true;
          score += POINTS[a.size];
          explode(a.x, a.y, a.size * 3);
          newAsteroids.push(...a.split());
          ship.shieldTimer = Math.max(0, ship.shieldTimer - 1);
        } else {
          killShip();
          break;
        }
      }
    }

    // Nave vs estrella fugaz + escudo
    for (const s of shootingStars) {
      if (!s.dead && dist(ship, s) < ship.radius + s.radius) {
        if (ship.shieldTimer > 0) {
          s.dead = true;
          score += 250;
          explode(s.x, s.y, 10);
          ship.shieldTimer = Math.max(0, ship.shieldTimer - 1);
        } else {
          killShip();
          break;
        }
      }
    }
  }

  // Nave vs power-up
  for (const p of powerUps) {
    if (!p.dead && dist(ship, p) < ship.radius + p.radius) {
      p.dead = true;
      if (p.type === 'speed') {
        ship.speedTimer = 5;
      } else if (p.type === 'triple') {
        ship.tripleTimer = 5;
      } else if (p.type === 'shield') {
        ship.shieldTimer = 8;
      }
    }
  }
  powerUps = powerUps.filter(p => !p.dead);

  trySpawnRandomPowerUp(dt);
  trySpawnShootingStar(dt);

  if (asteroids.length === 0) nextLevel();
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawLifeIcon(x, y) {
  currentSkin.drawIcon(ctx, x, y);
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '15px monospace';

  ctx.textAlign = 'left';
  ctx.fillText(`SCORE  ${score}`, 14, 26);

  ctx.textAlign = 'center';
  ctx.fillText(`NIVEL ${level}`, W / 2, 26);

  for (let i = 0; i < lives; i++)
    drawLifeIcon(W - 16 - i * 22, 18);

  // Indicadores de power-ups activos: Shield -> Speed -> Triple -> Star
  let indicatorY = 48;

  if (ship.shieldTimer > 0) {
    ctx.fillStyle = POWERUP_COLORS.shield;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SHIELD ${Math.ceil(ship.shieldTimer)}s`, 14, indicatorY);
    indicatorY += 20;
  }

  if (ship.speedTimer > 0) {
    ctx.fillStyle = POWERUP_COLORS.speed;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SPEED ${Math.ceil(ship.speedTimer)}s`, 14, indicatorY);
    indicatorY += 20;
  }

  if (ship.tripleTimer > 0) {
    ctx.fillStyle = POWERUP_COLORS.triple;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`TRIPLE ${Math.ceil(ship.tripleTimer)}s`, 14, indicatorY);
    indicatorY += 20;
  }

  if (shootingStars.length > 0) {
    ctx.fillStyle = '#ffffaa';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`* SHOOTING STAR *`, 14, indicatorY);
  }

  // Notificación de power-up recogido
  if (powerUpNotification > 0) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(powerUpNotification, 1);
    ctx.fillText('POWER-UP!', W / 2, H / 2 + 60);
    ctx.globalAlpha = 1;
  }

  // Skin activo
  ctx.fillStyle = currentSkin.color;
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`SKIN: ${currentSkin.name}`, W - 14, H - 12);
}

function drawOverlay(title, sub) {
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#fff';
  ctx.font        = 'bold 46px monospace';
  ctx.fillText(title, W / 2, H / 2 - 18);
  ctx.font        = '18px monospace';
  ctx.fillStyle   = 'rgba(255,255,255,0.65)';
  ctx.fillText(sub, W / 2, H / 2 + 22);
}

function draw() {
  if (state === 'menu') {
    drawSkinMenu();
    return;
  }

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  particles.forEach(p => p.draw());
  powerUps.forEach(p => p.draw());
  shootingStars.forEach(s => s.draw());
  asteroids.forEach(a => a.draw());
  bullets.forEach(b => b.draw());
  ship.draw();

  drawHUD();

  if (state === 'gameover')
    drawOverlay('GAME OVER', `PUNTAJE: ${score}   —   ESPACIO REINICIAR  \u00b7  M MENU`);
}

// ── Loop principal ────────────────────────────────────────────────────────────
let lastTime = null;

function loop(ts) {
  const dt = lastTime === null ? 0 : Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

state = 'menu';
requestAnimationFrame(loop);
