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
 * OPTIONAL MECHANICS:
 * '_' / 'p' / 'P' = Pressure plate
 * 'D' / 'd'       = Door controlled by pressure plate
 * 'T'             = Player-only teleporter pad (paired)
 * 'N' / 'S' / 'E' / 'W' = Perimeter room gateway (multi-room levels)
 */

// Levels are defined in levels.js as `const levels = [...]`
// Languages are defined in locales folder.
const levelsList = (typeof levels !== 'undefined') ? levels : [];

let currentLevelIndex = 0;

// Quick start system via URL (?level=N)
const urlParams = new URLSearchParams(window.location.search);
const requestedLevel = parseInt(urlParams.get('level') || urlParams.get('livello'), 10);
const hasDirectLevelParam = !isNaN(requestedLevel) && requestedLevel > 0 && requestedLevel <= levelsList.length;
if (hasDirectLevelParam) {
    currentLevelIndex = requestedLevel - 1;
}

// Game state (supports single-room `map` and multi-room `rooms` + `links`)
let roomsGrid = [];          // Array of 2D char grids, one per room
let activeRoom = 0;          // Currently displayed room index
let grid = [];               // Alias to roomsGrid[activeRoom]
let roomPortals = [];        // Per-room Map("x,y" -> perimeter gateway metadata)
let roomTeleporters = [];    // Per-room Map("x,y" -> { room, x, y } destination pad)
let player = { x: 0, y: 0 };
let plate = null;            // { room, x, y }
let door = null;             // { room, x, y }
let playerDir = 'down';
let pushCount = 0;
let lastMove = null;
let roomTransitionDir = null;

// Undo state (max 3 per normal level, disabled on Boss levels)
const MAX_UNDOS = 3;
let moveHistory = [];
let undosRemaining = MAX_UNDOS;

// 3-Star rating system (persisted in localStorage)
const STARS_STORAGE_KEY = 'sokonova_stars';

