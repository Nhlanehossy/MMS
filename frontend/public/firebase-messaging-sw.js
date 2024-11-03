// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCDUZNzlJpQJpO52-8OSjuveW4HbXLIhB8",
  authDomain: "server-services-50a49.firebaseapp.com",
  projectId: "server-services-50a49",
  storageBucket: "server-services-50a49.appspot.com",
  messagingSenderId: "484734300353",
  appId: "1:484734300353:web:e114a73b06c46823c72440",
  measurementId: "G-SJVFBE0VY0",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here using data from payload
  const notificationTitle = payload.data.title; // Changed to data
  const notificationOptions = {
    body: payload.data.body, // Changed to data
    icon: payload.data.icon // You can specify the icon in the data payload
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
