var friendCount = 0;
var countInterval;
const supported = ('contacts' in navigator && 'ContactsManager' in window);


if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}else{
    console.log('This browser should support IndexedDB')
}
var db2;
var request = indexedDB.open("MyTestDatabase");
request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = async function(event) {
    db2 = event.target.result;
    let tx = db2.transaction("name");
    var count = await tx.objectStore("name").count();
    console.log(count);

    count.onsuccess = () => {
    console.log(count.result);
    friendCount = count.result;
    countInterval = window.setInterval(changeCount, 10);
    }
}
request.onerror = function(event) {
    console.log("Why didn't you allow my web app to use IndexedDB?!");
};


var friendCount = 0;
var displayedFriendCount = 0;

var graphValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 2, 5];
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
