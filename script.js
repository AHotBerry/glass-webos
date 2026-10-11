setInterval(() => {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString();
}, 1000);

let highestZIndex = 10;

const apps = {
    notepad: {
        title: "Notes.app",
        icon: "fa-note-sticky",
        content: `<textarea class="notes-textarea" placeholder="Type notes here... Saves automatically to localStorage."></textarea>`,
        init: (winElement) => {
            const textarea = winElement.querySelector('textarea');
            textarea.value = localStorage.getItem('nexusos_notes') || '';
            textarea.addEventListener('input', () => {
                localStorage.setItem('nexusos_notes', textarea.value);
            });
        }
    },
    weather: {
        title: "Weather.wx",
        icon: "fa-cloud-sun",
        content: `
            <div style="display: flex; flex-direction: column; gap: 12px; height: 100%; justify-content: center; align-items: center; text-align: center;">
                <i class="fa-solid fa-cloud-sun" style="font-size: 48px; color: var(--accent);"></i>
                <div>
                    <h2 style="font-size: 24px; font-weight: 600;">72°F</h2>
                    <p style="color: var(--text-muted);">Scattered Clouds • Local Environment</p>
                </div>
            </div>
        `
    },
    terminal: {
        title: "Terminal",
        icon: "fa-rectangle-code",
        content: `<div class="terminal-output">NexusOS Terminal [Version 1.0.4]\nType 'help' for commands.\n\n> </div>`
    }
};

function openApp(appKey) {
    const appData = apps[appKey];
    if (!appData) return;

    const windowId = `window-${appKey}`;
    
    // Check if window already exists, bring to front if so
    let existingWindow = document.getElementById(windowId);
    if (existingWindow) {
        focusWindow(existingWindow);
        return;
    }

    const win = document.createElement('div');
    win.className = 'os-window focused';
    win.id = windowId;
    win.style.top = `${60 + (document.querySelectorAll('.os-window').length * 20)}px`;
    win.style.left = `${100 + (document.querySelectorAll('.os-window').length * 20)}px`;
    
    highestZIndex++;
    win.style.zIndex = highestZIndex;

    win.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                <i class="fa-solid ${appData.icon}"></i>
                <span>${appData.title}</span>
            </div>
            <div class="window-controls">
                <button class="control-btn close" onclick="closeWindow('${windowId}')"></button>
            </div>
        </div>
        <div class="window-body">
            ${appData.content}
        </div>
    `;

    document.getElementById('window-layer').appendChild(win);
    
    if (appData.init) {
        appData.init(win);
    }

    makeDraggable(win);
    
    win.addEventListener('mousedown', () => focusWindow(win));
    document.getElementById('active-window-title').innerText = appData.title;
}

function focusWindow(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('focused'));
    win.classList.add('focused');
    
    const titleSpan = win.querySelector('.window-title span');
    if (titleSpan) {
        document.getElementById('active-window-title').innerText = titleSpan.innerText;
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.remove();
        document.getElementById('active-window-title').innerText = "Desktop";
    }
}

function minimizeAll() {
    document.querySelectorAll('.os-window').forEach(w => w.remove());
    document.getElementById('active-window-title').innerText = "Desktop";
}

function makeDraggable(win) {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let startX, startY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - win.offsetLeft;
        startY = e.clientY - win.offsetTop;
        focusWindow(win);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = `${e.clientX - startX}px`;
        win.style.top = `${e.clientY - startY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
