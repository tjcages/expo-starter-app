import firebase from "firebase";
import * as Types from "../store/types";

import { createUser, updateUser, createInitialUserPreferences } from "./user";
import { auth } from "./firebase";

export const onSignInGoogle = (googleIdToken) => (dispatch) => {
  // show loading indicator
  dispatch({ type: Types.UPDATE_LOADING_STATE, payload: { loading: true } });

  // we need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    unsubscribe();
    // create the correct credential using our google id token
    var credential = firebase.auth.GoogleAuthProvider.credential({
      idToken: googleIdToken,
    });

    // Sign in with credential from the Google user.
    auth
      .signInWithCredential(credential)
      .then((result) => {
        if (result.additionalUserInfo.isNewUser) {
          // if user doesn't exist, create one
          createUser(result)
            .then((user) => {
              // successful creation
              // create initial user preferences
              const preferences = createInitialUserPreferences(user);
              // save to redux store & end loading
              return [
                dispatch({ type: Types.UPDATE_USER, payload: { user } }),
                dispatch({
                  type: Types.UPDATE_USER_PREFERENCES,
                  payload: { preferences },
                }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            })
            .catch((error) => {
              // issue creating new user
              console.log("Error: " + error);
              return [
                dispatch({
                  type: Types.UPDATE_USER,
                  payload: { user: null },
                }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            });
        } else {
          // user exists, update last login
          updateUser(result)
            .then((user) => {
              // successful update
              // save to redux store & end loading
              return [
                dispatch({ type: Types.UPDATE_USER, payload: { user } }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            })
            .catch((error) => {
              // issue updating user
              console.log("Error: " + error);
              return [
                dispatch({
                  type: Types.UPDATE_USER,
                  payload: { user: null },
                }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            });
        }
      })
      .catch((error) => {
        // handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // the email of the user's account used.
        var email = error.email;
        // the firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        const err = { errorCode, errorMessage, email, credential };
        console.log("Firebase Signin Error: ", err);
      });
  });
};

export const onSignInApple = (appleIdToken) => (dispatch) => {
  // show loading indicator
  dispatch({ type: Types.UPDATE_LOADING_STATE, payload: { loading: true } });

  // we need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
    unsubscribe();
    // build Firebase credential with the Apple ID token.
    const provider = new firebase.auth.OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");

    const credential = provider.credential({
      idToken: appleIdToken,
    });

    // sign in with credential from the Apple user.
    auth
      .signInWithCredential(credential)
      .then((result) => {
        if (result.additionalUserInfo.isNewUser) {
          // if user doesn't exist, create one
          createUser(result)
            .then((user) => {
              // successful creation
              // create initial user preferences
              const preferences = createInitialUserPreferences(user);
              // save to redux store & end loading
              return [
                dispatch({ type: Types.UPDATE_USER, payload: { user } }),
                dispatch({
                  type: Types.UPDATE_USER_PREFERENCES,
                  payload: { preferences },
                }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            })
            .catch((error) => {
              // issue creating new user
              console.log("Error: " + error);
              return [
                dispatch({
                  type: Types.UPDATE_USER,
                  payload: { user: null },
                }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            });
        } else {
          // user exists, update last login
          updateUser(result)
            .then((user) => {
              // successful update
              // save to redux store & end loading
              return [
                dispatch({ type: Types.UPDATE_USER, payload: { user } }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            })
            .catch((error) => {
              // issue updating user
              console.log("Error: " + error);
              return [
                dispatch({
                  type: Types.UPDATE_USER,
                  payload: { user: null },
                }),
                dispatch({
                  type: Types.UPDATE_LOADING_STATE,
                  payload: { loading: false },
                }),
              ];
            });
        }
      })
      .catch((error) => {
        // handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // the email of the user's account used.
        var email = error.email;
        // the firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        const err = { errorCode, errorMessage, email, credential };
        console.log("Firebase Signin Error: ", err);
      });
  });
};

export const signOut = () => {
  // sign out of Firebase Authentication
  auth.signOut();
};

export const revokeReduxStore = () => (dispatch) => {
  // remove all redux store persistent fields
  return dispatch({
    type: Types.REMOVE_ALL,
    payload: {},
  });
};
