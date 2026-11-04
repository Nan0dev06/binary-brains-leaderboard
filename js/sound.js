// Arcade sound effects. Each event plays CC0 retro samples from assets/sounds
// (Juhani Junkala's 512-sound collection) and falls back to a synthesized chiptune
// version if a file can't play. Everything is local, so it works offline.
// Browsers only allow sound after a click or key press on the page, so the first
// interaction "unlocks" audio.
(function () {
  let ctx = null;
  let master = null;
  let muted = false;
  let announced = false;
  const unlockListeners = [];

  const isUnlocked = () => !!ctx && ctx.state === 'running';
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);

  function unlock() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.2;
      master.connect(ctx.destination);
    }
    ctx.resume().then(() => {
      if (announced || !isUnlocked()) return;
      announced = true;
      unlockListeners.forEach(fn => fn());
    });
  }
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, unlock, { passive: true }));

  // One note with a fast attack and exponential decay; optional pitch slide.
  function tone(type, freq, at, dur, vol = 0.5, slideTo) {
    if (!isUnlocked() || muted) return;
    const t = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // Short burst of filtered noise, used for the "whoosh" when lanes swap.
  function whoosh(at, dur, vol, from, to) {
    if (!isUnlocked() || muted) return;
    const t = ctx.currentTime + at;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    src.buffer = buffer;
    filter.type = 'bandpass';
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t);
  }

  function seq(notes, step, type = 'square', vol = 0.4, len = 0.9) {
    notes.forEach((n, i) => { if (n) tone(type, midi(n), i * step, step * len * 1.6, vol); });
  }

  const SYNTH = {
    // a point is scored: two-note coin chime
    point() { tone('square', midi(83), 0, 0.07, 0.4); tone('square', midi(88), 0.07, 0.3, 0.4); },
    // every 10 points: quick rising run
    milestone() { seq([76, 79, 83, 88, 91], 0.055, 'square', 0.35); },
    // a point is removed: falling blip
    minus() { tone('square', 520, 0, 0.18, 0.35, 160); },
    // undo: rewind sweep
    undo() { tone('triangle', 1100, 0, 0.22, 0.55, 260); tone('square', 260, 0.06, 0.08, 0.15); },
    // a booth climbs a rank (not the lead)
    rank() { whoosh(0, 0.28, 0.5, 400, 3000); tone('square', midi(72), 0.05, 0.1, 0.25, midi(79)); },
    // new leader: short fanfare
    lead() {
      seq([67, 72, 76, 79, 0, 84], 0.085, 'square', 0.38);
      tone('triangle', midi(48), 0, 0.55, 0.5);
      tone('triangle', midi(55), 0.34, 0.5, 0.45);
    },
    // goal reached: longer victory jingle
    goal() {
      seq([72, 76, 79, 84, 79, 84, 88, 0, 91, 91, 96], 0.09, 'square', 0.36);
      [48, 55, 60, 64].forEach((n, i) => tone('triangle', midi(n), i * 0.22, 0.5, 0.45));
      tone('triangle', midi(60), 0.9, 0.8, 0.45);
    },
    // tie for first: alternating alarm
    tie() { [0, 1, 2].forEach(i => { tone('square', 660, i * 0.17, 0.08, 0.3); tone('square', 880, i * 0.17 + 0.085, 0.08, 0.3); }); },
    // reset: power-down
    reset() { tone('sawtooth', 900, 0, 0.7, 0.3, 45); tone('square', 450, 0, 0.7, 0.12, 30); },
    // goal changed / settings confirmations
    confirm() { tone('square', midi(79), 0, 0.06, 0.3); tone('square', midi(84), 0.06, 0.12, 0.3); },
    // button press on the control panel
    click() { tone('square', 1500, 0, 0.035, 0.18); },
    // sound just got switched on
    start() { seq([84, 91], 0.07, 'square', 0.35); },
  };

  // Event -> samples as [file in assets/sounds, delay in seconds]. Swap names here to change a sound.
  const SAMPLES = {
    point: [['sfx_coin_double1', 0]],
    milestone: [['sfx_sounds_powerup2', 0]],
    minus: [['sfx_sounds_damage1', 0]],
    undo: [['sfx_sounds_negative2', 0]],
    rank: [['sfx_movement_portal5', 0]],
    lead: [['sfx_sounds_fanfare1', 0], ['sfx_coin_cluster3', 0.35]],
    goal: [['sfx_sounds_fanfare1', 0], ['sfx_sounds_fanfare3', 0.55], ['sfx_coin_cluster8', 0.85]],
    tie: [['sfx_alarm_loop5', 0]],
    reset: [['sfx_sounds_falling4', 0]],
    confirm: [['sfx_menu_select1', 0]],
    click: [['sfx_menu_move1', 0]],
    start: [['sfx_sounds_powerup5', 0]],
  };
  const VOLUME = { click: 0.5 };

  // <audio> elements (not fetch) so the files also load when index.html is opened by double-click.
  const cache = {};
  function sample(file) {
    if (!cache[file]) {
      cache[file] = new Audio(`assets/sounds/${file}.wav`);
      cache[file].preload = 'auto';
    }
    return cache[file];
  }
  Object.values(SAMPLES).forEach(steps => steps.forEach(([file]) => sample(file)));

  function play(name) {
    if (!isUnlocked() || muted) return;
    let failed = false;
    SAMPLES[name].forEach(([file, delay]) => setTimeout(() => {
      if (failed) return;
      const a = sample(file).cloneNode(); // clone so rapid repeats overlap instead of cutting off
      a.volume = VOLUME[name] || 0.85;
      a.play().catch(() => {
        if (failed) return;
        failed = true;
        SYNTH[name]();
      });
    }, delay * 1000));
  }

  const SFX = {};
  Object.keys(SYNTH).forEach(name => { SFX[name] = () => play(name); });

  window.SFX = {
    ...SFX,
    unlock,
    isUnlocked,
    onUnlock: fn => unlockListeners.push(fn),
    setMuted: m => { muted = !!m; },
    isMuted: () => muted,
  };
})();
