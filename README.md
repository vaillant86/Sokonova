# Sokonova

Sokoban-style puzzle game: push the boxes onto the targets, featuring levels of increasing difficulty.

## How to play

Open `index.html` in your browser. Since Tailwind is loaded via CDN, an internet connection is required.

Controls adapt automatically to your device:

- **PC:** Arrow keys or WASD.
- **Mobile:** Swipe anywhere on the screen.

## Features

- **Time limits:** no limit for levels 1–10; from level 11 onwards, the time limit increases progressively with difficulty.
- **Checkpoint codes:** every ten levels (from level 11 onwards), you receive a 5-letter code. Enter it on the start screen to pick up right where you left off.

## Structure

| File | Contents |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Styling |
| `game.js` | Game engine |
| `levels.js` | Level list |

## Levels & versioning

- **Level Order:** Levels are arranged by increasing difficulty, meaning their order may shift between updates as new levels are created.
- **Versioning:** Release numbers match the total count of playable levels (e.g., `v0.5.0` = 50 levels).
