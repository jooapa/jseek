const { ipcRenderer } = require('electron');
const {
    Keywords,
    contructBlock,
    getUsername,
} = require('../config');

let debounceTimeoutFirst;
let debounceTimeoutSecond;

let selectedResult = 0;
let results = [];

function escapeHtml(text) {
    if (typeof text !== 'string') {
        text = String(text);
    }
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

// example
// [
//     ['content:', 'ansicontent:', 'utf8content:', 'utf16content:', 'utf16becontent:'],
//     ['Search file content.'],
//     ["intensity", 100]
// ],

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function fuzzySearchHighlight(text) {
    const escapedText = escapeHtml(text);
    let highlightedText = escapedText;
    const keywords = Keywords;
    
    let Intensities = [];
    for (let i = 0; i < keywords.length; i++) {
        const keywordArray = keywords[i][0];
        const description = keywords[i][1];
        const intensity = keywords[i][2];
        const start = keywords[i][3];
        const startSpaceMatters = keywords[i][4];

        let intensityKey;
        if (intensity[1] === 0) {
            intensityKey = "fast-key";
        } else if (intensity[1] === 50) {
            intensityKey = "medium-key";
        } else if (intensity[1] === 100) {
            intensityKey = "slow-key";
        } else if (intensity[1] === -1) {
            intensityKey = "op-key";
        } else if (intensity[1] === -1 && start === true) {
            intensityKey = "start-key";
        }
        
        for (let j = 0; j < keywordArray.length; j++) {
            const keyword = keywordArray[j];
            const escapedKeyword = escapeHtml(keyword);
            if (start) { 
                let regex;
                // match the start of the string until the first space
                if (startSpaceMatters) {
                    // if the keyword is at the start of the string, and the next character is a space
                    regex = new RegExp(`^${escapeRegExp(escapedKeyword)}(?=\\s)`, "gi");
                } else {
                    regex = new RegExp(`^${escapeRegExp(escapedKeyword)}`, "gi");
                }
                const match = escapedText.match(regex);
                if (match) {
                    Intensities.push(intensity[1]);
                    highlightedText = highlightedText.replace(regex, `<span class="highlight-key ${intensityKey}">${match[0]}</span>`);
                }
            }
            else {
                const regex = new RegExp(escapeRegExp(escapedKeyword), "gi");
                const match = escapedText.match(regex);
                if (match) {
                    Intensities.push(intensity[1]);
                    highlightedText = highlightedText.replace(regex, `<span class="highlight-key ${intensityKey}">${match[0]}</span>`);
                }
            }
        }
    }
    const regex = /(?<!<[^>]*)\s(?![^<]*>)/g;

    highlightedText = highlightedText.replace(regex, '<span class="highlight-key invi-key"> </span>');

    intiFact = null;
    const intiFoundSlow = Intensities.find((element) => element === 100);


    if (intiFoundSlow !== undefined) {
        intiFact = "Slow";
    }

    return [highlightedText, intiFact];
}

function checkForSearchResults(input) {
    let returnVal = false;
    // search
    let searchUsing, searchUrl, searchImage;
    let inputNew = input.substring(2);

    if (input.startsWith("g ")) {
        searchUsing = "Search using Google search";
        searchUrl = "https://www.google.com/search?q=" + inputNew;
        searchImage = "assets/google.png";
    } else if (input.startsWith("y ")) {
        searchUsing = "Search using Youtube search";
        searchUrl = "https://www.youtube.com/results?search_query=" + inputNew;
        searchImage = "assets/youtube.svg";
    } else if (input.startsWith("d ")) {
        searchUsing = "Search using DuckDuckGo search";
        searchUrl = "https://duckduckgo.com/?q=" + inputNew;
        searchImage = "assets/duckduckgo.svg";
    } else if (input.startsWith("b ")) {
        searchUsing = "Search using Bing search";
        searchUrl = "https://www.bing.com/search?q=" + inputNew;
        searchImage = "assets/bing.png";
    } else if (input.startsWith("w ")) {
        searchUsing = "Search using Wikipedia search";
        searchUrl = "https://en.wikipedia.org/wiki/Special:Search?search=" + inputNew;
        searchImage = "assets/wikipedia.png";
    }

    if (searchUsing !== undefined) {
            const searchDiv = contructBlock(
            searchUrl,
            searchUsing,
            "Web",
            inputNew == !isEmptyOrSpaces(inputNew) ? "Type something to search.." : "'" + inputNew + "'",
            searchUsing,
            input,
            true,
            searchImage
        );
        
        setPermaResults(searchDiv);
        returnVal = true;
    } else {
        resetPermaResults();
        returnVal = false;
    }

    return returnVal;
}

function checkForCommandResults(input) {
    let returnVal = false;
    // command >command
    let commandUsing;
    let inputNew = input.substring(1);

    if (input.startsWith(">")) {
        commandUsing = "Run command";
    }

    if (commandUsing !== undefined) {
        const commandDiv = contructBlock(
            inputNew,
            inputNew,
            "Command",
            inputNew == !isEmptyOrSpaces(inputNew) ? "Type something to run command.." : "'" + inputNew + "'",
            commandUsing,
            input,
            true
        );
        
        setPermaResults(commandDiv);
        returnVal = true;
    } else {
        resetPermaResults();
        returnVal = false;
    }

    return returnVal;
}

// https://stackoverflow.com/questions/10232366/how-to-check-if-a-variable-is-null-or-empty-string-or-all-whitespace-in-javascri
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function resetPermaResults() {
    const permaResults = document.getElementsByClassName("perma");
    for (let i = 0; i < permaResults.length; i++) {
        permaResults[i].remove();
    }
    permaResults.length = 0;
}

function setPermaResults(divs) {
    // replace the perma results with the new one
    resetPermaResults();
    document.getElementById("results").insertAdjacentHTML("afterbegin", divs);
    document.getElementById("results").getElementsByClassName("block");
}

document.getElementById("input").addEventListener("input", (event) => {
    const input = event.target;
    
    const highlighted = fuzzySearchHighlight(input.value);
    document.getElementById('highlight-key').innerHTML = highlighted[0];
    
    if (highlighted[1] === "Slow") {
        setResults("SLOW");
        return;
    }
    
    // this magic if statement checks if the return value is true, 
    // and if it is, it will continue without the rest functions
    // if the return value is false, it will continue with the rest of the functions
    // and it apparenly works ??, not even { } is needed
    if (
        checkForSearchResults(input.value)
        || 
        checkForCommandResults(input.value)
    )

    updateSelectedResult();

    // magic input replacement (now in the c++ code)
    // let new_input = magicInputreplacement(input.value);

    let new_input = input.value;

    clearTimeout(debounceTimeoutFirst);
    debounceTimeoutFirst = setTimeout(async () => {
        if (new_input.length === 0) {
            resetResults();
            return;
        }
        let newResults = await callSearch(1, new_input);

        setResults(newResults);
    }, 69);

    clearTimeout(debounceTimeoutSecond);
    debounceTimeoutSecond = setTimeout(async () => {
        if (new_input.length === 0) {
            resetResults();
            return;
        }
        let newResults = await callSearch(5, new_input);    
        setResults(newResults);
    }, 300);
});

function startLoading() {
    // add to .search-loader loading class
    document.getElementsByClassName("search-loader")[0].classList.add("loading");    
}

function stopLoading() {
    // remove from .search-loader loading class
    document.getElementsByClassName("search-loader")[0].classList.remove("loading");
}

function isValidnonModidyInputchar(input) {
    if (input.key === "ArrowLeft") return true;
    if (input.key === "ArrowRight") return true;
}

function isValidCharInput(input) {
    if (input.ctrlKey === true) return false;
    if (input.altKey === true) return false;
    if (input.metaKey === true) return false;


    console.log("Input: " + input.key);
    if (input.key === "Backspace") return true;
    if (input.key === " ") return true;

    const specialChars = ['"', "'", '?', '!', '#', '¤', '%', '&', '/', '(', ')', '=', '?', '*', '+', '§', '£', '€', '{', '[', ']', '}', '\\', '|', '@', '£', '€', '½', '¼', '¾', '¬', '¦', '´', '`', '¨', '^', '~', '<', '>', ',', ';', ':', '.', '-', "_"];
    if (specialChars.includes(input.key)) return true;

    return input.key.length === 1 && input.key.match(/[a-z0-9]/i);
}

// event listener for key press
document.addEventListener('keydown', function(event) {
    const inputElem = document.getElementById("input");

    if (event.key === "ArrowDown") {
        document.getElementById("input").blur();
        if (event.ctrlKey) {
            selectedResult = results.length - 2;
        } else {
            selectedResult = Math.min(selectedResult + 1, results.length - 1);
        }
        updateSelectedResult();
    }
    if (event.key === "ArrowUp") {
        document.getElementById("input").blur();
        if (selectedResult === 0
            || results.length === 0
        ) {
            const length = inputElem.value.length;
            inputElem.setSelectionRange(length, length);
            inputElem.focus();
            event.preventDefault();
        }

        if (event.ctrlKey) {
            selectedResult = 0;
        } else {
            selectedResult = Math.max(selectedResult - 1, 0);
        }

        updateSelectedResult();
    }

    if (event.key === "Enter") {
        const blocks = document.getElementsByClassName("block");
        if (blocks.length === 0) {
            return;
        }

        const block = blocks[selectedResult];
        const path = block.getAttribute("data-path");
        const type = block.getAttribute("data-type");
        
        if (block.id === "more") {
            moreResults();
            return;
        }

        // if shift is pressed, open the file in the explorer
        if (event.ctrlKey) {
            openFile(path, type, true);
        } else {
            openFile(path, type);
        }
    }

    if (event.key === "Tab") {
        inputElem.focus();
        inputElem.setSelectionRange(0, inputElem.value.length);
        event.preventDefault();
    }

    if (isValidCharInput(event)) {
        // resetResults();
        selectedResult = 0;
        inputElem.focus();
        // inputElem.setSelectionRange(inputElem.value.length, inputElem.value.length);
        updateSelectedResult();
    }

    if (isValidnonModidyInputchar(event)) {
        inputElem.focus();
        updateSelectedResult();
    }
    
    maybeResetResults(event);
});

function closeWindow() {
    ipcRenderer.invoke('close-window');
}

function updateSelectedResult() {
    const blocks = document.getElementsByClassName("block");
    if (blocks.length === 0) {
        return
    }
    for (let i = 0; i < blocks.length; i++) {
        if (i === selectedResult) {
            blocks[i].classList.add("selected");
        } else {
            blocks[i].classList.remove("selected");
        }
    }

    if (blocks.length > 0) {
        blocks[selectedResult].scrollIntoView({ behavior: "instant", block: "center" });
    }
}

function maybeResetResults() {
    if (document.getElementById("input").value.length === 0
    ) {
        resetResults();
        return true;
    }
    return false;
}

function setResults(result) {
    const resultsdiv = document.getElementById("results");
    // remove every children of results that doesnt have perma class
    document.querySelectorAll('.block:not(.perma)').forEach(e => e.remove());
    document.querySelectorAll('#more').forEach(e => e.remove());
    document.querySelectorAll('#no-results').forEach(e => e.remove());

    // resetResults()
    if (result[1] === "No results") {
        resultsdiv.insertAdjacentHTML("beforeend",
            `<div id="no-results">
                <p>No results found</p>
            </div>`
        );
        results = document.getElementById("results").getElementsByClassName("block");
        stopLoading();
        updateSelectedResult();
        return;
    }


    if (result[0] === undefined) {
        return;
    }

    
    // add the new results
    resultsdiv.insertAdjacentHTML("beforeend", result[0]);

    // calculate the number of results
    results = document.getElementById("results").getElementsByClassName("block");
    updateSelectedResult()

    stopLoading();
    
}

function resetResults() {
    document.getElementById("results").innerHTML = "";
    stopLoading();
}

function openFile(path, type, explorer = false) {
    if (typeof type === 'string') {
        type = type.toLowerCase();
    }

    if (explorer) {
        if (type === "file") {
            path = path.substring(0, path.lastIndexOf("\\"));
            type = "folder";
        }
    }
    
    if (type === "folder" || type === "volume") {
        ipcRenderer.invoke('open-folder', path);
    } else if (type === "file") {
        ipcRenderer.invoke('open-file', path);
    } else if (type === "web") {
        ipcRenderer.invoke('open-web', path);
    } else if (type === "command") {
        ipcRenderer.invoke('open-command', path);
    } 
    else {
        console.error("Unknown type: " + type);
    }

    closeWindow();
}

// called when the user clicks the "more results" button in the html
async function moreResults() {
    // 50 more results
    
    let moreResults = results.length + 50;
    let newResults = await callSearch(moreResults, document.getElementById("input").value);
    
    setResults(newResults);
}

/// returns array, where [0] is the result and [1] is the type of the result
/**
 * Calls the search query with the specified amount and query.
 * @param {number} amount - The amount of search results to retrieve.
 * @param {string} query - The search query.
 * @returns {Promise<[string, string]>} - returns array, where [0] is the result and [1] is the type of the result.
 * TYPES: 
 * | "" | 
 * "No results" |
 * "More results" |
 */
async function callSearch(amount, query) {
    startLoading();
    const result = await ipcRenderer.invoke('search-query', amount + ' "' + query + '"');
    return result;
}

ipcRenderer.on('start', (event, arg) => {
    inputElem = document.getElementById("input");
    inputElem.focus();
    const length = inputElem.value.length;
    inputElem.setSelectionRange(0, length);
});
