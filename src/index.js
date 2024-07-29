const { 
    BrowserWindow, 
    app, 
    globalShortcut, 
    screen, 
    ipcMain,
} = require('electron');

const {
    createWindow,
    mainWindow,
} = require('./create');

const {
    trySearch,
} = require('./actions');

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

// Listen for events from the renderer process
ipcMain.handle('search-query', async (event, query) => {
    try {
        if (query.length === 0) {
            return '';
        }

        const result = await trySearch(query);
        return "for: " + query + "\n" + result;
    } catch (error) {
        return { error: error.message };
    }
});