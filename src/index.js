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

ipcMain.handle('open-file', (event, path) => {
    // open the file in the default application
    shell.openPath(path);
});

function makeReply(reply) {
    // <div class="block">
    //     <img src="image1.jpg">
    //     <div class="info">
    //         <h2>asd.jammer</h2>
    //         <p>C:\Users\user\jammer\asd.jammer</p>
    //     </div>
    // </div>
    
    /// Example reply: "C:\Users\Jooapa\Documents\GitHub\jammer\example\asd.jammer | asd.jammer | file"
    // split by ":" 
    
    let result = '';
    let files = reply.split('\n');
    // remove the last empty string
    files.pop();
    files.forEach((file) => {
        if (file.length === 0) {
            return;
        }

        let [path, name, type] = file.split('|');
        // let betterPath = path.replace(/\\/g, '\\\\');
        result += 
        `<div class="block" data-type="${type}" data-path="${path}">
            <img src="image1.jpg">
            <div class="info">
                <h2 class="name">${name}</h2>
                <p class="path">${path}</p>
            </div>
        </div>`;
    });

    console.log(files.length);
    if (files.length === 0) {
        result += 
        `<div class="block-info">
            <div class="info">
                <h2>No results found</h2>
            </div>
        </div>`;
    } else {
        result += 
        `<button
            class="block"
            onclick="moreResults()"
        >
            More Results
        </button>`;
    }

    console.log("-------------------------------");
    console.log(result);
    console.log("-------------------------------");

    return result;
}



function highlightResults(input, highlight) {
    // find highlight in input and wrap it in <span> tags
    // return the modified input


}