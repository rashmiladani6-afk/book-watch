/**
 * Main Application Component
 */

import { useEffect } from 'react';

import { useFcmToken } from '@/hooks/useFcmToken';
import VerticalSidebar from '@/shared/components/layout/VerticalSidebar';

import { Providers } from './providers';
import { AppRoutes } from './routes';

const App = () => {
  const { token, permissionStatus, error } = useFcmToken();

  useEffect(() => {
    if (token) {
      console.log('FCM token:', token);
    }
  }, [token]);

  useEffect(() => {
    if (permissionStatus === 'missing_vapid_key') {
      console.warn('FCM is configured, but VITE_FIREBASE_VAPID_KEY is missing.');
    }
  }, [permissionStatus]);

  useEffect(() => {
    if (error) {
      console.error('Unable to fetch FCM token:', error);
    }
  }, [error]);

  return (
    <Providers>
      <VerticalSidebar />
      <div className="md:ml-[72px]">
        <AppRoutes />
      </div>
    </Providers>
  );
};

export default App;