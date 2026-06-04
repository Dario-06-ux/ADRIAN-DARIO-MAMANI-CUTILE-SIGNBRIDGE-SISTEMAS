/* ============================================================
   SIGNBRIDGE AI — PARTICLES ENGINE
   particles.js · Canvas-based animated particles
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');

  // ── Config ─────────────────────────────────────────────────
  const CONFIG = {
    particleCount:  72,
    particleRadius: { min: 1.2, max: 3.2 },
    speed:          { min: 0.18, max: 0.52 },
    colors:         ['#00D4FF', '#00FF9F', '#FFFFFF'],
    colorAlpha:     { min: 0.08, max: 0.38 },
    connectDistance: 130,
    connectAlpha:   0.07,
    mouseRadius:    140,
    mouseForce:     0.55,
  };

  let W = 0, H = 0;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let rafId = null;
  let isRunning = false;

  // ── Particle Class ──────────────────────────────────────────
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = CONFIG.particleRadius.min + Math.random() * (CONFIG.particleRadius.max - CONFIG.particleRadius.min);
    const spd = CONFIG.speed.min + Math.random() * (CONFIG.speed.max - CONFIG.speed.min);
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    this.baseAlpha = CONFIG.colorAlpha.min + Math.random() * (CONFIG.colorAlpha.max - CONFIG.colorAlpha.min);
    this.alpha = this.baseAlpha;
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.pulseSpeed  = 0.012 + Math.random() * 0.018;
  };

  Particle.prototype.update = function (t) {
    // Gentle pulse
    this.alpha = this.baseAlpha * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulseOffset));

    // Mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.mouseRadius && dist > 0) {
      const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * CONFIG.mouseForce;
      this.vx += (dx / dist) * force * 0.04;
      this.vy += (dy / dist) * force * 0.04;
    }

    // Dampen velocity
    this.vx *= 0.998;
    this.vy *= 0.998;

    // Re-inject base speed if too slow
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const targetSpeed = CONFIG.speed.min + Math.random() * 0.05;
    if (speed < targetSpeed * 0.3) {
      this.vx += (Math.random() - 0.5) * 0.05;
      this.vy += (Math.random() - 0.5) * 0.05;
    }
    // Cap speed
    if (speed > CONFIG.speed.max * 2) {
      this.vx = (this.vx / speed) * CONFIG.speed.max;
      this.vy = (this.vy / speed) * CONFIG.speed.max;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
    if (this.y < -10) this.y = H + 10;
    if (this.y > H + 10) this.y = -10;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(this.color, this.alpha);
    ctx.fill();
  };

  // ── Utilities ──────────────────────────────────────────────
  function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a.toFixed(3)})`;
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDistance) {
          const alpha = CONFIG.connectAlpha * (1 - dist / CONFIG.connectDistance);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha.toFixed(4)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  // ── Resize ─────────────────────────────────────────────────
  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width  = hero ? hero.offsetWidth  : window.innerWidth;
    H = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    resize();
    particles = [];
    const count = Math.min(CONFIG.particleCount, Math.floor((W * H) / 9000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // ── Render Loop ────────────────────────────────────────────
  let tickCount = 0;
  function loop(ts) {
    if (!isRunning) return;
    tickCount++;
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      p.update(tickCount);
      p.draw();
    });
    rafId = requestAnimationFrame(loop);
  }

  // ── Visibility API — pause when tab hidden ─────────────────
  function handleVisibilityChange() {
    if (document.hidden) {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
    } else {
      isRunning = true;
      loop();
    }
  }

  // ── Events ─────────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { init(); }, 180);
  });

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // ── Start ──────────────────────────────────────────────────
  init();
  isRunning = true;
  loop();

})();
