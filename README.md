# Binary Brains Booth Leaderboard

Live leaderboard for the Binary Brains (USAL Computer Science Club) booth event, styled after the club logo.
Four booths race (Computing, Cybersecurity, Data Science, General), staff add points, and the projector shows it with animations, chiptune sounds and Byte the mascot.

Runs 100% offline: plain HTML/CSS/JS, no install, no internet.

## Run it

1. Double-click `index.html` (Chrome or Edge).
2. Open **Projector display** and **Staff control panel** in the same browser.
3. `Win + P` → **Extend**, drag the display onto the projector, press `F` for fullscreen.
4. Click the display once to turn on sound (`sounds.html` plays every sound for testing).

Scores are saved in the browser and survive restarts. Only **Reset all scores** (type `RESET`) clears them.

## Keys

`1`-`4` add a point · `Shift`+number remove one · `Ctrl+Z` undo · `M` mute · `F` fullscreen (display)

## Byte

Byte lives in `byte/`. The display loads `byte/byte-mascot.js`, a self-contained `<byte-mascot>` element that works offline. If that file is missing, the board still runs without him.

On the display he cheers on every point and glances at the lane that scored. He spins when a booth climbs a rank, catches fire every 10 points, celebrates a new leader, celebrates and dances when a booth reaches the goal, gasps at a tie, looks sad when a point is removed, and glitches on undo or reset. With no points for 90 s he opens his laptop; after 4 min he yawns and naps, and the next point wakes him.

- In the staff panel, **Open Byte controls** asks for a password (set as `BYTE_PASSWORD` in `js/control.js`). Inside you can play any mode or reaction on the projector, make him say something, or turn on **Auto** so he runs his own routine. Closing the section locks it again.
- `byte/index.html` shows every mode and reaction (double-click it).
- To change his proportions or colours, run `node byte/serve.mjs` and open http://localhost:8737/designer.html. **Save** rebuilds `byte/byte-mascot.js` and `byte/byte.svg`; reload the display to see him.
- Include the `byte/` folder when you zip a release.

## Credits

- Icons: [Lucide](https://lucide.dev) (ISC)
- Sounds: [The Essential Retro Video Game Sound Effects Collection](https://opengameart.org/content/512-sound-effects-8-bit-style) by Juhani Junkala (CC0), see `assets/sounds/LICENSE.txt`. Try them all on `sounds.html`.

## Design options

Two looks were made: **terminal** (this branch, recommended) and **pixel / arcade** (the `pixel-design` branch).
Side-by-side screenshots for feedback: `screenshots/Binary-Brains-design-options.pdf`.

## Screenshots

Coming soon.
