


function calculateAoX(size) {
    // Jeśli nie ma wystarczającej liczby ułożeń, zwróć kreski
    if (times.length < size) return "—";

    const recentTimes = times.slice(0, size);

    // Zliczamy ile jest DNF w danej grupie
    const dnfCount = recentTimes.filter(t => t.isDnf).length;

    // Według zasad WCA: w Ao5 dopuszczalny jest 1 DNF (staje się najgorszym czasem), 
    // ale 2 DNF to już DNF całej średniej. Dla uproszczenia tutaj: 
    // jeśli więcej niż 1 DNF -> DNF
    if (dnfCount > 1) return "DNF";

    // Wyciągamy wartości milisekund
    let msValues = recentTimes.map(t => {
        if (t.isDnf) return Infinity; // DNF traktujemy jako nieskończoność
        return t.time;
    });

    // Sortujemy rosnąco
    msValues.sort((a, b) => a - b);

    // Usuwamy najgorszy (ostatni) i najlepszy (pierwszy)
    const trimmedTimes = msValues.slice(1, -1);

    // Jeśli po ucięciu został jakiś Infinity, to znaczy że średnia to DNF
    if (trimmedTimes.includes(Infinity)) return "DNF";

    const sum = trimmedTimes.reduce((acc, val) => acc + val, 0);
    return formatTime(sum / trimmedTimes.length);
}

function updateStats() {
    // 1. Solves Count - to zawsze pokazujemy, nawet 0
    const countEl = document.getElementById('solvesCount');
    if (countEl) countEl.textContent = times.length;

    // Pobieramy elementy
    const pbEl = document.getElementById('PersonalBest');
    const pwEl = document.getElementById('PersonalWorst');
    const avgAllEl = document.getElementById('currentAllAvg');
    const ao5El = document.getElementById('currentAo5');
    const ao12El = document.getElementById('currentAo12');
    const ao100El = document.getElementById('currentAo100');
    const bestAo5El = document.getElementById('bestAo5');

    // Jeśli nie ma czasów, ustaw wszystko na "--"
    if (times.length === 0) {
        if (pbEl) pbEl.textContent = "—";
        if (pwEl) pwEl.textContent = "—";
        if (avgAllEl) avgAllEl.textContent = "—";
        if (ao5El) ao5El.textContent = "—";
        if (ao12El) ao12El.textContent = "—";
        if (ao100El) ao100El.textContent = "—";
        if (bestAo5El) bestAo5El.textContent = "—";
        return;
    }

    // Filtrujemy tylko poprawne ułożenia (bez DNF) dla statystyk ogólnych
    const validTimes = times.filter(t => !t.isDnf);

    // 2. Personal Best
    if (pbEl) {
        pbEl.textContent = validTimes.length > 0
            ? formatTime(Math.min(...validTimes.map(t => t.time)))
            : "—";
    }

    // 3. Personal Worst
    if (pwEl) {
        pwEl.textContent = validTimes.length > 0
            ? formatTime(Math.max(...validTimes.map(t => t.time)))
            : "—";
    }

    // 4. All times Average
    if (avgAllEl) {
        if (validTimes.length > 0) {
            const sumAll = validTimes.reduce((acc, t) => acc + t.time, 0);
            avgAllEl.textContent = formatTime(sumAll / validTimes.length);
        } else {
            avgAllEl.textContent = "DNF";
        }
    }

    // 5. Current Averages
    if (ao5El) ao5El.textContent = calculateAoX(5);
    if (ao12El) ao12El.textContent = calculateAoX(12);
    if (ao100El) ao100El.textContent = calculateAoX(100);

    // 6. Best Ao5
    if (bestAo5El) {
        if (times.length < 5) {
            bestAo5El.textContent = "—";
        } else {
            let bestAo5Value = Infinity;
            for (let i = 0; i <= times.length - 5; i++) {
                const res = calculateAoX_Internal(times.slice(i, i + 5));
                if (res !== "DNF" && res < bestAo5Value) bestAo5Value = res;
            }
            bestAo5El.textContent = bestAo5Value === Infinity ? "DNF" : formatTime(bestAo5Value);
        }
    }
}

// Pomocnicza funkcja wewnętrzna do szukania Best Ao5
function calculateAoX_Internal(subset) {
    const dnfCount = subset.filter(t => t.isDnf).length;
    if (dnfCount > 1) return "DNF";
    let ms = subset.map(t => t.isDnf ? Infinity : t.time).sort((a, b) => a - b).slice(1, -1);
    if (ms.includes(Infinity)) return "DNF";
    return ms.reduce((a, b) => a + b, 0) / ms.length;
}


        const themeStylesheet = document.createElement("link");
        themeStylesheet.rel = "stylesheet";
        document.head.appendChild(themeStylesheet);

        function isMobileDevice() { 
        return window.matchMedia("(max-width: 768px)").matches; 
        }

        function updateStyles() {
        const targetCss = isMobileDevice() ? "./styles/style-mobile.css" : "./styles/style-desktop.css";
        
        if (themeStylesheet.getAttribute("href") !== targetCss) {
            themeStylesheet.href = targetCss;
        }
        }

        updateStyles();

        window.addEventListener("resize", updateStyles);
        
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker is already registered!', reg))
            .catch(err => console.log('Error reghistering SW:', err));
    });
}


function toggleOptionsBar(show) {
    const bar = document.getElementById('options-bar');

    if (show) {
        bar.classList.add('show');
    } else {
        bar.classList.remove('show');
        // Resetujemy wizualnie ikony przy znikaniu
        document.getElementById('add2tosolve').classList.remove('active');
        document.getElementById('addDnfToSolve').classList.remove('active');
    }
}


const timesList = document.getElementById('timesList2');
const timesListIcon = document.getElementById('timesListIcon');
function timesListClick() {
    if (timesList.style.display === 'block' || timesList.style.display === '') {
        timesList.style.display = 'none';
        timesListIcon.style.transform = 'rotate(0deg)';
    } else {
        timesList.style.display = 'block';
        timesListIcon.style.transform = 'rotate(180deg)';
    }
}



function handleIconAction(event, actionFn) {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation(); // Kluczowe dla mobile: zatrzymuje timer
    actionFn();
}

