/**
 * STANDARD SOKOBAN ASCII:
 * '#' = Wall
 * '@' = Player
 * '$' = Box
 * '.' = Target
 * '*' = Box on Target
 * '+' = Player on Target
 * ' ' = Empty
 */

// Levels are defined in levels.js, loaded before this file.

let currentLevelIndex = 0;

// Quick start system via URL (?level=N or ?livello=N)
const urlParams = new URLSearchParams(window.location.search);
const requestedLevel = parseInt(urlParams.get('level') || urlParams.get('livello'), 10);
const hasDirectLevelParam = !isNaN(requestedLevel) && requestedLevel > 0 && requestedLevel <= levels.length;
if (hasDirectLevelParam) {
    currentLevelIndex = requestedLevel - 1;
}

// Game State
let grid = [];
let player = { x: 0, y: 0 };
let playerDir = 'down';
let pushCount = 0;
let lastMove = null;

// Lock controls during transitions/modals
let inputLocked = false;
let gameStarted = false;

// Timer Variables
let timerInterval = null;
let timeLimit = 0;
let timeLeft = 0;
let timerStarted = false;

// Score-based timer rules: every 15 score points above TIMER_BASE_SCORE adds one 10s tier,
// from 30s up to a 180s cap (reached at score 261 and above)
const TIMER_FREE_LEVELS = 10;   // levels 1..10: untimed tutorial & warm-up
const TIMER_MIN_SECONDS = 30;   // minimum time limit (score <= 50)
const TIMER_MAX_SECONDS = 180;  // maximum time limit (3 minutes, reached at score >= 261)
const TIMER_STEP_SECONDS = 10;  // tier increment in seconds
const TIMER_BASE_SCORE = 50;    // highest score still in the 30s tier (also fallback if a level has no score)
const TIMER_SCORE_STEP = 15;    // score points per 10s tier

// Fixed 5-letter checkpoint passwords (levels 11, 21, 31, ...)
const CHECKPOINT_CODES = (typeof LEVEL_CODES !== 'undefined') ? LEVEL_CODES : {
    11:  'FKRWD',
    21:  'MZQTN',
    31:  'BGYPL',
    41:  'XCVRA',
    51:  'JHUES',
    61:  'NKTMF',
    71:  'PQXLB',
    81:  'DZWCG',
    91:  'RYVNH',
    101: 'SLKJP',
    111: 'AUTQE',
    121: 'WFMXB',
    131: 'CGRZD',
    141: 'HVKYN',
    151: 'PJLTC',
    161: 'XQWSE',
    171: 'MNBKU',
    181: 'TRGFA',
    191: 'ZYLHD',
};

// Theme configuration
const THEMES = [
    { id: 'classic', label: 'Classic' },
    { id: 'scifi', label: 'Sci-Fi' },
    { id: 'arcade', label: 'Arcade' },
    { id: 'monument', label: 'Monument' }
];

const THEME_STORAGE_KEY = 'sokonova_theme';
let currentThemeIndex = 0;

// UI Elements
const boardEl = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const pushesDisplay = document.getElementById('pushes-display');
const timerDisplay = document.getElementById('timer-display');
const codeBadge = document.getElementById('code-badge');
const homeBtn = document.getElementById('home-btn');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');
let modalCallback = null;

// Returns the time limit in seconds based on level complexity score, or null if untimed.
// Tiers: <=50 -> 30s, 51..65 -> 40s, 66..80 -> 50s, 81..95 -> 60s, ..., >=261 -> 180s (3 min cap).
function timeLimitForLevel(index, levelEntry) {
    if (index < TIMER_FREE_LEVELS) return null;

    const score = (levelEntry && typeof levelEntry.score === 'number')
        ? levelEntry.score
        : TIMER_BASE_SCORE;

    const maxTiers = Math.floor((TIMER_MAX_SECONDS - TIMER_MIN_SECONDS) / TIMER_STEP_SECONDS);
    const tier = Math.max(
        0,
        Math.min(maxTiers, Math.ceil((score - TIMER_BASE_SCORE) / TIMER_SCORE_STEP))
    );

    return TIMER_MIN_SECONDS + tier * TIMER_STEP_SECONDS;
}

// Returns the checkpoint level number (11, 21, 31, ...) active for a given level, or null for levels 1..10
function getCheckpointLevel(levelNumber) {
    if (levelNumber < 11) return null;
    return Math.floor((levelNumber - 1) / 10) * 10 + 1;
}

