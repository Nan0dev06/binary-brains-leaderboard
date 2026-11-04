// Byte commands from the staff panel to the projector display, on this laptop only.
// Sent like the scores: BroadcastChannel + a localStorage key, with a poll as a safety net
// for flaky file:// pages. Only the newest command is kept, and the Auto setting survives reloads.
(function () {
  const KEY = 'bb-byte-v1';
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(KEY) : null;
  const listeners = [];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }

  let lastId = read().id || 0;  // commands sent before this page opened are not replayed

  function deliver(cmd) {
    if (!cmd || !cmd.id || cmd.id <= lastId) return;
    lastId = cmd.id;
    listeners.forEach(fn => fn(cmd));
  }

  // type: 'react' {name} | 'state' {name} | 'say' {text} | 'auto' {on}
  function send(type, data) {
    const prev = read();
    const cmd = { ...data, type, id: Math.max(Date.now(), (prev.id || 0) + 1), auto: type === 'auto' ? !!data.on : !!prev.auto };
    lastId = cmd.id;
    try { localStorage.setItem(KEY, JSON.stringify(cmd)); } catch (e) { /* the channel still delivers */ }
    if (channel) channel.postMessage(cmd);
  }

  if (channel) channel.onmessage = e => deliver(e.data);
  window.addEventListener('storage', e => {
    if (e.key === KEY && e.newValue) {
      try { deliver(JSON.parse(e.newValue)); } catch (err) { /* ignore */ }
    }
  });
  setInterval(() => deliver(read()), 1000);

  window.ByteLink = {
    send,
    listen: fn => listeners.push(fn),
    auto: () => !!read().auto,
  };
})();
