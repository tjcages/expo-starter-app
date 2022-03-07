import * as Types from "./types";

const initialState = {
  user: null,
  loadingState: false,
  theme: "system",
  notifications: [],

  settings: [],
  policies: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.UPDATE_LOADING_STATE:
      return { ...state, loadingState: action.payload.loading };
    case Types.UDPATE_APP_THEME:
      return { ...state, theme: action.payload.theme };
    case Types.UPDATE_NOTIFICATION_PREFERENCES:
      return { ...state, notifications: action.payload.notifications };
      
    case Types.UPDATE_SETTINGS:
      return { ...state, settings: action.payload.settings };
    case Types.UPDATE_POLICIES:
      return { ...state, policies: action.payload.policies };

    case Types.UPDATE_USER:
      return { ...state, user: action.payload.user };
    case Types.UPDATE_USER_PREFERENCES:
      const theme = action.payload.preferences.theme;
      const notifications = action.payload.preferences.notifications;
      return { ...state, theme: theme, notifications: notifications };
    
    case Types.REMOVE_ALL:
      return {
        ...state,
        user: null,
        token: null,
        authorization: null,
        sites: null,
        collections: null,
        domains: null,
        collectionSchema: null,
        items: null,
        selectedSite: null,
        selectedCollection: null,
        selectedItem: null,
        changes: null,
        publishPending: false,
        publishSuccess: false,
        loadingState: false,
      };
    default:
      return state;
  }
};

export { reducer };