// Obsługa +2
const btnPlusTwo = document.getElementById('add2tosolve');
const plusTwoAction = () => {
    if (times.length === 0) return;
    const lastSolve = times[0];
    if (lastSolve.isDnf) {
        lastSolve.isDnf = false;
        document.getElementById('addDnfToSolve').classList.remove('active');
    }
    lastSolve.isPlusTwo = !lastSolve.isPlusTwo;
    lastSolve.time += lastSolve.isPlusTwo ? 2000 : -2000;
    btnPlusTwo.classList.toggle('active', lastSolve.isPlusTwo);
    finalizeUpdate();
};
btnPlusTwo.onclick = (e) => handleIconAction(e, plusTwoAction);
btnPlusTwo.ontouchend = (e) => handleIconAction(e, plusTwoAction);

// Obsługa DNF
const btnDnf = document.getElementById('addDnfToSolve');
const dnfAction = () => {
    if (times.length === 0) return;
    const lastSolve = times[0];
    if (lastSolve.isPlusTwo) {
        lastSolve.time -= 2000;
        lastSolve.isPlusTwo = false;
        document.getElementById('add2tosolve').classList.remove('active');
    }
    lastSolve.isDnf = !lastSolve.isDnf;
    btnDnf.classList.toggle('active', lastSolve.isDnf);
    finalizeUpdate();
};
btnDnf.onclick = (e) => handleIconAction(e, dnfAction);
btnDnf.ontouchend = (e) => handleIconAction(e, dnfAction);

// Obsługa Usuwania
const btnDelete = document.getElementById('deleteSolve');
const deleteAction = () => {
    if (times.length === 0) return;
    if (confirm("Are you sure you want to delete the last solve?")) {
        times.shift();
        saveTimes();
        updateTimesList();
        updateLastSolveDisplay();
        elapsedTime = 0;
        document.getElementById('timerNumbers').textContent = '0.000';
        toggleOptionsBar(false);
        showNotification("Solve deleted", "info");
    }
};
btnDelete.onclick = (e) => handleIconAction(e, deleteAction);
btnDelete.ontouchend = (e) => handleIconAction(e, deleteAction);

/* --- TĘ FUNKCJĘ TEŻ ZOSTAWIAMY --- */
function finalizeUpdate() {
    saveTimes();
    updateTimesList();
    updateLastSolveDisplay();
    updateStats();
    const lastSolve = times[0];
    document.getElementById('timerNumbers').textContent = lastSolve.isDnf ? "DNF" : formatTime(lastSolve.time);
}

let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let isReady = false;
let times = [];
let bluetoothDevice = null;
let bluetoothCharacteristic = null;

let spacePressed = false;
let spacePressStartTime = 0;
const SPACE_HOLD_TIME = 500; // 500ms
let readyCheckInterval = null;
let pollInterval = null;

// Touch support variables
let touchStartTime = null;
let touchHoldInterval = null;

// GAN Timer UUIDs
const GAN_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const GAN_STATE_CHAR_UUID = '0000fff5-0000-1000-8000-00805f9b34fb';  // Subscribe to this for state
const GAN_TIME_CHAR_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

// GAN Timer state constants (official from library)
const GAN_STATE = {
    DISCONNECT: 0,
    GET_SET: 1,      // Ready to start
    HANDS_OFF: 2,
    RUNNING: 3,
    STOPPED: 4,
    IDLE: 5,
    HANDS_ON: 6,
    FINISHED: 7
};

let ganTimerLastState = null;
let ganTimerRecordedTime = 0;

let notificationTimeout = null;
let wakeLock = null;

// Request wake lock to keep screen on during timer
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen wake lock acquired');
            wakeLock.addEventListener('release', () => {
                console.log('Screen wake lock released');
            });
        }
    } catch (err) {
        console.log('Wake lock not available:', err);
    }
}
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    const msStr = milliseconds.toString().padStart(3, '0');

    if (minutes > 0) {
        // Format M:SS.mmm (sekundy muszą mieć zero wiodące, np. 1:05.000)
        const secStr = seconds.toString().padStart(2, '0');
        return `${minutes}:${secStr}.${msStr}`;
    } else {
        // Format S.mmm (bez zera wiodącego, np. 5.000)
        return `${seconds}.${msStr}`;
    }
}
// Release wake lock
function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

let currentCube = localStorage.getItem('cubeTimerCube') || '3x3';
let currentSessionId = localStorage.getItem('cubeTimerSessionId') || null;
let sessions = [];
let editingSessionId = null; // when set, session modal will perform edit instead of create
const CUBES = ["3x3", "2x2", "4x4", "Pyraminx", "Skewb"];

function getSessionsKey() {
    return 'cubeTimerSessions';
}

function getSessionTimesKey(sessionId) {
    return 'cubeTimerTimes_' + sessionId;
}

function defaultSessionIdForCube(cube) {
    return cube.toLowerCase().replace(/\s+/g, '') + '_default';
}

function loadSessions() {
    const raw = localStorage.getItem(getSessionsKey());
    if (raw) {
        try {
            sessions = JSON.parse(raw);
            if (!Array.isArray(sessions)) sessions = [];
        } catch (err) {
            sessions = [];
        }
    } else {
        sessions = [];
    }
}

function saveSessions() {
    localStorage.setItem(getSessionsKey(), JSON.stringify(sessions));
}

function ensureDefaultSession(cube) {
    const existingForCube = sessions.find(s => s.cube === cube);
    if (!existingForCube) {
        const defaultId = defaultSessionIdForCube(cube);
        sessions.push({
            id: defaultId,
            name: cube,
            cube: cube,
            createdAt: Date.now()
        });
    }
}

function ensureSessions() {
    loadSessions();
    CUBES.forEach(cube => ensureDefaultSession(cube));
    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (!currentSession) {
        const existing = sessions.find(s => s.cube === currentCube);
        currentSessionId = existing ? existing.id : defaultSessionIdForCube(currentCube);
    }
    const updatedSession = sessions.find(s => s.id === currentSessionId);
    if (!updatedSession || updatedSession.cube !== currentCube) {
        const existing = sessions.find(s => s.cube === currentCube);
        currentSessionId = existing ? existing.id : defaultSessionIdForCube(currentCube);
    }
    localStorage.setItem('cubeTimerSessionId', currentSessionId);
    saveSessions();
}

