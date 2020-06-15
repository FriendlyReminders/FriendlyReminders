const publicKey = 'BGo3-1nTAVTQ1cM4py5Fp5HO5oHzTRsJY3bhwCsLxDDlpV38aNOaTL74e2QqT_6T6IxTQuIoSRZ-OZxcNGXltVs';
//private key: KdjGpy8sBHIaMIkMS2Te3cB3u2xep4pV0pU1XXL38gI

navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
    console.log('Excellent, registered with scope: ', registration.scope);
});



if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}else{
    console.log('This browser should support IndexedDB')
}
var db;
var request = indexedDB.open("MyTestDatabase");
request.onerror = function(event) {
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = async function(event) {
    db = event.target.result;
    console.log(db);
    
     
    var transaction = db.transaction("name").objectStore("name");

    transaction.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
        console.log("Name for SSN " + cursor.key + " is " + cursor.value.name);
        addCard(cursor.value);
        cursor.continue();
    }
    else {
        console.log("No more entries!");
    }
    };
};

function reRender(){

}
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

//   document.body.onkeyup = function(e){
//     if(e.key === 'Spacebar'){
//         console.log("hi");
//     const title = 'Push Codelab';
//   const options = {
//     body: 'Yay it works.',
//     icon: 'images/icon.png',
//     badge: 'images/badge.png'
//   };
//   self.registration.showNotification(title, options);
//     }
// }
  


const supported = ('contacts' in navigator && 'ContactsManager' in window);
function dosomething(){
    openUpContact();
}

async function openUpContact(){


    var objectStore = db.transaction("name").objectStore("name");

    
    if(supported){
        const props = ['name','tel'];
        const opts = {multiple: true};
        try {
        const contacts = await navigator.contacts.select(props, opts);
        handleResults(contacts);
        } catch (ex) {
        // Handle any errors here.
            window.alert(ex);
        }
    }
}

  
function handleResults(contacts) {
    var names = [];
    var numbers = []
    contacts.forEach((contact) => {
        names.push(contact.name)
        numbers.push(contact.tel);
    }
    )
    for(var i = 0;i<names.length;i++){
        var customerObjectStore = db.transaction("name", "readwrite").objectStore("name");
        var person = {
            name:names[i],tel:numbers[i],contactNumber:0,personNumber:0,contactDate:"never"
        }
        customerObjectStore.add(person);
        addCard(person);
    }
    
    
}
function addCard(contact){
    var a = document.createElement('a');
    a.href = "/person?name="+contact.name+"&tel="+contact.tel;
    document.getElementById("cardList").appendChild(a);

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
    h2.innerHTML=contact.name;
    div2.appendChild(h2);
    div.appendChild(img);
}