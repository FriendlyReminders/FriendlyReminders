const publicKey = 'BGo3-1nTAVTQ1cM4py5Fp5HO5oHzTRsJY3bhwCsLxDDlpV38aNOaTL74e2QqT_6T6IxTQuIoSRZ-OZxcNGXltVs';
//private key: KdjGpy8sBHIaMIkMS2Te3cB3u2xep4pV0pU1XXL38gI

navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
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


async function openUpContact(){
    console.log("test");
    if(supported){
        const props = ['name'];
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
    var names = [''];
    contacts.forEach((contact) => {
        names.push(contact.name)
    }
    )
}