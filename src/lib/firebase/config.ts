import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyC5NahtxifybmTGF10em7sFalOxsmBjbw4',
  authDomain: 'garbatown-167fa.firebaseapp.com',
  projectId: 'garbatown-167fa',
  storageBucket: 'garbatown-167fa.firebasestorage.app',
  messagingSenderId: '532154292062',
  appId: '1:532154292062:web:a0d5418cdaa190679621cf',
  measurementId: 'G-FC075F5YP0',
};

export const firebaseApp = initializeApp(firebaseConfig);
export { firebaseConfig };