// Returns the persistent 5-letter code shown in the HUD across the whole 10-level block (e.g. 11..20 -> code of 11)
function getActiveLevelCode(levelNumber) {
    const checkpoint = getCheckpointLevel(levelNumber);
    if (!checkpoint) return null;
    return CHECKPOINT_CODES[checkpoint] || null;
}

// Returns the 0-based level index matching the given 5-letter code, or -1 if invalid
function findLevelIndexByCode(rawCode) {
    const clean = rawCode.trim().toUpperCase();
    if (clean.length !== 5) return -1;

    for (const [lvlStr, code] of Object.entries(CHECKPOINT_CODES)) {
        const lvl = parseInt(lvlStr, 10);
        if (code.toUpperCase() === clean && lvl <= levels.length) {
            return lvl - 1;
        }
    }
    return -1;
}

// Detects the device type: 'touch' (phone/tablet) or 'keyboard' (PC)
function detectInputMode() {
    const forced = (urlParams.get('controls') || urlParams.get('controlli') || '').toLowerCase();
    if (forced === 'touch') return 'touch';
    if (forced === 'keyboard' || forced === 'tastiera') return 'keyboard';

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const hasTouch = navigator.maxTouchPoints > 0;
    return (coarse || (!fine && hasTouch)) ? 'touch' : 'keyboard';
}

function setupInputMode() {
    document.body.dataset.mode = detectInputMode();
}

// Theme management
function applyTheme(index) {
    currentThemeIndex = index % THEMES.length;
    const theme = THEMES[currentThemeIndex];
    document.body.dataset.theme = theme.id;

    const themeBtn = document.getElementById('theme-btn');
    const themeLabel = document.getElementById('theme-label');
    if (themeBtn) themeBtn.title = `Theme: ${theme.label}`;
    if (themeLabel) themeLabel.innerText = theme.label;

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme.id);
    } catch (_) {}
}

function setupTheme() {
    let saved = null;
    try {
        saved = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (_) {}

    const savedIndex = THEMES.findIndex(t => t.id === saved);
    applyTheme(savedIndex >= 0 ? savedIndex : 0);

    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyTheme(currentThemeIndex + 1);
        });
    }
}

// Initialize the game
function init() {
    setupInputMode();
    setupTheme();

    window.addEventListener('resize', updateCellSize);

    const codeInput = document.getElementById('code-input');
    const codeBtn = document.getElementById('code-btn');
    const codeError = document.getElementById('code-error');

    const submitCode = () => {
        const targetIndex = findLevelIndexByCode(codeInput.value);
        if (targetIndex === -1) {
            codeError.innerText = 'Invalid code';
            codeInput.value = '';
            return;
        }
        codeError.innerText = '';
        codeInput.value = '';
        currentLevelIndex = targetIndex;
        startGame();
    };

    codeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        submitCode();
    });

    codeInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
        codeError.innerText = '';
        if (e.key === 'Enter') {
            submitCode();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (!gameStarted) {
            startGame();
        } else {
            handleKeyDown(e);
        }
    });

    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('#password-box') || e.target.closest('#theme-btn') || e.target.closest('#home-btn')) return;
        if (!gameStarted) {
            startGame();
        }
    }, { passive: false });

    setupSwipeControls();

    // Click on the start screen (useful on PC)
    document.getElementById('start-overlay').addEventListener('click', (e) => {
        if (e.target.closest('#password-box') || e.target.closest('#theme-btn') || e.target.closest('#home-btn')) return;
        if (!gameStarted) {
            startGame();
        }
    });

    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goHome();
        });
    }

    modalBtn.addEventListener('click', () => {
        hideModal();
        if (modalCallback) modalCallback();
    });

    if (hasDirectLevelParam) {
        startGame();
    }
}

// Returns to the start screen, stops the timer, and closes active modals
function goHome() {
    if (!gameStarted) return;
    gameStarted = false;
    inputLocked = true;
    clearInterval(timerInterval);
    timerStarted = false;
    modalCallback = null;
    hideModal();

    if (homeBtn) homeBtn.classList.add('hidden');

    const overlay = document.getElementById('start-overlay');
    overlay.classList.remove('hidden', 'opacity-0');
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    inputLocked = true;

    const overlay = document.getElementById('start-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
        if (homeBtn) homeBtn.classList.remove('hidden');
        loadLevel(currentLevelIndex);
    }, 500);
}

