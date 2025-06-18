document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timerDisplay');
    const startButton = document.getElementById('startButton');
    const pomodoroTab = document.getElementById('pomodoroTab');
    const shortBreakTab = document.getElementById('shortBreakTab');
    const longBreakTab = document.getElementById('longBreakTab');
    const cycleNumberDisplay = document.getElementById('cycleNumber');
    const focusMessageDisplay = document.getElementById('focusMessage');

    const addTaskButton = document.getElementById('addTaskButton');
    const taskInputForm = document.getElementById('taskInputForm');
    const newTaskInput = document.getElementById('newTaskInput');
    const cancelTaskButton = document.getElementById('cancelTaskButton');
    const saveTaskButton = document.getElementById('saveTaskButton');
    const taskList = document.getElementById('taskList');

    // Settings Modal elements
    const settingButton = document.getElementById('settingButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsButton = document.getElementById('closeSettingsButton');
    const applySettingsButton = document.getElementById('applySettingsButton');

    const settingPomodoroTimeInput = document.getElementById('settingPomodoroTime');
    const settingShortBreakTimeInput = document.getElementById('settingShortBreakTime');
    const settingLongBreakTimeInput = document.getElementById('settingLongBreakTime');

    const bgColorPicker = document.getElementById('bgColor');
    const bgImageURLInput = document.getElementById('bgImageURL');
    const applyImageBgButton = document.getElementById('applyImageBg');
    const bgFileUploadInput = document.getElementById('bgFileUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const body = document.body;

    let countdown;
    let currentMode = 'pomodoro';
    let isRunning = false;
    let timeLeft = 0;
    let cycle = 1;

    let modes = {
        pomodoro: 45 * 60,
        'short-break': 5 * 60,
        'long-break': 15 * 60
    };

    let currentBackgroundOption = {
        type: 'color', // 'color', 'url', 'file'
        value: '#ba4949'
    };

    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('pomofocusSettings'));
        if (savedSettings) {
            modes.pomodoro = savedSettings.pomodoroTime * 60;
            modes['short-break'] = savedSettings.shortBreakTime * 60;
            modes['long-break'] = savedSettings.longBreakTime * 60;
            cycle = savedSettings.cycle || 1;
            currentBackgroundOption = savedSettings.backgroundOption || { type: 'color', value: '#ba4949' };

            settingPomodoroTimeInput.value = savedSettings.pomodoroTime;
            settingShortBreakTimeInput.value = savedSettings.shortBreakTime;
            settingLongBreakTimeInput.value = savedSettings.longBreakTime;

            applyBackground(currentBackgroundOption.type, currentBackgroundOption.value);
        }
        cycleNumberDisplay.textContent = cycle;
    }

    function saveSettings() {
        const settingsToSave = {
            pomodoroTime: parseInt(settingPomodoroTimeInput.value),
            shortBreakTime: parseInt(settingShortBreakTimeInput.value),
            longBreakTime: parseInt(settingLongBreakTimeInput.value),
            backgroundOption: currentBackgroundOption,
            cycle: cycle
        };
        localStorage.setItem('pomofocusSettings', JSON.stringify(settingsToSave));
    }

    function applyBackground(type, value) {
        body.style.backgroundImage = 'none'; // Clear any existing image
        body.style.backgroundColor = 'transparent'; // Clear any existing color

        if (type === 'color') {
            body.style.backgroundColor = value;
        } else if (type === 'url' || type === 'file') {
            body.style.backgroundImage = `url('${value}')`;
            body.style.backgroundColor = 'transparent'; // Ensure background color doesn't hide image
        }
    }

    function setMode(mode) {
        currentMode = mode;
        timeLeft = modes[mode];
        updateTimerDisplay();
        updateTabStyles(mode);
        resetTimer();
        updateFocusMessage(mode);
    }

    function updateTabStyles(activeMode) {
        document.querySelectorAll('.tab-button').forEach(button => {
            if (button.dataset.mode === activeMode) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.title = `${timerDisplay.textContent} - Pomofocus Clone`;
    }

    function updateFocusMessage(mode) {
        if (mode === 'pomodoro') {
            focusMessageDisplay.textContent = 'Time to focus!';
        } else if (mode === 'short-break') {
            focusMessageDisplay.textContent = 'Time for a short break!';
        } else if (mode === 'long-break') {
            focusMessageDisplay.textContent = 'Time for a long break!';
        }
    }

    function startTimer() {
        if (isRunning) {
            pauseTimer();
            return;
        }

        isRunning = true;
        startButton.textContent = 'PAUSE';
        startButton.style.color = '#555';
        startButton.style.backgroundColor = '#e7e7e7';

        countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                isRunning = false;
                startButton.textContent = 'START';
                startButton.style.color = '#ba4949';
                startButton.style.backgroundColor = '#fff';

                if (currentMode === 'pomodoro') {
                    cycle++;
                    cycleNumberDisplay.textContent = cycle;
                    if (cycle % 4 === 0) {
                        setMode('long-break');
                    } else {
                        setMode('short-break');
                    }
                } else {
                    setMode('pomodoro');
                }
                alert('Time is up! Switching to ' + currentMode.replace('-', ' ') + ' mode.');
                saveSettings();
                return;
            }
            timeLeft--;
            updateTimerDisplay();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(countdown);
        isRunning = false;
        startButton.textContent = 'START';
        startButton.style.color = '#ba4949';
        startButton.style.backgroundColor = '#fff';
    }

    function resetTimer() {
        clearInterval(countdown);
        isRunning = false;
        startButton.textContent = 'START';
        startButton.style.color = '#ba4949';
        startButton.style.backgroundColor = '#fff';
        timeLeft = modes[currentMode];
        updateTimerDisplay();
    }

    // Event Listeners for Tabs
    pomodoroTab.addEventListener('click', () => setMode('pomodoro'));
    shortBreakTab.addEventListener('click', () => setMode('short-break'));
    longBreakTab.addEventListener('click', () => setMode('long-break'));

    // Event Listener for Start/Pause Button
    startButton.addEventListener('click', startTimer);

    // Task Management (unchanged)
    addTaskButton.addEventListener('click', () => {
        addTaskButton.classList.add('hidden');
        taskInputForm.classList.remove('hidden');
        newTaskInput.focus();
    });

    cancelTaskButton.addEventListener('click', () => {
        newTaskInput.value = '';
        taskInputForm.classList.add('hidden');
        addTaskButton.classList.remove('hidden');
    });

    saveTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span>${taskText}</span>
                <button class="delete-task"><i class="fa-solid fa-trash-can"></i></button>
            `;
            taskList.appendChild(taskItem);

            taskItem.querySelector('.delete-task').addEventListener('click', () => {
                taskItem.remove();
            });

            taskItem.querySelector('.task-checkbox').addEventListener('change', (e) => {
                if (e.target.checked) {
                    taskItem.querySelector('span').style.textDecoration = 'line-through';
                    taskItem.querySelector('span').style.opacity = '0.7';
                } else {
                    taskItem.querySelector('span').style.textDecoration = 'none';
                    taskItem.querySelector('span').style.opacity = '1';
                }
            });

            newTaskInput.value = '';
            taskInputForm.classList.add('hidden');
            addTaskButton.classList.remove('hidden');
        } else {
            alert('Please enter a task!');
        }
    });

    // Settings Modal Logic
    settingButton.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        // Load current values into settings inputs
        settingPomodoroTimeInput.value = modes.pomodoro / 60;
        settingShortBreakTimeInput.value = modes['short-break'] / 60;
        settingLongBreakTimeInput.value = modes['long-break'] / 60;

        // Reset all background inputs first
        bgColorPicker.value = '#ba4949'; // Default or starting color
        bgImageURLInput.value = '';
        bgFileUploadInput.value = ''; // Clear file input
        fileNameDisplay.textContent = 'No file chosen';

        // Update settings modal based on current active background
        if (currentBackgroundOption.type === 'color') {
            bgColorPicker.value = currentBackgroundOption.value;
        } else if (currentBackgroundOption.type === 'url') {
            bgImageURLInput.value = currentBackgroundOption.value;
        } else if (currentBackgroundOption.type === 'file') {
            fileNameDisplay.textContent = 'Last uploaded image'; // Indicate a file was used
            // Cannot pre-fill file input for security reasons
        }
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // Event listener for color picker change
    bgColorPicker.addEventListener('input', (event) => {
        currentBackgroundOption = { type: 'color', value: event.target.value };
        bgImageURLInput.value = ''; // Clear URL input
        bgFileUploadInput.value = ''; // Clear file input
        fileNameDisplay.textContent = 'No file chosen';
    });

    // Event listener for image URL input change (real-time apply if desired, or just set current option)
    bgImageURLInput.addEventListener('input', (event) => {
        currentBackgroundOption = { type: 'url', value: event.target.value.trim() };
        bgColorPicker.value = '#ba4949'; // Reset color picker
        bgFileUploadInput.value = ''; // Clear file input
        fileNameDisplay.textContent = 'No file chosen';
    });

    // Event listener for file upload input change
    bgFileUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                currentBackgroundOption = { type: 'file', value: e.target.result }; // Store Data URL
                bgImageURLInput.value = ''; // Clear URL input
                bgColorPicker.value = '#ba4949'; // Reset color picker
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            currentBackgroundOption = { type: 'color', value: bgColorPicker.value }; // Revert to color if no file selected
        }
    });


    applySettingsButton.addEventListener('click', () => {
        const newPomodoroTime = parseInt(settingPomodoroTimeInput.value);
        const newShortBreakTime = parseInt(settingShortBreakTimeInput.value);
        const newLongBreakTime = parseInt(settingLongBreakTimeInput.value);

        if (newPomodoroTime < 1 || newShortBreakTime < 1 || newLongBreakTime < 1) {
            alert('Please enter valid positive numbers for all time settings.');
            return;
        }

        modes.pomodoro = newPomodoroTime * 60;
        modes['short-break'] = newShortBreakTime * 60;
        modes['long-break'] = newLongBreakTime * 60;

        // Apply the selected background option
        applyBackground(currentBackgroundOption.type, currentBackgroundOption.value);

        settingsModal.classList.add('hidden');
        setMode(currentMode);
        saveSettings();
    });


    // Helper to convert RGB to Hex for color picker display (unchanged)
    function rgbToHex(rgb) {
        if (!rgb || rgb.startsWith('transparent')) return '';
        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues || rgbValues.length < 3) return '';
        const hex = (num) => {
            const h = parseInt(num).toString(16);
            return h.length === 1 ? '0' + h : h;
        };
        return `#${hex(rgbValues[0])}${hex(rgbValues[1])}${hex(rgbValues[2])}`;
    }

    // Initial setup
    loadSettings();
    setMode('pomodoro');
});