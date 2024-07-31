const { 
    BrowserWindow, 
    app, 
    globalShortcut, 
    screen,
    ipcMain,
} = require('electron');

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
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
            spellcheck: false,
            // devTools: false,
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
        mainWindow.webContents.send('start');
    });

    globalShortcut.register('Escape', () => {
        app.quit();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

module.exports = {
    createWindow,
    mainWindow,
}