function updateCellSize() {
    if (!grid.length || !grid[0].length) return;
    const cols = grid[0].length;
    const rows = grid.length;
    const gap = 0;

    const availW = window.innerWidth - 44;
    const availH = window.innerHeight - 230;

    const cellW = (availW - (cols - 1) * gap) / cols;
    const cellH = (availH - (rows - 1) * gap) / rows;
    const size = Math.max(24, Math.min(58, Math.floor(Math.min(cellW, cellH))));

    boardEl.style.setProperty('--cell', `${size}px`);
}

// Updates the contextual hint below the board (special instructions for tutorials T0 and T1)
function updateLevelHint(index) {
    const hintKb = document.getElementById('hint-keyboard');
    const hintTouch = document.getElementById('hint-touch');
    if (!hintKb || !hintTouch) return;

    if (index === 0) {
        hintKb.innerHTML = 'Use <kbd>Arrows</kbd> or <kbd>WASD</kbd> to push every crate onto a glowing target.';
        hintTouch.innerHTML = 'Drag your finger in any direction to move and push every crate onto a target.';
    } else if (index === 1) {
        hintKb.innerHTML = 'Tip: You can only push crates, never pull them. Avoid corners, or press <kbd>R</kbd> to restart.';
        hintTouch.innerHTML = 'Tip: Crates can only be pushed, never pulled. Avoid corners, or tap restart if stuck.';
    } else {
        hintKb.innerHTML = 'Move with <kbd>Arrows</kbd> or <kbd>WASD</kbd>.';
        hintTouch.innerHTML = 'Swipe on the screen to move.';
    }
}