function getSessionsForCube(cube) {
    return sessions.filter(s => s.cube === cube);
}

function getCurrentSession() {
    return sessions.find(s => s.id === currentSessionId) || sessions.find(s => s.id === defaultSessionIdForCube(currentCube));
}

function updateSessionSelect() {
    const spinner = document.getElementById('session-spinner-text');
    const buttonText = document.getElementById('sessionCubeButtonText');
    const selectEl = document.getElementById('sessionSelect');

    const currentSession = getCurrentSession();
    if (spinner && currentSession) spinner.textContent = currentSession.name;
    if (buttonText && currentSession) buttonText.innerHTML = `${currentCube}  |  ${currentSession.name}`;
    if (selectEl) {
        const options = getSessionsForCube(currentCube).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        selectEl.innerHTML = options;
        selectEl.value = currentSession ? currentSession.id : defaultSessionIdForCube(currentCube);
    }
}

function buildSessionList() {
    const container = document.getElementById('sessionListItems');
    if (!container) return;
    const ordered = sessions.slice().sort((a, b) => {
        const cubeIndex = CUBES.indexOf(a.cube) - CUBES.indexOf(b.cube);
        if (cubeIndex !== 0) return cubeIndex;
        return a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' });
    });

    container.innerHTML = ordered.map(session => {
        const active = session.id === currentSessionId ? 'opacity: 0.65;' : '';
        const iconSource = isDarkMode() ? 'dm' : 'dm';
        return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 10px; border-bottom: 1px solid var(--md-sys-color-outline);">
            <button type="button" onclick="selectSession('${session.id}')"
                style="all: unset; width: 100%; display: flex; justify-content: space-between; align-items: center;  cursor: pointer; color: var(--md-sys-color-on-surface); background: transparent; ${active}">
                <span>${session.cube} | ${session.name}</span>
                <span style="opacity: 0.6; font-size: 0.95em;">Select</span>
            </button>
            <img src="./media/${iconSource}/edit_session.png" alt="Edit" style="background: var(--md-sys-color-surface-container-highest); padding: 2px; border-radius: 5px; width: 20px; height: 20px; cursor: pointer; margin-left: 10px;" onclick="editSession('${session.id}')">
            <img src="./media/${iconSource}/delete_session.png" alt="Delete" style="background: var(--md-sys-color-error-container); padding: 2px; border-radius: 5px; width: 20px; height: 20px; cursor: pointer; margin-left: 10px;" onclick="deleteSession('${session.id}')">
        </div>
            `;
    }).join('');
}

// Edit a session's name via browser prompt
function editSession(sessionId) {
    // reuse session modal for editing
    openSessionModal(sessionId);
}

// Delete a session after confirmation. Ensure at least one session remains per cube.
function deleteSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const cube = session.cube;
    const sessionsForCube = sessions.filter(s => s.cube === cube);
    if (sessionsForCube.length <= 1) {
        showNotification('Cannot delete the last session for this cube', 'error');
        return;
    }

    // create a custom confirm modal dynamically
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.zIndex = 1200;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'var(--md-sys-color-surface)';
    modal.style.color = 'var(--md-sys-color-on-surface)';
    modal.style.padding = '16px';
    modal.style.borderRadius = '12px';
    modal.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    modal.style.zIndex = 1201;
    modal.style.minWidth = '260px';

    modal.innerHTML = `
        <div style="font-weight:700; margin-bottom:8px;">Delete session</div>
        <div style="margin-bottom:12px;">Delete session "${session.name}"? This will permanently remove all times saved in this session.</div>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button id="_cancelDel" style="padding:8px 12px; border-radius:8px;">Cancel</button>
            <button id="_confirmDel" style="padding:8px 12px; border-radius:8px; background:var(--md-sys-color-error); color:var(--md-sys-color-on-error);">Delete</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const cleanup = () => {
        modal.remove();
        overlay.remove();
    };

    document.getElementById('_cancelDel').addEventListener('click', cleanup);
    document.getElementById('_confirmDel').addEventListener('click', () => {
        // Remove stored times for this session (if any)
        try { localStorage.removeItem(getSessionTimesKey(sessionId)); } catch (e) {}

        // Remove the session from the list
        sessions = sessions.filter(s => s.id !== sessionId);
        saveSessions();

        // If the deleted session was the current one, switch to another session for the same cube
        if (currentSessionId === sessionId) {
            const remaining = sessions.find(s => s.cube === cube);
            currentSessionId = remaining ? remaining.id : defaultSessionIdForCube(cube);
            localStorage.setItem('cubeTimerSessionId', currentSessionId);
            currentCube = cube;
            localStorage.setItem('cubeTimerCube', currentCube);
        }

        updateSessionSelect();
        buildSessionList();
        resetTimer();
        loadTimes();
        setNewScramble();
        updateLastSolveDisplay();
        updateStats();
        showNotification('Session deleted', 'info');
        cleanup();
    });
}

function toggleSessionList() {
    const popup = document.getElementById('sessionListPopup');
    if (!popup) return;
    if (popup.classList.contains('hidden2')) {
        buildSessionList();
        popup.classList.remove('hidden2');
    } else {
        popup.classList.add('hidden2');
    }
}

function hideSessionList() {
    const popup = document.getElementById('sessionListPopup');
    if (popup) popup.classList.add('hidden2');
}

function selectSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    currentSessionId = sessionId;
    currentCube = session.cube;
    localStorage.setItem('cubeTimerSessionId', currentSessionId);
    localStorage.setItem('cubeTimerCube', currentCube);

    ensureSessions();
    updateSessionSelect();
    hideSessionList();
    resetTimer();
    loadTimes();
    setNewScramble();
    updateLastSolveDisplay();
    updateStats();
}

function onSessionChange(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    currentSessionId = sessionId;
    localStorage.setItem('cubeTimerSessionId', currentSessionId);
    updateSessionSelect();
    resetTimer();
    loadTimes();
    updateLastSolveDisplay();
    updateStats();
}

function onCubeChange(newCube) {
    if (CUBES.includes(newCube)) {
        currentCube = newCube;
        localStorage.setItem('cubeTimerCube', currentCube);
        ensureSessions();
        updateSessionSelect();

        let spinner = document.getElementById('cube-spinner-text');
        if (spinner) spinner.textContent = currentCube;

        let selectEl = document.getElementById('cubeSelect');
        if (selectEl) selectEl.value = currentCube;

        resetTimer();
        loadTimes();
        setNewScramble();
        updateLastSolveDisplay();
        updateStats();
    }
}

function createNewSession(name) {
    if (!name || !name.trim()) return null;
    const safeName = name.trim();
    const sessionId = `session_${currentCube.toLowerCase().replace(/\s+/g, '')}_${Date.now()}`;
    const session = {
        id: sessionId,
        name: safeName,
        cube: currentCube,
        createdAt: Date.now()
    };
    sessions.push(session);
    saveSessions();
    return session;
}

function openSessionModal(sessionId = null) {
    const overlay = document.getElementById('sessionModalOverlay');
    const modal = document.getElementById('sessionModal');
    const input = document.getElementById('sessionNameInput');
    const title = modal ? modal.querySelector('h2') : null;
    if (!overlay || !modal || !input) return;

    editingSessionId = null;
    if (sessionId) {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return;
        input.value = session.name;
        editingSessionId = sessionId;
        if (title) title.textContent = 'Edit session';
    } else {
        input.value = '';
        if (title) title.textContent = 'New session';
    }

    overlay.classList.remove('hidden2');
    modal.classList.remove('hidden2');
    input.focus();
}

function closeSessionModal() {
    const overlay = document.getElementById('sessionModalOverlay');
    const modal = document.getElementById('sessionModal');
    if (overlay && modal) {
        overlay.classList.add('hidden2');
        modal.classList.add('hidden2');
        // reset editing state
        editingSessionId = null;
        const title = modal.querySelector('h2');
        if (title) title.textContent = 'New session';
    }
}

function createSessionFromModal() {
    const input = document.getElementById('sessionNameInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
        showNotification('Enter a session name', 'error');
        return;
    }

    if (editingSessionId) {
        // perform rename
        const session = sessions.find(s => s.id === editingSessionId);
        if (!session) {
            showNotification('Session not found', 'error');
            closeSessionModal();
            return;
        }
        session.name = name;
        saveSessions();
        updateSessionSelect();
        buildSessionList();
        showNotification('Session renamed', 'info');
        closeSessionModal();
        return;
    }

    const session = createNewSession(name);
    if (session) {
        currentSessionId = session.id;
        localStorage.setItem('cubeTimerSessionId', currentSessionId);
        updateSessionSelect();
        resetTimer();
        loadTimes();
        updateLastSolveDisplay();
        updateStats();
        closeSessionModal();
    }
}

function getStorageKey() {
    return currentSessionId ? getSessionTimesKey(currentSessionId) : (currentCube === '3x3' ? 'cubeTimerTimes' : 'cubeTimerTimes_' + currentCube);
}

// Show notification for 3 seconds
function showNotification(message, type = 'info') {
    const notifBox = document.getElementById('notificationsBox');
    if (!notifBox) return;
    const notifText = notifBox.querySelector('p');
    notifText.textContent = message;
    notifBox.style.display = 'block';

    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    // Hide after 3 seconds
    notificationTimeout = setTimeout(() => {
        notifBox.style.display = 'none';
    }, 3000);
}

// Load times from localStorage on page load
function loadTimes() {
    const key = getStorageKey();
    let saved = localStorage.getItem(key);
    if (!saved) {
        const legacyKey = currentCube === '3x3' ? 'cubeTimerTimes' : 'cubeTimerTimes_' + currentCube;
        saved = localStorage.getItem(legacyKey);
        if (saved) {
            localStorage.setItem(key, saved);
            localStorage.removeItem(legacyKey);
        }
    }
    if (saved) {
        times = JSON.parse(saved);
    } else {
        times = [];
    }
    updateTimesList();
}

// Save times to localStorage
function saveTimes() {
    localStorage.setItem(getStorageKey(), JSON.stringify(times));
}

// Delete all times
function deleteAllTimes() {
    if (confirm('Are you sure you want to delete all saved times?')) {
        times = [];
        resetTimer();
        toggleOptionsBar(false);
        updateLastSolveDisplay();
        updateTimesList();
        updateStats();
        saveTimes();
    }
}

// Scramble generator for cubes
function generateScramble() {
    if (currentCube === '2x2') {
        const sciany = ['U', 'R', 'F'];     
        const modyfikatory = ['', "'", '2'];     
        let scramble = [];     
        let ostatnia = null;     
        while (scramble.length < 11) {         
            let nowa = sciany[Math.floor(Math.random() * sciany.length)];         
            if (nowa === ostatnia) continue;         
            let mod = modyfikatory[Math.floor(Math.random() * modyfikatory.length)];         
            scramble.push(nowa + mod);         
            ostatnia = nowa;     }     
        return scramble.join(' ');
    } else if (currentCube === '4x4') {
const sciany3x3 = ['U', 'D', 'R', 'L', 'F', 'B'];
    const scianySzerokie = ['Uw', 'Rw', 'Fw']; // Ściany z 2x2 zamienione na 'w'
    const modyfikatory = ['', "'", '2'];
    const przeciwne = { 'U':'D', 'D':'U', 'R':'L', 'L':'R', 'F':'B', 'B':'F' };

    let scrambleBazy = [];
    let scramble = [];

    // Faza 1: 20 ruchów czystego 3x3
    while (scramble.length < 20) {
        let nowa = sciany3x3[Math.floor(Math.random() * sciany3x3.length)];
        let ostatnia = scrambleBazy[scrambleBazy.length - 1] || null;
        let przedostatnia = scrambleBazy[scrambleBazy.length - 2] || null;

        if (nowa === ostatnia) continue;
        if (ostatnia && nowa === przeciwne[ostatnia] && nowa === przedostatnia) continue;

        let mod = modyfikatory[Math.floor(Math.random() * modyfikatory.length)];
        scrambleBazy.push(nowa);
        scramble.push(nowa + mod);
    }

    // Faza 2: 20 ruchów przeplatanych (3x3 + szerokie Uw, Rw, Fw)
    while (scramble.length < 46) {
        // Losowanie typu ruchu (zwykły vs szeroki)
        let czySzeroki = Math.random() < 0.5;
        let pula = czySzeroki ? scianySzerokie : sciany3x3;
        let wylosowanyRuch = pula[Math.floor(Math.random() * pula.length)];

        let baza = wylosowanyRuch[0]; // Pierwsza litera ściany (np. 'Uw' -> 'U')
        let ostatnia = scrambleBazy[scrambleBazy.length - 1] || null;
        let przedostatnia = scrambleBazy[scrambleBazy.length - 2] || null;

        // Eliminacja powtórzeń na tej samej ścianie (np. R po Rw) oraz konfliktów osi
        if (baza === ostatnia) continue;
        if (ostatnia && baza === przeciwne[ostatnia] && baza === przedostatnia) continue;

        let mod = modyfikatory[Math.floor(Math.random() * modyfikatory.length)];
        scrambleBazy.push(baza);
        scramble.push(wylosowanyRuch + mod);
    }

    return scramble.join(' ');

    } else if (currentCube === 'Pyraminx') {
        const duzeSciany = ['U', 'L', 'R', 'B'];     const maleCzubki = ['u', 'l', 'r', 'b'];     const modyfikatory = ['', "'"];          let scramble = [];     let ostatnia = null;          while (scramble.length < 11) {         let nowa = duzeSciany[Math.floor(Math.random() * duzeSciany.length)];         if (nowa === ostatnia) continue;                  let mod = modyfikatory[Math.floor(Math.random() * modyfikatory.length)];         scramble.push(nowa + mod);         ostatnia = nowa;     }          maleCzubki.forEach(czubek => {         let stan = Math.floor(Math.random() * 3);         if (stan === 1) scramble.push(czubek);         else if (stan === 2) scramble.push(czubek + "'");     });          return scramble.join(' ');
    } else if (currentCube === 'Skewb') {
        const sciany = ['R', 'L', 'U', 'B'];     
        const modyfikatory = ['', "'"];          
        let scramble = [];     
        let ostatnia = null;          
        while (scramble.length < 11) {         
            let nowa = sciany[Math.floor(Math.random() * sciany.length)];         
            if (nowa === ostatnia) continue;                  
            let mod = modyfikatory[Math.floor(Math.random() * modyfikatory.length)];         
            scramble.push(nowa + mod);         ostatnia = nowa;     }          
        return scramble.join(' ');
    }

    // Default 3x3
    const sciany = ['U', 'D', 'R', 'L', 'F', 'B'];     
    const modyfikatory = ['', "'", '2'];     
    const przeciwne = { 'U':'D', 'D':'U', 'R':'L', 'L':'R', 'F':'B', 'B':'F' };     
    let scrambleSciany = []; 
    let scramble = [];     
    let dlugosc = 20;
    while (scramble.length < dlugosc) {         
        let nowaSciana = sciany[Math.floor(Math.random() * sciany.length)];         
        let ostatnia = scrambleSciany[scrambleSciany.length - 1] || null;         
        let przedostatnia = scrambleSciany[scrambleSciany.length - 2] || null;         
        if (nowaSciana === ostatnia) continue;         
        if (ostatnia && nowaSciana === przeciwne[ostatnia] && nowaSciana === przedostatnia) continue;         
        let mod = modyfikatory[Math.floor(Math.random() * modyfikatory.length)];         
        scrambleSciany.push(nowaSciana); scramble.push(nowaSciana + mod);     }     
    return scramble.join(' '); };


// Load scramble from localStorage or generate new one
function loadOrGenerateScramble() {
    setNewScramble(); // Always generate new scramble on page load
}

// Set new scramble and save it
function setNewScramble() {
    const newScramble = generateScramble();
    localStorage.setItem('cubeTimerScramble', newScramble);
    document.getElementById('scramble').textContent = newScramble;
}

// Get current scramble
function getCurrentScramble() {
    return document.getElementById('scramble').textContent.trim();
}

// --- Manual input time modal functions ---
function inputTime() {
    const overlay = document.getElementById('inputTimeOverlay');
    const modal = document.getElementById('inputTimeModal');
    const timeInput = document.getElementById('manualTimeInput');
    const scrambleInput = document.getElementById('manualScrambleInput');
    const dateInput = document.getElementById('manualDateInput');
    const useScr = document.getElementById('useCurrentScramble');
    const useDate = document.getElementById('useCurrentDate');
    if (!overlay || !modal || !timeInput || !scrambleInput || !dateInput || !useScr || !useDate) return;

    // Defaults
    timeInput.value = '';
    scrambleInput.value = getCurrentScramble();
    scrambleInput.disabled = true;
    useScr.checked = true;

    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    dateInput.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    dateInput.disabled = true;
    useDate.checked = true;

    // Wire checkbox toggles
    useScr.onchange = () => {
        scrambleInput.disabled = useScr.checked;
        if (useScr.checked) scrambleInput.value = getCurrentScramble();
    };
    useDate.onchange = () => {
        dateInput.disabled = useDate.checked;
        if (useDate.checked) {
            const d = new Date();
            dateInput.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
    };

    overlay.classList.remove('hidden2');
    modal.classList.remove('hidden2');
    timeInput.focus();
}

function closeInputTimeModal() {
    const overlay = document.getElementById('inputTimeOverlay');
    const modal = document.getElementById('inputTimeModal');
    const useScr = document.getElementById('useCurrentScramble');
    const useDate = document.getElementById('useCurrentDate');
    if (overlay && modal) {
        overlay.classList.add('hidden2');
        modal.classList.add('hidden2');
    }
    // clear handlers
    if (useScr) useScr.onchange = null;
    if (useDate) useDate.onchange = null;
}

function parseTimeToMs(str) {
    if (!str) return null;
    str = str.trim();
    // Accept formats: M:SS.mmm or S.mmm or SS.mmm
    if (str.includes(':')) {
        const parts = str.split(':');
        if (parts.length !== 2) return null;
        const minutes = parseInt(parts[0], 10);
        const secPart = parseFloat(parts[1].replace(',', '.'));
        if (isNaN(minutes) || isNaN(secPart)) return null;
        return Math.round(minutes * 60000 + secPart * 1000);
    } else {
        const seconds = parseFloat(str.replace(',', '.'));
        if (isNaN(seconds)) return null;
        return Math.round(seconds * 1000);
    }
}

function saveInputTime() {
    const timeInput = document.getElementById('manualTimeInput');
    const scrambleInput = document.getElementById('manualScrambleInput');
    const dateInput = document.getElementById('manualDateInput');
    const useScr = document.getElementById('useCurrentScramble');
    const useDate = document.getElementById('useCurrentDate');
    if (!timeInput || !scrambleInput || !dateInput || !useScr || !useDate) return;

    const ms = parseTimeToMs(timeInput.value);
    if (ms === null) {
        showNotification('Invalid time format', 'error');
        return;
    }

    const scramble = useScr.checked ? getCurrentScramble() : scrambleInput.value.trim();
    const timestamp = useDate.checked ? Date.now() : (new Date(dateInput.value)).getTime() || Date.now();

    const entry = {
        time: ms,
        date: timestamp,
        scramble: scramble,
        isPlusTwo: false,
        isDnf: false
    };

    // Save into current session (prepend)
    times.unshift(entry);
    saveTimes();
    updateTimesList();
    updateLastSolveDisplay();
    updateStats();

    // Show options bar like normal stop
    toggleOptionsBar(true);

    // Generate next scramble like a normal solve
    setNewScramble();

    closeInputTimeModal();
    showNotification('Manual time saved', 'success');
}


// Timer functions
function startTimer() {
    if (!isRunning) {
        toggleOptionsBar(false);
        isRunning = true;
        isReady = false;
        startTime = Date.now() - elapsedTime;
        document.getElementById('timerDisplay').style.fontWeight = 'bold';
        requestWakeLock();
        //showNotification('⏱️ Timer running...', 'info');

        timerInterval = setInterval(updateDisplay, 10);
    }
}
function formatDate(date) {
    timestamp = date;
    const formattedDate = new Date(timestamp).toLocaleString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    }).replace(',', ''); // Usuwa domyślny przecinek między czasem a datą
   return formattedDate; // Wynik: "16:50:00 31.07.2026"
}
function stopTimer(externalTime = null) {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);

        // Jeśli otrzymaliśmy precyzyjny czas z Gan Timera, nadpisujemy obliczenia Cubyy
        if (externalTime !== null) {
            elapsedTime = externalTime;
            // Od razu korygujemy licznik na ekranie do idealnej wartości
            document.getElementById('timerNumbers').textContent = formatTime(elapsedTime);
        }

        toggleOptionsBar(true);
        const currentScramble = getCurrentScramble();

        times.unshift({
            time: elapsedTime,
            date: Date.now(),
            scramble: currentScramble,
            isPlusTwo: false, // Dodajemy flagi dla kar
            isDnf: false
        });

        saveTimes();
        updateTimesList();
        updateStats();
        releaseWakeLock();
        //showNotification(`✓ Time saved: ${formatTime(elapsedTime)}`, 'success');

        setNewScramble();
    }
}
function resetTimer() {
    toggleOptionsBar(false);
    isRunning = false;
    isReady = false;
    if (timerInterval) clearInterval(timerInterval); // Czyścimy tylko jeśli istnieje
    elapsedTime = 0;
    spacePressed = false;

    // Aktualizacja wyglądu
    const timerNumbers = document.getElementById('timerNumbers');
    const timerDisplay = document.getElementById('timerDisplay');

    if (timerNumbers) timerNumbers.textContent = '0.000';
    if (timerDisplay) {
        timerDisplay.style.fontWeight = 'bold';
        setTimerState('default');
    }

    releaseWakeLock();

    // Sprawdzamy czy funkcja i zmienna istnieją
    if (typeof ganTimerState !== 'undefined' && ganTimerState !== 'disconnected') {
        if (typeof updateGanTimerInfo === 'function') {
            updateGanTimerInfo('idle', 0);
        }
    }
}
function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    document.getElementById('timerNumbers').textContent = formatTime(elapsedTime);
}

