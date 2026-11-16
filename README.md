# Sokonova

Sokoban-style puzzle game: push the boxes onto the targets, featuring levels of increasing difficulty.

## How to Play

- **PC**: Arrow keys or WASD. Press `R` to restart the level.
- **Smartphone / tablet**: Swipe on the screen to move the warehouse keeper.

The page detects the device and displays only the appropriate controls.

Time limits: levels 1–10 have no limit, 11–30 have 30 seconds, and 31–50 have 60 seconds.

## Structure

| File | Contents |
| --- | --- |
| `index.html` | Page structure and styling |
| `game.js` | Game logic, timer, controls |
| `levels.js` | Level list |

## Running Locally

Open `index.html` in your browser. The page uses Tailwind via CDN, so an internet connection is required.

## Versioning

Version numbers match the total count of playable levels (e.g., `v0.5.0` = 50 levels).
