// byte-art.mjs — generates Byte's layered pixel-art SVG from a design (proportions + colours).
// Shared by designer.html (live preview in the browser) and build.mjs (writes byte.svg + byte-mascot.js).
//
// Everything sits on a pixel grid (1 px = 10 SVG units), mirrored across x = 180. Feet always stand
// on row 37, so stretching grows Byte upward. Outlines are generated, which lets horns, legs and arms
// move on their own while their joints stay hidden inside the body.

export const DEFAULT_DESIGN = {
  hornHeight: 12,  // rows from the horn tips down to the head
  hornWidth: 7,    // pixels across a horn
  hornLean: 6,     // how far the tips lean outward (0 = upright)
  headWidth: 26,   // body width in pixels
  bodyHeight: 19,  // rows from the top of the head to the hips
  flare: 2,        // how much wider the hips are than the head, per side
  legLength: 6,    // rows of leg below the hips
  colors: { body: '#56B776', outline: '#031B0E', phones: '#26302C', lights: '#A6FFC4' },
};

export const LIMITS = {  // [min, max, step]
  hornHeight: [6, 16, 1], hornWidth: [5, 9, 1], hornLean: [0, 8, 1], headWidth: [22, 32, 2],
  bodyHeight: [16, 24, 1], flare: [0, 3, 1], legLength: [4, 8, 1],
};

const C = 10, W = 36, GROUND = 37, MID = 180;

/** Clamp a (possibly hand-edited or posted) design to safe values; unknown keys are dropped. */
export function normalize(input = {}) {
  const out = { colors: {} };
  for (const [k, [lo, hi, step]] of Object.entries(LIMITS)) {
    const v = Number(input[k]);
    out[k] = Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v / step) * step)) : DEFAULT_DESIGN[k];
  }
  out.hornWidth = Math.min(out.hornWidth, out.headWidth / 2 - 4);  // keep a gap between the horns
  for (const [k, fallback] of Object.entries(DEFAULT_DESIGN.colors)) {
    const v = input.colors?.[k];
    out.colors[k] = /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : fallback;
  }
  return out;
}

// ---------------------------------------------------------------- pixel helpers
const key = (c, r) => `${c},${r}`;
const cell = k => k.split(',').map(Number);
const fill = (set, a, b, r) => { for (let c = a; c <= b; c++) set.add(key(c, r)); return set; };
const remap = (set, f) => new Set([...set].map(k => key(...f(...cell(k)))));
const mirror = set => remap(set, (c, r) => [W - 1 - c, r]);
const shift = (set, dc, dr) => remap(set, (c, r) => [c + dc, r + dr]);
const union = (...sets) => new Set(sets.flatMap(s => [...s]));
const sym = set => union(set, mirror(set));
const topEdge = set => new Set([...set].filter(k => { const [c, r] = cell(k); return !set.has(key(c, r - 1)); }));

/** Cells plus their 4-neighbours, painted dark underneath a shape to outline it. */
function ring(set) {
  const out = new Set(set);
  for (const k of set) {
    const [c, r] = cell(k);
    out.add(key(c + 1, r)).add(key(c - 1, r)).add(key(c, r + 1)).add(key(c, r - 1));
  }
  return out;
}

/** Bresenham line between two cells. */
function line(c0, r0, c1, r1) {
  const out = [], dc = Math.abs(c1 - c0), dr = -Math.abs(r1 - r0), sc = c0 < c1 ? 1 : -1, sr = r0 < r1 ? 1 : -1;
  for (let err = dc + dr; ;) {
    out.push(key(c0, r0));
    if (c0 === c1 && r0 === r1) return out;
    const e2 = 2 * err;
    if (e2 >= dr) { err += dr; c0 += sc; }
    if (e2 <= dc) { err += dc; r0 += sr; }
  }
}

