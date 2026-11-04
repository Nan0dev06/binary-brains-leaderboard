// Canvas effects for the projector: binary rain in the background,
// pixel/bit bursts when a bar grows, and confetti for big moments.
(function () {
  function fitCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // ---------- binary rain ----------
  function startRain(canvas) {
    let ctx, cols, drops, size;
    function setup() {
      ctx = fitCanvas(canvas);
      size = Math.max(14, Math.round(innerHeight / 55));
      cols = Math.ceil(innerWidth / size);
      drops = Array.from({ length: cols }, () => Math.random() * -innerHeight / size);
      ctx.font = `${size}px Consolas, monospace`;
    }
    setup();
    addEventListener('resize', setup);

    let last = 0;
    (function frame(t) {
      requestAnimationFrame(frame);
      if (t - last < 60) return; // ~16fps keeps it calm and cheap
      last = t;
      ctx.fillStyle = 'rgba(6, 17, 11, 0.16)';
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        ctx.fillStyle = Math.random() < 0.04 ? 'rgba(180, 255, 210, 0.55)' : 'rgba(76, 214, 128, 0.32)';
        ctx.fillText(Math.random() < 0.5 ? '0' : '1', i * size, y);
        drops[i] += 0.5 + (i % 3) * 0.15;
        if (y > innerHeight && Math.random() > 0.975) drops[i] = 0;
      }
    })(0);
  }

  // ---------- particles ----------
  const canvas = document.getElementById('fx');
  let ctx = canvas ? fitCanvas(canvas) : null;
  if (canvas) addEventListener('resize', () => { ctx = fitCanvas(canvas); });
  const parts = [];
  let running = false;
  let lastT = 0;

  // Time-based so effects last the same on a slow laptop as on a fast one.
  function loop(t) {
    const dt = lastT ? Math.min(6, (t - lastT) / 16.67) : 1;
    lastT = t;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      const drag = Math.pow(p.drag, dt);
      p.vx *= drag; p.vy = p.vy * drag + p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0 || p.y > innerHeight + 40) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life * 1.5);
      ctx.fillStyle = p.color;
      if (p.ch) {
        ctx.font = `bold ${p.size * 2.2}px Consolas, monospace`;
        ctx.fillText(p.ch, p.x, p.y);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(loop);
    else running = false;
  }

  function kick() {
    if (!running && ctx) { running = true; lastT = 0; requestAnimationFrame(loop); }
  }

  // Pixel squares + flying 0/1 digits from a point (the end of a bar).
  function burst(x, y, color, count = 34) {
    if (document.hidden) return;
    const unit = innerHeight / 1080;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = (3 + Math.random() * 9) * unit;
      const size = (5 + Math.random() * 7) * unit;
      parts.push({
        x, y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 4 * unit,
        g: 0.32 * unit, drag: 0.96,
        life: 1, decay: 0.014 + Math.random() * 0.018,
        rot: 0, vr: 0,
        w: size, h: size, size,
        color: Math.random() < 0.25 ? '#ffffff' : color,
        ch: Math.random() < 0.35 ? (Math.random() < 0.5 ? '0' : '1') : null,
      });
    }
    kick();
  }

  // Confetti raining across the whole screen.
  function confetti(colors, count = 220) {
    const unit = innerHeight / 1080;
    for (let i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 4 * unit, vy: (2 + Math.random() * 4) * unit,
        g: 0.06 * unit, drag: 0.995,
        life: 1, decay: 0.003 + Math.random() * 0.003,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        w: (8 + Math.random() * 8) * unit, h: (4 + Math.random() * 6) * unit, size: 8,
        color: colors[i % colors.length],
        ch: Math.random() < 0.12 ? (Math.random() < 0.5 ? '0' : '1') : null,
      });
    }
    kick();
  }

  window.FX = { startRain, burst, confetti };
})();
