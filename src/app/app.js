addEventListener("input", (event) => {
    
    const input = document.getElementById("input");
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