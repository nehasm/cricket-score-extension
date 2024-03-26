document.addEventListener('DOMContentLoaded', function () {
    // Your code here
    var action = document.getElementById("click-me");
    action.addEventListener('click', function () {
        console.log("click working");
        document.getElementById("result").innerHTML ="I am clicked"
    });
    
});