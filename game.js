/**
 * STANDARD SOKOBAN ASCII:
 * '#' = Muro
 * '@' = Giocatore
 * '$' = Blocco
 * '.' = Destinazione (Target)
 * '*' = Blocco su Destinazione
 * '+' = Giocatore su Destinazione
 * ' ' = Vuoto
 *
 */

// I livelli sono definiti in levels.js, caricato prima di questo file.


let currentLevelIndex = 0;

// Sistema di avvio rapido tramite URL (?livello=N)
const urlParams = new URLSearchParams(window.location.search);
const livelloRichiesto = parseInt(urlParams.get('livello'));
if (!isNaN(livelloRichiesto) && livelloRichiesto > 0 && livelloRichiesto <= levels.length) {
    // Sottraiamo 1 perché l'array parte da 0
    currentLevelIndex = livelloRichiesto - 1;
}

let grid = [];
let player = { x: 0, y: 0 };

// Timer Variables
let timerInterval = null;
let timeLeft = 0;
// ============================================================
// REGOLE DEL TIMER: modifica solo questi valori
// ============================================================
const TIMER_FREE_LEVELS = 10;   // livelli 1..10: nessun limite di tempo
const TIMER_BLOCK_SIZE = 30;    // ogni blocco di livelli ha lo stesso limite
const TIMER_BASE_SECONDS = 30;  // limite del primo blocco a tempo (livelli 11..40)
const TIMER_STEP_SECONDS = 30;  // aumento del limite per ogni blocco successivo

// Restituisce il limite in secondi per un livello (indice 0-based), oppure null se senza limite.
// Esempi con i valori attuali: 11-40 -> 30s, 41-70 -> 60s, 71-100 -> 90s, ...
function timeLimitForIndex(index) {
    if (index < TIMER_FREE_LEVELS) return null;
    const levelNumber = index + 1;
    const block = Math.floor((levelNumber - (TIMER_FREE_LEVELS + 1)) / TIMER_BLOCK_SIZE);
    return TIMER_BASE_SECONDS + block * TIMER_STEP_SECONDS;
}

let timeLimit = 60; // secondi del livello corrente (impostato in setupTimer)

// Lock controls during transitions/modals
let inputLocked = false;
let gameStarted = false;

// UI Elements
const boardEl = document.getElementById('game-board');
const levelDisplay = document.getElementById('level-display');
const timerDisplay = document.getElementById('timer-display');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');
let modalCallback = null;

// Rileva il tipo di dispositivo: 'touch' (telefono/tablet) oppure 'keyboard' (PC).
// Per provare l'altra modalità: aggiungi ?controlli=touch o ?controlli=tastiera all'URL.
function detectInputMode() {
    const forced = (urlParams.get('controlli') || '').toLowerCase();
    if (forced === 'touch') return 'touch';
    if (forced === 'tastiera' || forced === 'keyboard') return 'keyboard';

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const hasTouch = navigator.maxTouchPoints > 0;
    // Dispositivo con puntatore grossolano (dito): modalità touch.
    // Dispositivo con mouse o tastiera precisi: modalità tastiera.
    return (coarse || (!fine && hasTouch)) ? 'touch' : 'keyboard';
}

function setupInputMode() {
    document.body.dataset.mode = detectInputMode();
}

