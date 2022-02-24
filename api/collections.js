import * as Types from "../store/types";

export const listCollections = (bearer, siteId) => (dispatch) => {
  //GET request
  fetch(`https://api.webflow.com/sites/${siteId}/collections`, {
    method: "GET",
    headers: {
      "Accept-Version": "1.0.0",
      Authorization: `Bearer ${bearer}`,
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      //Success
      return dispatch({
        type: Types.UPDATE_COLLECTIONS,
        // payload: { sites: responseJson.sort( sortSites ) },
        payload: { collections: responseJson.sort(sortCollections ) },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      // alert(JSON.stringify(error));
      console.error(error);
    });
};

export const selectCollection = (collectionId) => (dispatch) => {
  if (collectionId) {
    return dispatch({
      type: Types.SELECT_COLLECTION,
      payload: { selectedCollection: collectionId },
    });
  } else {
    // remove selected site and it's collections
    return dispatch({
      type: Types.SELECT_COLLECTION,
      payload: { selectedCollection: collectionId },
    });
  }
};

export const getCollectionSchema = (bearer, collectionId) => (dispatch) => {
  //GET request
  fetch(`https://api.webflow.com/collections/${collectionId}`, {
    method: "GET",
    headers: {
      "Accept-Version": "1.0.0",
      Authorization: `Bearer ${bearer}`,
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      //Success
      return dispatch({
        type: Types.UPDATE_COLLECTION_SCHEMA,
        payload: { collectionSchema: responseJson },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      // alert(JSON.stringify(error));
      console.error(error);
    });
};

function sortCollections(a, b) {
  // return the most recently published sites first
  if (a.lastUpdated > b.lastUpdated) {
    return -1;
  }
  if (a.lastUpdated < b.lastUpdated) {
    return 1;
  }
  return 0;
}