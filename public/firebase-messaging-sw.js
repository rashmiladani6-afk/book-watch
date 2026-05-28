importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC5NahtxifybmTGF10em7sFalOxsmBjbw4',
  authDomain: 'garbatown-167fa.firebaseapp.com',
  projectId: 'garbatown-167fa',
  storageBucket: 'garbatown-167fa.firebasestorage.app',
  messagingSenderId: '532154292062',
  appId: '1:532154292062:web:a0d5418cdaa190679621cf',
  measurementId: 'G-FC075F5YP0',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'BookWatch';
  const notificationOptions = {
    body: payload.notification?.body || '',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