// Inizializza il gioco
function init() {
    setupInputMode();

    window.addEventListener('keydown', (e) => {
        if (!gameStarted) startGame();
        else handleKeyDown(e);
    });
    window.addEventListener('touchstart', (e) => {
        if (!gameStarted) startGame();
    }, { passive: false });

    setupSwipeControls();

    // Clic sulla schermata iniziale (utile su PC)
    document.getElementById('start-overlay').addEventListener('click', () => {
        if (!gameStarted) startGame();
    });

    modalBtn.addEventListener('click', () => {
        hideModal();
        if (modalCallback) modalCallback();
    });

    // Aspettiamo l'interazione dell'utente per avviare il primo livello
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

function loadLevel(index) {
    if (index >= levels.length) {
        showModal("Vittoria!", "Hai completato tutti i livelli. Sei un maestro di Sokonova!", () => {
            currentLevelIndex = 0;
            loadLevel(0);
        });
        return;
    }

    const rawData = levels[index];
    grid = [];
    inputLocked = false;

    // Larghezza massima per il padding e per la CSS Grid
    let maxWidth = 0;
    rawData.forEach(row => { if (row.length > maxWidth) maxWidth = row.length; });

    // Costruisci la griglia di gioco e trova il giocatore
    for (let y = 0; y < rawData.length; y++) {
        let rowArray = [];
        for (let x = 0; x < maxWidth; x++) {
            let char = rawData[y][x] || ' '; // Pad con spazi vuoti
            if (char === '@' || char === '+') {
                player.x = x;
                player.y = y;
            }
            rowArray.push(char);
        }
        grid.push(rowArray);
    }

    // Imposta il CSS Grid in base alle dimensioni della mappa
    boardEl.style.gridTemplateColumns = `repeat(${maxWidth}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;

    // Aggiorna UI
    levelDisplay.innerText = `Livello ${index + 1} / ${levels.length}`;

    setupTimer(index);
    render();
}

function setupTimer(index) {
    clearInterval(timerInterval);

    const limit = timeLimitForIndex(index);

    if (limit === null) {
        timerDisplay.innerText = "∞";
        timerDisplay.classList.remove('text-red-400');
        timerDisplay.classList.add('text-emerald-400');
    } else {
        timeLimit = limit;
        timeLeft = timeLimit;
        updateTimerUI();

        timerInterval = setInterval(() => {
            if (inputLocked) return; // Non scalare il tempo se il gioco è in pausa/modal

            timeLeft--;
            updateTimerUI();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                inputLocked = true;
                showModal("Tempo Scaduto!", "Hai esaurito il tempo a disposizione.", () => {
                    restartCurrentLevel();
                });
            }
        }, 1000);
    }
}

function updateTimerUI() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Rosso nell'ultimo terzo del tempo disponibile
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

            // Classi base e logica di rendering visivo
            cell.className = 'cell';

            if (char === '#') cell.classList.add('wall');
            else if (char === ' ') cell.classList.add('floor');
            else if (char === '.') cell.classList.add('target');
            else if (char === '$') cell.classList.add('box', 'floor');
            else if (char === '*') cell.classList.add('box-on-target', 'floor');
            else if (char === '@') cell.classList.add('player', 'floor');
            else if (char === '+') cell.classList.add('player', 'target');
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
        e.preventDefault(); // Previene scroll
        move(dx, dy);
    }
}

// Gestione swipe su Mobile
function setupSwipeControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 30; // Minima distanza per considerare valida la swipe

    // Previene pull-to-refresh e scroll nativo durante il gioco
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
            // Movimento orizzontale
            if (Math.abs(dx) > swipeThreshold) {
                if (dx > 0) move(1, 0); // Destra
                else move(-1, 0);       // Sinistra
            }
        } else {
            // Movimento verticale
            if (Math.abs(dy) > swipeThreshold) {
                if (dy > 0) move(0, 1); // Giù
                else move(0, -1);       // Su
            }
        }
    }, { passive: false });
}

function move(dx, dy) {
    let newX = player.x + dx;
    let newY = player.y + dy;

    // Fuori dai bordi
    if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[newY].length) return;

    let targetCell = grid[newY][newX];

    // Muro
    if (targetCell === '#') return;

    // Cella vuota o destinazione pura -> muovi giocatore
    if (targetCell === ' ' || targetCell === '.') {
        updateGrid(player.x, player.y, newX, newY, false);
        return;
    }

    // C'è un blocco da spingere
    if (targetCell === '$' || targetCell === '*') {
        let beyondX = newX + dx;
        let beyondY = newY + dy;

        // Controlla cosa c'è dietro il blocco
        if (beyondY >= 0 && beyondY < grid.length && beyondX >= 0 && beyondX < grid[beyondY].length) {
            let beyondCell = grid[beyondY][beyondX];

            // Se dietro c'è spazio o un target, spingi
            if (beyondCell === ' ' || beyondCell === '.') {
                updateGrid(player.x, player.y, newX, newY, true, beyondX, beyondY);
            }
        }
    }
}

function updateGrid(px, py, nx, ny, pushedBox, bx, by) {
    // Rimuovi il giocatore dalla vecchia posizione
    grid[py][px] = (grid[py][px] === '+') ? '.' : ' ';

    if (pushedBox) {
        // Muovi il blocco nella nuova posizione
        let beyondWasTarget = (grid[by][bx] === '.');
        grid[by][bx] = beyondWasTarget ? '*' : '$';

        // Il giocatore prende il posto del blocco
        let boxWasOnTarget = (grid[ny][nx] === '*');
        grid[ny][nx] = boxWasOnTarget ? '+' : '@';
    } else {
        // Movimento semplice del giocatore
        grid[ny][nx] = (grid[ny][nx] === '.') ? '+' : '@';
    }

    player.x = nx;
    player.y = ny;

    render();
    checkWinCondition();
}

function checkWinCondition() {
    let isComplete = true;
    // Controlla se ci sono ancora blocchi '$' non sulle destinazioni
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

        // Piccolo delay per far vedere l'ultimo blocco posizionato
        setTimeout(() => {
            showModal("Livello Superato!", "Ottimo lavoro! Preparati per la prossima sfida.", () => {
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

// Avvio
init();
