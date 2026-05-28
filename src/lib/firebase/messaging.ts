import { getMessaging, getToken, isSupported } from 'firebase/messaging';

import { firebaseApp } from './config';

export const FCM_TOKEN_STORAGE_KEY = 'fcmToken';
const FCM_SERVICE_WORKER_PATH = '/firebase-messaging-sw.js';
const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export type FcmPermissionStatus =
  | NotificationPermission
  | 'unsupported'
  | 'missing_vapid_key';

export interface FcmTokenResult {
  token: string | null;
  permissionStatus: FcmPermissionStatus;
}

const isBrowser = () => typeof window !== 'undefined';

const canUseNotifications = () =>
  isBrowser() && 'Notification' in window && 'serviceWorker' in navigator;

export const getStoredFcmToken = () => {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
};

const storeFcmToken = (token: string | null) => {
  if (!isBrowser()) {
    return;
  }

  if (token) {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
    return;
  }

  localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
};

const registerMessagingServiceWorker = async () => {
  if (!canUseNotifications()) {
    return null;
  }

  return navigator.serviceWorker.register(FCM_SERVICE_WORKER_PATH);
};

export const requestFcmToken = async (): Promise<FcmTokenResult> => {
  if (!canUseNotifications()) {
    return {
      token: null,
      permissionStatus: 'unsupported',
    };
  }

  if (!FIREBASE_VAPID_KEY) {
    return {
      token: null,
      permissionStatus: 'missing_vapid_key',
    };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return {
      token: null,
      permissionStatus: 'unsupported',
    };
  }

  const permissionStatus =
    Notification.permission === 'granted'
      ? 'granted'
      : await Notification.requestPermission();

  if (permissionStatus !== 'granted') {
    storeFcmToken(null);
    return {
      token: null,
      permissionStatus,
    };
  }

  const serviceWorkerRegistration = await registerMessagingServiceWorker();
  if (!serviceWorkerRegistration) {
    return {
      token: null,
      permissionStatus: 'unsupported',
    };
  }

  const messaging = getMessaging(firebaseApp);
  const token = await getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });

  storeFcmToken(token || null);

  return {
    token: token || null,
    permissionStatus,
  };
};
