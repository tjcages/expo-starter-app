import * as Types from "./types";

const initialState = {
  user: null,
  token: null,
  authorization: null,
  sites: null,
  selectedSite: null,
  domains: null,
  collections: null,
  selectedCollection: null,
  collectionSchema: null,
  items: null,
  selectedItem: null,

  changes: null,

  publishPending: false,
  publishSuccess: false,
  loadingState: true,
  theme: "system",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.UPDATE_USER:
      return { ...state, user: action.payload.user };
    case Types.UDPATE_APP_THEME:
      return { ...state, theme: action.payload.theme };
    case Types.UPDATE_WEBFLOW_TOKEN:
      return { ...state, token: action.payload.token };
    case Types.UPDATE_AUTHORIZATION_ACCESS:
      return { ...state, authorization: action.payload.authorization };
    case Types.UPDATE_SITES:
      return { ...state, sites: action.payload.sites };
    case Types.SELECT_SITE:
      return { ...state, selectedSite: action.payload.selectedSite };
    case Types.UPDATE_DOMAINS:
      const domains = state.domains ?? {};
      domains[action.payload.site] = action.payload.domains;
      return { ...state, domains: domains };
    case Types.UPDATE_DOMAIN_SELECTION:
      const currentDomains = Object.assign({}, state.domains) ?? {};
      const selectedDomains = currentDomains[action.payload.site];
      const changedIndex = selectedDomains.findIndex(
        (dom) => dom._id === action.payload.domain._id
      );
      selectedDomains[changedIndex].selected = !action.payload.selected;

      return { ...state, domains: currentDomains };
    case Types.UPDATE_COLLECTIONS:
      return { ...state, collections: action.payload.collections };
    case Types.SELECT_COLLECTION:
      return {
        ...state,
        selectedCollection: action.payload.selectedCollection,
      };
    case Types.UPDATE_COLLECTION_SCHEMA:
      const existingSchema = state.collectionSchema ?? [];
      const newSchema = [action.payload.collectionSchema];
      const finalSchema = existingSchema.concat(newSchema);
      return { ...state, collectionSchema: finalSchema };
    case Types.UPDATE_ITEMS:
      const existingItems = state.items ?? [];
      const items = action.payload.items;
      if (items)
        items.map((item) => (item.collectionId = action.payload.collectionId));
      const newItems = existingItems.concat(items);
      return { ...state, items: newItems };
    case Types.SELECT_ITEM:
      return { ...state, selectedItem: action.payload.selectedItem };
    case Types.CHANGE_ITEM_VALUES:
      var newChanges = state.changes ?? {};
      const item = newChanges[action.payload.selectedItem] ?? {};
      item[action.payload.slug] = action.payload.newValue;
      newChanges[action.payload.selectedItem] = item;

      return { ...state, changes: newChanges };
    case Types.REMOVE_ITEM_CHANGE:
      const changes = Object.assign({}, state.changes) ?? {};
      delete changes[action.payload.key][action.payload.slug];

      // if the changes for this item are empty, delete the item
      if (Object.keys(changes[action.payload.key]).length === 0)
        delete changes[action.payload.key];

      return { ...state, changes: changes };
    case Types.PUBLISH_PENDING:
      return { ...state, publishPending: action.payload.pending };
    case Types.PUBLISH_SUCCESS:
      return {
        ...state,
        publishSuccess: action.payload.response,
        publishPending: false,
        changes: null,
      };
    case Types.PUBLISH_STATUS:
      return { ...state, publishSuccess: action.payload.status };
    case Types.REVOKE_AUTHORIZATION:
      return {
        ...state,
        token: action.payload.token,
        authorization: action.payload.authorization,
      };
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
      };
    default:
      return state;
  }
};

export { reducer };