function loadSavedStars() {
    try {
        const raw = localStorage.getItem(STARS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (_) {
        return {};
    }
}

function saveLevelStars(levelNumber, stars) {
    const saved = loadSavedStars();
    const prev = saved[levelNumber] || 0;
    const isNewBest = stars > prev;
    if (isNewBest) {
        saved[levelNumber] = stars;
        try {
            localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(saved));
        } catch (_) {}
    }
    return { best: Math.max(prev, stars), isNewBest };
}

const LEVELS_PER_PAGE = 20;

function isLevelUnlocked(levelNumber, savedStars = loadSavedStars()) {
    if (levelNumber <= 1) return true;
    return (savedStars[levelNumber - 1] || 0) >= 1 || (savedStars[levelNumber] || 0) >= 1;
}

function getLatestUnlockedLevel(savedStars = loadSavedStars()) {
    let latest = 1;
    for (let lvl = 2; lvl <= levelsList.length; lvl++) {
        if (isLevelUnlocked(lvl, savedStars)) {
            latest = lvl;
        }
    }
    return latest;
}

function calculateEarnedStars(pushes, levelEntry) {
    const minPushes = (levelEntry && typeof levelEntry.minPushes === 'number')
        ? levelEntry.minPushes
        : null;

    if (minPushes === null || pushes <= minPushes) return 3;

    const twoStarLimit = minPushes + Math.max(2, Math.ceil(minPushes * 0.3));
    if (pushes <= twoStarLimit) return 2;

    return 1;
}

// Lock controls during transitions/modals
let inputLocked = false;
let gameStarted = false;

// Timer variables
let timerInterval = null;
let timeLimit = 0;
let timeLeft = 0;
let timerStarted = false;
let isPaused = false;

// Score-based timer rules: every 15 score points above TIMER_BASE_SCORE adds one 10s tier,
// from 30s up to a 180s cap (reached at score 261 and above)
const TIMER_FREE_LEVELS = 10;   // levels 1..10: untimed tutorial & warm-up
const TIMER_MIN_SECONDS = 30;   // minimum time limit (score <= 50)
const TIMER_MAX_SECONDS = 180;  // maximum time limit (3 minutes, reached at score >= 261)
const TIMER_STEP_SECONDS = 10;  // tier increment in seconds
const TIMER_BASE_SCORE = 50;    // highest score still in the 30s tier (also fallback if a level has no score)
const TIMER_SCORE_STEP = 15;    // score points per 10s tier

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

function formatRoomLabel(roomIdx, totalRooms) {
    const template = t('roomLabel', { current: roomIdx + 1, total: totalRooms });
    if (template === 'roomLabel') {
        return `Room ${roomIdx + 1}/${totalRooms}`;
    }
    return template;
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
    if (langLabel) {
        langLabel.innerText = currentLang.toUpperCase();
    }

    for (const code of SUPPORTED_LANGS) {
        const flagEl = document.getElementById(`flag-${code}`);
        if (flagEl) flagEl.classList.toggle('hidden', currentLang !== code);
    }

    const homeLabel = document.getElementById('home-label');
    if (homeLabel) homeLabel.innerText = 'HOME';
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
    updatePauseUI();

    if (gameStarted) {
        const levelNumber = currentLevelIndex + 1;
        levelDisplay.innerText = t('levelLabel', { n: levelNumber });
        updateRoomBadge();
        updateLevelHint(currentLevelIndex);
    }

    if (dashboardOpen) {
        renderDashboard();
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
const homeBtn = document.getElementById('home-btn');
const soundBtn = document.getElementById('sound-btn');
const undoBtn = document.getElementById('undo-btn');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const pauseIconPause = document.getElementById('pause-icon-pause');
const pauseIconPlay = document.getElementById('pause-icon-play');
const boardWrapper = document.getElementById('board-wrapper');
const pauseOverlay = document.getElementById('pause-overlay');

// Modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');
let modalCallback = null;

function getOrCreateRoomBadge() {
    let badge = document.getElementById('room-badge');
    if (!badge && levelDisplay && levelDisplay.parentElement) {
        badge = document.createElement('span');
        badge.id = 'room-badge';
        badge.className = 'hidden text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md badge-room';
        levelDisplay.parentElement.appendChild(badge);
    }
    return badge;
}

function updateRoomBadge() {
    const badge = getOrCreateRoomBadge();
    if (!badge) return;
    if (roomsGrid.length > 1) {
        badge.innerText = formatRoomLabel(activeRoom, roomsGrid.length);
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Boss levels occur every 20 levels starting at level 20 (20, 40, 60, ...)
function isBossLevel(levelNumber) {
    return levelNumber >= 20 && levelNumber % 20 === 0;
}

// Pressure plate & door helpers
function normalizeCoord(coord, defaultRoom = 0) {
    if (!coord) return null;
    if (Array.isArray(coord)) {
        if (coord.length >= 3) {
            return { room: coord[0], x: coord[1], y: coord[2] };
        }
        if (coord.length >= 2) {
            return { room: defaultRoom, x: coord[0], y: coord[1] };
        }
    }
    if (typeof coord.x === 'number' && typeof coord.y === 'number') {
        return {
            room: typeof coord.room === 'number' ? coord.room : defaultRoom,
            x: coord.x,
            y: coord.y
        };
    }
    return null;
}

function isPlatePressed() {
    if (!plate) return false;
    const rGrid = roomsGrid[plate.room];
    if (!rGrid || !rGrid[plate.y]) return false;
    const cell = rGrid[plate.y][plate.x];
    return cell === '@' || cell === '+' || cell === '$' || cell === '*';
}

function isDoorOpen() {
    if (!door) return true;
    if (isPlatePressed()) return true;
    const rGrid = roomsGrid[door.room];
    const doorCell = (rGrid && rGrid[door.y]) ? rGrid[door.y][door.x] : null;
    return doorCell === '@' || doorCell === '+' || doorCell === '$' || doorCell === '*';
}

function isCellBlockedByDoor(roomIdx, x, y) {
    return Boolean(door && door.room === roomIdx && door.x === x && door.y === y && !isDoorOpen());
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
    if (themeLabel) themeLabel.innerText = theme.label.toUpperCase();

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
    const soundLabel = document.getElementById('sound-label');
    if (btn) btn.title = soundEnabled ? t('soundOnTitle') : t('soundOffTitle');
    if (iconOn) iconOn.classList.toggle('hidden', !soundEnabled);
    if (iconOff) iconOff.classList.toggle('hidden', soundEnabled);
    if (soundLabel) {
        soundLabel.innerText = soundEnabled ? 'ON' : 'OFF';
        soundLabel.classList.toggle('theme-accent', soundEnabled);
        soundLabel.classList.toggle('text-slate-500', !soundEnabled);
    }
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
    const themeId = (THEMES[currentThemeIndex] && THEMES[currentThemeIndex].id) || 'classic';

    const playTone = (freqStart, freqEnd, duration, wave, gainPeak, delay = 0, attack = 0.008) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freqStart, now + delay);
        if (freqEnd !== freqStart) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + delay + duration);
        }

        const startAt = now + delay;
        const safeAttack = Math.min(attack, duration * 0.45);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(gainPeak, startAt + safeAttack);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + duration + 0.015);
    };

    const playFilteredTone = (freqStart, freqEnd, filterStart, filterEnd, duration, wave, gainPeak, delay = 0, q = 3) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const startAt = now + delay;
        osc.type = wave;
        osc.frequency.setValueAtTime(freqStart, startAt);
        if (freqEnd !== freqStart) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), startAt + duration);
        }

        filter.type = 'lowpass';
        filter.Q.setValueAtTime(q, startAt);
        filter.frequency.setValueAtTime(filterStart, startAt);
        if (filterEnd !== filterStart) {
            filter.frequency.exponentialRampToValueAtTime(Math.max(20, filterEnd), startAt + duration);
        }

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(startAt + duration + 0.015);
    };

    // 1. SCI-FI: sweep sintetici filtrati, risonanze spaziali e accordi cristallini
    if (themeId === 'scifi') {
        if (type === 'move') {
            playFilteredTone(260, 140, 1400, 380, 0.055, 'sawtooth', 0.05, 0, 4);
        } else if (type === 'portal') {
            playFilteredTone(320, 760, 700, 2600, 0.12, 'sawtooth', 0.06, 0, 5);
            playTone(640, 960, 0.11, 'sine', 0.06, 0.04, 0.01);
        } else if (type === 'teleport') {
            playFilteredTone(480, 1280, 900, 3400, 0.14, 'sawtooth', 0.065, 0, 6);
            playTone(960, 420, 0.12, 'triangle', 0.055, 0.05, 0.008);
        } else if (type === 'undo') {
            playFilteredTone(520, 190, 1800, 420, 0.085, 'sawtooth', 0.055, 0, 4);
        } else if (type === 'plateOn') {
            playFilteredTone(340, 680, 900, 2400, 0.08, 'triangle', 0.075, 0, 4);
        } else if (type === 'plateOff') {
            playFilteredTone(620, 290, 2200, 700, 0.08, 'triangle', 0.065, 0, 4);
        } else if (type === 'target') {
            playTone(587.33, 587.33, 0.13, 'triangle', 0.08, 0, 0.01);      // D5
            playTone(590.50, 590.50, 0.13, 'sine', 0.06, 0, 0.01);          // D5 detuned
            playTone(880.00, 880.00, 0.22, 'triangle', 0.09, 0.07, 0.012);  // A5
            playTone(884.00, 884.00, 0.22, 'sine', 0.07, 0.07, 0.012);      // A5 detuned
        } else if (type === 'win') {
            playFilteredTone(523.25, 523.25, 1200, 2800, 0.14, 'sawtooth', 0.06, 0, 3);      // C5
            playFilteredTone(659.25, 659.25, 1400, 3000, 0.14, 'sawtooth', 0.06, 0.08, 3);   // E5
            playFilteredTone(783.99, 783.99, 1600, 3200, 0.15, 'sawtooth', 0.065, 0.16, 3);  // G5
            playTone(1046.50, 1046.50, 0.34, 'sine', 0.11, 0.24, 0.015);                     // C6
            playTone(1051.00, 1051.00, 0.34, 'triangle', 0.06, 0.24, 0.015);                 // C6 shimmer
        } else if (type === 'tick') {
            const isFinalSecond = timeLeft === 1;
            playFilteredTone(isFinalSecond ? 1180 : 880, isFinalSecond ? 980 : 760, 2400, 900, 0.045, 'sawtooth', 0.055, 0, 4);
        } else if (type === 'pause') {
            playFilteredTone(620, 280, 2000, 600, 0.09, 'triangle', 0.06, 0, 3);
        } else if (type === 'resume') {
            playFilteredTone(300, 660, 800, 2200, 0.09, 'triangle', 0.065, 0, 3);
        }
        return;
    }

    // 2. ARCADE: chiptune 8-bit secco (onde square, attacchi istantanei, salti di frequenza)
    if (themeId === 'arcade') {
        if (type === 'move') {
            playTone(165, 110, 0.038, 'square', 0.045, 0, 0.002);
        } else if (type === 'portal') {
            playTone(330, 330, 0.045, 'square', 0.055, 0, 0.002);
            playTone(494, 494, 0.045, 'square', 0.055, 0.04, 0.002);
            playTone(659, 659, 0.06, 'square', 0.06, 0.08, 0.002);
        } else if (type === 'teleport') {
            playTone(523, 262, 0.04, 'square', 0.055, 0, 0.002);
            playTone(784, 1046, 0.075, 'square', 0.065, 0.038, 0.002);
        } else if (type === 'undo') {
            playTone(392, 392, 0.038, 'square', 0.05, 0, 0.002);
            playTone(262, 262, 0.05, 'square', 0.05, 0.035, 0.002);
        } else if (type === 'plateOn') {
            playTone(440, 440, 0.038, 'square', 0.055, 0, 0.002);
            playTone(587, 587, 0.05, 'square', 0.06, 0.035, 0.002);
        } else if (type === 'plateOff') {
            playTone(587, 587, 0.038, 'square', 0.05, 0, 0.002);
            playTone(440, 440, 0.05, 'square', 0.05, 0.035, 0.002);
        } else if (type === 'target') {
            playTone(659.25, 659.25, 0.065, 'square', 0.07, 0, 0.002);      // E5
            playTone(987.77, 987.77, 0.13, 'square', 0.08, 0.06, 0.002);    // B5
        } else if (type === 'win') {
            playTone(523.25, 523.25, 0.085, 'square', 0.075, 0, 0.002);     // C5
            playTone(659.25, 659.25, 0.085, 'square', 0.075, 0.08, 0.002);  // E5
            playTone(783.99, 783.99, 0.085, 'square', 0.075, 0.16, 0.002);  // G5
            playTone(1046.50, 1046.50, 0.24, 'square', 0.085, 0.24, 0.002); // C6
        } else if (type === 'tick') {
            const isFinalSecond = timeLeft === 1;
            playTone(isFinalSecond ? 1046 : 784, isFinalSecond ? 1046 : 784, 0.035, 'square', 0.055, 0, 0.002);
        } else if (type === 'pause') {
            playTone(523, 523, 0.04, 'square', 0.055, 0, 0.002);
            playTone(392, 392, 0.06, 'square', 0.055, 0.045, 0.002);
        } else if (type === 'resume') {
            playTone(392, 392, 0.04, 'square', 0.055, 0, 0.002);
            playTone(523, 523, 0.06, 'square', 0.06, 0.045, 0.002);
        }
        return;
    }

    // 3. MONUMENT: acustico-vetroso minimalista (marimba / campane morbide con decadimento arioso)
    if (themeId === 'monument') {
        if (type === 'move') {
            playTone(220, 175, 0.07, 'sine', 0.055, 0, 0.014);
        } else if (type === 'portal') {
            playTone(440, 440, 0.18, 'sine', 0.07, 0, 0.018);        // A4
            playTone(659.25, 659.25, 0.22, 'sine', 0.065, 0.06, 0.018); // E5
        } else if (type === 'teleport') {
            playTone(523.25, 523.25, 0.18, 'sine', 0.07, 0, 0.016);     // C5
            playTone(783.99, 783.99, 0.24, 'sine', 0.075, 0.055, 0.018);// G5
            playTone(1567.98, 1567.98, 0.22, 'sine', 0.025, 0.055, 0.02); // G6 armonica
        } else if (type === 'undo') {
            playTone(329.63, 246.94, 0.11, 'sine', 0.065, 0, 0.015);
        } else if (type === 'plateOn') {
            playTone(392.00, 392.00, 0.15, 'sine', 0.07, 0, 0.015);     // G4
            playTone(783.99, 783.99, 0.15, 'sine', 0.025, 0, 0.015);    // G5 armonica
        } else if (type === 'plateOff') {
            playTone(293.66, 293.66, 0.15, 'sine', 0.065, 0, 0.015);    // D4
        } else if (type === 'target') {
            playTone(523.25, 523.25, 0.24, 'sine', 0.095, 0, 0.018);       // C5
            playTone(1046.50, 1046.50, 0.22, 'sine', 0.03, 0, 0.02);       // C6 armonica
            playTone(783.99, 783.99, 0.34, 'sine', 0.10, 0.08, 0.02);      // G5
        } else if (type === 'win') {
            playTone(523.25, 523.25, 0.32, 'sine', 0.10, 0, 0.02);         // C5
            playTone(659.25, 659.25, 0.36, 'sine', 0.10, 0.11, 0.02);      // E5
            playTone(783.99, 783.99, 0.44, 'sine', 0.11, 0.22, 0.02);      // G5
            playTone(1174.66, 1174.66, 0.52, 'sine', 0.08, 0.33, 0.025);   // D6 (nona aperta)
        } else if (type === 'tick') {
            const isFinalSecond = timeLeft === 1;
            playTone(isFinalSecond ? 880 : 659.25, isFinalSecond ? 880 : 659.25, 0.07, 'sine', 0.07, 0, 0.012);
        } else if (type === 'pause') {
            playTone(440, 329.63, 0.12, 'sine', 0.065, 0, 0.015);
        } else if (type === 'resume') {
            playTone(329.63, 440, 0.12, 'sine', 0.065, 0, 0.015);
        }
        return;
    }

    // 4. CLASSIC (default): profilo originale invariato
    if (type === 'move') {
        playTone(190, 130, 0.055, 'triangle', 0.07);
    } else if (type === 'portal') {
        playTone(340, 540, 0.085, 'sine', 0.085, 0);
        playTone(540, 680, 0.095, 'sine', 0.075, 0.055);
    } else if (type === 'teleport') {
        playTone(420, 760, 0.075, 'sine', 0.085, 0);
        playTone(620, 980, 0.10, 'triangle', 0.075, 0.045);
    } else if (type === 'undo') {
        playTone(260, 165, 0.075, 'triangle', 0.08);
    } else if (type === 'plateOn') {
        playTone(330, 460, 0.065, 'sine', 0.08);
    } else if (type === 'plateOff') {
        playTone(390, 260, 0.065, 'sine', 0.07);
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
    } else if (type === 'pause') {
        playTone(360, 240, 0.08, 'triangle', 0.075);
    } else if (type === 'resume') {
        playTone(240, 360, 0.08, 'triangle', 0.075);
    }
}

