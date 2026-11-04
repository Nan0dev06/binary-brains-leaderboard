// Projector view: renders the leaderboard and plays effects + sounds when scores change.
(function () {
  const $ = id => document.getElementById(id);
  const lanesEl = $('lanes');
  const totalEl = $('total');
  const goalEl = $('goal');
  const feedEl = $('feed');
  const bubbleEl = $('bubble');
  const bannerEl = $('banner');
  const bannerText = bannerEl.querySelector('.banner-text');
  const bannerKicker = bannerEl.querySelector('.banner-kicker');
  const coinEl = $('coin');
  const soundIcon = $('sound-icon');
  $('coin-icon').innerHTML = ICONS.volume;

  const byte = Byte.mount($('byte'));
  FX.startRain($('rain'));

  const CROWN = '<svg viewBox="0 0 10 6" fill="currentColor" shape-rendering="crispEdges"><path d="M0 0h2v2h1V1h1V0h2v1h1v1h1V0h2v6H0z"/></svg>';

  function bits(n) {
    let s = '';
    for (let i = 0; i < n; i++) s += Math.random() < 0.5 ? '0' : '1';
    return s + s;
  }

  function restart(el, cls, ms) {
    el.classList.remove(cls);
    void el.offsetWidth; // reflow so the CSS animation replays
    el.classList.add(cls);
    clearTimeout(el['_t_' + cls]);
    if (ms) el['_t_' + cls] = setTimeout(() => el.classList.remove(cls), ms);
  }

  // Animated number counter that can be retargeted mid-flight.
  function tween(el, to, animate) {
    cancelAnimationFrame(el._raf);
    const from = el._cur == null ? to : el._cur;
    if (!animate || from === to) { el.textContent = to; el._cur = to; return; }
    const start = performance.now();
    const step = t => {
      const k = Math.min(1, (t - start) / 650);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      el.textContent = v;
      el._cur = v;
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  // ---------- build lanes once ----------
  const lanes = {};
  BB.TEAMS.forEach(team => {
    const el = document.createElement('article');
    el.className = 'lane';
    el.style.setProperty('--c', team.color);
    el.innerHTML = `
      <div class="rank"><span class="crown">${CROWN}</span><span class="rank-num">1</span></div>
      <div class="mid">
        <div class="name"><span class="icon">${team.icon}</span>${team.name}<span class="tag">LEADING</span></div>
        <div class="track">
          <div class="fill"><div class="fill-bits">${bits(80)}</div><div class="shine"></div></div>
          <div class="goal-line"></div>
        </div>
        <div class="meta mono"></div>
      </div>
      <div class="score"><span class="num">0</span><span class="pts">PTS</span></div>`;
    lanesEl.appendChild(el);
    lanes[team.id] = {
      el,
      track: el.querySelector('.track'),
      fill: el.querySelector('.fill'),
      num: el.querySelector('.num'),
      rankNum: el.querySelector('.rank-num'),
      meta: el.querySelector('.meta'),
      goalLine: el.querySelector('.goal-line'),
    };
  });

  function metaHtml(r, s) {
    if (s.total === 0) return '<span>Waiting for the first point&hellip;</span>';
    const parts = [`<span><b>${Math.round(r.share * 100)}%</b> of points</span>`];
    if (s.leader && s.leader.team.id === r.team.id) parts.push(`<span class="hot">Leading by <b>${s.lead}</b></span>`);
    else if (r.gap === 0) parts.push('<span class="hot">Tied for 1st</span>');
    else parts.push(`<span><b>${r.gap}</b> behind 1st</span>`);
    parts.push(r.score >= s.goal ? '<span class="hot">GOAL REACHED</span>' : `<span><b>${r.toGoal}</b> to goal</span>`);
    return parts.join('');
  }

  // Where the end of a bar will be once its lane finishes sliding into its new slot.
  function barEnd(L, r) {
    const laneRect = L.el.getBoundingClientRect();
    const trackRect = L.track.getBoundingClientRect();
    const slotTop = lanesEl.getBoundingClientRect().top + r.slot * (laneRect.height + innerHeight * 0.024);
    return {
      x: trackRect.left + trackRect.width * r.progress,
      y: slotTop + (trackRect.top - laneRect.top) + trackRect.height / 2,
    };
  }

  function floatChip(L, r, text, sub, minus) {
    const chip = document.createElement('div');
    chip.className = 'plus' + (minus ? ' minus' : '');
    chip.style.left = Math.max(3, r.progress * 100) + '%';
    chip.innerHTML = text + (sub ? `<small>${sub}</small>` : '');
    L.track.appendChild(chip);
    setTimeout(() => chip.remove(), 1400);
  }

  function hit(L, r, delta) {
    restart(L.el, 'hit', 800);
    const before = r.score - delta;
    const milestone = Math.floor(r.score / 10) > Math.floor(before / 10) ? Math.floor(r.score / 10) * 10 : 0;
    floatChip(L, r, '+' + delta, milestone ? milestone + ' PTS!' : '');
    // wait a beat so the burst lands where the bar is growing to
    setTimeout(() => {
      const p = barEnd(L, r);
      FX.burst(p.x, p.y, r.team.color, milestone ? 80 : 26 + Math.min(delta, 5) * 8);
    }, 250);
    byte.bop();
    return milestone;
  }

  function drop(L, r, delta) {
    restart(L.el, 'drop', 500);
    floatChip(L, r, '&minus;' + Math.abs(delta), '', true);
  }

  // ---------- Byte's speech bubble ----------
  const TIPS = [
    'Finish a booth challenge to score for your concentration!',
    '4 booths. 1 champion. Who is taking it?',
    'Visit Computing, Cyber, Data Science and General!',
    'Every point counts. Go go go!',
  ];
  let tipIndex = 0;
  let holdUntil = 0;

  function say(text, hold = 6000) {
    bubbleEl.textContent = text;
    restart(bubbleEl, 'say', 500);
    holdUntil = Date.now() + hold;
  }
  setInterval(() => {
    if (Date.now() < holdUntil) return;
    tipIndex = (tipIndex + 1) % TIPS.length;
    say(TIPS[tipIndex], 0);
  }, 12000);

  function banner(kicker, text, color) {
    bannerEl.style.setProperty('--c', color);
    bannerKicker.textContent = kicker;
    bannerText.textContent = text;
    bannerText.dataset.text = text;
    restart(bannerEl, 'show', 2700);
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
    const recent = state.log.slice(-8).reverse();
    if (!recent.length) {
      feedEl.innerHTML = '<li class="empty">No points yet. Be the first!</li>';
      lastSeen = 0;
      return;
    }
    feedEl.innerHTML = recent.map(e => {
      const t = BB.team(e.team);
      const sign = e.delta > 0 ? '+' : '&minus;';
      return `<li class="${e.at > lastSeen ? 'new' : ''}" style="--c:${t.color}">
        <span class="dot"></span><span>${sign}${Math.abs(e.delta)} ${t.name}</span>
        <span class="ago" data-at="${e.at}">${ago(e.at)}</span></li>`;
    }).join('');
    lastSeen = recent[0].at;
  }
  setInterval(() => {
    feedEl.querySelectorAll('.ago').forEach(el => { el.textContent = ago(+el.dataset.at); });
  }, 5000);

  // ---------- main render ----------
  function render(state, prev, animate) {
    const s = BB.standings(state);
    const p = BB.standings(prev || state);
    const scale = Math.max(s.goal, s.top, 1);

    tween(totalEl, s.total, animate);
    if (animate && s.total > p.total) restart(totalEl, 'bump', 600);
    goalEl.textContent = s.goal;

    const events = { points: false, milestone: false, minus: false, climbed: false };
    s.rows.forEach(r => {
      const L = lanes[r.team.id];
      const old = p.rows.find(x => x.team.id === r.team.id);
      L.el.style.setProperty('--slot', r.slot);
      L.el.classList.toggle('rising', r.slot < old.slot);
      L.el.classList.toggle('is-leader', !!s.leader && s.leader.team.id === r.team.id);
      L.fill.style.width = r.progress * 100 + '%';
      L.rankNum.textContent = r.rank;
      L.goalLine.style.left = (s.goal / scale) * 100 + '%';
      L.goalLine.style.display = s.goal < scale ? '' : 'none';
      L.meta.innerHTML = metaHtml(r, s);
      tween(L.num, r.score, animate);

      const delta = r.score - old.score;
      if (animate && delta > 0) { events.points = true; if (hit(L, r, delta)) events.milestone = true; }
      if (animate && delta < 0) { events.minus = true; drop(L, r, delta); }
      if (animate && r.rank < old.rank && r.score > 0) events.climbed = true;
    });

    renderSound(state);
    if (animate) celebrate(s, p, state.log.length < prev.log.length, events);
    renderFeed(state);
  }

  // ---------- sound ----------
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

  function celebrate(s, p, undid, events) {
    if (s.total === 0 && p.total > 0) { say('Scores reset. Fresh start, everyone!'); byte.glitch(); SFX.reset(); return; }

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
      setTimeout(SFX.goal, 220);
      FX.confetti([t.color, '#ffffff', '#4cd680', ...BB.TEAMS.map(x => x.color)]);
      byte.cheer(t.color, 4000);
      say(`${t.name} reached ${s.goal} points! Incredible!`, 8000);
    } else if (newLeader) {
      const t = s.leader.team;
      banner(p.total === 0 ? 'FIRST POINT' : 'NEW LEADER', t.name, t.color);
      setTimeout(SFX.lead, 220);
      byte.cheer(t.color);
      byte.glitch();
      say(p.total === 0 ? `${t.name} is on the board!` : `${t.name} is now #1!`);
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
