const { 
    BrowserWindow, 
    app, 
    globalShortcut, 
    screen, 
    ipcMain,
    shell,
} = require('electron');

const {
    createWindow,
    mainWindow,
} = require('./create');

const {
    trySearch,
} = require('./actions');

const {
    contructBlock,
} = require('./config');

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
        return makeReply(result, query);
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('open-file', (event, path) => {
    shell.openPath(path);
});

ipcMain.handle('open-folder', (event, path) => {
    shell.openPath(path);
});

ipcMain.handle('open-web', (event, path) => {
    shell.openExternal(path);
});

function makeReply(reply, originalQuery) {
    let whatType;
    // <div class="block">
    //     <img src="image1.jpg">
    //     <div class="info">
    //         <h2>asd.jammer</h2>
    //         <p>C:\Users\user\jammer\asd.jammer</p>
    //     </div>
    // </div>
    
    /// Example reply: "C:\Users\user\Documents\file.txt|file.txt|File|Display Name|Info Name\n"
    // split by ":" 
    if (reply.length === 0) {
        return ["", "No results"];
    }

    let result = '';
    let files = reply.split('\n');
    // remove the last empty string
    files.pop();
    files.forEach((file) => {
        if (file.length === 0) {
            return;
        }
        file = file.substring(0, file.length - 1);
        let [path, name, type, displayName, infoName] = file.split('|');
        
        result += contructBlock(path, name, type, displayName, infoName, originalQuery, false);
    });

    isWeb = files[0].split('|')[2] === "Web";
    console.log(files.length);
    // if the first is a web search dont count it in the lenght
    if (isWeb) {
        files.shift();
    }

    if (files.length === 0) {
        whatType = "No results";
    } else {
        result += 
        `<button class="block" id="more" onclick="moreResults()">
            More results...
        </button>`;
        whatType = "More results";
    }

    console.log("-------------------------------");
    console.log(result);
    console.log("-------------------------------");
    console.log(whatType);
    console.log("-------------------------------");

    return [result, whatType];
}