// Undo state management
function updateUndoUI() {
    if (!undoBtn) return;
    const boss = isBossLevel(currentLevelIndex + 1);
    const canUndo = !boss && !isPaused && undosRemaining > 0 && moveHistory.length > 0 && !inputLocked;
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
        roomsGrid: roomsGrid.map(r => r.map(row => [...row])),
        activeRoom,
        player: { x: player.x, y: player.y },
        playerDir,
        pushCount
    });
    if (moveHistory.length > MAX_UNDOS) {
        moveHistory.shift();
    }
}

function undoMove() {
    if (inputLocked || isPaused || !gameStarted) return;
    if (isBossLevel(currentLevelIndex + 1)) return;
    if (undosRemaining <= 0 || moveHistory.length === 0) return;

    const prev = moveHistory.pop();
    undosRemaining--;

    const roomChanged = activeRoom !== prev.activeRoom;
    roomsGrid = prev.roomsGrid;
    activeRoom = prev.activeRoom;
    grid = roomsGrid[activeRoom];
    player = { x: prev.player.x, y: prev.player.y };
    playerDir = prev.playerDir;
    pushCount = prev.pushCount;
    pushesDisplay.innerText = pushCount;
    lastMove = null;

    if (roomChanged) {
        applyBoardGridDimensions();
        updateRoomBadge();
    }
    render(roomChanged);
    playSound('undo');
    updateUndoUI();
}

