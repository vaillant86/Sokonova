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
| `levels.js` | Level list (managed by the script) |
| `generate_levels.py` | Level generator and verifier |

## Running Locally

Open `index.html` in your browser. The page uses Tailwind via CDN, so an internet connection is required.

## Adding Levels

The script uses Python 3 with no external libraries. Run the commands from the project folder:

```bash
python generate_levels.py --add 10 --budget 90 --seed 2
python generate_levels.py --add 3 --extra my_maps.txt
python generate_levels.py --sort
```

- `--add N` appends N levels to the end of `levels.js`.
- `--extra FILE` includes hand-crafted maps separated by a `===` line. They are verified before being added.
- `--sort` reorders all levels from easiest to hardest.

The script verifies each level with a solver and stops if it encounters an unsolvable map. Before writing, it creates a backup copy named `levels.js.bak`.

`game.js` does not need to be modified to add levels.
