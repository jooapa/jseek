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
        return makeReply(result);
    } catch (error) {
        return { error: error.message };
    }
});

function makeReply(reply) {
    // <div class="block">
    //     <img src="image1.jpg">
    //     <div class="info">
    //         <h2>asd.jammer</h2>
    //         <p>C:\Users\user\jammer\asd.jammer</p>
    //     </div>
    // </div>
    
    /// Example reply: "C:\Users\Jooapa\Documents\GitHub\jammer\example\asd.jammer | asd.jammer"
    // split by ":" 
    
    let result = '';
    let files = reply.split('\n');
    files.forEach((file) => {
        if (file.length === 0) {
            return;
        }

        let [path, name] = file.split('|');
        result += `<div class="block">
            <img src="image1.jpg">
            <div class="info">
                <h2>${name}</h2>
                <p>${path}</p>
            </div>
        </div>`;
    });

    console.log(result);

    return result;
}