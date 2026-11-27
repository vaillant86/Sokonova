# Sokonova

Sokonova is a puzzle game inspired by the classic Sokoban. You guide a character through compact grid levels, pushing crates until each one rests on a target.

Release numbers reflect the total count of playable levels (e.g., `v1.0.0` = 100 levels).

## What makes it different

Early levels teach the basics. As you progress, new elements join the puzzle: pressure plates that hold doors open, teleporters that warp you across the map, and levels split into several connected rooms. Every 20th level is a boss: a tougher, specially styled finale for its block of levels.

From level 11 onwards a timer adds pressure, and every level rewards efficiency with up to three stars, so a clean solution is worth chasing even after you have cleared it.

## How to play

### Online

Play in your browser at **[vaillant86.github.io/Sokonova](https://vaillant86.github.io/Sokonova)**. No installation needed and it works on desktop and mobile.

### Locally

Open `index.html` in any modern browser. An internet connection is required to load Tailwind CSS from its CDN.

### Controls

- **Desktop:** arrow keys or `WASD` to move, `Z` or `Backspace` to undo, `R` to restart.
- **Mobile:** swipe to move, with on-screen buttons for undo and restart.

## Highlights

- Procedurally generated and balanced levels along a sawtooth difficulty curve.
- Boss levels, time limits and a 3-star rating based on how few pushes you need.
- Four visual themes and five languages, switchable at any time.
- Procedural sound effects tailored to each visual theme, synthesized in the browser.

## Project structure

| Path | Contents |
| --- | --- |
| `index.html` | Page structure and HUD |
| `style.css` | Styling and animations |
| `themes.css` | Themes |
| `game.js` | Game engine, input and audio |
| `levels.js` | Level data, optimal push counts and difficulty scores |
| `locales/` | Translations |

## License

Released under the AGPL-3.0 license. See [LICENSE](LICENSE) for details.
