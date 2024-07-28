const { app, BrowserWindow, globalShortcut, screen } = require('electron');

let mainWindow;

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
        vibrancy: 'ultra-dark',
        webPreferences: {
            nodeIntegration: true
        }
});

    mainWindow.loadFile('app/app.html');

    // Hide window on click outside
    mainWindow.on('blur', () => {
        mainWindow.hide();
    });

    // Show window on Alt+Space
    globalShortcut.register('Alt+Space', () => {
        mainWindow.show();
    });

    globalShortcut.register('Escape', () => {
        app.quit();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
