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

function makeReply(reply, originalQuery) {
    let whatType;
    // <div class="block">
    //     <img src="image1.jpg">
    //     <div class="info">
    //         <h2>asd.jammer</h2>
    //         <p>C:\Users\user\jammer\asd.jammer</p>
    //     </div>
    // </div>
    
    /// Example reply: "C:\Users\Jooapa\Documents\GitHub\jammer\example\asd.jammer | asd.jammer | File\n"
    // split by ":" 
    
    let result = '';
    let files = reply.split('\n');
    // remove the last empty string
    files.pop();
    files.forEach((file) => {
        if (file.length === 0) {
            return;
        }
        file = file.substring(0, file.length - 1);
        let [path, name, type] = file.split('|');

        let betterPath = path.replace(/\\/g, '\\\\');
        result += 
        `<div class="block" data-type="${type}" data-path="${path}" onclick="openFile('${betterPath}', '${type}')">
            <img src="image1.jpg">
            <div class="info">
                <h2 class="name">${highlightResults(name, originalQuery)}</h2>
                <p class="path">${highlightResults(path, originalQuery)}</p>
            </div>
        </div>`;
    });

    console.log(files.length);
    if (files.length === 0) {
        result += 
        `<div class="greeting">
            <h2>No results found</h2>
        </div>`;
        whatType = "No results";
    } else {
        result += 
        `<button class="block" onclick="moreResults()">
            More Results
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



function highlightResults(input, highlight) {
    // find highlight in input and wrap it in <span class="highlight"> tags
    // return the modified input

    // hightlight example: "num query going here"
    // remove the number from the start

    highlight = highlight.substring(highlight.indexOf(' ') + 1);

    if (!input || !highlight) {
        return input;
    }

    // Escape special characters in the highlight string to safely use it in regex
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const escapedHighlight = escapeRegExp(highlight);
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');

    return input.replace(regex, '<span class="highlight">$1</span>');
}