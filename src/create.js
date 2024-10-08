const { 
    BrowserWindow, 
    app, 
    globalShortcut, 
    screen,
    ipcMain,
} = require('electron');

const path = require('path');

let mainWindow;

function getWindow() {
    return mainWindow;
}

function createWindow() {
    const currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    const { width, height } = currentScreen.workAreaSize;
    const windowWidth = 650;
    const windowHeight = 300;
    const x = (width - windowWidth) / 2;
    const y = (height - windowHeight) / 2 - 50;

    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: x,
        y: y,
        transparent: false,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
            spellcheck: false,
            // devTools: false,
        }
});

    console.log('Loading HTML from:', path.join(__dirname, 'app/app.html'));
    mainWindow.loadFile(path.join(__dirname, 'app/app.html'));

    // Hide window on click outside
    mainWindow.on('blur', () => {
        mainWindow.hide();
    });

    // Show window on Alt+Space
    globalShortcut.register('Alt+Space', () => {
        mainWindow.show();
        mainWindow.webContents.send('start');
    });

    globalShortcut.register('Escape', () => {
        app.quit();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }

        return false;
    });
}

app.on('before-quit', () => {
    app.isQuiting = true;
});

module.exports = {
    createWindow,
    getWindow
}