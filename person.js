// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const name = urlParams.get('name')
// document.getElementById("personName").innerHTML = name;

var possibleMessages;
possibleMessages = ["Hey, how are you doing today?","What's going on?","Have you done anything fun recently?","Do you want to talk?","What's up?","Let's chat","Do you have a free minute?","Let me know if you can talk!"];

function doStuff(){
    console.log(possibleMessages.length);
    var message = "sms:?body="+possibleMessages[Math.floor((Math.random()*possibleMessages.length))]
    document.getElementById("smsID").href = message;
    console.log(message);
}