function updateTimesList() {
    const listContainer = document.getElementById('timesList');

    // TA LINIA JEST KLUCZOWA:
    if (!listContainer) return; // Jeśli nie ma listy na tej stronie, zakończ funkcję bezpiecznie

    const listHTML = times.map((t, index) => {
        const formatted = t.isDnf ? "DNF" : (formatTime(t.time) + (t.isPlusTwo ? "+" : ""));
        return `<div>#${times.length - index}: ${formatted}</div>`;
    }).join('');

    listContainer.innerHTML = listHTML || '(No times yet)';
}

// Bluetooth GanTimer functions
async function connectBluetooth() {
    try {
        // Check if Bluetooth API is available
        if (!navigator.bluetooth) {
            showNotification('⚠ Bluetooth API not supported in this browser', 'error');
            return;
        }

        showNotification('🔍 Searching for GanTimer...', 'info');

        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: [GAN_SERVICE_UUID] }
            ]
        }).catch(() => {
            // Fallback if filtered request doesn't work
            return navigator.bluetooth.requestDevice({
                acceptAllDevices: true
            });
        });

        bluetoothDevice = device;
        console.log('Connected to device:', device.name);

        const server = await device.gatt.connect();
        console.log('GATT server connected');

        // Get the GAN service
        let service;
        try {
            service = await server.getPrimaryService(GAN_SERVICE_UUID);
            console.log('Found GAN service');
        } catch (e) {
            console.log('GAN service not found');
            throw new Error('GAN service not found');
        }

        // Get the STATE characteristic (this is what we subscribe to)
        let stateCharacteristic;
        try {
            stateCharacteristic = await service.getCharacteristic(GAN_STATE_CHAR_UUID);
            console.log('Found GAN state characteristic - subscribing to this!');
        } catch (e) {
            console.log('State characteristic not found, trying alternatives');
            throw new Error('State characteristic not found');
        }

        bluetoothCharacteristic = stateCharacteristic;

        // Enable notifications/subscriptions on the state characteristic
        try {
            await bluetoothCharacteristic.startNotifications();
            console.log('Notifications ENABLED - waiting for automatic updates from device');
        } catch (e) {
            console.error('Failed to start notifications:', e);
            throw e;
        }

        // Listen for state updates from the device
        bluetoothCharacteristic.addEventListener('characteristicvaluechanged', handleGanTimerData);

        ganTimerLastState = null;
        updateGanTimerInfo('idle', 0);
        updateBluetoothIcon(true);
        requestWakeLock();
        showNotification(`✓ Connected: ${device.name || 'GanTimer Device'} - Ready to begin!`, 'success');
        console.log('GanTimer subscriptions active - ready for events');

    } catch (error) {
        console.error('Bluetooth connection error:', error);
        updateGanTimerInfo('disconnected', 0);
        updateBluetoothIcon(false);
        showNotification(`✗ Connection Failed: ${error.message}`, 'error');
    }
}