function loadLevel(index) {
    if (index >= levels.length) {
        showModal("Victory!", "You completed all levels. You are a Sokonova master!", () => {
            currentLevelIndex = 0;
            loadLevel(0);
        });
        return;
    }

    const levelEntry = levels[index];
    const rawData = Array.isArray(levelEntry) ? levelEntry : levelEntry.map;

    grid = [];
    inputLocked = false;
    playerDir = 'down';
    pushCount = 0;
    lastMove = null;
    pushesDisplay.innerText = '0';

    // Maximum width for padding and CSS Grid
    let maxWidth = 0;
    rawData.forEach(row => {
        if (row.length > maxWidth) maxWidth = row.length;
    });

    // Build the game grid and locate the player
    for (let y = 0; y < rawData.length; y++) {
        const rowArray = [];
        for (let x = 0; x < maxWidth; x++) {
            const char = rawData[y][x] || ' ';
            if (char === '@' || char === '+') {
                player.x = x;
                player.y = y;
            }
            rowArray.push(char);
        }
        grid.push(rowArray);
    }

    // Set up CSS Grid based on map dimensions
    boardEl.style.gridTemplateColumns = `repeat(${maxWidth}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;
    updateCellSize();

    // Update UI
    const levelNumber = index + 1;
    levelDisplay.innerText = `Level ${levelNumber}`;
    updateLevelHint(index);

    const levelCode = getActiveLevelCode(levelNumber);
    if (levelCode) {
        codeBadge.innerText = `Code: ${levelCode}`;
        codeBadge.classList.remove('hidden');
    } else {
        codeBadge.classList.add('hidden');
    }

    setupTimer(index, levelEntry);
    render();
}

function setupTimer(index, levelEntry) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStarted = false;

    const limit = timeLimitForLevel(index, levelEntry);

    if (limit === null) {
        timeLimit = 0;
        timeLeft = 0;
        timerDisplay.innerText = "∞";
        timerDisplay.classList.remove('text-red-400');
        timerDisplay.classList.add('text-emerald-400');
    } else {
        timeLimit = limit;
        timeLeft = timeLimit;
        updateTimerUI();
    }
}

function startLevelTimer() {
    if (timerStarted || timeLimit <= 0) return;
    timerStarted = true;

    timerInterval = setInterval(() => {
        if (inputLocked) return;

        timeLeft--;
        updateTimerUI();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            inputLocked = true;
            showModal("Time's Up!", "You ran out of time.", () => {
                restartCurrentLevel();
            });
        }
    }, 1000);
}

function updateTimerUI() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Turn red during the last third of the available time
    if (timeLeft <= Math.ceil(timeLimit / 3)) {
        timerDisplay.classList.remove('text-emerald-400');
        timerDisplay.classList.add('text-red-400');
    } else {
        timerDisplay.classList.remove('text-red-400');
        timerDisplay.classList.add('text-emerald-400');
    }
}

function render() {
    boardEl.innerHTML = '';

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const char = grid[y][x];
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (char === '#') {
                cell.classList.add('wall');
                if (y > 0 && grid[y - 1][x] === '#') cell.classList.add('wall-top');
                if (y < grid.length - 1 && grid[y + 1][x] === '#') cell.classList.add('wall-bottom');
                if (x > 0 && grid[y][x - 1] === '#') cell.classList.add('wall-left');
                if (x < grid[y].length - 1 && grid[y][x + 1] === '#') cell.classList.add('wall-right');
            } else if (char === ' ') {
                cell.classList.add('floor');
            } else if (char === '.') {
                cell.classList.add('target');
            } else if (char === '$') {
                cell.classList.add('box', 'floor');
            } else if (char === '*') {
                cell.classList.add('box-on-target', 'floor');
            } else if (char === '@') {
                cell.classList.add('player', 'floor');
                cell.dataset.dir = playerDir;
            } else if (char === '+') {
                cell.classList.add('player', 'target');
                cell.dataset.dir = playerDir;
            } else {
                cell.classList.add('empty');
            }

            if (lastMove) {
                const isMovedPlayer = lastMove.playerTo.x === x && lastMove.playerTo.y === y;
                const isMovedBox = lastMove.boxTo && lastMove.boxTo.x === x && lastMove.boxTo.y === y;

                if (isMovedPlayer || isMovedBox) {
                    cell.style.setProperty('--dx', lastMove.dx);
                    cell.style.setProperty('--dy', lastMove.dy);
                    cell.classList.add(lastMove.boxLanded && isMovedBox ? 'anim-box-lock' : 'anim-slide');
                }
            }

            boardEl.appendChild(cell);
        }
    }
}

function handleKeyDown(e) {
    if (inputLocked || !gameStarted) return;

    let dx = 0;
    let dy = 0;

    if (['ArrowUp', 'w', 'W'].includes(e.key)) dy = -1;
    else if (['ArrowDown', 's', 'S'].includes(e.key)) dy = 1;
    else if (['ArrowLeft', 'a', 'A'].includes(e.key)) dx = -1;
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) dx = 1;
    else if (['r', 'R'].includes(e.key)) {
        restartCurrentLevel();
        return;
    }

    if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        move(dx, dy);
    }
}

// Mobile continuous swipe handling with auto-recovery
function setupSwipeControls() {
    let lastX = 0;
    let lastY = 0;
    let activeTouchId = null;
    let lastStepTime = 0;
    const STEP_COOLDOWN_MS = 70;

    // Proportional step distance (clamped between 30px and 44px)
    const getStepThreshold = () => {
        const cellVal = parseFloat(boardEl.style.getPropertyValue('--cell')) || 36;
        return Math.max(30, Math.min(44, Math.round(cellVal * 0.95)));
    };

    const resetTouch = () => {
        activeTouchId = null;
    };

    window.addEventListener('touchstart', (e) => {
        if (!gameStarted || inputLocked) {
            resetTouch();
            return;
        }
        if (e.target.closest('button, input, #password-box, #modal-content')) return;

        const touch = e.touches[0];
        if (touch) {
            activeTouchId = touch.identifier;
            lastX = touch.clientX;
            lastY = touch.clientY;
        }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (gameStarted && !inputLocked) {
            e.preventDefault();
        }
        if (!gameStarted || inputLocked) {
            resetTouch();
            return;
        }

        // Find tracked finger, or auto-recover to the primary finger if only one is on screen
        let touch = null;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === activeTouchId) {
                touch = e.touches[i];
                break;
            }
        }
        if (!touch && e.touches.length === 1) {
            touch = e.touches[0];
            activeTouchId = touch.identifier;
            lastX = touch.clientX;
            lastY = touch.clientY;
            return;
        }
        if (!touch) return;

        const now = performance.now();
        if (now - lastStepTime < STEP_COOLDOWN_MS) return;

        const step = getStepThreshold();
        const dx = touch.clientX - lastX;
        const dy = touch.clientY - lastY;

        if (Math.abs(dx) < step && Math.abs(dy) < step) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            move(dx > 0 ? 1 : -1, 0);
            lastX = dx > 0 ? Math.min(touch.clientX, lastX + step) : Math.max(touch.clientX, lastX - step);
            lastY = touch.clientY;
        } else {
            move(0, dy > 0 ? 1 : -1);
            lastY = dy > 0 ? Math.min(touch.clientY, lastY + step) : Math.max(touch.clientY, lastY - step);
            lastX = touch.clientX;
        }

        lastStepTime = now;
    }, { passive: false });

    const handleTouchEnd = (e) => {
        if (e.touches.length === 0) {
            resetTouch();
            return;
        }
        let stillActive = false;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === activeTouchId) {
                stillActive = true;
                break;
            }
        }
        if (!stillActive) {
            const fallback = e.touches[0];
            activeTouchId = fallback.identifier;
            lastX = fallback.clientX;
            lastY = fallback.clientY;
        }
    };

    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
}

function updatePlayerDirection(dx, dy) {
    if (dy === -1) playerDir = 'up';
    else if (dy === 1) playerDir = 'down';
    else if (dx === -1) playerDir = 'left';
    else if (dx === 1) playerDir = 'right';

    const playerEl = boardEl.querySelector('.player');
    if (playerEl) playerEl.dataset.dir = playerDir;
}

function move(dx, dy) {
    updatePlayerDirection(dx, dy);

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Out of bounds
    if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[newY].length) return;

    const targetCell = grid[newY][newX];

    // Wall
    if (targetCell === '#') return;

    // Empty cell or bare target -> move player
    if (targetCell === ' ' || targetCell === '.') {
        updateGrid(player.x, player.y, newX, newY, false);
        return;
    }

    // Box to push
    if (targetCell === '$' || targetCell === '*') {
        const beyondX = newX + dx;
        const beyondY = newY + dy;

        if (beyondY >= 0 && beyondY < grid.length && beyondX >= 0 && beyondX < grid[beyondY].length) {
            const beyondCell = grid[beyondY][beyondX];

            if (beyondCell === ' ' || beyondCell === '.') {
                updateGrid(player.x, player.y, newX, newY, true, beyondX, beyondY);
            }
        }
    }
}

function updateGrid(px, py, nx, ny, pushedBox, bx, by) {
    startLevelTimer();

    // Remove player from the old position
    grid[py][px] = (grid[py][px] === '+') ? '.' : ' ';

    if (pushedBox) {
        pushCount++;
        pushesDisplay.innerText = pushCount;

        // Move the box to the new position
        const beyondWasTarget = (grid[by][bx] === '.');
        grid[by][bx] = beyondWasTarget ? '*' : '$';

        // The player takes the box's previous spot
        const boxWasOnTarget = (grid[ny][nx] === '*');
        grid[ny][nx] = boxWasOnTarget ? '+' : '@';
    } else {
        // Simple player movement
        grid[ny][nx] = (grid[ny][nx] === '.') ? '+' : '@';
    }

    player.x = nx;
    player.y = ny;

    lastMove = {
        dx: nx - px,
        dy: ny - py,
        playerTo: { x: nx, y: ny },
        boxTo: pushedBox ? { x: bx, y: by } : null,
        boxLanded: pushedBox && (grid[by][bx] === '*')
    };

    render();
    lastMove = null;
    checkWinCondition();
}

function checkWinCondition() {
    let isComplete = true;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '$') {
                isComplete = false;
                break;
            }
        }
        if (!isComplete) break;
    }

    if (isComplete) {
        inputLocked = true;
        clearInterval(timerInterval);

        setTimeout(() => {
            const nextLevel = currentLevelIndex + 2;
            const isNewCheckpoint = nextLevel >= 11 && (nextLevel - 1) % 10 === 0;
            const nextCode = isNewCheckpoint ? getActiveLevelCode(nextLevel) : null;
            const msg = nextCode
                ? `Great job! Level ${nextLevel} code: ${nextCode}`
                : "Great job! Get ready for the next challenge.";

            showModal("Level Complete!", msg, () => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            });
        }, 200);
    }
}

function restartCurrentLevel() {
    loadLevel(currentLevelIndex);
}

// Modal Logic
function showModal(title, message, callback) {
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modalCallback = callback;

    modalOverlay.classList.remove('modal-hidden');
    modalOverlay.classList.add('modal-active');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');

    modalBtn.focus();
}

function hideModal() {
    modalOverlay.classList.remove('modal-active');
    modalOverlay.classList.add('modal-hidden');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
}

// Start
init();