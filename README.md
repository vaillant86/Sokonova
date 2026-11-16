# Sokonova

Sokoban-style puzzle game: push the boxes onto the targets, featuring levels of increasing difficulty.

## How to Play

- **PC**: Arrow keys or WASD. Press `R` to restart the level.
- **Smartphone / tablet**: Swipe on the screen.

The page detects the device and displays only the appropriate controls.

Time limits: no limit for levels 1–10; from level 11 onwards, the time limit increases progressively with difficulty.

## Structure

| File | Contents |
| --- | --- |
| `index.html` | Page structure and styling |
| `game.js` | Game logic, timer, controls |
| `levels.js` | Level list |

## Running Locally

Open `index.html` in your browser. The page uses Tailwind via CDN, so an internet connection is required.

## Levels & Versioning

- **Versioning:** Release numbers match the total count of playable levels (e.g., `v0.5.0` = 50 levels).
- **Level Order:** Levels are arranged by increasing difficulty, meaning their order may shift between updates as new levels are created.
