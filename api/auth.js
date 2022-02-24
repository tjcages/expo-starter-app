import * as Types from "../store/types";
import getEnvVars from "../environment";

import { db } from "./firebase";

const { clientId, clientSecret } = getEnvVars();

export const getAccessToken = (code) => (dispatch) => {
  //GET request
  fetch("https://api.webflow.com/oauth/access_token", {
    method: "POST",
    body: `client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      //Success
      return dispatch({
        type: Types.UPDATE_WEBFLOW_TOKEN,
        payload: { token: responseJson.access_token },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      console.log("Error getting access token: " + error.message);
      // alert(JSON.stringify(error));
      return dispatch({
        type: Types.UPDATE_WEBFLOW_TOKEN,
        payload: { token: null },
      });
    });
};

export const getCurrentAuthorizationInfo = (bearer) => (dispatch) => {
  //GET request
  fetch("https://api.webflow.com/info", {
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
        type: Types.UPDATE_AUTHORIZATION_ACCESS,
        payload: { authorization: responseJson },
      });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      // alert(JSON.stringify(error));
      console.error(error);
    });
};

export const revokeAuthToken = (bearer) => (dispatch) => {
  //GET request
  fetch("https://api.webflow.com/oauth/revoke_authorization", {
    method: "POST",
    body: `client_id=${clientId}&client_secret=${clientSecret}&access_token=${bearer}`,
    headers: {
      "Accept-Version": "1.0.0",
      Authorization: `Bearer ${bearer}`,
    },
  })
    .then((response) => response.json())
    //If response is in json then in success
    .then((responseJson) => {
      // Sign-out successful.
      //Success
      return [
        dispatch({
          type: Types.REVOKE_AUTHORIZATION,
          payload: { token: null, authorization: null },
        }),
        dispatch({
          type: Types.REMOVE_ALL,
          payload: {},
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

export const getCurrentAuthorizedUser = (bearer) => (dispatch) => {
  //GET request
  fetch("https://api.webflow.com/user", {
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
      manageFirestoreDatabase(responseJson.user)
        .then((user) => {
          return dispatch({
            type: Types.UPDATE_USER,
            payload: { user: user },
          });
        })
        .catch((error) => {
          //Error
          console.log("Error saving to Firestore");
          // alert(JSON.stringify(error));
          console.error(error);
        });
    })
    //If response is not in json then in error
    .catch((error) => {
      //Error
      // alert(JSON.stringify(error));
      console.error(error);
    });
};

const manageFirestoreDatabase = async (user) => {
  const ref = db.collection("users").doc(user._id);
  const firestoreUser = await ref.get().then(async (doc) => {
    if (doc.exists) {
      // user already exists, pass the whole object back
      return doc.data();
    } else {
      // user doesn't exist, create one
      const newUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
        status: "free",
      };
      return await ref
        .set(newUser)
        .then(() => {
          console.log("Firestore: New user successfully created");
          return newUser;
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          return null;
        });
    }
  });

  if (firestoreUser) {
    return Promise.resolve(firestoreUser);
  }
  return Promise.reject("Error creating user in Firestore");
};
