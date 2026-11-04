# Binary Brains Booth Leaderboard

Live leaderboard for the Binary Brains (USAL Computer Science Club) booth event.
Four booths compete, staff add points as students finish booth challenges, and the projector shows the race.

Runs **100% offline**: plain HTML/CSS/JS, no internet, no install, no server.

| Booth | Color |
| --- | --- |
| Computing | blue |
| Cybersecurity | red |
| Data Science | green |
| General (non-CS students) | pink |

## Event-day setup

1. Copy this folder to the event laptop.
2. Double-click `index.html` (Chrome or Edge recommended).
3. Open **Projector display** and **Staff control panel**. Both must be in the same browser.
4. Plug in the projector, press `Win + P`, and choose **Extend**.
5. Drag the display window onto the projector and press `F` for fullscreen.
6. Keep the control panel on the laptop screen. Every click shows up on the projector instantly.

Scores are saved in the browser, so closing a tab or restarting the laptop keeps them.
Only **Reset all scores** in the control panel clears them (you have to type `RESET` to confirm).

### Only one screen (mirrored projector)?

Use the display page alone with the keyboard:

| Key | Action |
| --- | --- |
| `1` `2` `3` `4` | +1 point to Computing, Cyber, Data, General |
| `Shift` + `1`-`4` | -1 point (fix a mistake) |
| `U` or `Ctrl + Z` | Undo the last action |
| `F` | Toggle fullscreen |

The same number keys work in the control panel.

## What is on the projector

- Racing bars that fill toward the goal (default 50, change it in the control panel). Once a team passes the goal, the leader's bar is full and the others are relative to it.
- Rank, points, share of all points, distance behind 1st, and points left to the goal for every booth.
- Lanes slide to re-sort whenever someone overtakes.
- Animations: spring bars, count-up numbers, floating `+1`, pixel/binary particle bursts, a "10 PTS!" milestone every 10 points, a banner on lead changes, confetti when a booth hits the goal, binary rain in the background.
- **Byte**, the mascot, reacts: hops on every point, cheers in the leader's color, and comments in the speech bubble.

## Files

```
index.html      landing page with links to both views
display.html    projector view
control.html    staff control panel
byte.html       Byte mascot preview
js/store.js     scores, saving, tab sync, and all leaderboard math
js/display.js   projector rendering and effects
js/control.js   control panel
js/fx.js        canvas particles, confetti, binary rain
js/byte.js      Byte as a component SVG (body, headphones, eyes, mouth, sparkles)
css/            styles
```

## Development

Open the HTML files directly, or serve the folder if you prefer:

```bash
python -m http.server 8765
```
