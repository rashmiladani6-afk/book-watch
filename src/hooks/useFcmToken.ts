import { useEffect, useState } from 'react';

import {
  getStoredFcmToken,
  requestFcmToken,
  type FcmPermissionStatus,
} from '@/lib/firebase/messaging';

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(() => getStoredFcmToken());
  const [permissionStatus, setPermissionStatus] = useState<FcmPermissionStatus>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    return Notification.permission;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadFcmToken = async () => {
      try {
        const result = await requestFcmToken();
        if (!active) {
          return;
        }

        setToken(result.token);
        setPermissionStatus(result.permissionStatus);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to get FCM token');
      }
    };

    void loadFcmToken();

    return () => {
      active = false;
    };
  }, []);

  return {
    token,
    permissionStatus,
    error,
  };
};
