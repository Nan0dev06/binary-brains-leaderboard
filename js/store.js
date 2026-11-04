// Shared score state for the display and control pages.
// Everything lives in localStorage on this laptop, no network involved.
// Tabs stay in sync through BroadcastChannel + the storage event, with a
// slow poll as a safety net (some browsers are flaky with file:// pages).
(function () {
  const KEY = 'bb-leaderboard-v1';

  const TEAMS = [
    { id: 'computing', name: 'Computing', short: 'Computing', color: '#4aa8ff', key: '1', icon: 'code' },
    { id: 'cyber', name: 'Cybersecurity', short: 'Cyber', color: '#ff3b55', key: '2', icon: 'shield' },
    { id: 'data', name: 'Data Science', short: 'Data', color: '#3ee07f', key: '3', icon: 'chart' },
    { id: 'general', name: 'General', short: 'General', color: '#ff6cc4', key: '4', icon: 'info' },
  ].map(t => ({ ...t, icon: window.ICONS[t.icon] }));

  const MAX_LOG = 1000;

  function blank(rev) {
    const scores = {};
    TEAMS.forEach(t => { scores[t.id] = 0; });
    return { rev: rev || 0, goal: 50, muted: false, scores, log: [] };
  }

  function read() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.scores) return { ...blank(), ...s, scores: { ...blank().scores, ...s.scores } };
    } catch (e) { /* corrupted or blocked storage: start fresh */ }
    return blank();
  }

  let state = read();
  const listeners = [];
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(KEY) : null;

  function emit(prev) { listeners.forEach(fn => fn(state, prev)); }

  function commit(next) {
    const prev = state;
    next.rev = prev.rev + 1;
    state = next;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* keep running in memory */ }
    if (channel) channel.postMessage(state);
    emit(prev);
  }

  function receive(incoming) {
    if (!incoming || !incoming.scores || incoming.rev <= state.rev) return;
    const prev = state;
    state = incoming;
    emit(prev);
  }

  if (channel) channel.onmessage = e => receive(e.data);
  window.addEventListener('storage', e => {
    if (e.key === KEY && e.newValue) {
      try { receive(JSON.parse(e.newValue)); } catch (err) { /* ignore */ }
    }
  });
  setInterval(() => receive(read()), 1500);

  function clone() { return JSON.parse(JSON.stringify(state)); }

  function add(teamId, delta) {
    const next = clone();
    const before = next.scores[teamId];
    const after = Math.max(0, before + delta);
    if (after === before) return;
    next.scores[teamId] = after;
    next.log.push({ team: teamId, delta: after - before, at: Date.now() });
    if (next.log.length > MAX_LOG) next.log.splice(0, next.log.length - MAX_LOG);
    commit(next);
  }

  function undo() {
    const next = clone();
    const last = next.log.pop();
    if (!last) return null;
    next.scores[last.team] = Math.max(0, next.scores[last.team] - last.delta);
    commit(next);
    return last;
  }

  function setGoal(goal) {
    const next = clone();
    next.goal = Math.max(1, Math.round(goal) || 1);
    commit(next);
  }

  function setMuted(muted) {
    const next = clone();
    next.muted = !!muted;
    commit(next);
  }

  function reset() {
    const next = blank();
    next.goal = state.goal;
    next.muted = state.muted;
    commit(next);
  }

  // All leaderboard math lives here so both pages agree on it.
  function standings(s) {
    s = s || state;
    const scores = TEAMS.map(t => s.scores[t.id] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    const top = Math.max(...scores);
    // Bars fill toward the goal; once someone passes it, the leader becomes 100%.
    const scale = Math.max(s.goal, top, 1);

    const rows = TEAMS.map((team, i) => ({
      team,
      score: scores[i],
      share: total ? scores[i] / total : 0,
      progress: scores[i] / scale,
      gap: top - scores[i],
      toGoal: Math.max(0, s.goal - scores[i]),
    }));

    // Highest score first; ties keep booth order and share a rank (1, 1, 3, ...).
    const sorted = rows.slice().sort((a, b) => b.score - a.score || TEAMS.indexOf(a.team) - TEAMS.indexOf(b.team));
    sorted.forEach((r, i) => {
      r.slot = i;
      r.rank = i > 0 && r.score === sorted[i - 1].score ? sorted[i - 1].rank : i + 1;
    });

    const tiedAtTop = sorted.length > 1 && sorted[1].score === top;
    const leader = top > 0 && !tiedAtTop ? sorted[0] : null;
    const lead = leader ? top - sorted[1].score : 0;

    return { rows, sorted, total, top, leader, lead, goal: s.goal };
  }

  function team(id) { return TEAMS.find(t => t.id === id); }

  window.BB = {
    TEAMS,
    team,
    get: () => state,
    subscribe: fn => listeners.push(fn),
    add,
    undo,
    setGoal,
    setMuted,
    reset,
    standings,
  };
})();
