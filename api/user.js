import * as Types from "../store/types";
import { db, auth } from "./firebase";
import reduxStore from "../store/store";

export const createUser = (result) => {
  // initial user object
  const user = {
    email: result.user.email ?? "",
    profile_picture: result.additionalUserInfo.profile.picture ?? "",
    locale: result.additionalUserInfo.profile.locale ?? "en",
    first_name: result.additionalUserInfo.profile.given_name ?? "",
    last_name: result.additionalUserInfo.profile.family_name ?? "",
    created_at: Date.now(),
    last_logged_in: Date.now(),
    uid: result.user.uid,
    plan: "free",
  };

  return new Promise((resolve, reject) => {
    const ref = db.collection("users").doc(result.user.uid);
    ref
      .set(user)
      .then(() => {
        // if successful creation, then pass that user object back
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createInitialUserPreferences = (user) => {
  // create an instance of the redux store
  const state = reduxStore.store.getState();
  // get the current preferences object
  const preferences = state.settings.filter(
    (setting) => setting.category === "Preferences"
  )[0];
  // get the current notification preferences object
  const notifications = preferences.data.filter(
    (preference) => preference.title === "Notifications"
  )[0];
  // get the current notification preference options array
  const notificationOptions = notifications.options
    .filter((option) => option.enabled) // only include initially enabled notifications
    .map((option) => option.value);

  // set the initial preferences to include all initially enabled notifications
  const initialPreferences = {
    theme: "system",
    notifications: notificationOptions,
  };
  // save the initial preferences to Firestore
  db.collection("userPreferences").doc(user.uid).set(initialPreferences);
  return initialPreferences;
};

export const updateUser = (result) => {
  return new Promise((resolve, reject) => {
    const ref = db.collection("users").doc(result.user.uid);
    // update the user "last_logged_in" property
    ref.update({
      last_logged_in: Date.now(),
    });
    // pass the user object back
    ref
      .get()
      .then((doc) => {
        const data = doc.data(0);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getCurrentUser = () => async (dispatch) => {
  // retrieve the current user from Firebase Authentication
  const currentUser = auth.currentUser;
  // retrieve that user object from Firestore
  const user = await getUser(currentUser.uid);
  // retrieve that user preferences object from Firestore
  const preferences = await getUserPreferences(currentUser.uid);
  // pass user details back & stop loading
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
};

const getUser = async (uid) => {
  return new Promise((resolve, reject) => {
    db.collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getUserPreferences = async (uid) => {
  return new Promise((resolve, reject) => {
    db.collection("userPreferences")
      .doc(uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
