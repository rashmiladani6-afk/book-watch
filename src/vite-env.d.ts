/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_VAPID_KEY?: string;
  readonly VITE_GARBATOWN_AUTH_BASE_URL?: string;
  readonly VITE_GARBATOWN_USER_API_BASE_URL?: string;
  readonly VITE_GARBATOWN_POPULAR_EVENTS_URL?: string;
  readonly VITE_GARBATOWN_EVENT_DETAILS_URL?: string;
  readonly VITE_GARBATOWN_EVENT_LIKE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
