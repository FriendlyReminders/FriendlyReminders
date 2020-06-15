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
    document.getElementById("cardList").innerHTML = '';
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
            }
        }else{
            window.alert("You must add contacts before receiving a reminder!");
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