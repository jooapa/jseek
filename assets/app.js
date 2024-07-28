addEventListener("input", (event) => {
    
    const input = document.getElementById("input");
    OnButtonClick(input.value);
});

// event listener for key press
document.addEventListener('keydown', function(event) {
    // const input = document.getElementById("input");

    // if (event.key === "Backspace") {
    //     input.value = input.value.slice(0, -1);
    // } else {W
    //     input.value += event.key;
    // }
    // OnButtonClick(input.value);
    document.getElementById("input").focus();
});



document.addEventListener('DOMContentLoaded', function() {
    Onload();
});

function Onload() {
    // already focus on the input field
    document.getElementById("input").select();
    document.getElementById("input").focus();
    document.getElementById("input").click();


}