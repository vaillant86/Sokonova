/**
 * STANDARD SOKOBAN ASCII:
 * '#' = Wall
 * '@' = Player
 * '$' = Box
 * '.' = Target
 * '*' = Box on Target
 * '+' = Player on Target
 * ' ' = Empty
 *
 */

// Levels are defined in levels.js, loaded before this file.


let currentLevelIndex = 0;

// Quick start system via URL (?level=N or ?livello=N)
const urlParams = new URLSearchParams(window.location.search);
const requestedLevel = parseInt(urlParams.get('level') || urlParams.get('livello'));
if (!isNaN(requestedLevel) && requestedLevel > 0 && requestedLevel <= levels.length) {
    // Subtract 1 because the array is 0-indexed
    currentLevelIndex = requestedLevel - 1;
}

let grid = [];
let player = { x: 0, y: 0 };
let playerDir = 'down';
let pushCount = 0;

// Timer Variables
let timerInterval = null;
let timeLeft = 0;
let timerStarted = false;

// Timer rules: modify only these values
const TIMER_FREE_LEVELS = 10;   // levels 1..10: no time limit
const TIMER_BLOCK_SIZE = 20;    // each block of levels shares the same time limit
const TIMER_BASE_SECONDS = 30;  // time limit for the first timed block (levels 11..30)
const TIMER_STEP_SECONDS = 15;  // time limit increase for each subsequent block

// Returns the time limit in seconds for a level (0-based index), or null if untimed.
// Examples with current values: 11-30 -> 30s, 31-50 -> 45s, 51-70 -> 60s, ...
function timeLimitForIndex(index) {
    if (index < TIMER_FREE_LEVELS) return null;
    const levelNumber = index + 1;
    const block = Math.floor((levelNumber - (TIMER_FREE_LEVELS + 1)) / TIMER_BLOCK_SIZE);
    return TIMER_BASE_SECONDS + block * TIMER_STEP_SECONDS;
}

// Generates a deterministic 5-letter uppercase password for checkpoint levels (11, 21, 31, ...)
function getLevelCode(levelNumber) {
    if (levelNumber < 11 || (levelNumber - 1) % 10 !== 0) return null;
    let seed = (levelNumber * 2654435761) >>> 0;
    let code = '';
    for (let i = 0; i < 5; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        code += String.fromCharCode(65 + (seed % 26));
    }
    return code;
}

// Returns the 0-based level index matching the given 5-letter code, or -1 if invalid
function findLevelIndexByCode(rawCode) {
    const clean = rawCode.trim().toUpperCase();
    if (clean.length !== 5) return -1;
    for (let lvl = 11; lvl <= levels.length; lvl += 10) {
        if (getLevelCode(lvl) === clean) {
            return lvl - 1;
        }
    }
    return -1;
}

let timeLimit = 60; // seconds for the current level (set in setupTimer)

// Lock controls during transitions/modals
let inputLocked = false;
let gameStarted = false;

// UI Elements
const boardEl = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const pushesDisplay = document.getElementById('pushes-display');
const timerDisplay = document.getElementById('timer-display');
const codeBadge = document.getElementById('code-badge');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');
let modalCallback = null;

// Detects the device type: 'touch' (phone/tablet) or 'keyboard' (PC).
function detectInputMode() {
    const forced = (urlParams.get('controls') || urlParams.get('controlli') || '').toLowerCase();
    if (forced === 'touch') return 'touch';
    if (forced === 'keyboard' || forced === 'tastiera') return 'keyboard';

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const hasTouch = navigator.maxTouchPoints > 0;
    // Device with a coarse pointer (finger): touch mode.
    // Device with a precise mouse or keyboard: keyboard mode.
    return (coarse || (!fine && hasTouch)) ? 'touch' : 'keyboard';
}

function setupInputMode() {
    document.body.dataset.mode = detectInputMode();
}

