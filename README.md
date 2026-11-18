# Sokonova

Sokonova is a challenging puzzle game (inspired by Sokoban): push the boxes onto the targets, beware of tricks and time limits.

## How to play

### Via web link
Open **[https://vaillant86.github.io/Sokonova](https://vaillant86.github.io/Sokonova)** directly in your browser.

### Local
Open `index.html` in your browser. Since Tailwind is loaded via CDN, an internet connection is required.

Controls adapt automatically to your device:

- **PC:** Arrow keys or WASD to move, `R` to restart the current level.
- **Mobile:** Swipe anywhere on the screen.

## Features

- **Time limits:** no limit for levels 1–10; from level 11 onwards, the timer starts on first move.
- **Checkpoint codes:** every ten levels, from level 11 onwards, you receive a 5-letter code. Enter it in the upper right box to pick up right where you left off.
- **Visual themes:** switch anytime between **Classic**, **Sci-Fi**, and **Arcade** themes.

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