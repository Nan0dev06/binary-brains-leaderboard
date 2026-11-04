// Staff panel: add/remove points, undo, set the goal, reset.
(function () {
  const $ = id => document.getElementById(id);
  const teamsEl = $('teams');
  const toastEl = $('toast');

  const cards = {};
  BB.TEAMS.forEach(team => {
    const el = document.createElement('article');
    el.className = 'team';
    el.style.setProperty('--c', team.color);
    el.innerHTML = `
      <div class="team-head"><span class="icon">${team.icon}</span><h2>${team.name}</h2><span class="rank"></span></div>
      <div class="team-score"><span class="num">0</span><span class="muted"></span></div>
      <div class="mini-track"><div class="mini-fill"></div></div>
      <button class="btn plus-btn" type="button">+1 POINT <kbd>${team.key}</kbd></button>
      <button class="btn minus-btn" type="button">&minus;1 (fix a mistake)</button>`;
    teamsEl.appendChild(el);

    const plus = el.querySelector('.plus-btn');
    plus.addEventListener('click', e => {
      const r = plus.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX ? e.clientX - r.left : r.width / 2) + 'px';
      ripple.style.top = (e.clientY ? e.clientY - r.top : r.height / 2) + 'px';
      plus.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
      BB.add(team.id, 1);
    });
    el.querySelector('.minus-btn').addEventListener('click', () => BB.add(team.id, -1));

    cards[team.id] = {
      el,
      num: el.querySelector('.num'),
      info: el.querySelector('.team-score .muted'),
      rank: el.querySelector('.rank'),
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

  function restart(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function time(at) {
    return new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function render(state, prev) {
    const s = BB.standings(state);
    $('total').textContent = s.total;
    $('goal-label').textContent = s.goal;
    if (document.activeElement !== $('goal')) $('goal').value = s.goal;

    s.rows.forEach(r => {
      const c = cards[r.team.id];
      const before = prev ? prev.scores[r.team.id] : r.score;
      c.num.textContent = r.score;
      c.info.textContent = `pts · ${Math.round(r.share * 100)}%`;
      c.rank.textContent = s.total ? `#${r.rank}` : '';
      c.rank.classList.toggle('first', s.total > 0 && r.rank === 1);
      c.fill.style.width = r.progress * 100 + '%';
      if (prev && r.score !== before) {
        restart(c.num, 'pop');
        restart(c.el, 'flash');
      }
    });

    const last = state.log[state.log.length - 1];
    $('undo').disabled = !last;
    $('undo-hint').textContent = last
      ? `Last: ${last.delta > 0 ? '+' : '−'}${Math.abs(last.delta)} ${BB.team(last.team).name} at ${time(last.at)}`
      : 'Nothing to undo yet.';

    const recent = state.log.slice(-30).reverse();
    $('log').innerHTML = recent.length
      ? recent.map(e => {
        const t = BB.team(e.team);
        return `<li style="--c:${t.color}"><span class="dot"></span><span>${e.delta > 0 ? '+' : '−'}${Math.abs(e.delta)} ${t.name}</span><time>${time(e.at)}</time></li>`;
      }).join('')
      : '<li class="muted">No points yet.</li>';

    if (prev && state.log.length > prev.log.length && last) {
      toast(`${last.delta > 0 ? '+' : '−'}${Math.abs(last.delta)} ${BB.team(last.team).name}`);
    }
  }

  $('undo').addEventListener('click', () => {
    const undone = BB.undo();
    if (undone) toast(`Undid ${undone.delta > 0 ? '+' : '−'}${Math.abs(undone.delta)} ${BB.team(undone.team).name}`);
  });

  $('goal-form').addEventListener('submit', e => {
    e.preventDefault();
    const goal = parseInt($('goal').value, 10);
    if (goal > 0) { BB.setGoal(goal); toast(`Goal set to ${goal}`); $('goal').blur(); }
  });

  $('reset').addEventListener('click', () => {
    const answer = prompt('This wipes every score and the activity log.\nType RESET to confirm.');
    if (answer && answer.trim().toUpperCase() === 'RESET') { BB.reset(); toast('All scores reset'); }
  });

  // 1-4: +1, Shift+1-4: -1, Ctrl+Z: undo (ignored while typing in the goal box)
  addEventListener('keydown', e => {
    if (e.repeat || e.target.tagName === 'INPUT') return;
    const m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
    if (m) { BB.add(BB.TEAMS[+m[1] - 1].id, e.shiftKey ? -1 : 1); return; }
    if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); $('undo').click(); }
  });

  BB.subscribe(render);
  render(BB.get(), null);
})();