function updateBluetoothIcon(connected) {
    const icon = document.getElementById('bluetoothIcon');
    if (connected) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            icon.src = './media/dm/bluetooth_connected.png';
        } else {
            icon.src = './media/icons/bluetooth_connected.png';
        }
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            icon.src = './media/dm/bluetooth.png';
        } else {
            icon.src = './media/icons/bluetooth.png';
        }
    }
}

function updateGanTimerInfo(state, value) {
    ganTimerState = state;

    let stateText = '';
    switch (state) {
        case 'idle':
            stateText = '🔄 Idle - Place hands on timer';
            if (ganTimerLastState !== GAN_STATE.IDLE) {
                ganTimerLastState = GAN_STATE.IDLE;
                resetTimer();
                console.log('GAN State: IDLE - Timer Reseted');
            }
            break;
        case 'hands_on':
            stateText = '👆 Hands On - Hold and wait...';
            setTimerState('holding');
            break;
        case 'hands_off':
            stateText = '⚡ Hands Off - Waiting during grace period';
            setTimerState('default');
            break;
        case 'get_set':
            stateText = '⏳ Get Set! - Timer ready, remove hands to start';
            setTimerState('ready');
            break;
        case 'running':
            stateText = `⏱️ Running - ${(value / 1000).toFixed(3)}s`;
            setTimerState('default');
            break;
        case 'stopped':
            stateText = `⏹️ Stopped - Final: ${formatTime(value)}s`;
            setTimerState('default');
            break;
        case 'finished':
            stateText = `✅ Finished - ${(value / 1000).toFixed(3)}s saved`;
            break;
        case 'disconnected':
            stateText = '❌ Not Connected';
            return;
        default:
            stateText = `⚙️ ${state}`;
    }

    // Show status in notifications box instead of gantimerInfo div
    //showNotification(stateText, 'info');
}

