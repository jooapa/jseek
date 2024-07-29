const { ipcRenderer } = require('electron');


let debounceTimeout;

document.getElementById("input").addEventListener("input", (event) => {
    const input = event.target;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        ipcRenderer.invoke('search-query', input.value).then((result) => {
            document.getElementById("results").innerHTML = result;
        });
    }, 500);
});

// event listener for key press
document.addEventListener('keydown', function(event) {
    document.getElementById("input").focus();
});


document.addEventListener('DOMContentLoaded', function() {
    Onload();
});

function Onload() {
    document.getElementById("input").focus();
}