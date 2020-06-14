var friendCount = 134;
var displayedFriendCount = 0;

var graphValues = [0, 1, 0, 3, 5, 2, 1, 1, 0, 3, 4, 5, 4, 3, 2, 1, 1, 0, 1, 1];
var graphMax = 6;
var animatedGraphMax = 50;

var canvas = document.getElementById("involvementGraph");
var ctx = canvas.getContext("2d");

var cWidth = canvas.width;
var cHeight = canvas.height - 20;
var cXIncrement = canvas.width / graphValues.length;

ctx.strokeStyle = "#424242";
ctx.lineJoin = "round"; 
ctx.lineWidth = 5;

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (animatedGraphMax > graphMax + 1) animatedGraphMax--;
    else window.clearInterval(graphInterval);
    ctx.beginPath();
    ctx.moveTo(0, cHeight);
    for (var i = 1; i < graphValues.length; i++) {
        ctx.lineTo(cXIncrement * i, cHeight - graphValues[i] * cHeight / animatedGraphMax);
        ctx.stroke();
    }
}

var countText = document.getElementById("friendCount");

function changeCount() {
    if (displayedFriendCount < friendCount) {
        displayedFriendCount++;
        countText.innerHTML = displayedFriendCount;
    } else {
        window.clearInterval(countInterval);
    }
}


var graphInterval = window.setInterval(drawGraph, 30);
var countInterval = window.setInterval(changeCount, 10);