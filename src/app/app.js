const { ipcRenderer } = require('electron');


addEventListener("input", (event) => {
    const input = document.getElementById("input");

    if (input.value.length > 0) {
        ipcRenderer.send('some-event', input.value);
    } else {
        document.getElementById("results").innerHTML = "";
    }
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

ipcRenderer.on('some-event-reply', (event, arg) => {
    document.getElementById("results").innerHTML = arg;
});