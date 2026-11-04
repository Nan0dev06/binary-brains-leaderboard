// Projector view: renders the arcade scoreboard and plays effects + sounds when scores change.
(function () {
  const $ = id => document.getElementById(id);
  const lanesEl = $('lanes');
  const totalEl = $('total');
  const goalEl = $('goal');
  const feedEl = $('feed');
  const bubbleEl = $('bubble');
  const bannerEl = $('banner');
  const bannerKicker = bannerEl.querySelector('.banner-kicker');
  const bannerName = bannerEl.querySelector('.banner-name');
  const coinEl = $('coin');
  const soundIcon = $('sound-icon');

  $('feed-icon').innerHTML = ICONS.zap;
  $('coin-icon').innerHTML = ICONS.coins;

  const byte = Byte.mount($('byte'));
  FX.startRain($('rain'));

  const MAX_SEGMENTS = 50;

  function restart(el, cls, ms) {
    el.classList.remove(cls);
    void el.offsetWidth; // reflow so the CSS animation replays
    el.classList.add(cls);
    clearTimeout(el['_t_' + cls]);
    if (ms) el['_t_' + cls] = setTimeout(() => el.classList.remove(cls), ms);
  }

  // Animated number counter that can be retargeted mid-flight.
  function tween(el, to, animate, format = String) {
    cancelAnimationFrame(el._raf);
    const from = el._cur == null ? to : el._cur;
    if (!animate || from === to) { el.textContent = format(to); el._cur = to; return; }
    const start = performance.now();
    const step = t => {
      const k = Math.min(1, (t - start) / 600);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 4)));
      el.textContent = format(v);
      el._cur = v;
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  const pad4 = n => String(n).padStart(4, '0');
  const SUFFIX = ['', 'ST', 'ND', 'RD', 'TH'];

  // ---------- build lanes once ----------
  const lanes = {};
  BB.TEAMS.forEach(team => {
    const el = document.createElement('article');
    el.className = 'lane px-border';
    el.style.setProperty('--c', team.color);
    el.innerHTML = `
      <div class="rank"><span class="crown icon-svg">${ICONS.crown}</span><span class="rk-n">1</span><span class="rk-s">ST</span></div>
      <div class="mid">
        <div class="name"><span class="icon-svg">${team.icon}</span>${team.name}<span class="tag">LEADER</span></div>
        <div class="meter"><div class="goal-flag"></div></div>
        <div class="meta"></div>
      </div>
      <div class="score"><span class="num">0</span><span class="share"></span></div>`;
    lanesEl.appendChild(el);
    lanes[team.id] = {
      el,
      meter: el.querySelector('.meter'),
      goalFlag: el.querySelector('.goal-flag'),
      num: el.querySelector('.num'),
      share: el.querySelector('.share'),
      rankN: el.querySelector('.rk-n'),
      rankS: el.querySelector('.rk-s'),
      meta: el.querySelector('.meta'),
      segs: [],
      lit: 0,
    };
  });

  // The meter is a row of blocks: one block per point up to 50, then each block covers more.
  function setMeter(L, r, scale, animate) {
    const count = Math.min(scale, MAX_SEGMENTS);
    if (L.segs.length !== count) {
      L.segs.forEach(s => s.remove());
      L.segs = Array.from({ length: count }, () => {
        const s = document.createElement('div');
        s.className = 'seg';
        L.meter.insertBefore(s, L.goalFlag);
        return s;
      });
      L.lit = 0;
    }
    const lit = r.score > 0 ? Math.max(1, Math.round(r.progress * count)) : 0;
    L.segs.forEach((s, i) => {
      s.classList.toggle('on', i < lit);
      if (animate && i >= L.lit && i < lit) {
        s.style.animationDelay = (i - L.lit) * 40 + 'ms';
        restart(s, 'new', 700);
      }
    });
    L.lit = lit;
  }

  function metaHtml(r, s) {
    if (s.total === 0) return '<span>Waiting for the first point&hellip;</span>';
    const parts = [];
    if (s.leader && s.leader.team.id === r.team.id) parts.push(`<span class="hot">Leads by ${s.lead}</span>`);
    else if (r.gap === 0) parts.push('<span class="hot">Tied for 1st</span>');
    else parts.push(`<span><b>${r.gap}</b> behind 1st</span>`);
    parts.push(r.score >= s.goal ? '<span class="hot">Goal reached!</span>' : `<span><b>${r.toGoal}</b> to goal</span>`);
    return parts.join('');
  }

  // Where the end of a meter will be once its lane finishes sliding into its new slot.
  function meterEnd(L, r) {
    const laneRect = L.el.getBoundingClientRect();
    const meterRect = L.meter.getBoundingClientRect();
    const slotTop = lanesEl.getBoundingClientRect().top + r.slot * (laneRect.height + innerHeight * 0.024);
    return {
      x: meterRect.left + meterRect.width * r.progress,
      y: slotTop + (meterRect.top - laneRect.top) + meterRect.height / 2,
    };
  }

  function floatChip(L, r, text, sub, minus) {
    const chip = document.createElement('div');
    chip.className = 'plus' + (minus ? ' minus' : '');
    chip.style.left = Math.min(96, Math.max(4, r.progress * 100)) + '%';
    chip.innerHTML = text + (sub ? `<small>${sub}</small>` : '');
    L.meter.appendChild(chip);
    setTimeout(() => chip.remove(), 1300);
  }

  function hit(L, r, delta) {
    restart(L.el, 'hit', 450);
    const before = r.score - delta;
    const milestone = Math.floor(r.score / 10) > Math.floor(before / 10) ? Math.floor(r.score / 10) * 10 : 0;
    floatChip(L, r, '+' + delta, milestone ? milestone + ' PTS!' : '');
    setTimeout(() => {
      const p = meterEnd(L, r);
      FX.burst(p.x, p.y, r.team.color, milestone ? 70 : 22 + Math.min(delta, 5) * 6);
    }, 200);
    byte.bop();
    return milestone;
  }

  function drop(L, r, delta) {
    restart(L.el, 'drop', 450);
    floatChip(L, r, '&minus;' + Math.abs(delta), '', true);
  }

  // ---------- Byte's speech bubble ----------
  const TIPS = [
    'Finish a booth challenge to score for your booth!',
    '4 booths. 1 champion. Who takes it?',
    'Visit Computing, Cyber, Data Science and General!',
    'Every point counts. Go go go!',
  ];
  let tipIndex = 0;
  let holdUntil = 0;

  function say(text, hold = 6000) {
    bubbleEl.textContent = text;
    restart(bubbleEl, 'say', 400);
    holdUntil = Date.now() + hold;
  }
  setInterval(() => {
    if (Date.now() < holdUntil) return;
    tipIndex = (tipIndex + 1) % TIPS.length;
    say(TIPS[tipIndex], 0);
  }, 12000);

  function banner(kicker, name, color) {
    bannerEl.style.setProperty('--c', color);
    bannerKicker.textContent = kicker;
    bannerName.textContent = name;
    restart(bannerEl, 'show', 2900);
  }

  // ---------- feed ----------
  let lastSeen = 0;
  function ago(at) {
    const s = Math.round((Date.now() - at) / 1000);
    if (s < 10) return 'now';
    if (s < 60) return s + 's';
    if (s < 3600) return Math.floor(s / 60) + 'm';
    return Math.floor(s / 3600) + 'h';
  }
  function renderFeed(state) {
    const recent = state.log.slice(-7).reverse();
    if (!recent.length) {
      feedEl.innerHTML = '<li class="empty">No points yet. Be the first!</li>';
      lastSeen = 0;
      return;
    }
    feedEl.innerHTML = recent.map(e => {
      const t = BB.team(e.team);
      const sign = e.delta > 0 ? '+' : '&minus;';
      return `<li class="${e.at > lastSeen ? 'new' : ''}" style="--c:${t.color}">
        <span class="dot"></span><span>${sign}${Math.abs(e.delta)} ${t.short}</span>
        <span class="ago" data-at="${e.at}">${ago(e.at)}</span></li>`;
    }).join('');
    lastSeen = recent[0].at;
  }
  setInterval(() => {
    feedEl.querySelectorAll('.ago').forEach(el => { el.textContent = ago(+el.dataset.at); });
  }, 5000);

  // ---------- sound state ----------
  function renderSound(state) {
    SFX.setMuted(state.muted);
    const on = SFX.isUnlocked() && !state.muted;
    soundIcon.innerHTML = on ? ICONS.volume : ICONS.mute;
    soundIcon.classList.toggle('on', on);
    coinEl.hidden = SFX.isUnlocked() || state.muted;
  }
  SFX.onUnlock(() => {
    renderSound(BB.get());
    SFX.start();
  });
  coinEl.addEventListener('click', () => SFX.unlock());

  // ---------- main render ----------
  function render(state, prev, animate) {
    const s = BB.standings(state);
    const p = BB.standings(prev || state);
    const scale = Math.max(s.goal, s.top, 1);

    tween(totalEl, s.total, animate, pad4);
    if (animate && s.total > p.total) restart(totalEl, 'bump', 500);
    goalEl.textContent = s.goal;

    const events = { points: false, milestone: false, minus: false, climbed: false };
    s.rows.forEach(r => {
      const L = lanes[r.team.id];
      const old = p.rows.find(x => x.team.id === r.team.id);
      L.el.style.setProperty('--slot', r.slot);
      L.el.classList.toggle('rising', r.slot < old.slot);
      L.el.classList.toggle('is-leader', !!s.leader && s.leader.team.id === r.team.id);
      L.rankN.textContent = s.total ? r.rank : '-';
      L.rankS.textContent = s.total ? SUFFIX[r.rank] : '';
      L.goalFlag.style.left = (s.goal / scale) * 100 + '%';
      L.goalFlag.style.display = s.goal < scale ? '' : 'none';
      L.meta.innerHTML = metaHtml(r, s);
      L.share.textContent = s.total ? `${Math.round(r.share * 100)}% of points` : '';
      tween(L.num, r.score, animate);
      setMeter(L, r, scale, animate);

      const delta = r.score - old.score;
      if (animate && delta > 0) { events.points = true; if (hit(L, r, delta)) events.milestone = true; }
      if (animate && delta < 0) { events.minus = true; drop(L, r, delta); }
      if (animate && r.rank < old.rank && r.score > 0) events.climbed = true;
    });

    renderSound(state);
    if (animate) celebrate(s, p, state, prev, events);
    renderFeed(state);
  }

  function celebrate(s, p, state, prev, events) {
    if (s.total === 0 && p.total > 0) {
      say('Scores reset. Fresh start, everyone!');
      byte.glitch();
      SFX.reset();
      return;
    }

    const undid = state.log.length < prev.log.length;
    if (events.points) SFX.point();
    if (events.minus) undid ? SFX.undo() : SFX.minus();
    if (events.milestone) setTimeout(SFX.milestone, 140);
    if (s.goal !== p.goal) SFX.confirm();

    const goalHit = s.goal === p.goal && s.rows.find(r => {
      const old = p.rows.find(x => x.team.id === r.team.id);
      return r.score >= s.goal && old.score < s.goal;
    });
    const newLeader = s.leader && (!p.leader || p.leader.team.id !== s.leader.team.id);
    const tiedTop = !s.leader && s.top > 0 && p.leader;

    if (goalHit) {
      const t = goalHit.team;
      banner('GOAL REACHED', t.name, t.color);
      FX.confetti([t.color, '#f2fff7', '#4cd680', ...BB.TEAMS.map(x => x.color)]);
      byte.cheer(t.color, 4000);
      say(`${t.name} reached ${s.goal} points! Incredible!`, 8000);
      setTimeout(SFX.goal, 220);
    } else if (newLeader) {
      const t = s.leader.team;
      banner(p.total === 0 ? 'FIRST POINT' : 'NEW LEADER', t.name, t.color);
      byte.cheer(t.color);
      byte.glitch();
      say(p.total === 0 ? `${t.name} is on the board!` : `${t.name} is now #1!`);
      setTimeout(SFX.lead, 220);
    } else if (tiedTop) {
      byte.glitch();
      say('It is a tie at the top! Who breaks it?');
      setTimeout(SFX.tie, 200);
    } else if (events.climbed) {
      setTimeout(SFX.rank, 160);
    }
  }

  BB.subscribe((state, prev) => render(state, prev, true));
  render(BB.get(), null, false);
  say(TIPS[0], 0);

  // ---------- keyboard (handy when the projector mirrors the laptop) ----------
  // 1-4: +1 point, Shift+1-4: -1 point, U or Ctrl+Z: undo, M: mute, F: fullscreen.
  addEventListener('keydown', e => {
    if (e.repeat) return;
    const m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
    if (m) { BB.add(BB.TEAMS[+m[1] - 1].id, e.shiftKey ? -1 : 1); return; }
    if (e.code === 'KeyU' || (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey))) { BB.undo(); return; }
    if (e.code === 'KeyM') { BB.setMuted(!BB.get().muted); return; }
    if (e.code === 'KeyF') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    }
  });

  // Hide the mouse cursor on the projector when it is not moving.
  let idleTimer;
  addEventListener('mousemove', () => {
    document.body.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.add('idle'), 2500);
  });
})();
