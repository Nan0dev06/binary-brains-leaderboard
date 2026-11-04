# Product

## Register

product

## Users
- **Students walking the event floor.** They glance at a projector from several meters away, often in a bright room, for a few seconds at a time. They need to see who is winning and that their booth just scored.
- **Booth staff / the operator.** One person on the event laptop adds points when staff report a finished booth task. They are busy and talking to people, so the panel must be impossible to misclick and quick to correct.

## Product Purpose
A live, offline leaderboard for the Binary Brains (USAL Computer Science Club) booth event. Four booths (Computing, Cybersecurity, Data Science, General) compete; every finished challenge adds a point and the projector shows the race. Success: students feel the competition from across the room and want to go earn points, and the operator never loses or miscounts a score.

## Brand Personality
Hacker terminal: techy, competitive, clever. It should feel like the club's logo come to life: near-black green, bright green, binary digits and glowing circuit energy, crisp and controlled. Big moments when someone scores or takes the lead, calm and readable in between. (A pixel/arcade direction was tried and rejected; it lives on the `pixel-design` branch.)

## Anti-references
- Generic SaaS dashboards: rounded cards, gray body text, corporate charts.
- Over-the-top neon: glow on everything, which washes out on a projector.
- Chunky pixel/arcade styling (tried and rejected by the club).
- Cluttered screens: many effects and numbers fighting for attention.

## Design Principles
1. **Readable from the back of the room.** Rank, name and score win every size and contrast decision; secondary stats stay secondary.
2. **Celebrate the moment, then get out of the way.** Motion fires on scoring events and lead changes; idle state is quiet.
3. **One terminal language.** Dark green surfaces, monospace accents, binary motifs and line icons everywhere, so it reads as the Binary Brains logo in motion.
4. **Never lose a point.** The operator panel favors clarity, undo and confirmation over flair.

## Accessibility & Inclusion
- Projected in a bright room: high contrast, large type, solid fills over thin lines or soft glows.
- Never rely on color alone: every booth is always labeled by name and icon.
- `prefers-reduced-motion` respected: effects reduce to instant state changes.
- Operator panel fully keyboard-operable with visible focus.
