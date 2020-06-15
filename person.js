const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name')
const telephone = urlParams.get('tel')

var possibleMessages;
possibleMessages = ["Hey, how are you doing today?","What's going on?","Have you done anything fun recently?","Do you want to talk?","What's up?","Let's chat","Do you have a free minute?","Let me know if you can talk!"];
var possibleTopics
possibleTopics = ["Favorite animal", "Favorite Pet","Favorite Dessert","Favorite Snack","Favorite breakfast","Favorite Dinner","Favorite Drink","Favorite Place","Favorite Movie","Favorite Song","Favorite Album","Favorite Musician","Favorite Subject","Favorite Politician","Favorite Instrument","Least Favorite Food","Favorite Season","Favorite Weather","Least Favorite Season","Their lunch today","Their dinner today","Favorite gift","Favorite Candy","Their breakfast today","Favorite Book","Favorite Artist","Favorite Gum Flavor","Favorite time period","Favorite age","Favorite Website","Least Favorite Website"]
function doStuff(){
    var message1 = possibleTopics[Math.floor((Math.random()*possibleTopics.length))]
    document.getElementById("possibleTopicsText1").innerHTML = message1;
    var message2 = possibleTopics[Math.floor((Math.random()*possibleTopics.length))]
    document.getElementById("possibleTopicsText2").innerHTML = message2;
    var message3 = possibleTopics[Math.floor((Math.random()*possibleTopics.length))]
    document.getElementById("possibleTopicsText3").innerHTML = message3;
    document.getElementById("personName").innerHTML = name;
    document.getElementById("callID").href = "tel: "+telephone;
    console.log(possibleMessages.length);
    var message = "sms:?body="+possibleMessages[Math.floor((Math.random()*possibleMessages.length))]
    document.getElementById("textID").href = message;
    console.log(message);
}

