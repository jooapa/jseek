const { ipcRenderer } = require('electron');


let debounceTimeoutFirst;
let debounceTimeoutSecond;
let debounceTimeoutThird;

let selectedResult = 0;
let results = [];

document.getElementById("input").addEventListener("input", (event) => {
    const input = event.target;

    clearTimeout(debounceTimeoutFirst);
    debounceTimeoutFirst = setTimeout(() => {
        if (input.value.length === 0) {
            resetResults();
            return;
        }
        gettingResultsLoading()
        ipcRenderer.invoke('search-query', '1 "' + input.value+'"').then((result) => {
            console.log("What type: " + result[1]);
            console.log("Result: " + result[0]);
            // if (whatType === "No results") {
            //     return;
            // }
            setResults(result[0]);
            if (result[1] === "No results") {
                clearTimeout(debounceTimeoutFirst);
                clearTimeout(debounceTimeoutSecond);
                clearTimeout(debounceTimeoutThird);
                return;
            }
            
        });
    }, 100);

    clearTimeout(debounceTimeoutSecond);
    debounceTimeoutSecond = setTimeout(() => {
        if (input.value.length === 0) {
            resetResults();
            return;
        }
        gettingResultsLoading()
        ipcRenderer.invoke('search-query', '5 "' + input.value+'"').then((result) => {
            setResults(result[0]);
        });
    }, 1000);

    clearTimeout(debounceTimeoutThird);
    debounceTimeoutThird = setTimeout(() => {
        if (input.value.length === 0) {
            resetResults();
            return;
        }
        gettingResultsLoading()
        ipcRenderer.invoke('search-query', '10 "' + input.value+'"').then((result) => {
            setResults(result[0]);
        });
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
        if (input === "ArrowLeft") return true;
    if (input === "ArrowRight") return true;
}
function isValidCharInput(input) {
    console.log("Input: " + input);
    if (input === "Backspace") return true;
    if (input === " ") return true;

    const specialChars = ['"', "'", '?', '!', '#', '¤', '%', '&', '/', '(', ')', '=', '?', '*', '+', '§', '£', '€', '{', '[', ']', '}', '\\', '|', '@', '£', '€', '½', '¼', '¾', '¬', '¦', '´', '`', '¨', '^', '~', '<', '>', ',', ';', ':', '.', '-'];
    if (specialChars.includes(input)) return true;

    return input.length === 1 && input.match(/[a-z0-9]/i);
}

// event listener for key press
document.addEventListener('keydown', function(event) {
    const inputElem = document.getElementById("input");

    if (event.key === "ArrowDown") {
        document.getElementById("input").blur();
        selectedResult = Math.min(selectedResult + 1, results.length - 1);
        updateSelectedResult();
    }
    if (event.key === "ArrowUp") {
        document.getElementById("input").blur();
        const length = inputElem.value.length;
        inputElem.setSelectionRange(length, length);
        if (selectedResult === 0) {
            inputElem.focus();
        }
        selectedResult = Math.max(selectedResult - 1, 0);
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
        if (event.shiftKey) {
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

    if (isValidCharInput(event.key)) {
        resetResults();
        selectedResult = 0;
        document.getElementById("input").focus();
        updateSelectedResult();
    }

    if (isValidnonModidyInputchar(event.key)) {
        document.getElementById("input").focus();
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

function moreResults() {
    // 50 more results
    gettingResultsLoading();

    let moreResults = results.length + 50;
    ipcRenderer.invoke('search-query', moreResults + ' "' + document.getElementById("input").value + '"')
    .then((result) => {
        setResults(result);
    });
}

ipcRenderer.on('start', (event, arg) => {
    inputElem = document.getElementById("input");
    inputElem.focus();
    const length = inputElem.value.length;
    inputElem.setSelectionRange(0, length);
});
