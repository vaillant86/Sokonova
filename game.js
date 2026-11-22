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

// Levels are defined in levels.js
// Languages are defined in locales folder.

let currentLevelIndex = 0;

// Quick start system via URL (?level=N)
const urlParams = new URLSearchParams(window.location.search);
const requestedLevel = parseInt(urlParams.get('level') || urlParams.get('livello'), 10);
const hasDirectLevelParam = !isNaN(requestedLevel) && requestedLevel > 0 && requestedLevel <= levels.length;
if (hasDirectLevelParam) {
    currentLevelIndex = requestedLevel - 1;
}

// Game atate
let grid = [];
let player = { x: 0, y: 0 };
let playerDir = 'down';
let pushCount = 0;
let lastMove = null;

// Undo atate (max 3 per normal level, disabled on Boss levels)
const MAX_UNDOS = 3;
let moveHistory = [];
let undosRemaining = MAX_UNDOS;

// Lock controls during transitions/modals
let inputLocked = false;
let gameStarted = false;

// Timer variables
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
//    111: 'AUTQE',
//    121: 'WFMXB',
//    131: 'CGRZD',
//    141: 'HVKYN',
//    151: 'PJLTC',
//    161: 'XQWSE',
//    171: 'MNBKU',
//    181: 'TRGFA',
//    191: 'ZYLHD',
};

// Localization configuration
const SUPPORTED_LANGS = ['en', 'it', 'fr', 'es', 'de'];
const LANG_STORAGE_KEY = 'sokonova_lang';
let currentLang = 'en';

function t(key, vars = {}) {
    const locales = window.SOKONOVA_LOCALES || {};
    const dict = locales[currentLang] || locales.en || {};
    const fallback = locales.en || {};
    let str = dict[key] !== undefined ? dict[key] : (fallback[key] !== undefined ? fallback[key] : key);

    for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
    return str;
}

function applyLanguage(lang) {
    currentLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
    document.documentElement.lang = currentLang;

    try {
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    } catch (_) {}

    const langBtn = document.getElementById('lang-btn');
    const langLabel = document.getElementById('lang-label');

    if (langBtn) {
        langBtn.title = t('switchLangTitle');
        langBtn.setAttribute('aria-label', t('switchLangTitle'));
    }
    if (langLabel) langLabel.innerText = currentLang.toUpperCase();

    for (const code of SUPPORTED_LANGS) {
        const flagEl = document.getElementById(`flag-${code}`);
        if (flagEl) flagEl.classList.toggle('hidden', currentLang !== code);
    }

    const homeLabel = document.getElementById('home-label');
    if (homeLabel) homeLabel.innerText = t('homeLabel');
    if (homeBtn) {
        homeBtn.title = t('homeTitle');
        homeBtn.setAttribute('aria-label', t('homeTitle'));
    }

    const pushesLabel = document.getElementById('pushes-label');
    const timeLabel = document.getElementById('time-label');
    if (pushesLabel) pushesLabel.innerText = t('pushesLabel');
    if (timeLabel) timeLabel.innerText = t('timeLabel');

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.title = t('restartTitle');
        restartBtn.setAttribute('aria-label', t('restartTitle'));
    }

    const codeInput = document.getElementById('code-input');
    const codeBtn = document.getElementById('code-btn');
    if (codeInput) codeInput.placeholder = t('codePlaceholder');
    if (codeBtn) codeBtn.setAttribute('aria-label', t('sendCodeLabel'));

    const startTouchText = document.getElementById('start-touch-text');
    const startKeyboardText = document.getElementById('start-keyboard-text');
    if (startTouchText) startTouchText.innerText = t('swipeToStart');
    if (startKeyboardText) startKeyboardText.innerText = t('pressAnyKey');

    if (modalBtn) modalBtn.innerText = t('modalOk');

    const currentTheme = THEMES[currentThemeIndex];
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn && currentTheme) {
        themeBtn.title = t('themeTitle', { label: currentTheme.label });
    }

    updateSoundUI();
    updateUndoUI();

    if (gameStarted) {
        const levelNumber = currentLevelIndex + 1;
        levelDisplay.innerText = t('levelLabel', { n: levelNumber });
        updateLevelHint(currentLevelIndex);

        const levelCode = getActiveLevelCode(levelNumber);
        if (levelCode && codeBadge) {
            codeBadge.innerText = t('codeBadge', { code: levelCode });
        }
    }
}

