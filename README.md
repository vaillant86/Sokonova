# Sokonova

Sokonova is a challenging puzzle game (inspired by Sokoban): push the boxes onto the targets, beware of tricks, boss milestones, and time limits.

## How to play

### Via web link
Open **[https://vaillant86.github.io/Sokonova](https://vaillant86.github.io/Sokonova)** directly in your browser.

### Local
Open `index.html` in your browser. Since Tailwind is loaded via CDN, an internet connection is required.

Controls adapt automatically to your device:

- **PC:** Arrow keys or `WASD` to move, `Z` or `Backspace` to undo a move, `R` to restart the current level.
- **Mobile:** Continuous swipe anywhere on the screen, with HUD buttons for undo and restart.

## Features

- **Time limits:** no limit for levels 1–10 (tutorials and warm-up); from level 11 onwards, a score-based timer starts on your first move.
- **Undo system:** rewind up to 3 moves per level via the HUD button or `Z` / `Backspace`.
- **Boss levels:** features dedicated visual styling, a higher difficulty spike, and undo button disabled.
- **Checkpoint codes:** every ten levels, from level 11 onwards, you receive a 5-letter code. Enter it in the bottom-left box on the start screen to pick up right where you left off.
- **Visual themes:** switch anytime between 4 themes (`Classic`, `Sci-Fi`, `Arcade`, and `Monument`).
- **Multilingual support:** switch between five languages via the top-right flag toggle.
- **Procedural sound effects:** synthesized web audio feedback for movement, crate placement, undo, countdown ticks, and level completion, toggleable at any time.

## Structure

| File | Contents |
| --- | --- |
| `index.html` | Page structure and HUD layout |
| `style.css` | Styling, themes, and animations |
| `game.js` | Game engine, input handling, and Web Audio synthesizer |
| `levels.js` | Level definitions, difficulty scores, and checkpoint codes |
| `locales` | Languages dictionary folder |

## Levels & versioning

- **Level Order:** Levels are organized into 10-level thematic blocks (`parking`, `traffic`, `endurance`) following a progressive boss-peak curve, where every 10th level acts as the toughest finale of its block. Level order may shift between updates as new levels are generated.
- **Versioning:** Release numbers match the total count of playable levels (e.g., `v1.0.0` = 100 levels).
