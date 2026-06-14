/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_VAPID_KEY?: string;
  readonly VITE_DEFAULT_FCM_TOKEN?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GARBATOWN_AUTH_BASE_URL?: string;
  readonly VITE_GARBATOWN_API_BEARER?: string;
  readonly VITE_GARBATOWN_GUEST_USER_TOKEN?: string;
  readonly VITE_GARBATOWN_BROWSE_EMAIL?: string;
  readonly VITE_GARBATOWN_BROWSE_PASSWORD?: string;
  readonly VITE_GARBATOWN_POPULAR_EVENTS_URL?: string;
  readonly VITE_GARBATOWN_EVENT_DETAILS_URL?: string;
  readonly VITE_GARBATOWN_EVENT_LIKE_URL?: string;
  readonly VITE_GARBATOWN_ADD_RATING_URL?: string;
  readonly VITE_GARBATOWN_ADD_TO_CART_URL?: string;
  readonly VITE_GARBATOWN_CART_DETAILS_URL?: string;
  readonly VITE_GARBATOWN_REMOVE_CART_URL?: string;
  readonly VITE_GARBATOWN_BUY_TICKET_URL?: string;
  readonly VITE_GARBATOWN_ORDER_SUMMARY_URL?: string;
  readonly VITE_GARBATOWN_MY_TICKETS_URL?: string;
  readonly VITE_GARBATOWN_TICKET_DETAILS_URL?: string;
  readonly VITE_GARBATOWN_TICKET_DOWNLOAD_URL?: string;
  readonly VITE_GARBATOWN_SPLIT_TICKET_URL?: string;
  readonly VITE_GARBATOWN_UPDATE_LOCATION_URL?: string;
  readonly VITE_GARBATOWN_NEARBY_EVENTS_URL?: string;
  readonly VITE_GARBATOWN_PROFILE_URL?: string;
  readonly VITE_GARBATOWN_EDIT_PROFILE_URL?: string;
  readonly VITE_GARBATOWN_DELETE_ACCOUNT_URL?: string;
  readonly VITE_GARBATOWN_CHANGE_PASSWORD_URL?: string;
  readonly VITE_GARBATOWN_CONTACT_US_URL?: string;
  readonly VITE_GARBATOWN_PAYMENT_GATEWAY_URL?: string;
  readonly VITE_GARBATOWN_CREATE_ORDER_URL?: string;
  readonly VITE_GARBATOWN_VERIFY_PAYMENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
