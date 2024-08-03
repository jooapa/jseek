const { ipcRenderer } = require('electron');
const {
    Keywords,
} = require('../config');

let debounceTimeoutFirst;
let debounceTimeoutSecond;
let debounceTimeoutThird;

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
function fuzzySearchHighlight(text) {
    const escapedText = escapeHtml(text);
    let highlightedText = escapedText;
    const keywords = Keywords;
    
    let Intensities = [];
    for (let i = 0; i < keywords.length; i++) {
        const keywordArray = keywords[i][0];
        const description = keywords[i][1];
        const intensity = keywords[i][2];

        let intensityKey;
        if (intensity[1] === 0) {
            intensityKey = "fast-key";
        } else if (intensity[1] === 50) {
            intensityKey = "medium-key";
        } else if (intensity[1] === 100) {
            intensityKey = "slow-key";
        } else if (intensity[1] === -1) {
            intensityKey = "op-key";
        }
        
        for (let j = 0; j < keywordArray.length; j++) {
            const keyword = keywordArray[j];
            const escapedKeyword = escapeHtml(keyword);
            

            const regex = new RegExp(escapedKeyword, "gi");
            const match = escapedText.match(regex);
            if (match) {
                Intensities.push(intensity[1]);

                highlightedText = highlightedText.replace(regex, `<span class="highlight-key ${intensityKey}">${match[0]}</span>`);
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

document.getElementById("input").addEventListener("input", (event) => {
    const input = event.target;
    
    const highlighted = fuzzySearchHighlight(input.value);
    document.getElementById('highlight-key').innerHTML = highlighted[0];

    if (highlighted[1] === "Slow") {
        setResults("SLOW");
        return;
    }

    clearTimeout(debounceTimeoutFirst);
    debounceTimeoutFirst = setTimeout(async () => {
        if (input.value.length === 0) {
            resetResults();
            return;
        }
        gettingResultsLoading()
        let newResults = await callSearch(1, input.value);

        setResults(newResults[0]);
        if (result[1] === "No results") {
            clearTimeout(debounceTimeoutFirst);
            clearTimeout(debounceTimeoutSecond);
            clearTimeout(debounceTimeoutThird);
            return;
        }
    }, 100);

    clearTimeout(debounceTimeoutSecond);
    debounceTimeoutSecond = setTimeout(async () => {
        if (input.value.length === 0) {
            resetResults();
            return;
        }
        gettingResultsLoading()
        let newResults = await callSearch(5, input.value);
        setResults(newResults[0]);
    }, 1000);

    clearTimeout(debounceTimeoutThird);
    debounceTimeoutThird = setTimeout(async () => {
        if (input.value.length === 0) {
            resetResults();
            return;
        }
        gettingResultsLoading()
        let newResults = await callSearch(50, input.value);
        setResults(newResults[0]);
    }, 2000);
});

function gettingResultsLoading() {
    //         <div class="getting">
    //             <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    //         </div>

    // add loading div between </div> and <button class="block" onclick="moreResults()">
    let noBLocks = false;

    const results = document.getElementById("results");
    const blocks = results.getElementsByClassName("block");
    if (blocks.length === 0) {
        noBLocks = true;
    }

    // if already exists, remove it
    const existingLoadingDiv = results.getElementsByClassName("getting");
    if (existingLoadingDiv.length > 0) {
        existingLoadingDiv[0].remove();
    }

    const lastBlock = blocks[blocks.length - 1];
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("getting");
    loadingDiv.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
    if (!noBLocks) {
        results.insertBefore(loadingDiv, lastBlock);
    } else {
        results.appendChild(loadingDiv);
    }
    // scroll to the bottom
    // results.scrollTop = results.scrollHeight;
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
        const length = inputElem.value.length;
        inputElem.setSelectionRange(length, length);
        if (selectedResult === 0) {
            inputElem.focus();
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


        // simulate click
        if (selectedResult === blocks.length - 1) {
            moreResults();
            return;
        }

        const block = blocks[selectedResult];
        const path = block.getAttribute("data-path");
        const type = block.getAttribute("data-type");

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
        resetResults();
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
    if (document.getElementById("input").value.length === 0) {
        resetResults();
        return true;
    }
    return false;
}

function setResults(result) {
    if (!maybeResetResults()) {
        document.getElementById("results").innerHTML = result;
        // calculate the number of results
        results = document.getElementById("results").getElementsByClassName("block");
        console.log(results);
        updateSelectedResult()
    }
}

function resetResults() {
    document.getElementById("results").innerHTML = "";
}

function openFile(path, type, explorer = false) {
    type = type.toLowerCase();
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
    } else {
        console.error("Unknown type: " + type);
    }
}

async function moreResults() {
    gettingResultsLoading();
    // 50 more results
    
    let moreResults = results.length + 50;
    let newResults = await callSearch(moreResults, document.getElementById("input").value);
    
    setResults(newResults[0]);
}

// returns array, where [0] is the result and [1] is the type of the result
// types: 
// ""
// "No results"
// "More results"
async function callSearch(amount, query) {
    gettingResultsLoading();
    const result = await ipcRenderer.invoke('search-query', amount + ' "' + query + '"');
    return result;
}

ipcRenderer.on('start', (event, arg) => {
    inputElem = document.getElementById("input");
    inputElem.focus();
    const length = inputElem.value.length;
    inputElem.setSelectionRange(0, length);
});
