// Byte, the Binary Brains mascot, drawn as an SVG built from named parts
// so each piece (body, headphones, eyes, mouth, sparkles) can be animated on its own.
// Usage: const byte = Byte.mount(element); byte.bop(); byte.cheer('#ff3b55'); byte.glitch();
(function () {
  const C = {
    outline: '#0a1440',
    body: '#2f7df6',
    light: '#6cc4ff',
    shade: '#1c5bd6',
    ink: '#0b1020',
    cup: '#1b2236',
    cupFace: '#2b3552',
    cyan: '#36d8ff',
    tongue: '#3d7bff',
  };

  // Stepped, pixel-art silhouette on a 22-unit grid, mirrored around x = 11.
  const BODY = [
    [1, 1], [5, 1], [5, 3], [6, 3], [6, 5], [7, 5], [7, 6], [15, 6], [15, 5], [16, 5], [16, 3], [17, 3], [17, 1],
    [21, 1], [21, 4], [20, 4], [20, 6], [19, 6], [19, 18], [20, 18], [20, 21], [18, 21], [18, 23], [15, 23],
    [15, 21], [13, 21], [13, 22], [9, 22], [9, 21], [7, 21], [7, 23], [4, 23], [4, 21], [2, 21], [2, 18],
    [3, 18], [3, 6], [2, 6], [2, 4], [1, 4],
  ].map(p => p.join(',')).join(' ');

  const MIRROR = 'matrix(-1 0 0 1 22 0)';

  function cup(side) {
    return `
      <g class="byte-cup byte-cup-${side}" ${side === 'right' ? `transform="${MIRROR}"` : ''}>
        <g class="byte-cup-inner">
          <rect x="-2.2" y="10.6" width="4.6" height="7" rx="1.3" fill="${C.cup}" stroke="${C.outline}" stroke-width=".5"/>
          <rect x="-1.5" y="11.4" width="1.5" height="5.4" rx=".6" fill="${C.cupFace}"/>
          <rect class="byte-cup-glow" x="-.9" y="11.2" width=".55" height="5.8" fill="${C.cyan}"/>
          <rect x="1.3" y="11.1" width="1" height="6.2" fill="#11172a"/>
          <rect x="-1.6" y="11.1" width="1.2" height=".5" fill="#56618a"/>
        </g>
      </g>`;
  }

  function bandSide(side) {
    return `
      <g ${side === 'right' ? `transform="${MIRROR}"` : ''}>
        <path d="M4.5 3.8 C 0 3.9 -1.3 7.5 -.6 11" fill="none" stroke="${C.outline}" stroke-width="1.5"/>
        <path d="M4.5 3.8 C 0 3.9 -1.3 7.5 -.6 11" fill="none" stroke="#2a3557" stroke-width=".8"/>
      </g>`;
  }

  function sparkles(side) {
    return `
      <g ${side === 'right' ? `transform="${MIRROR}"` : ''}>
        <rect x="-3.4" y="3.6" width="2.6" height=".9" rx=".2" transform="rotate(50 -2.1 4)" />
        <rect x="-4" y="7.2" width="2.4" height=".9" rx=".2" transform="rotate(18 -2.8 7.6)" />
      </g>`;
  }

  const MARKUP = `
<svg class="byte" viewBox="-5 -1 32 26" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Byte, the Binary Brains mascot">
  <g class="byte-sparkles" fill="${C.cyan}" stroke="${C.outline}" stroke-width=".3">
    ${sparkles('left')}${sparkles('right')}
  </g>
  <g class="byte-rig">
    <g class="byte-band-back">${bandSide('left')}${bandSide('right')}</g>

    <g class="byte-body" shape-rendering="crispEdges">
      <polygon points="${BODY}" fill="${C.body}" stroke="${C.outline}" stroke-width=".6" stroke-linejoin="miter"/>
      <rect x="1.5" y="1.5" width="3" height=".8" fill="${C.light}"/>
      <rect x="17.5" y="1.5" width="3" height=".8" fill="${C.light}"/>
      <rect x="1.5" y="2.3" width=".8" height="1.4" fill="${C.light}"/>
      <rect x="3.5" y="6.5" width=".8" height="11" fill="${C.light}"/>
      <rect x="4.6" y="7.2" width="1.1" height="1.1" fill="#9fdcff"/>
      <rect x="18.1" y="6.6" width=".6" height="11.6" fill="${C.shade}"/>
      <rect x="3.3" y="20.1" width="15.4" height=".6" fill="${C.shade}"/>
      <rect x="4.4" y="22.1" width="2.3" height=".6" fill="${C.shade}"/>
      <rect x="15.3" y="22.1" width="2.3" height=".6" fill="${C.shade}"/>
      <rect x="9.3" y="21.2" width="3.4" height=".5" fill="${C.shade}"/>
    </g>

    <g class="byte-band">
      <rect x="6.2" y="2.7" width="9.6" height="1.9" rx=".9" fill="${C.cup}" stroke="${C.outline}" stroke-width=".45"/>
      <rect class="byte-cup-glow" x="7.6" y="2.95" width="6.8" height=".45" rx=".2" fill="${C.cyan}"/>
    </g>

    ${cup('left')}${cup('right')}

    <g class="byte-face">
      <g class="byte-eyes-open" fill="${C.ink}" stroke="#1846c4" stroke-width=".2">
        <rect class="byte-eye" x="6.6" y="11.2" width="2.6" height="3.6" rx=".45"/>
        <rect class="byte-eye" x="12.8" y="11.2" width="2.6" height="3.6" rx=".45"/>
      </g>
      <g class="byte-eyes-happy" fill="none" stroke="${C.ink}" stroke-width=".95" stroke-linecap="square">
        <path d="M6.5 13.9 Q7.9 11.3 9.3 13.9"/>
        <path d="M12.7 13.9 Q14.1 11.3 15.5 13.9"/>
      </g>
      <g class="byte-mouth">
        <path d="M9.2 16.2 H12.8 V16.8 Q12.8 18.4 11 18.4 Q9.2 18.4 9.2 16.8 Z" fill="${C.ink}"/>
        <ellipse cx="11" cy="17.6" rx="1.1" ry=".5" fill="${C.tongue}"/>
      </g>
    </g>
  </g>
  <g class="byte-glitch" fill="${C.cyan}">
    <rect x="-4" y="7.8" width="3.4" height=".35"/>
    <rect x="19.5" y="12.2" width="4.2" height=".35"/>
    <rect x="-3" y="16.6" width="2.6" height=".3"/>
    <rect x="20.2" y="5" width="2.2" height=".3" fill="#2b5cff"/>
    <rect x="3" y="23.4" width="3.2" height=".3"/>
    <rect x="13" y="0" width="2.8" height=".3" fill="#2b5cff"/>
  </g>
</svg>`;

  function restart(el, cls, ms) {
    el.classList.remove(cls);
    void el.getBoundingClientRect(); // force reflow so the animation replays
    el.classList.add(cls);
    clearTimeout(el['_t_' + cls]);
    el['_t_' + cls] = setTimeout(() => el.classList.remove(cls), ms);
  }

  function mount(container) {
    container.innerHTML = MARKUP;
    const el = container.querySelector('.byte');

    // Idle blink every few seconds.
    (function blink() {
      setTimeout(() => {
        if (!el.classList.contains('is-happy')) restart(el, 'is-blinking', 180);
        blink();
      }, 2500 + Math.random() * 3000);
    })();

    return {
      el,
      // Small hop, used whenever any team scores.
      bop() { restart(el, 'is-bop', 450); },
      // Big celebration: happy eyes, jump, sparkles tinted in the given color.
      cheer(color, ms = 2600) {
        if (color) el.style.setProperty('--byte-cheer', color);
        restart(el, 'is-happy', ms);
        restart(el, 'is-cheer', ms);
      },
      glitch() { restart(el, 'is-glitch', 600); },
    };
  }

  window.Byte = { mount, markup: MARKUP };
})();
