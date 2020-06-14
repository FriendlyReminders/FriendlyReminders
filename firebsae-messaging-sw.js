// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAkM_I-Ws79RnIvOLf8qh1RQCVi71KxtbY",
    authDomain: "friendlyreminders-5f78e.firebaseapp.com",
    databaseURL: "https://friendlyreminders-5f78e.firebaseio.com",
    projectId: "friendlyreminders-5f78e",
    storageBucket: "friendlyreminders-5f78e.appspot.com",
    messagingSenderId: "273447854632",
    appId: "1:273447854632:web:72f525303d7b001c600b1d",
    measurementId: "G-8DKCSZYBLL"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: 'images/FR.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });