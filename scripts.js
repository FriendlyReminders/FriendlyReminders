const publicKey = 'BGo3-1nTAVTQ1cM4py5Fp5HO5oHzTRsJY3bhwCsLxDDlpV38aNOaTL74e2QqT_6T6IxTQuIoSRZ-OZxcNGXltVs';
//private key: KdjGpy8sBHIaMIkMS2Te3cB3u2xep4pV0pU1XXL38gI

navigator.serviceWorker && navigator.serviceWorker.register('./firebase-messaging-sw.js').then(function(registration) {
    console.log('Excellent, registered with scope: ', registration.scope);
});

function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}
if(!isMobile){
    document.getElementById("allContent").innerHTML = "";
    document.getElementById("allContent").style.background = "white"
    document.getElementById("allContent").style.paddingTop = "10%";

    var bigFont = document.createElement("h1");
    bigFont.style.fontSize = "50px";
    bigFont.innerHTML = "Due to restrictions with APIs, this project only works on a mobile phone"
    document.getElementById("allContent").appendChild(bigFont);
    document.getElementById("footerDiv").style.boxShadow = "none"
    document.getElementById("footerDiv").innerHTML = "";
    // window.alert("THIS PROJECT USES AN API FUNCTIONAL ONLY ON MOBILE.  TO USE THIS APP, YOU MUST ACCESS IT ON A PHONE");

}


navigator.serviceWorker && navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
    serviceWorkerRegistration.pushManager.getSubscription()  
      .then(function(subscription) {  
        if (subscription) {
            console.info('Got existing', subscription);
            window.subscription = subscription;
            return;  // got one, yay
          }
        
          const applicationServerKey = urlB64ToUint8Array(publicKey);
          serviceWorkerRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey,
          })
            .then(function(subscription) { 
              console.info('Newly subscribed to push!', subscription);
              window.subscription = subscription;
            });
      });
  });

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
    document.getElementById("cardList").innerHTML = '';
    db2 = event.target.result;
    
    // var customerObjectStore = db2.transaction("name", "readwrite").objectStore("name");
    // var person = {name: "James",tel:"sfdaosdjfosa"}
    // customerObjectStore.add(person);
    // var customerObjectStore = db2.transaction("name", "readwrite").objectStore("name");
    // var person = {
    //     name:"james",tel:"5",contactNumber:0,personNumber:0,contactDate:"never"
    // }
    // customerObjectStore.add(person);
    // addCard(person);

    var sameDate = false;
    var addedPerson = false;
    var transaction = db2.transaction("dateAccessed").objectStore("dateAccessed");
    transaction.openCursor().onsuccess = async function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(d.getFullYear()+" "+cursor.value.year);
            if(d.getDate()!=cursor.value.day||(d.getDate()==cursor.value.day&&d.getFullYear()!=cursor.value.year)){
                console.log("Days match");
                let tx = db2.transaction("name");
                    var count = await tx.objectStore("name").count();
                    console.log(count);

                    count.onsuccess = () => {
                        console.log(count.result);
                        console.log("already added someone: "+addedPerson);
                        if(count.result>0 && !addedPerson){
                            //adds in a date
                            addedPerson = true;
                            var customerObjectStore = db2.transaction("dateAccessed", "readwrite").objectStore("dateAccessed");
                            var date = {
                                year:d.getFullYear(),month:d.getMonth(),day:d.getDate()
                            }
                            customerObjectStore.add(date);
                            var index = Math.ceil(Math.random()*count.result);
                            db2.transaction("name").objectStore("name").get(index).onsuccess = function(event) {

                            var customerObjectStore = db2.transaction("peopleDay", "readwrite").objectStore("peopleDay");
                            var person = event.target.result;
                            customerObjectStore.add(person);
                            }
                            };
                        };
                    }
            console.log("Year " + cursor.value.year+" Month "+cursor.value.month + " Day " + cursor.value.day);
            cursor.continue();
        }
        else {
            console.log("No more entries!");
        }
    }
    var transaction = db2.transaction("peopleDay").objectStore("peopleDay");

    transaction.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
        addCard(cursor.value);
        cursor.continue();
    }
    else {
        console.log("No more entries!");
    }
    };
    var transaction = db2.transaction("dateAccessed").objectStore("dateAccessed");
    var d = new Date();
    var customerObjectStore = db2.transaction("dateAccessed", "readwrite").objectStore("dateAccessed");
    var date = {
    year:d.getFullYear(),month:d.getMonth(),day:d.getDate()
    }
    customerObjectStore.add(date);
}


async function enterAPerson(){
    let tx = db2.transaction("name");
    var count = await tx.objectStore("name").count();
    var personAdded = false;
    count.onsuccess = () => {
        if(count.result>0&&!personAdded){
            personAdded = true;
            var index = Math.ceil(Math.random()*count.result);
            db2.transaction("name").objectStore("name").get(index).onsuccess = function(event) {

            var customerObjectStore = db2.transaction("peopleDay", "readwrite").objectStore("peopleDay");
            var person = {
                name:event.target.result.name,tel:event.target.result.tel,contactNumber:event.target.result.contactNumber,personNumber:event.target.result.personNumber,contactDate:event.target.result.contactDate
            }
            customerObjectStore.add(person);

            var transaction = db2.transaction("peopleDay").objectStore("peopleDay");
            document.getElementById("cardList").innerHTML = '';
            transaction.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                addCard(cursor.value);
                cursor.continue();
            }
            else {
                console.log("No more entries!");
            }
            };
            }
            
        }else{
            window.alert("You must add contacts before receiving a reminder!");
        }
    }

    
}    

request.onupgradeneeded = function(event) { 
    // Save the Idb2Database interface 
    db2 = event.target.result;
    console.log("upgradeneeded");
    // Create an objectStore for this db2
    var objectStore = db2.createObjectStore("name",{autoIncrement: "true"});
    objectStore.transaction.oncomplete = function(event) {
        console.log("created object store");
    };
    var objectStore = db2.createObjectStore("dateAccessed",{autoIncrement: "true"});
    objectStore.transaction.oncomplete = function(event) {
        console.log("creation is complete");
        var transaction = db2.transaction("dateAccessed").objectStore("dateAccessed");
        var d = new Date();
        var customerObjectStore = db2.transaction("dateAccessed", "readwrite").objectStore("dateAccessed");
        var date = {
        year:0,month:0,day:0
        }
        customerObjectStore.add(date);
    };
    var objectStore = db2.createObjectStore("peopleDay",{autoIncrement: "true"});
    objectStore.transaction.oncomplete = function(event) {
        console.log("creation is complete");
    };



};





function addCard(contact){
    var a = document.createElement('a');
    a.href = "/person?name="+contact.name+"&tel="+contact.tel;
    document.getElementById("cardList").prepend(a);

    var div = document.createElement('div');
    a.appendChild(div);

    div.className = "friendCard";
    var img = document.createElement('img');
    div.appendChild(img);
    img.src = "images/Man.png"
    img.className = "smallFace";


    var div2 = document.createElement('div');
    div.appendChild(div2);
    div2.className = "talkToText";


    var h2 = document.createElement('h2');
    div2.appendChild(h2);
    h2.innerHTML="Talk to " +contact.name;
    div2.appendChild(h2);
    div.appendChild(img);
}

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey("BJhYGR06GEK0DA2sKNDDdUkk7WKnVk6UmyQOy-HOa2NAEo06HStm_bxQLkEDuf8T19w131q_IObZ-QxkvdB9utI");

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
    if (currentToken) {
      sendTokenToServer(currentToken);
    //   updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
    //   updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });

  // Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // ...
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
    //   showToken('Unable to retrieve refreshed token ', err);
    });
  });

  function resetUI() {
    clearMessages();
    // showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        sendTokenToServer(currentToken);
        // updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    //   showToken('Error retrieving Instance ID token. ', err);
      setTokenSentToServer(false);
    });
    // [END get_token]
  }


//   function showToken(currentToken) {
//     // Show token in console and UI.
//     const tokenElement = document.querySelector('#token');
//     tokenElement.textContent = currentToken;
//   }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }

  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }

//   function showHideDiv(divId, show) {
//     const div = document.querySelector('#' + divId);
//     if (show) {
//       div.style = 'display: visible';
//     } else {
//       div.style = 'display: none';
//     }
//   }

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // [START_EXCLUDE]
        // In many cases once an app has been granted notification permission,
        // it should update its UI reflecting this.
        // resetUI();
        // [END_EXCLUDE]
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
    // [END request_permission]
  }

  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken().then((currentToken) => {
      messaging.deleteToken(currentToken).then(() => {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      }).catch((err) => {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    }).catch((err) => {
      console.log('Error retrieving Instance ID token. ', err);
    //   showToken('Error retrieving Instance ID token. ', err);
    });

  }

//   // Add a message to the messages element.
//   function appendMessage(payload) {
//     const messagesElement = document.querySelector('#messages');
//     const dataHeaderELement = document.createElement('h5');
//     const dataElement = document.createElement('pre');
//     dataElement.style = 'overflow-x:hidden;';
//     dataHeaderELement.textContent = 'Received message:';
//     dataElement.textContent = JSON.stringify(payload, null, 2);
//     messagesElement.appendChild(dataHeaderELement);
//     messagesElement.appendChild(dataElement);
//   }

  // Clear the messages element of all children.
//   function clearMessages() {
//     const messagesElement = document.querySelector('#messages');
//     while (messagesElement.hasChildNodes()) {
//       messagesElement.removeChild(messagesElement.lastChild);
//     }
//   }

//   function updateUIForPushEnabled(currentToken) {
//     showHideDiv(tokenDivId, true);
//     showHideDiv(permissionDivId, false);
//     showToken(currentToken);
//   }

//   function updateUIForPushPermissionRequired() {
//     showHideDiv(tokenDivId, false);
//     showHideDiv(permissionDivId, true);
//   }

//   resetUI();