// Theme management
const THEMES = [
    { id: 'classic', label: 'Classic' },
    { id: 'scifi', label: 'Sci-Fi' },
    { id: 'arcade', label: 'Arcade' }
];
const THEME_STORAGE_KEY = 'sokonova_theme';
let currentThemeIndex = 0;

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
        if (!gameStarted) startGame();
        else handleKeyDown(e);
    });
    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('#password-box') || e.target.closest('#theme-btn')) return;
        if (!gameStarted) startGame();
    }, { passive: false });

    setupSwipeControls();

    // Click on the start screen (useful on PC)
    document.getElementById('start-overlay').addEventListener('click', (e) => {
        if (e.target.closest('#password-box') || e.target.closest('#theme-btn')) return;
        if (!gameStarted) startGame();
    });

    modalBtn.addEventListener('click', () => {
        hideModal();
        if (modalCallback) modalCallback();
    });

    // Wait for user interaction to start the first level
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    const overlay = document.getElementById('start-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
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

function loadLevel(index) {
    if (index >= levels.length) {
        showModal("Victory!", "You completed all levels. You are a Sokonova master!", () => {
            currentLevelIndex = 0;
            loadLevel(0);
        });
        return;
    }

    const rawData = levels[index];
    grid = [];
    inputLocked = false;
    playerDir = 'down';
    pushCount = 0;
    pushesDisplay.innerText = '0';

    // Maximum width for padding and CSS Grid
    let maxWidth = 0;
    rawData.forEach(row => { if (row.length > maxWidth) maxWidth = row.length; });

    // Build the game grid and locate the player
    for (let y = 0; y < rawData.length; y++) {
        let rowArray = [];
        for (let x = 0; x < maxWidth; x++) {
            let char = rawData[y][x] || ' '; // Pad with empty spaces
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
    levelDisplay.innerText = `Level ${levelNumber} / ${levels.length}`;

    const levelCode = getLevelCode(levelNumber);
    if (levelCode) {
        codeBadge.innerText = `Code: ${levelCode}`;
        codeBadge.classList.remove('hidden');
    } else {
        codeBadge.classList.add('hidden');
    }

    setupTimer(index);
    render();
}

function setupTimer(index) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStarted = false;

    const limit = timeLimitForIndex(index);

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
        if (inputLocked) return; // Do not decrease time while paused or in a modal

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

            // Base classes and visual rendering logic
            cell.className = 'cell';

            if (char === '#') {
            cell.classList.add('wall');
            if (y > 0 && grid[y - 1][x] === '#') cell.classList.add('wall-top');
            if (y < grid.length - 1 && grid[y + 1][x] === '#') cell.classList.add('wall-bottom');
            if (x > 0 && grid[y][x - 1] === '#') cell.classList.add('wall-left');
            if (x < grid[y].length - 1 && grid[y][x + 1] === '#') cell.classList.add('wall-right');
            }
            else if (char === ' ') cell.classList.add('floor');
            else if (char === '.') cell.classList.add('target');
            else if (char === '$') cell.classList.add('box', 'floor');
            else if (char === '*') cell.classList.add('box-on-target', 'floor');
            else if (char === '@') {
                cell.classList.add('player', 'floor');
                cell.dataset.dir = playerDir;
            }
            else if (char === '+') {
                cell.classList.add('player', 'target');
                cell.dataset.dir = playerDir;
            }
            else cell.classList.add('empty');

            boardEl.appendChild(cell);
        }
    }
}

function handleKeyDown(e) {
    if (inputLocked || !gameStarted) return;

    let dx = 0, dy = 0;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) dy = -1;
    else if (['ArrowDown', 's', 'S'].includes(e.key)) dy = 1;
    else if (['ArrowLeft', 'a', 'A'].includes(e.key)) dx = -1;
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) dx = 1;
    else if (['r', 'R'].includes(e.key)) {
        restartCurrentLevel();
        return;
    }

    if (dx !== 0 || dy !== 0) {
        e.preventDefault(); // Prevent scrolling
        move(dx, dy);
    }
}

// Mobile swipe handling
function setupSwipeControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 30; // Minimum distance to register a valid swipe

    // Prevent pull-to-refresh and native scrolling during gameplay
    window.addEventListener('touchmove', e => {
        if (gameStarted && !inputLocked) {
            e.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    window.addEventListener('touchend', e => {
        if (inputLocked || !gameStarted) return;

        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;

        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal movement
            if (Math.abs(dx) > swipeThreshold) {
                if (dx > 0) move(1, 0); // Right
                else move(-1, 0);       // Left
            }
        } else {
            // Vertical movement
            if (Math.abs(dy) > swipeThreshold) {
                if (dy > 0) move(0, 1); // Down
                else move(0, -1);       // Up
            }
        }
    }, { passive: false });
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

    let newX = player.x + dx;
    let newY = player.y + dy;

    // Out of bounds
    if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[newY].length) return;

    let targetCell = grid[newY][newX];

    // Wall
    if (targetCell === '#') return;

    // Empty cell or bare target -> move player
    if (targetCell === ' ' || targetCell === '.') {
        updateGrid(player.x, player.y, newX, newY, false);
        return;
    }

    // There is a box to push
    if (targetCell === '$' || targetCell === '*') {
        let beyondX = newX + dx;
        let beyondY = newY + dy;

        // Check what is behind the box
        if (beyondY >= 0 && beyondY < grid.length && beyondX >= 0 && beyondX < grid[beyondY].length) {
            let beyondCell = grid[beyondY][beyondX];

            // If there is empty space or a target behind it, push
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
        let beyondWasTarget = (grid[by][bx] === '.');
        grid[by][bx] = beyondWasTarget ? '*' : '$';

        // The player takes the box's previous spot
        let boxWasOnTarget = (grid[ny][nx] === '*');
        grid[ny][nx] = boxWasOnTarget ? '+' : '@';
    } else {
        // Simple player movement
        grid[ny][nx] = (grid[ny][nx] === '.') ? '+' : '@';
    }

    player.x = nx;
    player.y = ny;

    render();
    checkWinCondition();
}

function checkWinCondition() {
    let isComplete = true;
    // Check if there are still any '$' boxes not on targets
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

        // Short delay to show the last box placed
        setTimeout(() => {
            const nextCode = getLevelCode(currentLevelIndex + 2);
            const msg = nextCode
                ? `Great job! Level ${currentLevelIndex + 2} code: ${nextCode}`
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