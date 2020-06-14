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
    db2 = event.target.result;
    console.log(db2);


    var sameDate = false;
    var transaction = db2.transaction("dateAccessed").objectStore("dateAccessed");
    var d = new Date();
    transaction.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if(d.getFullYear()==cursor.value.year){
                console.log("Years match");
                if(d.getMonth()==cursor.value.month){
                    console.log("Months match");
                    if(d.getDay()==cursor.value.day){
                        console.log("Days match");
                        sameDate = true;
                    }
                }
            }
            console.log("Year " + cursor.value.year+" Month "+cursor.value.month + " Day " + cursor.value.day);
            cursor.continue();
        }
        else {
            console.log("No more entries!");
        }
    }
    if(!sameDate){
        var array = customerObjectStore.getAll();
        if(array.length>0){
            var customerObjectStore = db2.transaction("dateAccessed", "readwrite").objectStore("dateAccessed");
            var date = {
                year:d.getFullYear(),month:d.getMonth(),day:d.getDay()
            }
            customerObjectStore.add(date);
            addCard(array[Math.floor(Math.random()*array.length)])
        }
        
    }

};

request.onupgradeneeded = function(event) { 
    // Save the Idb2Database interface 
    db2 = event.target.result;
    console.log("upgradeneeded");
    // Create an objectStore for this db2
    var objectStore = db2.createObjectStore("dateAccessed",{autoIncrement: "true"});
    objectStore.transaction.oncomplete = function(event) {
        console.log("creation is complete");
    };
    

};





function addCard(contact){
    var div = document.createElement('div');
    document.getElementById("cardList").appendChild(div);

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
    h2.innerHTML="Talk to "+contact;
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