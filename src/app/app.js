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
            return;
        }
        ipcRenderer.invoke('search-query', "1 " + input.value).then((result) => {
            setResults(result);
        });
    }, 100);

    clearTimeout(debounceTimeoutSecond);
    debounceTimeoutSecond = setTimeout(() => {
        if (input.value.length === 0) {
            return;
        }
        ipcRenderer.invoke('search-query', "5 " + input.value).then((result) => {
            setResults(result);
        });
    }, 1000);

    clearTimeout(debounceTimeoutThird);
    debounceTimeoutThird = setTimeout(() => {
        if (input.value.length === 0) {
            return;
        }
        ipcRenderer.invoke('search-query', "10 " + input.value).then((result) => {
            setResults(result);
        });
    }, 2000);
});

function isValidCharInput(input) {
    // check if the input the normal key
    return input.length === 1 && input.match(/[a-z0-9]/i);
}

// event listener for key press
document.addEventListener('keydown', function(event) {
    maybeResetResults(event);
    const inputElem = document.getElementById("input");

    if (event.key === "ArrowDown") {
        document.getElementById("input").blur();
        selectedResult = Math.min(selectedResult + 1, results.length - 1);
        updateSelectedResult();
    }
    if (event.key === "ArrowUp") {
        document.getElementById("input").blur();
        if (selectedResult === 0) {
            inputElem.focus();
            const length = inputElem.value.length;
            inputElem.setSelectionRange(length, length);
        }
        selectedResult = Math.max(selectedResult - 1, 0);
        updateSelectedResult();
    }

    if (event.key === "Enter") {
        const blocks = document.getElementsByClassName("block");
        if (blocks.length === 0) {
            return;
        }
        const block = blocks[selectedResult];
        // `<div class="block" data-type="${type}" data-path="${path}">
        const path = block.getAttribute("data-path");
        const type = block.getAttribute("data-type");
        alert("Opening: " + path + " of type: " + type);
        // openFile(path, type);
    }

    if (event.key === "Tab") {
        inputElem.focus();
        event.preventDefault();
    }

    if (isValidCharInput(event.key)) {
        console.log("Key pressed: " + event.key);
        selectedResult = 0;
        updateSelectedResult();
    }
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
        blocks[selectedResult].scrollIntoView({ behavior: "auto", block: "center" });
    }
}

function maybeResetResults(event) {
    if (event.target.value.length === 0 && event.key === "Backspace") {
        resetResults();
        return true;
    }
    return false;
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

function openFile(path, type) {
    if (type === "folder") {
        ipcRenderer.invoke('open-folder', path);
    } else if (type === "file") {
        ipcRenderer.invoke('open-file', path);
    }
}

function moreResults() {
    alert("More results");
}

document.addEventListener('DOMContentLoaded', function() {
    Onload();
});

function Onload() {
    document.getElementById("input").focus();
}