function handleGanTimerData(event) {
    try {
        const value = event.target.value;
        const dataBytes = new Uint8Array(value.buffer);

        // GAN timer protocol: Byte 0 is magic 0xFE, Byte 3 is state
        if (dataBytes[0] !== 0xFE) {
            console.log('Invalid magic byte, received:', Array.from(dataBytes).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
            return;
        }

        const stateCode = dataBytes[3];
        console.log('GAN State:', stateCode, 'Raw:', Array.from(dataBytes).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));

        // Parse time if state is STOPPED
        let timerValue = 0;
        if (stateCode === GAN_STATE.STOPPED && dataBytes.length >= 8) {
            // Bytes 4-5: minutes, seconds
            // Bytes 6-7: milliseconds (little-endian)
            const minutes = dataBytes[4];
            const seconds = dataBytes[5];
            const millis = dataBytes[6] | (dataBytes[7] << 8);
            timerValue = (minutes * 60000) + (seconds * 1000) + millis;
            ganTimerRecordedTime = timerValue;
        }

        // Handle state transitions
        switch (stateCode) {
            case GAN_STATE.DISCONNECT:
                console.log('GAN State: DISCONNECT');
                updateGanTimerInfo('disconnected', 0);
                updateBluetoothIcon(false);
                break;
            case GAN_STATE.IDLE:
                if (ganTimerLastState !== GAN_STATE.IDLE) {
                    updateGanTimerInfo('idle', 0);
                    console.log('GAN State: IDLE');
                    updateLastSolveDisplay();
                }
                break;

            case GAN_STATE.HANDS_ON:
                if (ganTimerLastState !== GAN_STATE.HANDS_ON) {
                    updateGanTimerInfo('hands_on', 0);
                    console.log('GAN State: HANDS_ON');
                }
                break;

            case GAN_STATE.HANDS_OFF:
                if (ganTimerLastState !== GAN_STATE.HANDS_OFF) {
                    updateGanTimerInfo('hands_off', 0);
                    console.log('GAN State: HANDS_OFF');
                }
                break;

            case GAN_STATE.GET_SET:
                if (ganTimerLastState !== GAN_STATE.GET_SET) {
                    updateGanTimerInfo('get_set', 0);
                    isReady = true;
                    console.log('GAN State: GET_SET - Ready!');
                }
                break;

            case GAN_STATE.RUNNING:
                if (ganTimerLastState !== GAN_STATE.RUNNING) {
                    console.log('GAN State: RUNNING - Starting!');
                    if (!isRunning) {
                        startTimer();
                    }
                }
                // Update display with current running time
                updateGanTimerInfo('running', elapsedTime);
                break;

            case GAN_STATE.STOPPED:
                if (isRunning) {
                    // Przekazujemy timerValue bezprośrednio do funkcji
                    stopTimer(timerValue);
                } else {
                    // Jeśli timer nie biegł w aplikacji, ale stoper wysłał czas (np. szybkie ułożenie)
                    elapsedTime = timerValue;
                    document.getElementById('timerNumbers').textContent = formatTime(elapsedTime);
                    updateGanTimerInfo('stopped', timerValue);
                }
                console.log('GAN Precision Sync:', timerValue);
                break;

            case GAN_STATE.FINISHED:
                updateGanTimerInfo('finished', ganTimerRecordedTime);
                console.log('GAN State: FINISHED');
                break;

            default:
                console.log('Unknown state:', stateCode);
        }

        ganTimerLastState = stateCode;
    } catch (error) {
        console.error('Error parsing timer data:', error);
    }
}