/** Pixel cells -> compact path data (row runs, stacked into rectangles). */
function pathD(set) {
  const rows = new Map();
  for (const k of set) {
    const [c, r] = cell(k);
    if (!rows.has(r)) rows.set(r, []);
    rows.get(r).push(c);
  }
  const order = [...rows.keys()].sort((a, b) => a - b), rects = [], open = new Map();
  for (let r = order[0]; r <= order.at(-1) + 1; r++) {
    const cols = (rows.get(r) || []).sort((a, b) => a - b), cur = new Set();
    for (let i = 0; i < cols.length; i++) {
      let j = i;
      while (cols[j + 1] === cols[j] + 1) j++;
      cur.add(`${cols[i]},${cols[j]}`);
      i = j;
    }
    for (const [run, r0] of open) if (!cur.has(run)) { rects.push([run, r0, r]); open.delete(run); }
    for (const run of cur) if (!open.has(run)) open.set(run, r);
  }
  return rects.map(([run, r0, r1]) => {
    const [a, b] = run.split(',').map(Number), w = (b - a + 1) * C;
    return `M${a * C} ${r0 * C}h${w}v${(r1 - r0) * C}h${-w}z`;
  }).join('');
}

const P = (set, color, cls = '') => set.size ? `<path${cls ? ` class="${cls}"` : ''} fill="${color}" d="${pathD(set)}"/>` : '';
const hidden = flag => flag ? ' display="none"' : '';

// ---------------------------------------------------------------- colours
function hsl(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return [0, 0, l];
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, d / (1 - Math.abs(2 * l - 1)), l];
}