function syncCornerButtonsWidth() {
    const rootStyle = document.documentElement.style;
    rootStyle.removeProperty('--corner-btn-w');

    if (window.innerWidth < 640) return;

    const themeBtn = document.getElementById('theme-btn');
    const themeLabel = document.getElementById('theme-label');
    const langBtn = document.getElementById('lang-btn');
    const langLabel = document.getElementById('lang-label');
    const soundLabel = document.getElementById('sound-label');
    const homeLabel = document.getElementById('home-label');
    if (!themeBtn || typeof themeBtn.getBoundingClientRect !== 'function') return;

    const prevThemeWidth = themeBtn.style.width;
    themeBtn.style.width = 'auto';

    let maxW = 0;

    if (themeLabel) {
        const prevThemeText = themeLabel.innerText;
        for (const theme of THEMES) {
            themeLabel.innerText = theme.label.toUpperCase();
            maxW = Math.max(maxW, Math.ceil(themeBtn.getBoundingClientRect().width));
        }
        themeLabel.innerText = prevThemeText;
    }

    if (langBtn && typeof langBtn.getBoundingClientRect === 'function') {
        const prevW = langBtn.style.width;
        langBtn.style.width = 'auto';
        if (langLabel) {
            const prevLangText = langLabel.innerText;
            for (const code of SUPPORTED_LANGS) {
                langLabel.innerText = code.toUpperCase();
                maxW = Math.max(maxW, Math.ceil(langBtn.getBoundingClientRect().width));
            }
            langLabel.innerText = prevLangText;
        } else {
            maxW = Math.max(maxW, Math.ceil(langBtn.getBoundingClientRect().width));
        }
        langBtn.style.width = prevW;
    }

    if (soundBtn && typeof soundBtn.getBoundingClientRect === 'function') {
        const prevW = soundBtn.style.width;
        soundBtn.style.width = 'auto';
        if (soundLabel) {
            const prevSoundText = soundLabel.innerText;
            for (const stateText of ['ON', 'OFF']) {
                soundLabel.innerText = stateText;
                maxW = Math.max(maxW, Math.ceil(soundBtn.getBoundingClientRect().width));
            }
            soundLabel.innerText = prevSoundText;
        } else {
            maxW = Math.max(maxW, Math.ceil(soundBtn.getBoundingClientRect().width));
        }
        soundBtn.style.width = prevW;
    }

    if (homeBtn && typeof homeBtn.getBoundingClientRect === 'function') {
        const wasHidden = homeBtn.classList.contains('hidden');
        const prevVisibility = homeBtn.style.visibility;
        const prevHomeWidth = homeBtn.style.width;
        if (wasHidden) {
            homeBtn.style.visibility = 'hidden';
            homeBtn.classList.remove('hidden');
        }
        homeBtn.style.width = 'auto';
        if (homeLabel) homeLabel.innerText = 'HOME';
        maxW = Math.max(maxW, Math.ceil(homeBtn.getBoundingClientRect().width));

        homeBtn.style.width = prevHomeWidth;
        if (wasHidden) {
            homeBtn.classList.add('hidden');
        }
        homeBtn.style.visibility = prevVisibility;
    }

    themeBtn.style.width = prevThemeWidth;

    if (maxW > 0) {
        rootStyle.setProperty('--corner-btn-w', `${maxW}px`);
    }
}

// Initialize the game
function init() {
    setupInputMode();
    setupTheme();
    setupSound();
    setupLanguage();
    setupDashboardControls();
    syncCornerButtonsWidth();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncCornerButtonsWidth);
    }

    window.addEventListener('resize', () => {
        updateCellSize();
        syncCornerButtonsWidth();
    });

    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (!gameStarted && !dashboardOpen) {
            if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) return;
            openDashboard();
        } else if (dashboardOpen) {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                changeDashboardPage(-1);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                changeDashboardPage(1);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                goHome();
            }
        } else {
            handleKeyDown(e);
        }
    });

    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('#top-right-controls, #home-btn')) return;
        if (!gameStarted && !dashboardOpen) {
            e.preventDefault();
            openDashboard();
        }
    }, { passive: false });

    setupSwipeControls();

    // Click on the start screen (useful on PC)
    document.getElementById('start-overlay').addEventListener('click', (e) => {
        if (e.target.closest('#top-right-controls, #home-btn')) return;
        if (!gameStarted && !dashboardOpen) {
            openDashboard();
        }
    });

    if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSound();
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goHome();
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePause();
        });
    }

    modalBtn.addEventListener('click', () => {
        hideModal();
        if (modalCallback) modalCallback();
    });

    if (hasDirectLevelParam) {
        startLevelDirect(currentLevelIndex);
    }
}

// Returns to the welcome screen from either the dashboard or an active level
function goHome() {
    if (!gameStarted && !dashboardOpen) return;

    if (dashboardOpen) {
        closeDashboard();
    }

    if (gameStarted) {
        gameStarted = false;
        inputLocked = true;
        clearInterval(timerInterval);
        timerInterval = null;
        timerStarted = false;
        clearPauseState();
        modalCallback = null;
        hideModal();
        updateUndoUI();
        updatePauseUI();
        document.body.classList.remove('boss-level');
    }

    if (homeBtn) homeBtn.classList.add('hidden');

    const overlay = document.getElementById('start-overlay');
    overlay.classList.remove('hidden', 'opacity-0');
}

function startLevelFromDashboard(index) {
    if (gameStarted) return;
    currentLevelIndex = index;
    gameStarted = true;
    inputLocked = true;
    closeDashboard();
    if (homeBtn) homeBtn.classList.remove('hidden');
    loadLevel(currentLevelIndex);
}

function startLevelDirect(index) {
    if (gameStarted) return;
    currentLevelIndex = index;
    gameStarted = true;
    inputLocked = true;
    closeDashboard();

    const overlay = document.getElementById('start-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
        if (homeBtn) homeBtn.classList.remove('hidden');
        loadLevel(currentLevelIndex);
    }, 500);
}

function applyBoardGridDimensions() {
    if (!grid.length || !grid[0].length) return;
    const cols = grid[0].length;
    const rows = grid.length;
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    updateCellSize();
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

// Updates the contextual hint below the board
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
    } else if (index === 2) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintPlate3Keyboard');
        hintTouch.innerHTML = t('hintPlate3Touch');
    } else if (index === 3) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintTeleport4Keyboard');
        hintTouch.innerHTML = t('hintTeleport4Touch');
    } else if (index === 4) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintMultiRoom5Keyboard');
        hintTouch.innerHTML = t('hintMultiRoom5Touch');
    } else if (index === 19) {
        hintBox.classList.remove('hidden');
        hintKb.innerHTML = t('hintBoss20');
        hintTouch.innerHTML = t('hintBoss20');
    } else {
        hintBox.classList.add('hidden');
    }
}

// Resolves the interior landing cell and direction for a perimeter gateway
function resolveGatewayGeometry(rGrid, gx, gy) {
    const h = rGrid.length;
    const w = rGrid[0].length;
    const candidates = [
        { ix: gx - 1, iy: gy, outDx: 1, outDy: 0, arrow: '\u2192' },
        { ix: gx + 1, iy: gy, outDx: -1, outDy: 0, arrow: '\u2190' },
        { ix: gx, iy: gy - 1, outDx: 0, outDy: 1, arrow: '\u2193' },
        { ix: gx, iy: gy + 1, outDx: 0, outDy: -1, arrow: '\u2191' }
    ];
    for (const c of candidates) {
        if (c.iy >= 0 && c.iy < h && c.ix >= 0 && c.ix < w) {
            const cell = rGrid[c.iy][c.ix];
            if (cell !== '#' && cell !== 'N' && cell !== 'S' && cell !== 'E' && cell !== 'W') {
                return {
                    innerX: c.ix,
                    innerY: c.iy,
                    outDx: c.outDx,
                    outDy: c.outDy,
                    inDx: -c.outDx,
                    inDy: -c.outDy,
                    arrow: c.arrow
                };
            }
        }
    }
    return null;
}

