// Staff panel: add/remove points, undo, set the goal, mute the projector, reset.
(function () {
  const $ = id => document.getElementById(id);
  const teamsEl = $('teams');
  const toastEl = $('toast');

  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ICONS[el.dataset.icon]; });

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
      SFX.click();
      BB.add(team.id, 1);
    });
    el.querySelector('.minus-btn').addEventListener('click', () => { SFX.click(); BB.add(team.id, -1); });

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

    SFX.setMuted(state.muted);
    $('sound').classList.toggle('off', state.muted);
    $('sound-icon').innerHTML = state.muted ? ICONS.mute : ICONS.volume;
    $('sound-label').textContent = state.muted ? 'Sound muted' : 'Sound on';

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
    SFX.click();
    const undone = BB.undo();
    if (undone) toast(`Undid ${undone.delta > 0 ? '+' : '−'}${Math.abs(undone.delta)} ${BB.team(undone.team).name}`);
  });

  $('goal-form').addEventListener('submit', e => {
    e.preventDefault();
    const goal = parseInt($('goal').value, 10);
    if (goal > 0) { SFX.click(); BB.setGoal(goal); toast(`Goal set to ${goal}`); $('goal').blur(); }
  });

  $('sound').addEventListener('click', () => {
    BB.setMuted(!BB.get().muted);
    if (!BB.get().muted) SFX.click();
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

  // Byte controls: the section opens freely, Say needs the password, and closing locks Say again.
  // A light lock against stray clicks, not real security (it is readable in this file).
  const BYTE_PASSWORD = 'meow';
  const Mascot = customElements.get('byte-mascot');
  const byteOpen = $('byte-open');
  const byteLock = $('byte-lock');
  const bytePass = $('byte-pass');
  const bytePanel = $('byte-panel');
  const byteSay = $('byte-say');
  const preview = $('byte-preview');

  function lockSay() {
    byteLock.hidden = false;
    byteSay.hidden = true;
    bytePass.value = '';
    $('byte-text').value = '';
    $('byte-lock-msg').textContent = '';
  }
  byteOpen.addEventListener('click', () => {
    SFX.click();
    const open = bytePanel.hidden;
    bytePanel.hidden = !open;
    byteOpen.setAttribute('aria-expanded', open);
    byteOpen.textContent = open ? 'Close Byte controls' : 'Open Byte controls';
    if (!open) lockSay();
  });
  byteLock.addEventListener('submit', e => {
    e.preventDefault();
    if (bytePass.value.trim().toLowerCase() === BYTE_PASSWORD) {
      byteLock.hidden = true;
      byteSay.hidden = false;
      $('byte-text').focus();
      return;
    }
    bytePass.value = '';
    $('byte-lock-msg').textContent = 'Wrong password.';
    bytePass.focus();
  });

  // Every button plays on the projector and on the small preview here.
  function byteButtons(el, names, play) {
    names.forEach(name => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.textContent = name;
      b.addEventListener('click', () => { SFX.click(); play(name); toast(`Byte: ${name}`); });
      el.appendChild(b);
    });
  }
  if (Mascot) {
    byteButtons($('byte-modes'), Mascot.STATES, name => { ByteLink.send('state', { name }); preview.state = name; });
    byteButtons($('byte-reactions'), Mascot.REACTIONS, name => { ByteLink.send('react', { name }); preview.react(name); });
  }
  byteSay.addEventListener('submit', e => {
    e.preventDefault();
    const text = $('byte-text').value.trim();
    if (!text) return;
    SFX.click();
    ByteLink.send('say', { text });
    if (Mascot) preview.say(text);
    $('byte-text').value = '';
    toast('Byte is saying it on the projector');
  });
  $('byte-auto').checked = ByteLink.auto();
  $('byte-auto').addEventListener('change', e => {
    ByteLink.send('auto', { on: e.target.checked });
    toast(e.target.checked ? 'Byte auto routine on' : 'Byte auto routine off');
  });

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