function pollGanTimerData() {
    // No longer needed - subscription handles everything
}

// Touch support for mobile - hold 0.5s to ready, release to start
function handleTouchStart(event) {
    // Zapobiega domyślnym akcjom przeglądarki (zoom, scroll)
    if (event.cancelable) event.preventDefault();

    // 1. Jeśli timer działa - ZATRZYMAJ GO i wyjdź
    if (isRunning) {
        stopTimer();
        return;
    }

    // 2. Jeśli timer nie działa (jest zatrzymany)
    if (!spacePressed && !isReady) {
        // RESETUJEMY WIZUALNIE: Jeśli na ekranie jest stary czas, 
        // zerujemy go, ale NIE przerywamy funkcji, idziemy dalej do "hold"
        if (elapsedTime > 0) {
            elapsedTime = 0;
            document.getElementById('timerNumbers').textContent = '0.000';
        }
        updateLastSolveDisplay()
        // STARTUJEMY PROCEDURĘ TRZYMANIA (HOLD)
        spacePressed = true;
        touchStartTime = Date.now();

        // Zmieniamy kolor na czerwony (czekaj)
        setTimerState('holding');

        if (touchHoldInterval) clearInterval(touchHoldInterval);

        touchHoldInterval = setInterval(() => {
            if (spacePressed && (Date.now() - touchStartTime) >= SPACE_HOLD_TIME) {
                isReady = true;
                // Zmieniamy kolor na zielony (gotowy!)
                setTimerState('ready');
                //showNotification('🚀 Ready! Release to start...', 'info');
                clearInterval(touchHoldInterval);
            }
        }, 10);
    }
}

