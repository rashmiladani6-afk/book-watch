/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_VAPID_KEY?: string;
  readonly VITE_DEFAULT_FCM_TOKEN?: string;
  readonly VITE_GARBATOWN_AUTH_BASE_URL?: string;
  readonly VITE_GARBATOWN_USER_API_BASE_URL?: string;
  readonly VITE_GARBATOWN_POPULAR_EVENTS_URL?: string;
  readonly VITE_GARBATOWN_EVENT_DETAILS_URL?: string;
  readonly VITE_GARBATOWN_EVENT_LIKE_URL?: string;
  readonly VITE_GARBATOWN_BUY_TICKET_URL?: string;
  readonly VITE_GARBATOWN_ORDER_SUMMARY_URL?: string;
  readonly VITE_GARBATOWN_API_BEARER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
