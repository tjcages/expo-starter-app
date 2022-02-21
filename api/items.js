import * as Types from "../store/types";

export const getAllCollectionItems = (bearer, collectionId) => (dispatch) => {
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
      alert(JSON.stringify(error));
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
  (bearer, collectionId, item, changes) => (dispatch) => {
    const updates = {
      ...item,
      ...changes,
    };

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
        //Success
        console.log(responseJson);
        return dispatch({
          type: Types.PUBLISH_PENDING,
          payload: { pending: true },
        });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        alert(JSON.stringify(error));
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
