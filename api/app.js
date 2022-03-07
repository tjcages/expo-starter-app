import * as Types from "../store/types";
import { db, auth } from "./firebase";

export const updateAppTheme = (theme) => (dispatch) => {
  // retrieve the current user from Firebase Authentication
  const currentUser = auth.currentUser;
  // update user preferences in Firestore
  db.collection("userPreferences").doc(currentUser.uid).update({ theme });
  // update redux store
  return dispatch({ type: Types.UDPATE_APP_THEME, payload: { theme } });
};

export const updateNotificationPreferences =
  (option, notifications) => (dispatch) => {
    var notificationUpdate = [...notifications];
    if (notificationUpdate.includes(option.value)) {
      // option was enabled, disable
      notificationUpdate = notificationUpdate.filter(
        (notification) => notification !== option.value
      );
    } else {
      // option was disabled, enable
      notificationUpdate.push(option.value);
    }

    // retrieve the current user from Firebase Authentication
    const currentUser = auth.currentUser;
    // update user preferences in Firestore
    db.collection("userPreferences")
      .doc(currentUser.uid)
      .update({ notifications: notificationUpdate });

    return dispatch({
      type: Types.UPDATE_NOTIFICATION_PREFERENCES,
      payload: { notifications: notificationUpdate },
    });
  };
