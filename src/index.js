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
ipcMain.on('some-event', (event, arg) => {
    console.log(arg); // Prints the argument sent from the renderer process
    // Perform some action in the main process
    event.reply('some-event-reply',
        "Arg: " + arg
    );
});