function setupLanguage() {
    let saved = null;
    try {
        saved = localStorage.getItem(LANG_STORAGE_KEY);
    } catch (_) {}

    if (SUPPORTED_LANGS.includes(saved)) {
        applyLanguage(saved);
    } else {
        const browserPrefix = (navigator.language || '').toLowerCase().slice(0, 2);
        applyLanguage(SUPPORTED_LANGS.includes(browserPrefix) ? browserPrefix : 'en');
    }

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextIndex = (SUPPORTED_LANGS.indexOf(currentLang) + 1) % SUPPORTED_LANGS.length;
            applyLanguage(SUPPORTED_LANGS[nextIndex]);
        });
    }
}

// Theme configuration
const THEMES = [
    { id: 'classic', label: 'Classic' },
    { id: 'scifi', label: 'Sci-Fi' },
    { id: 'arcade', label: 'Arcade' },
    { id: 'monument', label: 'Monument' }
];

const THEME_STORAGE_KEY = 'sokonova_theme';
let currentThemeIndex = 0;

// Sound configuration (Web Audio API, zero external dependencies)
const SOUND_STORAGE_KEY = 'sokonova_sound';
let soundEnabled = true;
let audioCtx = null;

// UI elements
const boardEl = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const pushesDisplay = document.getElementById('pushes-display');
const timerDisplay = document.getElementById('timer-display');
const bossBadge = document.getElementById('boss-badge');
const codeBadge = document.getElementById('code-badge');
const homeBtn = document.getElementById('home-btn');
const undoBtn = document.getElementById('undo-btn');

// Modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');
let modalCallback = null;

// Boss levels occur every 10 levels starting at level 10 (10, 20, 30, ...)
function isBossLevel(levelNumber) {
    return levelNumber >= 10 && levelNumber % 10 === 0;
}

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
    if (themeBtn) themeBtn.title = t('themeTitle', { label: theme.label });
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

// Sound effects management
function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

function updateSoundUI() {
    const btn = document.getElementById('sound-btn');
    const iconOn = document.getElementById('sound-icon-on');
    const iconOff = document.getElementById('sound-icon-off');
    if (btn) btn.title = soundEnabled ? t('soundOnTitle') : t('soundOffTitle');
    if (iconOn) iconOn.classList.toggle('hidden', !soundEnabled);
    if (iconOff) iconOff.classList.toggle('hidden', soundEnabled);
}

function setupSound() {
    try {
        const saved = localStorage.getItem(SOUND_STORAGE_KEY);
        if (saved === 'off') soundEnabled = false;
    } catch (_) {}
    updateSoundUI();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    try {
        localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled ? 'on' : 'off');
    } catch (_) {}
    updateSoundUI();
    if (soundEnabled) {
        playSound('move');
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const playTone = (freqStart, freqEnd, duration, wave, gainPeak, delay = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freqStart, now + delay);
        if (freqEnd !== freqStart) {
            osc.frequency.exponentialRampToValueAtTime(freqEnd, now + delay + duration);
        }

        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.linearRampToValueAtTime(gainPeak, now + delay + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.01);
    };

    if (type === 'move') {
        playTone(190, 130, 0.055, 'triangle', 0.07);
    } else if (type === 'undo') {
        playTone(260, 165, 0.075, 'triangle', 0.08);
    } else if (type === 'target') {
        playTone(523.25, 523.25, 0.09, 'sine', 0.11, 0);      // C5
        playTone(783.99, 783.99, 0.16, 'sine', 0.12, 0.065);  // G5
    } else if (type === 'win') {
        playTone(523.25, 523.25, 0.12, 'triangle', 0.13, 0);     // C5
        playTone(659.25, 659.25, 0.12, 'triangle', 0.13, 0.09);  // E5
        playTone(783.99, 783.99, 0.26, 'triangle', 0.15, 0.18);  // G5
    } else if (type === 'tick') {
        const isFinalSecond = timeLeft === 1;
        playTone(isFinalSecond ? 980 : 740, isFinalSecond ? 880 : 660, 0.045, 'sine', 0.09);
    }
}