function hex(h, s, l) {
  const a = s * Math.min(l, 1 - l), k = n => (n + h / 30) % 12;
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

const clamp01 = v => Math.max(0, Math.min(1, v));
const tone = (color, ds, dl) => { const [h, s, l] = hsl(color); return hex(h, clamp01(s + ds), clamp01(l + dl)); };

function palette(c) {  // highlights and shadows are derived from the four chosen colours
  return {
    out: c.outline, base: c.body, light: tone(c.body, .19, .19), shade: tone(c.body, .05, -.13), deep: tone(c.body, .17, -.26),
    phone: c.phones, phone2: tone(c.phones, 0, .14), led: c.lights,
    glint: '#F1FFF5', tongue: '#FF7F9C', blush: '#FF8FAB', lid: '#5E7068', lid2: '#7D918A',
    star: '#FFD447', heart: '#FF4F7B', tear: '#7FDBFF', cloud: '#B4C2BA', flame: '#FF7A1A', bubble: '#D9FFE6',
  };
}

// ---------------------------------------------------------------- small pixel drawings
const KEY = { o: 'out', G: 'base', W: 'glint', Y: 'star', P: 'heart', M: 'led', K: 'phone',
              B: 'tear', C: 'cloud', O: 'flame', A: 'bubble', D: 'deep', T: 'tongue' };

const ART = {
  note: `.MMMMM
         .M...M
         .M...M
         MM..MM
         MM..MM`,
  zed: `WWWW
        ..W.
        .W..
        WWWW`,
  heart: `.PP.PP.
          PWPPPPP
          PPPPPPP
          .PPPPP.
          ..PPP..
          ...P...`,
  spark: `..Y..
          ..Y..
          YYWYY
          ..Y..
          ..Y..`,
  star: `..Y..
         .YYY.
         YYYYY
         .YYY.
         .Y.Y.`,
  bang: `YYY
         YYY
         YYY
         YYY
         .Y.
         ...
         YYY`,
  tear: `.B.
         BBB
         WBB
         .B.`,
  cloud: `...CCC...
          .CCCCCCC.
          CCCCCCCCC
          .CCCCCCC.`,
  drop: `B
         B`,
  flame: `..O..
          ..OO.
          .OOO.
          .OYO.
          OOYOO
          OYYYO
          .OYO.`,
  dot2: `WW
         WW`,
  dot3: `WWW
         WWW
         WWW`,
  bubble: `.AAA.
           AW..A
           A...A
           A...A
           .AAA.`,
  zero: `MMM
         M.M
         M.M
         M.M
         MMM`,
  one: `.M.
        MM.
        .M.
        .M.
        MMM`,
  bulb: `.MM.
         MMMM
         MMMM
         .MM.
         .KK.`,
};

// Left eye (the right eye is mirrored, but keeps its shine on the top-left). Row 0 = top of the eye.
const EYES = {
  normal: [`.oooo.
            oWWooo
            oWoooo
            oooooo
            oooooo
            oooooo
            .oooo.`, false],
  happy: [`......
           .oooo.
           oo..oo
           o....o`, false],
  closed: [`......
            ......
            ......
            o....o
            oo..oo
            .oooo.`, false],
  sad: [`......
         ...ooo
         .ooooo
         oWWooo
         oWoooo
         oooooo
         .oooo.`, false],
  angry: [`......
           ooo...
           ooooo.
           oWWooo
           oooooo
           oooooo
           .oooo.`, false],
  spiral: [`oooooo
            .....o
            .ooo.o
            .o.o.o
            .o...o
            .ooooo`, false],
  star: [`..YY..
          ..YY..
          YYYYYY
          .YYYY.
          .YYYY.
          YY..YY`, true],
  heart: [`.......
           .PP.PP.
           PWPPPPP
           PPPPPPP
           .PPPPP.
           ..PPP..
           ...P...`, true],
};

// Mouths are centred on the face. Row 0 sits just under the eyes.
const MOUTHS = {
  smile: `oooooo
          oDDDDo
          .oooo.`,
  grin: `oooooooo
         oDDDDDDo
         oDDTTDDo
         .oTTTTo.
         ..oooo..`,
  o: `.oooo.
      oDDDDo
      oDDDDo
      .oooo.`,
  small: `......
          ..oo..
          .oDDo.
          ..oo..`,
  flat: `......
         .oooo.`,
  frown: `......
          .oooo.
          o....o`,
  wavy: `......
         .o..o.
         o.oo.o`,
};

function parse(art) {
  const layers = new Map(), lines = art.trim().split('\n').map(l => l.trim());
  lines.forEach((ln, r) => [...ln].forEach((ch, c) => {
    if (ch === '.') return;
    if (!layers.has(ch)) layers.set(ch, new Set());
    layers.get(ch).add(key(c, r));
  }));
  return { layers, width: lines[0].length };
}

function paint(layers, pal, outline) {
  let s = outline ? P(ring(union(...layers.values())), pal.out) : '';
  for (const [ch, set] of layers) s += P(set, pal[KEY[ch]]);
  return s;
}

const sprite = (name, pal, outline = true) => paint(parse(ART[name]).layers, pal, outline);

function fx(name, x, y, cls, pal, style = '', outline = true) {
  return `<g transform="translate(${x} ${y})"><g class="fxi ${cls}"${style ? ` style="${style}"` : ''}>${sprite(name, pal, outline)}</g></g>`;
}

const group = (name, items) => `<g class="fx fx-${name}" display="none">${items}</g>`;

function rng(seed) {  // mulberry32, so the confetti is the same on every build
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- Byte
function geometry(d) {
  const bL = W / 2 - d.headWidth / 2;                   // leftmost body column
  const bodyBottom = GROUND - d.legLength;              // last row of the hips
  const headTop = bodyBottom - d.bodyHeight + 1;
  const eyeTop = headTop + Math.round((d.bodyHeight - 7) / 2);
  const armTop = Math.min(eyeTop + 7, bodyBottom - 4);
  return {
    bL, bodyBottom, headTop, eyeTop, armTop,
    tipRow: headTop - d.hornHeight,
    eyeOuter: 8 - Math.round((d.headWidth / 2 - 13) / 2),  // eyes spread a little on wider heads
    cupTop: Math.min(eyeTop - 4, armTop - 11),              // keep raised arms clear of the cups on short bodies
    lidTop: eyeTop + 11,
  };
}

function hornShape(d, g) {
  const baseOuter = g.bL + 2, tipOuter = baseOuter - d.hornLean, tipInner = tipOuter + d.hornWidth - 1;
  const baseInner = tipInner + d.hornLean + 1;
  const slant = Math.min(d.hornHeight - 1, d.hornLean + 2);  // lower rows slide inward toward the head
  const set = new Set(), inner = {};
  for (let i = 0; i < d.hornHeight; i++) {
    const k = Math.max(0, i - (d.hornHeight - 1 - slant)), r = g.tipRow + i;
    inner[r] = tipInner + Math.round((d.hornLean + 1) * k / slant);
    fill(set, tipOuter + Math.round(d.hornLean * k / slant), inner[r], r);
  }
  fill(set, baseOuter, baseInner, g.headTop);             // tucked under the head so the joint never shows
  fill(set, baseOuter, baseInner - 1, g.headTop + 1);
  return { set, inner, tipOuter, baseOuter, baseInner };
}

function bodyShape(d, g) {
  const body = new Set(), legOut = g.bL + 4;
  const legIn = Math.min(15, legOut + 4 + Math.max(0, Math.round((d.headWidth / 2 - 13) / 2)));
  fill(body, g.bL + 1, 17, g.headTop);                    // rounded shoulders
  for (let r = g.headTop + 1; r <= g.bodyBottom - 2; r++) fill(body, g.bL, 17, r);
  for (let r = g.bodyBottom - 1; r <= g.bodyBottom; r++) fill(body, g.bL - d.flare, 17, r);
  fill(body, legIn + 1, 17, g.bodyBottom + 1);            // belly over the gap between the legs
  for (let r = g.bodyBottom + 1; r <= g.bodyBottom + d.legLength - 2; r++) fill(body, g.bL - d.flare, g.bL + 1, r);  // outer feet
  const leg = new Set();
  for (let r = g.bodyBottom - 2; r <= GROUND; r++) fill(leg, legOut, legIn, r);   // top rows tuck under the body
  const arm = new Set();                                  // tucked 7px inside the body until a reaction
  fill(arm, g.bL - 5, g.bL + 4, g.armTop);
  fill(arm, g.bL - 6, g.bL + 4, g.armTop + 1);
  fill(arm, g.bL - 5, g.bL + 4, g.armTop + 2);
  return { body: sym(body), leg, arm, feetOuter: g.bL - d.flare };
}

function bandShape(g, horn) {  // a 1px band that arcs over the head behind the horns, down to the cups
  const set = new Set(), archRow = Math.max(g.headTop - 7, g.tipRow + 2), dip = horn.inner[archRow + 1];
  fill(set, Math.min(horn.inner[archRow] + 4, 16), 17, archRow);
  fill(set, dip, dip + 2, archRow + 1);
  for (const k of line(dip, archRow + 1, g.bL - 1, g.headTop - 2)) set.add(k);  // runs behind the horn
  for (let r = g.headTop - 2; r < g.cupTop; r++) set.add(key(g.bL - 1, r));
  return { set: sym(set), led: sym(fill(new Set(), 16, 17, archRow)) };
}

function cupShape(g) {
  const a = g.bL - 3, b = g.bL, t = g.cupTop;
  const set = fill(new Set(), a + 1, b, t), hi = fill(new Set(), a + 1, b, t), led = new Set();
  for (let r = t + 1; r <= t + 6; r++) { fill(set, a, b, r); hi.add(key(a + 1, r)); led.add(key(a, r)); }
  fill(set, a + 1, b, t + 7);
  return { set, hi, led };
}

function shading(set, solid) {  // light on top/left edges, shade on bottom/right edges
  const light = new Set(), shade = new Set();
  for (const k of set) {
    const [c, r] = cell(k);
    if (!solid.has(key(c, r + 1))) shade.add(k);
    else if (!solid.has(key(c, r - 1)) || !solid.has(key(c - 1, r))) light.add(k);
    else if (!solid.has(key(c + 1, r))) shade.add(k);
  }
  return { light, shade };
}

function eyeMarkup(side, g, pal) {
  let out = '';
  for (const [name, [art, outline]] of Object.entries(EYES)) {
    const { layers, width } = parse(art);
    const shine = layers.get('W') || new Set(), host = [...layers.keys()].find(ch => ch !== 'W');
    const placed = new Map([...layers].map(([ch, set]) => {
      const moved = shift(set, g.eyeOuter, g.eyeTop);
      if (side === 'L') return [ch, moved];
      if (ch === 'W') return [ch, shift(moved, W - width - 2 * g.eyeOuter, 0)];
      // fill the hole left for the shine before mirroring, or it would show on the wrong corner
      return [ch, mirror(ch === host ? union(moved, shift(shine, g.eyeOuter, g.eyeTop)) : moved)];
    }));
    let body = paint(placed, pal, outline);
    if (name === 'spiral') body = `<g class="spin">${body}</g>`;
    if (name === 'heart') body = `<g transform="translate(${side === 'L' ? -5 : 5} 0)">${body}</g>`;  // 7px wide: re-centre
    out += `<g class="ev ev-${name}"${hidden(name !== 'normal')}>${body}</g>`;
  }
  return `<g class="eye eye${side}"><g class="blinker">${out}</g></g>`;
}

function mouthMarkup(g, pal) {
  return Object.entries(MOUTHS).map(([name, art]) => {
    const { layers, width } = parse(art);
    const placed = new Map([...layers].map(([ch, set]) => [ch, shift(set, W / 2 - width / 2, g.eyeTop + 7)]));
    return `<g class="mv mv-${name}"${hidden(name !== 'smile')}>${paint(placed, pal, false)}</g>`;
  }).join('');
}

/**
 * Build Byte's SVG layers for a design.
 * Returns { markup, viewBox, css, eyeAt, bounds }: `css` holds the animation pivots for these
 * proportions, `eyeAt` is where the eyes sit inside viewBox (fractions), `bounds` is a tight box.
 */
export function buildByte(input, { still = false } = {}) {
  const d = normalize(input), pal = palette(d.colors), g = geometry(d);
  const horn = hornShape(d, g), { body, leg, arm, feetOuter } = bodyShape(d, g);
  const band = bandShape(g, horn), cup = cupShape(g);
  const solid = union(horn.set, mirror(horn.set), body, leg, mirror(leg), arm, mirror(arm));

  // outlines all go first, then fills with the body last, so joints never show a seam
  const parts = [
    [horn.set, 'p-hornL', ''], [mirror(horn.set), 'p-hornR', ''],
    [leg, 'p-legL', ''], [mirror(leg), 'p-legR', ''],
    [arm, 'p-armL', ' transform="translate(70 0)"'], [mirror(arm), 'p-armR', ' transform="translate(-70 0)"'],
    [body, 'p-body', ''],
  ];
  const outlines = parts.map(([set, cls, tf]) => `<path class="${cls}"${tf} fill="${pal.out}" d="${pathD(ring(set))}"/>`).join('');
  const fills = parts.map(([set, cls, tf]) => {
    const { light, shade } = shading(set, solid);
    return `<g class="${cls}"${tf}>${P(set, pal.base)}${P(light, pal.light)}${P(shade, pal.shade)}</g>`;
  }).join('');
  const blush = fill(fill(new Set(), g.eyeOuter - 2, g.eyeOuter, g.eyeTop + 7), g.eyeOuter - 2, g.eyeOuter, g.eyeTop + 8);
  const face = `<g class="look">${eyeMarkup('L', g, pal)}${eyeMarkup('R', g, pal)}</g><g class="mlook">${mouthMarkup(g, pal)}</g>`
    + `<g class="blush" display="none">${P(sym(blush), pal.blush)}</g>`;
  const cups = [[cup, 'cupL', s => s], [cup, 'cupR', mirror]].map(([c, cls, f]) =>
    `<g class="${cls}">${P(ring(f(c.set)), pal.out)}${P(f(c.set), pal.phone)}${P(f(c.hi), pal.phone2)}${P(f(c.led), pal.led, 'led')}</g>`).join('');
  const character = `<g class="band">${P(ring(band.set), pal.out)}${P(band.set, pal.phone2)}${P(band.led, pal.led, 'led')}</g>`
    + `<g class="outlines">${outlines}</g><g class="fills">${fills}</g><g class="face">${face}</g><g class="cups">${cups}</g>`;

  // anchors (SVG units) that effects and pivots hang off
  const headY = g.headTop * C, tipY = g.tipRow * C, edgeX = g.bL * C, eyeX = g.eyeOuter * C + 30, eyeY = g.eyeTop * C + 32;
  const right = (x, w) => 2 * MID - x - w;  // mirror an effect of width w to the other side

  // laptop: lid seen from behind, little mitts typing on the keyboard edge, code flying out
  const lid = new Set(), mitt = new Set();
  for (let r = g.lidTop; r <= GROUND; r++) fill(lid, g.bL + 2, W - 3 - g.bL, r);
  for (let r = g.lidTop - 3; r <= g.lidTop + 1; r++) fill(mitt, g.bL + 1, g.bL + 3, r);
  const deck = fill(new Set(), g.bL - 1, W - g.bL, GROUND + 1);
  const bulb = parse(ART.bulb).layers, bulbAt = s => shift(s, W / 2 - 2, g.lidTop + 2);
  const bulbAll = bulbAt(union(...bulb.values()));
  const lidX = (g.bL + 2) * C, glyphY = g.lidTop * C - 30;
  const glyphs = [['zero', lidX + 20, -130, 0], ['one', lidX + 55, -90, -.65], ['one', right(lidX + 55, 30), 90, -1.3], ['zero', right(lidX + 20, 30), 130, -1.95]]
    .map(([n, x, dx, delay]) => fx(n, x, glyphY, 'glyph', pal, `--dx:${dx}px;animation-delay:${delay}s`)).join('');
  const mitts = [[mitt, 'mittL'], [mirror(mitt), 'mittR']]
    .map(([m, cls]) => `<g class="mitt ${cls}">${P(ring(m), pal.out)}${P(m, pal.base)}${P(topEdge(m), pal.light)}</g>`).join('');
  const laptop = `<g class="laptop"${hidden(still)}>`
    + `<ellipse class="screen-glow" cx="${MID}" cy="${g.lidTop * C + 18}" rx="${(16 - g.bL) * C + 30}" ry="48" fill="url(#byte-glow)"/>`
    + `<g class="mitts">${mitts}</g><g class="glyphs">${glyphs}</g>`
    + P(ring(union(lid, deck)), pal.out) + P(lid, pal.lid) + P(fill(new Set(), g.bL + 2, W - 3 - g.bL, g.lidTop), pal.lid2) + P(deck, pal.phone)
    + P(ring(bulbAll), pal.out) + P(bulbAt(bulb.get('M')), pal.led, 'bulb') + P(bulbAt(bulb.get('K')), pal.phone) + '</g>';

  const flames = [[horn.tipOuter * C - 20, tipY - 55, 1.5, 0], [right(horn.tipOuter * C - 20, 50), tipY - 55, 1.5, -.15],
    [155, headY - 100, 1.3, -.08], [edgeX - 100, headY - 20, 1.8, -.2], [right(edgeX - 100, 50), headY - 20, 1.8, -.05],
    [edgeX - 90, eyeY + 27, 1.6, -.12], [right(edgeX - 90, 50), eyeY + 27, 1.6, -.25]]
    .map(([x, y, s, delay]) => fx('flame', x, y, 'flame', pal, `--s:${s};animation-delay:${delay}s`)).join('');

  const rand = rng(7), colors = [pal.led, pal.star, pal.heart, pal.glint, pal.tear, pal.base];
  let confetti = '';
  for (let i = 0; i < 28; i++) {
    const angle = (-170 + rand() * 160) * Math.PI / 180, dist = 120 + rand() * 130;
    const spinDeg = (rand() < .5 ? -1 : 1) * Math.round(240 + rand() * 480);
    confetti += `<g transform="translate(173 ${headY - 20})"><rect class="fxi conf" width="14" height="22" fill="${colors[i % 6]}" `
      + `style="--dx:${Math.round(dist * Math.cos(angle))}px;--dy:${Math.round(dist * Math.sin(angle))}px;--r:${spinDeg}deg;animation-delay:${i < 15 ? 0 : .95}s"/></g>`;
  }

  const cupY = g.cupTop * C, cloudY = tipY - 105;
  const front = [
    group('notes', [[edgeX - 90, cupY - 20, -50, -20, 0], [right(edgeX - 90, 60), cupY - 30, 50, 20, -.6],
      [edgeX - 105, cupY + 20, -35, -10, -1.2], [right(edgeX - 105, 60), cupY + 15, 40, 14, -1.8]]
      .map(([x, y, dx, r, delay]) => fx('note', x, y, 'note', pal, `--dx:${dx}px;--r:${r}deg;animation-delay:${delay}s`)).join('')),
    group('zzz', [0, -1, -2].map(delay => fx('zed', right(edgeX, 0) - 35, headY - 75, 'zed', pal, `animation-delay:${delay}s`)).join('')),
    group('bubble', fx('bubble', 201, g.eyeTop * C + 73, 'bubble', pal, '', false)),
    group('hearts', [[edgeX - 85, headY + 10, -25, 0], [40, headY - 60, -10, -.45], [260, headY - 80, 15, -.9],
      [right(edgeX - 85, 70) + 10, headY + 20, 30, -1.35], [150, headY - 140, 5, -1.8]]
      .map(([x, y, dx, delay]) => fx('heart', x, y, 'heart', pal, `--dx:${dx}px;animation-delay:${delay}s`)).join('')),
    group('sparkle', [[edgeX - 110, headY - 100, 0], [right(edgeX - 110, 50) + 15, headY - 130, -.3], [edgeX - 125, eyeY + 17, -.55],
      [right(edgeX - 125, 50) + 10, eyeY + 7, -.15], [165, tipY - 95, -.7]]
      .map(([x, y, delay]) => fx('spark', x, y, 'sparkle', pal, `animation-delay:${delay}s`)).join('')),
    group('confetti', confetti),
    group('orbit', [0, -.4, -.8].map(delay => fx('star', 155, tipY - 50, 'orb', pal, `animation-delay:${delay}s`)).join('')),
    group('bang', fx('bang', right(horn.tipOuter * C, 0) - 50, tipY - 105, 'bang', pal)),
    group('tears', fx('tear', eyeX - 15, g.eyeTop * C + 66, 'tear', pal) + fx('tear', right(eyeX - 15, 30), g.eyeTop * C + 66, 'tear', pal, 'animation-delay:-.55s')),
    group('cloud', fx('cloud', 135, cloudY, 'cloud', pal)
      + [[150, .3], [180, .55], [205, .4]].map(([x, delay]) => fx('drop', x, cloudY + 47, 'drop', pal, `animation-delay:${delay}s`)).join('')),
    group('dots', fx('dot2', 250, tipY - 35, 'dot', pal, 'animation-delay:.2s') + fx('dot2', 280, tipY - 65, 'dot', pal, 'animation-delay:.55s')
      + fx('dot3', 310, tipY - 105, 'dot', pal, 'animation-delay:.9s')),
  ].join('');

  const defs = `<defs><radialGradient id="byte-glow"><stop offset="0" stop-color="${pal.led}" stop-opacity=".3"/>`
    + `<stop offset="1" stop-color="${pal.led}" stop-opacity="0"/></radialGradient></defs>`;
  const shadowRx = (18 - feetOuter) * C - 25;
  const markup = defs + group('flames', flames)
    + `<ellipse class="shadow" cx="${MID}" cy="393" rx="${shadowRx}" ry="9" fill="#000" opacity=".28"/>`
    + `<g class="rig"><g class="squash"><g class="tilt">${character}</g></g></g>` + laptop + front;

  const top = tipY - 120, height = 410 - top;
  const hornX = (horn.baseOuter + horn.baseInner + 1) * C / 2, armX = edgeX + 5, armY = (g.armTop + 1.5) * C;
  const css = `:host{aspect-ratio:500/${height}}
.rig,.squash,.shadow{transform-origin:${MID}px 392px}
.tilt{transform-origin:${MID}px ${(headY + 380) / 2}px}
.p-hornL{transform-origin:${hornX}px ${headY + 5}px}.p-hornR{transform-origin:${2 * MID - hornX}px ${headY + 5}px}
.p-armL{transform-origin:${armX}px ${armY}px}.p-armR{transform-origin:${2 * MID - armX}px ${armY}px}
.eyeL,.eyeL .blinker,.eyeL .ev{transform-origin:${eyeX}px ${eyeY}px}.eyeR,.eyeR .blinker,.eyeR .ev{transform-origin:${2 * MID - eyeX}px ${eyeY}px}
.eyeL .spin{transform-origin:${eyeX}px ${eyeY - 2}px}.eyeR .spin{transform-origin:${2 * MID - eyeX}px ${eyeY - 2}px}
.mv{transform-origin:${MID}px ${g.eyeTop * C + 88}px}`;

  const visible = union(horn.set, mirror(horn.set), body, leg, mirror(leg), cup.set, mirror(cup.set));  // arms are tucked away
  const cs = [...ring(visible)].map(cell);
  const minC = Math.min(...cs.map(([c]) => c)), maxC = Math.max(...cs.map(([c]) => c)), minR = Math.min(...cs.map(([, r]) => r));
  const bounds = [minC * C - 10, minR * C - 10, (maxC - minC + 1) * C + 20, 405 - (minR * C - 10)];

  return { markup, viewBox: `-70 ${top} 500 ${height}`, css, eyeAt: [.5, (eyeY - top) / height], bounds };
}

/** The standalone byte.svg: default pose, every other layer included but hidden. */
export function staticSvg(input) {
  const { markup, bounds: [x, y, w, h] } = buildByte(input, { still: true });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">`
    + `<title>Byte - Binary Brains mascot</title>${markup}</svg>\n`;
}
