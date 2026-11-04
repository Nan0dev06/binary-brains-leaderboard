# Product

## Register

product

## Users
- **Students walking the event floor.** They glance at a projector from several meters away, often in a bright room, for a few seconds at a time. They need to see who is winning and that their booth just scored.
- **Booth staff / the operator.** One person on the event laptop adds points when staff report a finished booth task. They are busy and talking to people, so the panel must be impossible to misclick and quick to correct.

## Product Purpose
A live, offline leaderboard for the Binary Brains (USAL Computer Science Club) booth event. Four booths (Computing, Cybersecurity, Data Science, General) compete; every finished challenge adds a point and the projector shows the race. Success: students feel the competition from across the room and want to go earn points, and the operator never loses or miscounts a score.

## Brand Personality
Arcade, competitive, clever. It should feel like a retro arcade scoreboard built by a CS club: pixel energy that matches Byte the mascot, grounded in the club's dark-green-and-binary logo. Big, punchy moments when someone scores or takes the lead, calm and readable in between.

## Anti-references
- Generic SaaS dashboards: rounded cards, gray body text, corporate charts.
- Over-the-top neon: glow on everything, which washes out on a projector.
- Cluttered screens: many effects and numbers fighting for attention.

## Design Principles
1. **Readable from the back of the room.** Rank, name and score win every size and contrast decision; secondary stats stay secondary.
2. **Celebrate the moment, then get out of the way.** Motion fires on scoring events and lead changes; idle state is quiet.
3. **One arcade language.** Pixel geometry (stepped corners, block segments, pixel type and icons) everywhere, so Byte, bars and UI look like one game.
4. **Never lose a point.** The operator panel favors clarity, undo and confirmation over flair.

## Accessibility & Inclusion
- Projected in a bright room: high contrast, large type, solid fills over thin lines or soft glows.
- Never rely on color alone: every booth is always labeled by name and icon.
- `prefers-reduced-motion` respected: effects reduce to instant state changes.
- Operator panel fully keyboard-operable with visible focus.