// Undo state management
function updateUndoUI() {
    if (!undoBtn) return;
    const boss = isBossLevel(currentLevelIndex + 1);
    const canUndo = !boss && undosRemaining > 0 && moveHistory.length > 0 && !inputLocked;
    undoBtn.disabled = !canUndo;

    if (boss) {
        undoBtn.title = t('undoBossTitle');
    } else if (undosRemaining > 0) {
        undoBtn.title = t('undoTitle', { left: undosRemaining });
    } else {
        undoBtn.title = t('undoEmptyTitle');
    }
}

function recordMoveSnapshot() {
    if (isBossLevel(currentLevelIndex + 1)) return;
    moveHistory.push({
        grid: grid.map(row => [...row]),
        player: { x: player.x, y: player.y },
        playerDir,
        pushCount
    });
    if (moveHistory.length > MAX_UNDOS) {
        moveHistory.shift();
    }
}

function undoMove() {
    if (inputLocked || !gameStarted) return;
    if (isBossLevel(currentLevelIndex + 1)) return;
    if (undosRemaining <= 0 || moveHistory.length === 0) return;

    const prev = moveHistory.pop();
    undosRemaining--;

    grid = prev.grid;
    player = { x: prev.player.x, y: prev.player.y };
    playerDir = prev.playerDir;
    pushCount = prev.pushCount;
    pushesDisplay.innerText = pushCount;
    lastMove = null;

    render();
    playSound('undo');
    updateUndoUI();
}

// Initialize the game
function init() {
    setupInputMode();
    setupTheme();
    setupSound();
    setupLanguage();

    window.addEventListener('resize', updateCellSize);

    const codeInput = document.getElementById('code-input');
    const codeBtn = document.getElementById('code-btn');
    const codeError = document.getElementById('code-error');

    const submitCode = () => {
        const targetIndex = findLevelIndexByCode(codeInput.value);
        if (targetIndex === -1) {
            codeError.innerText = t('invalidCode');
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
        if (e.target.closest('#password-box, #theme-btn, #lang-btn, #home-btn')) return;
        if (!gameStarted) {
            startGame();
        }
    }, { passive: false });

    setupSwipeControls();

    // Click on the start screen (useful on PC)
    document.getElementById('start-overlay').addEventListener('click', (e) => {
        if (e.target.closest('#password-box, #theme-btn, #lang-btn, #home-btn')) return;
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
    updateUndoUI();

    document.body.classList.remove('boss-level');
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
    const boardPad = 24; // 12px padding on each side

    const availW = window.innerWidth - 32 - boardPad;
    const availH = window.innerHeight - 255 - boardPad;

    const cellW = availW / cols;
    const cellH = availH / rows;
    let size = Math.max(24, Math.min(58, Math.floor(Math.min(cellW, cellH))));

    // Ensure the board is at least wide enough to comfortably host the HUD bar (2 pills + 3 buttons)
    const minBoardWidth = Math.min(320, availW + boardPad);
    if (cols * size + boardPad < minBoardWidth) {
        size = Math.min(68, Math.ceil((minBoardWidth - boardPad) / cols));
    }

    boardEl.style.setProperty('--cell', `${size}px`);

    const hudControls = document.getElementById('hud-controls');
    if (hudControls) {
        const exactBoardWidth = cols * size + boardPad;
        hudControls.style.setProperty('--board-w', `${exactBoardWidth}px`);
    }
}

// Updates the contextual hint below the board (shown only on tutorials T0/T1 and first Boss level 10)
function updateLevelHint(index) {
    const hintBox = document.getElementById('hint-box');
    const hintKb = document.getElementById('hint-keyboard');
    const hintTouch = document.getElementById('hint-touch');
    if (!hintBox || !hintKb || !hintTouch) return;

    if (index === 0) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintT0Keyboard');
        hintTouch.innerHTML = t('hintT0Touch');
    } else if (index === 1) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintT1Keyboard');
        hintTouch.innerHTML = t('hintT1Touch');
    } else if (index === 9) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintBoss10');
        hintTouch.innerHTML = t('hintBoss10');
    } else {
        hintBox.classList.add('hidden');
    }
}