function handleTouchEnd(event) {
    if (event.cancelable) event.preventDefault();

    if (spacePressed) {
        clearInterval(touchHoldInterval);
        const holdTime = Date.now() - touchStartTime;
        spacePressed = false;

        if (isReady) {
            // Startujemy nowy pomiar
            setTimerState('default');
            startTimer();
            isReady = false;
        } else {
            // Puściłeś za wcześnie - zresetuj kolor i stan
            setTimerState('default');
            toggleOptionsBar(false)
            isReady = false;
            if (holdTime < SPACE_HOLD_TIME) {
                showNotification('👆 Hold for 0.5 seconds', 'info');
            }
        }
    }
}

// Keyboard shortcuts - Space hold for 0.5s to get ready, release to start, press to stop
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();

        // 1. Jeśli timer działa, zatrzymaj go i wyjdź
        if (isRunning) {
            stopTimer();
            return;
        }

        // 2. Logika "uzbrajania" (hold)
        if (!spacePressed && !isReady) {
            // Resetujemy wynik wizualnie, jeśli jakiś był, ale NIE przerywamy funkcji
            if (elapsedTime > 0) {
                resetTimer();
            }
            updateLastSolveDisplay();
            spacePressed = true;
            spacePressStartTime = Date.now();

            // Ustawiamy kolor CZERWONY od razu po naciśnięciu
            setTimerState('holding');
            //showNotification('⏸️ Holding space...', 'info');

            // Czyścimy stary interwał na wszelki wypadek
            if (readyCheckInterval) clearInterval(readyCheckInterval);

            readyCheckInterval = setInterval(() => {
                if (spacePressed && (Date.now() - spacePressStartTime) >= SPACE_HOLD_TIME) {
                    isReady = true;
                    // Zmieniamy na ZIELONY po 0.5s
                    setTimerState('ready');
                    document.getElementById('timerDisplay').style.fontWeight = 'bold';
                    //showNotification('🚀 Ready! Release to start...', 'info');
                    clearInterval(readyCheckInterval);
                }
            }, 10);
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (spacePressed) {
            clearInterval(readyCheckInterval);
            const holdTime = Date.now() - spacePressStartTime;
            spacePressed = false;

            // Powrót do domyślnego koloru cyfr
            setTimerState('default');

            if (isReady) {
                startTimer();
                isReady = false;
            } else if (holdTime < SPACE_HOLD_TIME) {
                showNotification('⏸️ Hold for 0.5 seconds', 'info');
            }
        }
    }
});

// Check for Bluetooth support
if (!navigator.bluetooth) {
    showNotification('⚠ Bluetooth API not supported in this browser', 'error');
} else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    showNotification('⚠ Web Bluetooth requires HTTPS or localhost', 'error');
}
function updateLastSolveDisplay() {
    const lastSolveElement = document.getElementById('last-solve');
    if (!lastSolveElement) return;

    if (times && times.length > 0) {
        const lastTime = times[0];

        // Ta sama logika co powyżej - sprawdzamy flagi obiektu lastTime
        const formatted = lastTime.isDnf ? "DNF" : (formatTime(lastTime.time) + (lastTime.isPlusTwo ? "+" : ""));

        lastSolveElement.textContent = `last solve: ${formatted}`;
        lastSolveElement.style.display = 'block';
    } else {
        lastSolveElement.textContent = '';
        lastSolveElement.style.display = 'none';
    }
}
function setTimerState(state) {
    const el = document.getElementById('timerNumbers');
    if (!el) return;

    // Usuwamy stare klasy
    el.classList.remove('timer-default', 'timer-ready', 'timer-holding');

    // Dodajemy właściwą klasę
    if (state === 'ready') el.classList.add('timer-ready');
    else if (state === 'holding') el.classList.add('timer-holding');
    else el.classList.add('timer-default');
}
function isDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        return true;
    } else {
        return false;
    }
}
// --- START ---
window.onload = function () {
    ensureSessions();
    updateSessionSelect();

    let spinner = document.getElementById('cube-spinner-text');
    if (spinner) spinner.textContent = currentCube;

    let selectEl = document.getElementById('cubeSelect');
    if (selectEl) selectEl.value = currentCube;

    loadTimes();
    updateLastSolveDisplay();
    loadOrGenerateScramble();
    updateTimesList();
    updateStats();

    // Inicjalizacja stanu koloru na start
    setTimerState('default');

    console.log("Cubyy załadowany pomyślnie!");
};

data = Date.now()
console.log(formatDate(data))