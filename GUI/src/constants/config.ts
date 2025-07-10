export const RESPONSE_TEXT_LENGTH = 450;
export const INTENT_EXAMPLE_LENGTH = 600;
export const USER_IDLE_STATUS_TIMEOUT = 300000; // milliseconds
export const CHAT_HISTORY_PREFERENCES_KEY = 'chat-history-preferences';
export const POPUP_DURATION = 5; // seconds
export const isHiddenFeaturesEnabled = 
  import.meta.env.REACT_APP_ENABLE_HIDDEN_FEATURES?.toLowerCase().trim() == 'true' ||
  import.meta.env.REACT_APP_ENABLE_HIDDEN_FEATURES?.toLowerCase().trim() == '1';