function loadLevel(index) {
    if (index >= levels.length) {
        document.body.classList.remove('boss-level');
        showModal(t('victoryTitle'), t('victoryMsg'), () => {
            currentLevelIndex = 0;
            loadLevel(0);
        });
        return;
    }

    const levelEntry = levels[index];
    const rawData = Array.isArray(levelEntry) ? levelEntry : levelEntry.map;
    const levelNumber = index + 1;
    const boss = isBossLevel(levelNumber);

    grid = [];
    inputLocked = false;
    playerDir = 'down';
    pushCount = 0;
    lastMove = null;
    moveHistory = [];
    undosRemaining = boss ? 0 : MAX_UNDOS;
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

    // Update UI & Boss milestone styling
    document.body.classList.toggle('boss-level', boss);
    if (bossBadge) {
        bossBadge.classList.toggle('hidden', !boss);
    }

    levelDisplay.innerText = t('levelLabel', { n: levelNumber });
    updateLevelHint(index);

    const levelCode = getActiveLevelCode(levelNumber);
    if (levelCode) {
        codeBadge.innerText = t('codeBadge', { code: levelCode });
        codeBadge.classList.remove('hidden');
    } else {
        codeBadge.classList.add('hidden');
    }

    setupTimer(index, levelEntry);
    updateUndoUI();
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

        if (timeLeft > 0 && timeLeft <= 5) {
            playSound('tick');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            inputLocked = true;
            updateUndoUI();
            showModal(t('timesUpTitle'), t('timesUpMsg'), () => {
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
    else if (['z', 'Z', 'Backspace'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        undoMove();
        return;
    } else if (['r', 'R'].includes(e.key)) {
        restartCurrentLevel();
        return;
    }

    if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        move(dx, dy);
    }
}

// Mobile continuous swipe handling.
// Uses Pointer Events with pointer capture on <body>, which is never re-rendered,
// so moves keep reaching window even though the board cells are rebuilt on each move.
function setupSwipeControls() {
    let lastX = 0;
    let lastY = 0;
    let activePointerId = null;

    // Proportional step distance (clamped between 30px and 44px)
    const getStepThreshold = () => {
        const cellVal = parseFloat(boardEl.style.getPropertyValue('--cell')) || 36;
        return Math.max(30, Math.min(44, Math.round(cellVal * 0.95)));
    };

    window.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        if (!gameStarted || inputLocked) {
            activePointerId = null;
            return;
        }
        if (e.target.closest('button, input, #password-box, #modal-content')) return;

        activePointerId = e.pointerId;
        lastX = e.clientX;
        lastY = e.clientY;
        try {
            document.body.setPointerCapture(e.pointerId);
        } catch (err) {
            // Capture not supported: events still arrive through the original target
        }
    });

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'touch' || e.pointerId !== activePointerId) return;
        if (!gameStarted || inputLocked) {
            activePointerId = null;
            return;
        }

        const step = getStepThreshold();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (Math.abs(dx) < step && Math.abs(dy) < step) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            move(dx > 0 ? 1 : -1, 0);
            lastX = dx > 0 ? Math.min(e.clientX, lastX + step) : Math.max(e.clientX, lastX - step);
            lastY = e.clientY;
        } else {
            move(0, dy > 0 ? 1 : -1);
            lastY = dy > 0 ? Math.min(e.clientY, lastY + step) : Math.max(e.clientY, lastY - step);
            lastX = e.clientX;
        }
    }, { passive: true });

    const endPointer = (e) => {
        if (e.pointerId === activePointerId) activePointerId = null;
    };
    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
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
    recordMoveSnapshot();
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
    playSound(lastMove.boxLanded ? 'target' : 'move');
    lastMove = null;
    updateUndoUI();
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
        updateUndoUI();
        playSound('win');

        setTimeout(() => {
            const completedLevel = currentLevelIndex + 1;
            const wasBoss = isBossLevel(completedLevel);
            const nextLevel = completedLevel + 1;
            const isNewCheckpoint = nextLevel >= 11 && (nextLevel - 1) % 10 === 0;
            const nextCode = isNewCheckpoint ? getActiveLevelCode(nextLevel) : null;

            const title = wasBoss ? t('bossDefeatedTitle') : t('levelCompleteTitle');
            const msg = nextCode
                ? t('levelCompleteCodeMsg', { n: nextLevel, code: nextCode })
                : t('levelCompleteMsg');

            showModal(title, msg, () => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            });
        }, 200);
    }
}

function restartCurrentLevel() {
    loadLevel(currentLevelIndex);
}

// Modal logic
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
