import firebase from "firebase";
import * as Types from "../store/types";
const storage = firebase.storage();

export const getAllCollectionItems =
  (bearer, collectionId, replace = false) =>
  (dispatch) => {
    //GET request
    fetch(`https://api.webflow.com/collections/${collectionId}/items`, {
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
        if (replace) {
          return dispatch({
            type: Types.REPLACE_ITEMS,
            payload: {
              items: responseJson.items.sort(sortItems),
            },
          });
        }
        return dispatch({
          type: Types.UPDATE_ITEMS,
          payload: {
            items: responseJson.items.sort(sortItems),
            collectionId: collectionId,
          },
        });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        // alert(JSON.stringify(error));
        console.error(error);
      });
  };

export const selectItem = (itemId) => (dispatch) => {
  if (itemId) {
    return dispatch({
      type: Types.SELECT_ITEM,
      payload: { selectedItem: itemId },
    });
  } else {
    // remove selected site and it's collections
    return dispatch({
      type: Types.SELECT_ITEM,
      payload: { selectedItem: itemId },
    });
  }
};

export const updateItemValue = (selectedItem, slug, newValue) => (dispatch) => {
  return dispatch({
    type: Types.CHANGE_ITEM_VALUES,
    payload: { selectedItem, slug, newValue },
  });
};

export const revertChange = (key, slug) => (dispatch) => {
  return dispatch({
    type: Types.REMOVE_ITEM_CHANGE,
    payload: { key, slug },
  });
};

export const publishItemChange =
  (bearer, collectionId, item, changes, userId) => async (dispatch) => {
    // start loading
    dispatch({
      type: Types.UPDATE_LOADING_STATE,
      payload: { loading: true },
    });

    var updates = Object.assign({}, item);
    const promises = Object.keys(changes).map(async function (key, index) {
      var change = changes[key];
      if (change && change.status === "upload") {
        // an image, upload to storage first
        change = await uploadImageToStorage(change, userId);
      }
      var obj = {};
      obj[key] = change;
      return obj;
    });
    const updatedChanges = await Promise.all(promises);
    updatedChanges.map((update) => {
      updates = {
        ...updates,
        ...update,
      };
    });

    // delete uneditable or unused fields
    delete updates.collectionId;
    delete updates["updated-on"];
    delete updates["updated-by"];
    delete updates["created-on"];
    delete updates["created-by"];
    delete updates["published-on"];
    delete updates["published-by"];

    const changesJSON = JSON.stringify({ fields: updates });

    //PUT request
    fetch(
      `https://api.webflow.com/collections/${collectionId}/items/${item._id}`,
      {
        method: "PUT",
        body: changesJSON,
        headers: {
          "Accept-Version": "1.0.0",
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        console.log(responseJson);
        //Success
        return [
          dispatch({
            type: Types.PUBLISH_PENDING,
            payload: { pending: true },
          }),
          dispatch({
            type: Types.UPDATE_LOADING_STATE,
            payload: { loading: false },
          }),
        ];
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        // alert(JSON.stringify(error));
        console.error(error);
      });
  };

function sortItems(a, b) {
  // return the most recently published sites first
  if (a["updated-on"] > b["updated-on"]) {
    return -1;
  }
  if (a["updated-on"] < b["updated-on"]) {
    return 1;
  }
  return 0;
}

async function uploadImageToStorage(image, userId) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    // create a filename
    const filename =
      "images/" +
      `${userId}_` +
      image.uri.substring(image.uri.lastIndexOf("/") + 1);
    // create a lightweight storage ref
    const storageRef = storage.ref().child(filename);
    // retrieve accessible url

    // storageRef.put(blob);
    await storageRef.put(blob);
    const downloadURL = await storageRef.getDownloadURL();

    resolve(downloadURL);
  });
}
