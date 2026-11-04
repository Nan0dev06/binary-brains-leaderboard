// Staff panel: add/remove points, undo, set the goal, mute the projector, reset.
(function () {
  const $ = id => document.getElementById(id);
  const teamsEl = $('teams');
  const toastEl = $('toast');
  const SUFFIX = ['', 'ST', 'ND', 'RD', 'TH'];

  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ICONS[el.dataset.icon]; });

  function restart(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  const cards = {};
  BB.TEAMS.forEach(team => {
    const el = document.createElement('article');
    el.className = 'team px-border';
    el.style.setProperty('--c', team.color);
    el.innerHTML = `
      <div class="team-head"><span class="icon-svg">${team.icon}</span><h2>${team.name}</h2><span class="rank-tile"></span></div>
      <div class="team-score"><span class="num">0</span><span class="muted"></span></div>
      <div class="mini-meter"><div class="mini-fill"></div></div>
      <button class="btn plus-btn" type="button"><span class="icon-svg">${ICONS.plus}</span>1 POINT <kbd>${team.key}</kbd></button>
      <button class="btn minus-btn" type="button"><span class="icon-svg">${ICONS.minus}</span>Remove 1 (fix a mistake)</button>`;
    teamsEl.appendChild(el);

    const plus = el.querySelector('.plus-btn');
    plus.addEventListener('click', () => {
      const flash = document.createElement('span');
      flash.className = 'burst';
      plus.appendChild(flash);
      setTimeout(() => flash.remove(), 300);
      SFX.click();
      BB.add(team.id, 1);
    });
    el.querySelector('.minus-btn').addEventListener('click', () => { SFX.click(); BB.add(team.id, -1); });

    cards[team.id] = {
      el,
      num: el.querySelector('.num'),
      info: el.querySelector('.team-score .muted'),
      rank: el.querySelector('.rank-tile'),
      fill: el.querySelector('.mini-fill'),
    };
  });

  let toastTimer;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1600);
  }

  const time = at => new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmt = e => `${e.delta > 0 ? '+' : '−'}${Math.abs(e.delta)} ${BB.team(e.team).name}`;

  function render(state, prev) {
    const s = BB.standings(state);
    $('total').textContent = s.total;
    $('goal-label').textContent = s.goal;
    if (document.activeElement !== $('goal')) $('goal').value = s.goal;

    SFX.setMuted(state.muted);
    $('sound').classList.toggle('off', state.muted);
    $('sound-icon').innerHTML = state.muted ? ICONS.mute : ICONS.volume;
    $('sound-label').textContent = state.muted ? 'Sound muted' : 'Sound on';

    s.rows.forEach(r => {
      const c = cards[r.team.id];
      const before = prev ? prev.scores[r.team.id] : r.score;
      c.num.textContent = r.score;
      c.info.textContent = s.total ? `pts · ${Math.round(r.share * 100)}% of all` : 'pts';
      c.rank.textContent = s.total ? r.rank + SUFFIX[r.rank] : '';
      c.fill.style.width = r.progress * 100 + '%';
      if (prev && r.score !== before) {
        restart(c.num, 'pop');
        restart(c.el, 'flash');
      }
    });

    const last = state.log[state.log.length - 1];
    $('undo').disabled = !last;
    $('undo-hint').textContent = last ? `Last: ${fmt(last)} at ${time(last.at)}` : 'Nothing to undo yet.';

    const recent = state.log.slice(-30).reverse();
    $('log').innerHTML = recent.length
      ? recent.map(e => `<li style="--c:${BB.team(e.team).color}"><span class="dot"></span><span>${fmt(e)}</span><time>${time(e.at)}</time></li>`).join('')
      : '<li class="empty">No points yet.</li>';

    if (prev && state.log.length > prev.log.length && last) toast(fmt(last));
  }

  $('undo').addEventListener('click', () => {
    SFX.click();
    const undone = BB.undo();
    if (undone) toast(`Undid ${fmt(undone)}`);
  });

  $('sound').addEventListener('click', () => {
    BB.setMuted(!BB.get().muted);
    if (!BB.get().muted) SFX.click();
  });

  $('goal-form').addEventListener('submit', e => {
    e.preventDefault();
    const goal = parseInt($('goal').value, 10);
    if (goal > 0) { SFX.click(); BB.setGoal(goal); toast(`Goal set to ${goal}`); $('goal').blur(); }
  });

  // Reset needs the word RESET typed in, right here in the panel.
  const resetForm = $('reset-form');
  const resetText = $('reset-text');
  function closeReset() {
    resetForm.hidden = true;
    $('reset').hidden = false;
    resetText.value = '';
    $('reset-confirm').disabled = true;
  }
  $('reset').addEventListener('click', () => {
    SFX.click();
    $('reset').hidden = true;
    resetForm.hidden = false;
    resetText.focus();
  });
  resetText.addEventListener('input', () => {
    $('reset-confirm').disabled = resetText.value.trim().toUpperCase() !== 'RESET';
  });
  $('reset-cancel').addEventListener('click', closeReset);
  resetForm.addEventListener('submit', e => {
    e.preventDefault();
    if (resetText.value.trim().toUpperCase() !== 'RESET') return;
    BB.reset();
    closeReset();
    toast('All scores reset');
  });
  resetForm.addEventListener('keydown', e => { if (e.key === 'Escape') closeReset(); });

  // 1-4: +1, Shift+1-4: -1, Ctrl+Z: undo, M: mute (ignored while typing)
  addEventListener('keydown', e => {
    if (e.repeat || e.target.tagName === 'INPUT') return;
    const m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
    if (m) { SFX.click(); BB.add(BB.TEAMS[+m[1] - 1].id, e.shiftKey ? -1 : 1); return; }
    if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); $('undo').click(); return; }
    if (e.code === 'KeyM') $('sound').click();
  });

  BB.subscribe(render);
  render(BB.get(), null);
})();
