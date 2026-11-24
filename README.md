# Sokonova

Sokonova is a challenging grid-based puzzle game inspired by Sokoban: push every crate onto its target while navigating pressure plates, teleporters, multi-room layouts, boss milestones, and time limits.

## How to play

### Online
Play directly in your browser at **[https://vaillant86.github.io/Sokonova](https://vaillant86.github.io/Sokonova)**.

### Locally
Open `index.html` in any modern browser (an internet connection is required to load Tailwind CSS via CDN).

Controls adapt automatically to your device:

- **Desktop:** `arrow keys` or `WASD` to move, `Z` or `Backspace` to undo a move, `R` to restart the current level.
- **Mobile & Touch:** swipe anywhere on the screen, with on-screen HUD buttons for undo and restart.

## Features

- **Boss levels:** every 20th level features dedicated visual styling, a higher difficulty spike, and the undo button disabled.
- **Checkpoint codes:** every ten levels from level 11 onwards, you receive a 5-letter code. Enter it in the bottom-left input on the start screen to resume from that milestone.
- **Multilingual support:** switch on the fly between five languages (`English`, `Italiano`, `Español`, `Français`, and `Deutsch`) via the flag toggle.
- **Pressure plates & doors:** step onto a pressure plate or park a crate on it to hold linked doors open.
- **Procedural sound effects:** synthesized web audio feedback for movement, crate placement, teleportation, undo, countdown ticks, and level completion, toggleable at any time.
- **Teleporters & linked rooms:** step onto teleporter tiles to warp across split chambers or cross perimeter portals to travel between connected rooms.
- **Time limits:** untimed for levels 1–10 (tutorials and warm-up); from level 11 onwards a countdown starts on your first move.
- **Undo system:** rewind up to 3 moves per level.
- **Visual themes:** switch anytime between 4 distinct themes (`Classic`, `Sci-Fi`, `Arcade`, and `Monument`).

## Structure

| Path | Contents |
| --- | --- |
| `index.html` | Page structure and HUD layout |
| `style.css` | Styling, themes, and animations |
| `game.js` | Game engine, input handling, and web audio synthesizer |
| `levels.js` | Level definitions, optimal push counts, difficulty scores, and checkpoint codes |
| `locales/` | Translation dictionaries (`en`, `it`, `es`, `fr`, `de`) |

## Levels & versioning

- **Level progression:** Levels are arranged along a progressive sawtooth difficulty curve, where every 20th level acts as the toughest finale of its block. Level order may shift between updates as new stages are generated and rebalanced.
- **Star rating system:** Every level tracks an optimal push count (`minPushes`). Clear a stage to earn 1 to 3 stars based on your efficiency; your best ratings are saved automatically in local storage.
- **Versioning:** Release numbers reflect the total count of playable levels (e.g., `v1.0.0` = 100 levels, `v1.2.0` = 120 levels).