function loadLevel(index) {
    if (index >= levelsList.length) {
        document.body.classList.remove('boss-level');
        showModal(t('victoryTitle'), t('victoryMsg'), () => {
            currentLevelIndex = 0;
            loadLevel(0);
        });
        return;
    }

    const levelEntry = levelsList[index];
    const rawRooms = Array.isArray(levelEntry)
        ? [levelEntry]
        : (Array.isArray(levelEntry.rooms) && levelEntry.rooms.length > 0
            ? levelEntry.rooms
            : [levelEntry.map]);

    const levelNumber = index + 1;
    const boss = isBossLevel(levelNumber);

    roomsGrid = [];
    roomPortals = rawRooms.map(() => new Map());
    roomTeleporters = rawRooms.map(() => new Map());
    activeRoom = 0;
    plate = Array.isArray(levelEntry) ? null : normalizeCoord(levelEntry.plate, 0);
    door = Array.isArray(levelEntry) ? null : normalizeCoord(levelEntry.door, 0);
    inputLocked = false;
    playerDir = 'down';
    pushCount = 0;
    lastMove = null;
    moveHistory = [];
    undosRemaining = boss ? 0 : MAX_UNDOS;
    pushesDisplay.innerText = '0';

    const asciiTeleports = [];

    // Build all rooms' grids
    for (let r = 0; r < rawRooms.length; r++) {
        const rawData = rawRooms[r];
        let maxWidth = 0;
        rawData.forEach(row => {
            if (row.length > maxWidth) maxWidth = row.length;
        });

        const rGrid = [];
        for (let y = 0; y < rawData.length; y++) {
            const rowArray = [];
            for (let x = 0; x < maxWidth; x++) {
                let char = rawData[y][x] || ' ';
                if (char === '@' || char === '+') {
                    activeRoom = r;
                    player.x = x;
                    player.y = y;
                } else if (char === '_' || char === 'p' || char === 'P') {
                    plate = { room: r, x, y };
                    char = ' ';
                } else if (char === 'D' || char === 'd') {
                    door = { room: r, x, y };
                    char = ' ';
                } else if (char === 'T' || char === 't') {
                    asciiTeleports.push({ room: r, x, y });
                    char = ' ';
                } else if (char === '%') {
                    plate = { room: r, x, y };
                    activeRoom = r;
                    player.x = x;
                    player.y = y;
                    char = '@';
                } else if (char === '&') {
                    plate = { room: r, x, y };
                    char = '$';
                } else if (char === 'o') {
                    door = { room: r, x, y };
                    activeRoom = r;
                    player.x = x;
                    player.y = y;
                    char = '@';
                } else if (char === '0') {
                    door = { room: r, x, y };
                    char = '$';
                } else if (char === 'N' || char === 'S' || char === 'E' || char === 'W') {
                    char = '#';
                }
                rowArray.push(char);
            }
            rGrid.push(rowArray);
        }
        roomsGrid.push(rGrid);
    }

    // Register paired ASCII 'T' teleporters (player-only transport)
    if (asciiTeleports.length === 2) {
        const [tpA, tpB] = asciiTeleports;
        roomTeleporters[tpA.room].set(`${tpA.x},${tpA.y}`, { room: tpB.room, x: tpB.x, y: tpB.y });
        roomTeleporters[tpB.room].set(`${tpB.x},${tpB.y}`, { room: tpA.room, x: tpA.x, y: tpA.y });
    }

    // Register explicit teleporter pairs if defined on levelEntry
    const explicitTeleports = (!Array.isArray(levelEntry) && Array.isArray(levelEntry.teleports))
        ? levelEntry.teleports
        : [];
    for (const tp of explicitTeleports) {
        if (!tp || !tp.a || !tp.b) continue;
        const aRoom = tp.a.room ?? 0;
        const bRoom = tp.b.room ?? 0;
        if (!roomsGrid[aRoom] || !roomsGrid[bRoom]) continue;
        roomTeleporters[aRoom].set(`${tp.a.x},${tp.a.y}`, { room: bRoom, x: tp.b.x, y: tp.b.y });
        roomTeleporters[bRoom].set(`${tp.b.x},${tp.b.y}`, { room: aRoom, x: tp.a.x, y: tp.a.y });
    }

    // Register bidirectional links between rooms
    const links = (!Array.isArray(levelEntry) && Array.isArray(levelEntry.links))
        ? levelEntry.links
        : [];

    for (const link of links) {
        if (!link || !link.a || !link.b) continue;
        const aRoom = link.a.room ?? 0;
        const bRoom = link.b.room ?? 0;
        if (!roomsGrid[aRoom] || !roomsGrid[bRoom]) continue;

        const geomA = resolveGatewayGeometry(roomsGrid[aRoom], link.a.x, link.a.y);
        const geomB = resolveGatewayGeometry(roomsGrid[bRoom], link.b.x, link.b.y);
        if (!geomA || !geomB) continue;

        roomPortals[aRoom].set(`${link.a.x},${link.a.y}`, {
            x: link.a.x,
            y: link.a.y,
            arrow: geomA.arrow,
            outDx: geomA.outDx,
            outDy: geomA.outDy,
            targetRoom: bRoom,
            targetInnerX: geomB.innerX,
            targetInnerY: geomB.innerY,
            targetInDx: geomB.inDx,
            targetInDy: geomB.inDy
        });

        roomPortals[bRoom].set(`${link.b.x},${link.b.y}`, {
            x: link.b.x,
            y: link.b.y,
            arrow: geomB.arrow,
            outDx: geomB.outDx,
            outDy: geomB.outDy,
            targetRoom: aRoom,
            targetInnerX: geomA.innerX,
            targetInnerY: geomA.innerY,
            targetInDx: geomA.inDx,
            targetInDy: geomA.inDy
        });
    }

    grid = roomsGrid[activeRoom];
    applyBoardGridDimensions();

    // Update UI & Boss milestone styling
    document.body.classList.toggle('boss-level', boss);
    if (bossBadge) {
        bossBadge.classList.toggle('hidden', !boss);
    }

    levelDisplay.innerText = t('levelLabel', { n: levelNumber });
    updateRoomBadge();
    updateLevelHint(index);

    clearPauseState();
    setupTimer(index, levelEntry);
    updateUndoUI();
    updatePauseUI();
    render();
}

function updatePauseUI() {
    if (!pauseBtn) return;
    const canPause = gameStarted && timeLimit > 0 && timerStarted && !inputLocked;
    pauseBtn.disabled = !canPause;

    if (pauseIconPause) pauseIconPause.classList.toggle('hidden', isPaused);
    if (pauseIconPlay) pauseIconPlay.classList.toggle('hidden', !isPaused);

    const label = (gameStarted && timeLimit <= 0)
        ? t('pauseUntimedTitle')
        : (isPaused ? t('resumeTitle') : t('pauseTitle'));
    pauseBtn.title = label;
    pauseBtn.setAttribute('aria-label', label);
    pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
}

function clearPauseState() {
    isPaused = false;
    if (boardWrapper) boardWrapper.classList.remove('is-paused');
    if (pauseOverlay) {
        pauseOverlay.classList.remove('pause-active');
        pauseOverlay.classList.add('pause-hidden');
    }
    if (restartBtn) restartBtn.disabled = false;
    updateUndoUI();
    updatePauseUI();
}

function pauseGame() {
    if (!gameStarted || inputLocked || isPaused || timeLimit <= 0 || !timerStarted) return;
    isPaused = true;
    clearInterval(timerInterval);
    timerInterval = null;

    if (boardWrapper) boardWrapper.classList.add('is-paused');
    if (pauseOverlay) {
        pauseOverlay.classList.remove('pause-hidden');
        pauseOverlay.classList.add('pause-active');
    }
    if (restartBtn) restartBtn.disabled = true;

    updateUndoUI();
    updatePauseUI();
    playSound('pause');
}

function resumeGame() {
    if (!isPaused) return;
    clearPauseState();
    if (timerStarted && timeLimit > 0 && !inputLocked) {
        runTimerInterval();
    }
    playSound('resume');
}

