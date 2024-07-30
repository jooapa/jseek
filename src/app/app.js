const { ipcRenderer } = require('electron');


let debounceTimeoutFirst;
let debounceTimeoutSecond;
let debounceTimeoutThird;

document.getElementById("input").addEventListener("input", (event) => {
    const input = event.target;

    clearTimeout(debounceTimeoutFirst);
    debounceTimeoutFirst = setTimeout(() => {
        if (input.value.length === 0) {
            return;
        }
        ipcRenderer.invoke('search-query', "1 " + input.value).then((result) => {
            addResults(result);
        });
    }, 100);
    clearTimeout(debounceTimeoutSecond);
    debounceTimeoutSecond = setTimeout(() => {
        if (input.value.length === 0) {
            return;
        }
        ipcRenderer.invoke('search-query', "5 " + input.value).then((result) => {
            addResults(result);
        });
    }, 1000);
    clearTimeout(debounceTimeoutThird);
    debounceTimeoutThird = setTimeout(() => {
        if (input.value.length === 0) {
            return;
        }
        ipcRenderer.invoke('search-query', "10 " + input.value).then((result) => {
            addResults(result);
        });
    }, 2000);
});

// event listener for key press
document.addEventListener('keydown', function(event) {
    maybeResetResults(event);
    document.getElementById("input").focus();
});

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

function addResults(result) {
    if (!maybeResetResults()) {
        document.getElementById("results").innerHTML += result;
    }
}

function resetResults() {
    document.getElementById("results").innerHTML = "";
}

document.addEventListener('DOMContentLoaded', function() {
    Onload();
});

function Onload() {
    document.getElementById("input").focus();
}
