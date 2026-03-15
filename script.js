


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
    let ms = subset.map(t => t.isDnf ? Infinity : t.time).sort((a,b) => a-b).slice(1, -1);
    if (ms.includes(Infinity)) return "DNF";
    return ms.reduce((a,b) => a+b, 0) / ms.length;
}


 function isMobileDevice() { return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches; } 
 function loadCSS(file) { const link = document.createElement("link"); link.rel = "stylesheet"; link.href = file; document.head.appendChild(link); } 
 if (isMobileDevice()) { loadCSS("./styles/style-mobile.css"); } else { loadCSS("./styles/style-desktop.css"); }

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

        // Show notification for 3 seconds
        function showNotification(message, type = 'info') {
            const notifBox = document.getElementById('notificationsBox');
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
            const saved = localStorage.getItem('cubeTimerTimes');
            if (saved) {
                times = JSON.parse(saved);
                updateTimesList();
            }
        }

        // Save times to localStorage
        function saveTimes() {
            localStorage.setItem('cubeTimerTimes', JSON.stringify(times));
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

        // Scramble generator for 3x3 cube
        function generateScramble() {
            const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
            const modifiers = ['', "'", '2'];
            let scramble = [];
            let lastMove = '';

            for (let i = 0; i < 20; i++) {
                let move;
                do {
                    move = moves[Math.floor(Math.random() * moves.length)];
                } while (move === lastMove); // Avoid consecutive same moves
                lastMove = move;
                const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
                scramble.push(move + modifier);
            }

            return scramble.join(' ');
        }

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
            date: new Date().toLocaleTimeString(),
            scramble: currentScramble,
            isPlusTwo: false, // Dodajemy flagi dla kar
            isDnf: false
        });
        
        saveTimes(); 
        updateTimesList();
        updateLastSolveDisplay();
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
                icon.src = './media/icons/bluetooth_connected.png';
            } else {
                icon.src = './media/icons/bluetooth.png';
            }
        }

        function updateGanTimerInfo(state, value) {
            ganTimerState = state;
            
            let stateText = '';
            switch(state) {
                case 'idle':
                    stateText = '🔄 Idle - Place hands on timer';
                    if (ganTimerLastState !== GAN_STATE.IDLE) {
        resetTimer(); 
        updateGanTimerInfo('idle', 0);
        console.log('GAN State: IDLE - Timer Reseted');
    }
    break;
                case 'hands_on':
                    stateText = '👆 Hands On - Hold and wait...';
                    setTimerState('holding');
                    break;
                case 'hands_off':
                    stateText = '⚡ Hands Off - Waiting during grace period';
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
                switch(stateCode) {
                    case GAN_STATE.DISCONNECT:
                        console.log('GAN State: DISCONNECT');
                        updateGanTimerInfo('disconnected', 0);
                    updateBluetoothIcon(false);
                    case GAN_STATE.IDLE:
                        if (ganTimerLastState !== GAN_STATE.IDLE) {
                            updateGanTimerInfo('idle', 0);
                            console.log('GAN State: IDLE');
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
// --- START ---
window.onload = function() {
    loadTimes();
    updateLastSolveDisplay();
    loadOrGenerateScramble();
    updateTimesList();
    updateStats();
    
    // Inicjalizacja stanu koloru na start
    setTimerState('default');
    
    console.log("Cubyy załadowany pomyślnie!");
};