function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function setupTimer(index, levelEntry) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStarted = false;

    const limit = timeLimitForLevel(index, levelEntry);

    if (limit === null) {
        timeLimit = 0;
        timeLeft = 0;
        timerDisplay.innerText = "\u221E";
        timerDisplay.classList.remove('text-red-400');
        timerDisplay.classList.add('text-emerald-400');
    } else {
        timeLimit = limit;
        timeLeft = timeLimit;
        updateTimerUI();
    }
    updatePauseUI();
}

function runTimerInterval() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (inputLocked || isPaused) return;

        timeLeft--;
        updateTimerUI();

        if (timeLeft > 0 && timeLeft <= 5) {
            playSound('tick');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            inputLocked = true;
            updateUndoUI();
            updatePauseUI();
            showModal(t('timesUpTitle'), t('timesUpMsg'), () => {
                restartCurrentLevel();
            });
        }
    }, 1000);
}

function startLevelTimer() {
    if (timerStarted || timeLimit <= 0) return;
    timerStarted = true;
    runTimerInterval();
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

function render(withRoomTransition = false) {
    grid = roomsGrid[activeRoom];
    boardEl.innerHTML = '';

    if (withRoomTransition) {
        boardEl.classList.remove('room-transition');
        void boardEl.offsetWidth;
        boardEl.classList.add('room-transition');
    }

    const portalsMap = roomPortals[activeRoom] || new Map();
    const teleportersMap = roomTeleporters[activeRoom] || new Map();

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

                const portal = portalsMap.get(`${x},${y}`);
                if (portal) {
                    cell.classList.add('portal');
                    cell.dataset.arrow = portal.arrow;
                }
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

            if (teleportersMap.has(`${x},${y}`)) {
                cell.classList.add('teleporter');
            }
            if (plate && plate.room === activeRoom && plate.x === x && plate.y === y) {
                cell.classList.add('plate');
                if (isPlatePressed()) cell.classList.add('plate-active');
            }
            if (door && door.room === activeRoom && door.x === x && door.y === y) {
                cell.classList.add('door', isDoorOpen() ? 'door-open' : 'door-closed');
            }

            if (lastMove && lastMove.room === activeRoom) {
                const isMovedPlayer = lastMove.playerTo && lastMove.playerTo.x === x && lastMove.playerTo.y === y;
                const isMovedBox = lastMove.boxTo && lastMove.boxTo.room === activeRoom && lastMove.boxTo.x === x && lastMove.boxTo.y === y;

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
    if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (timeLimit > 0 && timerStarted) {
            e.preventDefault();
            togglePause();
        }
        return;
    }
    if (isPaused) return;

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
function setupSwipeControls() {
    let lastX = 0;
    let lastY = 0;
    let activePointerId = null;

    const getStepThreshold = () => {
        const cellVal = parseFloat(boardEl.style.getPropertyValue('--cell')) || 36;
        return Math.max(30, Math.min(44, Math.round(cellVal * 0.95)));
    };

    window.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        if (!gameStarted || inputLocked || isPaused) {
            activePointerId = null;
            return;
        }
        if (e.target.closest('button, input, #modal-content')) return;

        activePointerId = e.pointerId;
        lastX = e.clientX;
        lastY = e.clientY;
        try {
            document.body.setPointerCapture(e.pointerId);
        } catch (_) {}
    });

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'touch' || e.pointerId !== activePointerId) return;
        if (!gameStarted || inputLocked || isPaused) {
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

function dirNameFromDelta(dx, dy) {
    if (dy === -1) return 'up';
    if (dy === 1) return 'down';
    if (dx === -1) return 'left';
    return 'right';
}

function move(dx, dy) {
    updatePlayerDirection(dx, dy);

    const curGrid = roomsGrid[activeRoom];
    const portalsMap = roomPortals[activeRoom] || new Map();
    const newX = player.x + dx;
    const newY = player.y + dy;

    // Out of bounds
    if (newY < 0 || newY >= curGrid.length || newX < 0 || newX >= curGrid[newY].length) return;

    // Case A: Player steps directly into a room gateway
    const directPortal = portalsMap.get(`${newX},${newY}`);
    if (directPortal) {
        const dstRoom = directPortal.targetRoom;
        const dstGrid = roomsGrid[dstRoom];
        const dstX = directPortal.targetInnerX;
        const dstY = directPortal.targetInnerY;
        const dstCell = dstGrid[dstY][dstX];

        if (dstCell === ' ' || dstCell === '.') {
            applyStateTransition({
                px: player.x,
                py: player.y,
                pDestRoom: dstRoom,
                pDestX: dstX,
                pDestY: dstY,
                pushedBox: false,
                portalUsed: true,
                arrivalDir: dirNameFromDelta(directPortal.targetInDx, directPortal.targetInDy)
            });
            return;
        }

        // Box sitting right at the landing cell of the connected room -> push it deeper into dstRoom
        if (dstCell === '$' || dstCell === '*') {
            const beyondX = dstX + directPortal.targetInDx;
            const beyondY = dstY + directPortal.targetInDy;
            if (
                beyondY >= 0 && beyondY < dstGrid.length &&
                beyondX >= 0 && beyondX < dstGrid[beyondY].length
            ) {
                const beyondCell = dstGrid[beyondY][beyondX];
                if ((beyondCell === ' ' || beyondCell === '.') && !isCellBlockedByDoor(dstRoom, beyondX, beyondY)) {
                    applyStateTransition({
                        px: player.x,
                        py: player.y,
                        pDestRoom: dstRoom,
                        pDestX: dstX,
                        pDestY: dstY,
                        pushedBox: true,
                        bSrcRoom: dstRoom,
                        bSrcX: dstX,
                        bSrcY: dstY,
                        bDestRoom: dstRoom,
                        bDestX: beyondX,
                        bDestY: beyondY,
                        portalUsed: true,
                        arrivalDir: dirNameFromDelta(directPortal.targetInDx, directPortal.targetInDy)
                    });
                }
            }
        }
        return;
    }

    const targetCell = curGrid[newY][newX];

    // Wall or closed door
    if (targetCell === '#' || isCellBlockedByDoor(activeRoom, newX, newY)) return;

    // Empty cell or bare target -> move player within activeRoom
    if (targetCell === ' ' || targetCell === '.') {
        applyStateTransition({
            px: player.x,
            py: player.y,
            pDestRoom: activeRoom,
            pDestX: newX,
            pDestY: newY,
            pushedBox: false,
            portalUsed: false
        });
        return;
    }

    // Box to push (boxes never trigger player-only teleporters)
    if (targetCell === '$' || targetCell === '*') {
        const beyondX = newX + dx;
        const beyondY = newY + dy;

        if (beyondY >= 0 && beyondY < curGrid.length && beyondX >= 0 && beyondX < curGrid[beyondY].length) {
            // Case B: Box is pushed into a room gateway -> box transfers to connected room!
            const boxPortal = portalsMap.get(`${beyondX},${beyondY}`);
            if (boxPortal) {
                const dstRoom = boxPortal.targetRoom;
                const dstGrid = roomsGrid[dstRoom];
                const dstX = boxPortal.targetInnerX;
                const dstY = boxPortal.targetInnerY;
                const dstCell = dstGrid[dstY][dstX];

                if ((dstCell === ' ' || dstCell === '.') && !isCellBlockedByDoor(dstRoom, dstX, dstY)) {
                    applyStateTransition({
                        px: player.x,
                        py: player.y,
                        pDestRoom: activeRoom,
                        pDestX: newX,
                        pDestY: newY,
                        pushedBox: true,
                        bSrcRoom: activeRoom,
                        bSrcX: newX,
                        bSrcY: newY,
                        bDestRoom: dstRoom,
                        bDestX: dstX,
                        bDestY: dstY,
                        portalUsed: true
                    });
                }
                return;
            }

            const beyondCell = curGrid[beyondY][beyondX];
            if ((beyondCell === ' ' || beyondCell === '.') && !isCellBlockedByDoor(activeRoom, beyondX, beyondY)) {
                applyStateTransition({
                    px: player.x,
                    py: player.y,
                    pDestRoom: activeRoom,
                    pDestX: newX,
                    pDestY: newY,
                    pushedBox: true,
                    bSrcRoom: activeRoom,
                    bSrcX: newX,
                    bSrcY: newY,
                    bDestRoom: activeRoom,
                    bDestX: beyondX,
                    bDestY: beyondY,
                    portalUsed: false
                });
            }
        }
    }
}

function applyStateTransition(tr) {
    recordMoveSnapshot();
    startLevelTimer();

    const wasDoorOpen = isDoorOpen();
    const prevRoom = activeRoom;
    const srcGrid = roomsGrid[prevRoom];

    // Clear player from source cell
    srcGrid[tr.py][tr.px] = (srcGrid[tr.py][tr.px] === '+') ? '.' : ' ';

    if (tr.pushedBox) {
        pushCount++;
        pushesDisplay.innerText = pushCount;

        // Clear box from its source cell (also when it equals the player's destination)
        const bSrcGrid = roomsGrid[tr.bSrcRoom];
        bSrcGrid[tr.bSrcY][tr.bSrcX] = (bSrcGrid[tr.bSrcY][tr.bSrcX] === '*') ? '.' : ' ';

        // Place box at destination (boxes stay on teleporter pads without teleporting)
        const bDestGrid = roomsGrid[tr.bDestRoom];
        const beyondWasTarget = (bDestGrid[tr.bDestY][tr.bDestX] === '.');
        bDestGrid[tr.bDestY][tr.bDestX] = beyondWasTarget ? '*' : '$';
    }

    // Resolve player-only teleporter if the player stepped onto a teleporter pad
    let finalPRoom = tr.pDestRoom;
    let finalPX = tr.pDestX;
    let finalPY = tr.pDestY;
    let teleported = false;

    const tpMap = roomTeleporters[tr.pDestRoom];
    if (tpMap) {
        const tpDest = tpMap.get(`${tr.pDestX},${tr.pDestY}`);
        if (tpDest) {
            const tpCell = roomsGrid[tpDest.room][tpDest.y][tpDest.x];
            if ((tpCell === ' ' || tpCell === '.') && !isCellBlockedByDoor(tpDest.room, tpDest.x, tpDest.y)) {
                finalPRoom = tpDest.room;
                finalPX = tpDest.x;
                finalPY = tpDest.y;
                teleported = true;
            }
        }
    }

    // Place player at final destination
    const pDestGrid = roomsGrid[finalPRoom];
    const destWasTarget = (pDestGrid[finalPY][finalPX] === '.');
    pDestGrid[finalPY][finalPX] = destWasTarget ? '+' : '@';

    activeRoom = finalPRoom;
    grid = roomsGrid[activeRoom];
    player.x = finalPX;
    player.y = finalPY;
    if (tr.arrivalDir) {
        playerDir = tr.arrivalDir;
    }

    const roomChanged = (prevRoom !== activeRoom);
    const nowDoorOpen = isDoorOpen();
    const boxLandedOnTarget = tr.pushedBox && (roomsGrid[tr.bDestRoom][tr.bDestY][tr.bDestX] === '*');

    const finishMove = () => {
        if (!roomChanged && !teleported) {
            lastMove = {
                room: activeRoom,
                dx: finalPX - tr.px,
                dy: finalPY - tr.py,
                playerTo: { x: finalPX, y: finalPY },
                boxTo: tr.pushedBox
                    ? { room: tr.bDestRoom, x: tr.bDestX, y: tr.bDestY }
                    : null,
                boxLanded: boxLandedOnTarget
            };
        } else if (!roomChanged && teleported) {
            lastMove = tr.pushedBox
                ? {
                    room: activeRoom,
                    dx: tr.bDestX - tr.bSrcX,
                    dy: tr.bDestY - tr.bSrcY,
                    playerTo: null,
                    boxTo: { room: tr.bDestRoom, x: tr.bDestX, y: tr.bDestY },
                    boxLanded: boxLandedOnTarget
                }
                : null;
        } else {
            lastMove = null;
            applyBoardGridDimensions();
            updateRoomBadge();
        }

        render(roomChanged);

        if (teleported) {
            const destCell = boardEl.children[finalPY * grid[0].length + finalPX];
            if (destCell) {
                destCell.classList.add('player-teleport-in');
                setTimeout(() => destCell.classList.remove('player-teleport-in'), 140);
            }
        }

        if (boxLandedOnTarget) {
            playSound('target');
        } else if (!teleported && tr.portalUsed) {
            playSound('portal');
        } else if (!teleported && door && wasDoorOpen !== nowDoorOpen) {
            playSound(nowDoorOpen ? 'plateOn' : 'plateOff');
        } else if (!teleported) {
            playSound('move');
        }

        lastMove = null;
        inputLocked = false;
        updateUndoUI();
        updatePauseUI();
        checkWinCondition();
    };

    if (teleported) {
        inputLocked = true;
        updatePauseUI();
        playSound('teleport');

        // Mostra dissolvenza in uscita sul pad di partenza se nella stanza corrente
        if (prevRoom === tr.pDestRoom) {
            const cols = roomsGrid[prevRoom][0].length;
            const entryCell = boardEl.children[tr.pDestY * cols + tr.pDestX];
            if (entryCell) {
                entryCell.classList.add('player', 'player-teleport-out');
                entryCell.dataset.dir = playerDir;
            }
        }

        setTimeout(finishMove, 95);
    } else {
        finishMove();
    }
}

function checkWinCondition() {
    let isComplete = true;

    for (let r = 0; r < roomsGrid.length; r++) {
        const rGrid = roomsGrid[r];
        for (let y = 0; y < rGrid.length; y++) {
            for (let x = 0; x < rGrid[y].length; x++) {
                if (rGrid[y][x] === '$') {
                    isComplete = false;
                    break;
                }
            }
            if (!isComplete) break;
        }
        if (!isComplete) break;
    }

    if (isComplete) {
        inputLocked = true;
        clearInterval(timerInterval);
        timerInterval = null;
        updateUndoUI();
        updatePauseUI();
        playSound('win');

        const completedLevel = currentLevelIndex + 1;
        const levelEntry = levelsList[currentLevelIndex];
        const earnedStars = calculateEarnedStars(pushCount, levelEntry);
        saveLevelStars(completedLevel, earnedStars);

        setTimeout(() => {
            const wasBoss = isBossLevel(completedLevel);
            const title = wasBoss ? t('bossDefeatedTitle') : t('levelCompleteTitle');
            const msg = t('levelCompleteMsg');

            showModal(title, msg, () => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, {
                earned: earnedStars
            });
        }, 200);
    }
}

function restartCurrentLevel() {
    if (isPaused) return;
    loadLevel(currentLevelIndex);
}

// Modal stars rendering
function renderModalStars(starsInfo) {
    let box = document.getElementById('modal-stars-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'modal-stars-box';
        modalMessage.parentElement.insertBefore(box, modalMessage);
    }

    if (!starsInfo) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }

    const starPath = 'M12 2.4l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.4z';
    const delays = ['0.10s', '0.24s', '0.38s'];

    const starsHtml = [1, 2, 3].map((idx) => {
        const earned = idx <= starsInfo.earned;
        return `
            <span class="star-slot ${earned ? 'earned' : ''}" style="--star-delay: ${delays[idx - 1]}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path class="star-empty" d="${starPath}" stroke-linejoin="round" />
                </svg>
                <svg class="star-fill" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="${starPath}" stroke-linejoin="round" />
                </svg>
            </span>
        `;
    }).join('');

    box.innerHTML = `
        <div class="modal-stars-row" aria-label="${starsInfo.earned}/3">${starsHtml}</div>
    `;
    box.classList.remove('hidden');
}

// Modal logic
function showModal(title, message, callback, starsInfo = null) {
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modalCallback = callback;

    renderModalStars(starsInfo);

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

let dashboardOpen = false;
let dashboardPage = 0;

function getTotalDashboardPages() {
    return Math.max(1, Math.ceil(levelsList.length / LEVELS_PER_PAGE));
}

function openDashboard(targetPage = null) {
    if (gameStarted || dashboardOpen) return;
    dashboardOpen = true;

    const latestUnlocked = getLatestUnlockedLevel();
    const defaultPage = Math.floor((latestUnlocked - 1) / LEVELS_PER_PAGE);
    dashboardPage = targetPage !== null
        ? Math.max(0, Math.min(getTotalDashboardPages() - 1, targetPage))
        : defaultPage;

    renderDashboard();

    const startOverlay = document.getElementById('start-overlay');
    const dashOverlay = document.getElementById('dashboard-overlay');

    if (startOverlay) {
        startOverlay.classList.add('opacity-0');
        setTimeout(() => {
            if (dashboardOpen) startOverlay.classList.add('hidden');
        }, 300);
    }

    if (dashOverlay) {
        dashOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            dashOverlay.classList.remove('opacity-0');
        });
    }

    if (homeBtn) homeBtn.classList.remove('hidden');
}

function closeDashboard() {
    dashboardOpen = false;
    const dashOverlay = document.getElementById('dashboard-overlay');
    if (dashOverlay) {
        dashOverlay.classList.add('opacity-0', 'hidden');
    }
}

function changeDashboardPage(delta) {
    if (!dashboardOpen) return;
    const totalPages = getTotalDashboardPages();
    const next = Math.max(0, Math.min(totalPages - 1, dashboardPage + delta));
    if (next !== dashboardPage) {
        dashboardPage = next;
        renderDashboard();
        playSound('move');
    }
}

function renderDashboard() {
    const gridEl = document.getElementById('dash-grid');
    const rangeEl = document.getElementById('dash-range-label');
    const pageStarsEl = document.getElementById('dash-page-stars');
    const totalStarsEl = document.getElementById('dash-total-stars');
    const totalCompEl = document.getElementById('dash-total-completed');
    const prevBtn = document.getElementById('dash-prev-btn');
    const nextBtn = document.getElementById('dash-next-btn');
    const dotsEl = document.getElementById('dash-dots');
    if (!gridEl) return;

    const savedStars = loadSavedStars();
    const totalLevels = levelsList.length;
    const totalPages = getTotalDashboardPages();

    // Global counters
    let totalStars = 0;
    let totalCompleted = 0;
    for (let lvl = 1; lvl <= totalLevels; lvl++) {
        const s = savedStars[lvl] || 0;
        if (s > 0) {
            totalStars += Math.min(3, s);
            totalCompleted++;
        }
    }
    if (totalStarsEl) totalStarsEl.innerText = `★ ${totalStars} / ${totalLevels * 3}`;
    if (totalCompEl) {
        const label = t('dashCompleted');
        const suffix = label === 'dashCompleted' ? 'COMPLETED' : label;
        totalCompEl.innerText = `${totalCompleted} / ${totalLevels} ${suffix}`;
    }

    // Current page range (20 per page)
    const startLevel = dashboardPage * LEVELS_PER_PAGE + 1;
    const endLevel = Math.min(totalLevels, startLevel + LEVELS_PER_PAGE - 1);
    const pageCapacity = (endLevel - startLevel + 1) * 3;
    let pageStars = 0;

    if (rangeEl) rangeEl.innerText = `${startLevel} / ${endLevel}`;
    if (prevBtn) prevBtn.disabled = dashboardPage <= 0;
    if (nextBtn) nextBtn.disabled = dashboardPage >= totalPages - 1;

    const starPath = 'M12 2.4l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.4z';
    const lockSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    `;

    gridEl.innerHTML = '';

    for (let lvl = startLevel; lvl <= endLevel; lvl++) {
        const stars = Math.min(3, savedStars[lvl] || 0);
        pageStars += stars;
        const unlocked = isLevelUnlocked(lvl, savedStars);
        const isCurrent = unlocked && stars === 0;
        const boss = isBossLevel(lvl);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.disabled = !unlocked;
        btn.className = `level-tile${isCurrent ? ' tile-current' : ''}${boss ? ' tile-boss' : ''}`;
        btn.setAttribute('aria-label', `Level ${lvl}`);

        const bossTag = boss ? `<span class="tile-boss-tag">BOSS</span>` : '';

        let bottomHtml = '';
        if (!unlocked) {
            bottomHtml = `<div class="tile-stars">${lockSvg}</div>`;
        } else {
            const starsSvg = [1, 2, 3].map((i) => `
                <svg class="tile-star ${i <= stars ? 'filled' : 'empty'}" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="${starPath}" stroke-linejoin="round" />
                </svg>
            `).join('');
            bottomHtml = `<div class="tile-stars">${starsSvg}</div>`;
        }

        btn.innerHTML = `
            ${bossTag}
            <span class="tile-number">${lvl}</span>
            ${bottomHtml}
        `;

        if (unlocked) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                startLevelFromDashboard(lvl - 1);
            });
        }

        gridEl.appendChild(btn);
    }

    if (pageStarsEl) pageStarsEl.innerText = `★ ${pageStars} / ${pageCapacity}`;

    // Dots
    if (dotsEl) {
        dotsEl.innerHTML = '';
        for (let p = 0; p < totalPages; p++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `dash-dot${p === dashboardPage ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Page ${p + 1}`);
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                if (dashboardPage !== p) {
                    dashboardPage = p;
                    renderDashboard();
                    playSound('move');
                }
            });
            dotsEl.appendChild(dot);
        }
    }
}

function setupDashboardControls() {
    const prevBtn = document.getElementById('dash-prev-btn');
    const nextBtn = document.getElementById('dash-next-btn');
    const dashOverlay = document.getElementById('dashboard-overlay');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeDashboardPage(-1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeDashboardPage(1);
        });
    }

    // Horizontal swipe on dashboard to switch pages
    if (dashOverlay) {
        let touchStartX = 0;
        let touchStartY = 0;
        dashOverlay.addEventListener('touchstart', (e) => {
            if (!dashboardOpen || e.touches.length !== 1) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        dashOverlay.addEventListener('touchend', (e) => {
            if (!dashboardOpen || e.changedTouches.length !== 1) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
                changeDashboardPage(dx < 0 ? 1 : -1);
            }
        }, { passive: true });
    }
}

// Start
init();