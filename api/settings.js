import * as Types from "../store/types";
import { db } from "./firebase";
import { Platform, Share } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as StoreReview from "expo-store-review";

import { signOut } from "./auth";

export const loadSettings = (navigation) => (dispatch) => {
  // get basic settings
  getSettings(navigation)
    .then((settings) => {
      return dispatch({
        type: Types.UPDATE_SETTINGS,
        payload: { settings },
      });
    })
    .catch((err) => {
      return dispatch({
        type: Types.UPDATE_SETTINGS,
        payload: { settings: [] },
      });
    });

  // get terms and privacy
  getPolicies()
    .then((policies) => {
      return dispatch({
        type: Types.UPDATE_POLICIES,
        payload: { policies },
      });
    })
    .catch((err) => {
      return dispatch({
        type: Types.UPDATE_POLICIES,
        payload: { policies: [] },
      });
    });
};

const getSettings = (navigation) => {
  return Promise.resolve(
    db
      .collection("App Admin")
      .doc("Settings")
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Firebase has been configured, use database data
          const data = doc.data();

          return sortSectionData(data, navigation);
        } else {
          // firebase has not been configured, default to static data
          console.log(
            "NOTICE: Using static data. Create a Firestore Settings object to dynamically pull."
          );
          return sortSectionData(starterSettings, navigation);
        }
      })
  );
};

const sortSectionData = (data, navigation) => {
  // determine the categories and order to display
  const sections = [
    { category: "Account", data: [] },
    { category: "Preferences", data: [] },
    { category: "Information", data: [] },
    { category: "Options", data: [] },
  ];
  sections.map(async (section) => {
    // load actions and options if applicable
    const options = await settingActions(data[section.category], navigation);
    return (section.data = options);
  });

  return sections;
};

const settingActions = async (category, navigation) => {
  const promises = await category.map(async (setting) => {
    switch (setting.type) {
      case "option":
        setting.action = setting.link
          ? () => WebBrowser.openBrowserAsync(setting.link)
          : undefined;
        return setting;
      case "share":
        setting.action = setting.shareText
          ? () => onShare(setting.shareText ?? "Share with friends")
          : undefined;
        return setting;
      case "rate":
        setting.action = () => StoreReview.requestReview();
        setting.title +=
          Platform.OS === "ios" ? "the App Store" : " Google Play";
        return setting;
      case "preference":
        // load preferences
        const options = await loadPreferenceOptions(setting.title);
        setting.options = options.options ?? [];

        const fields = Object.assign({}, setting);
        setting.action = setting.link
          ? () => navigation.navigate("Preferences", { settings: fields })
          : undefined;
        return setting;
      case "status":
        setting.action = setting.link
          ? () => navigation.navigate(setting.link)
          : undefined;
        return setting;
      case "logout":
        setting.action = () => signOut();
      default:
        return setting;
    }
  });
  return Promise.all(promises);
};

const onShare = async (shareText) => {
  try {
    const result = await Share.share({
      message: shareText,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log("SHARED!"); // need to log in Analaytics
      } else {
        // shared
        console.log("SHARED!"); // need to log in Analaytics
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      // need to log in Analaytics
    }
  } catch (error) {
    alert(error.message);
  }
};

export const loadPreferenceOptions = (preference) => {
  return new Promise((resolve, reject) => {
    getPreferenceOptions(preference)
      .then((options) => {
        // need to save to redux store
        resolve(options);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getPreferenceOptions = (preference) => {
  return new Promise((resolve, reject) => {
    db.collection("App Admin")
      .doc(preference)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          // no database values found, resort to starter values
          console.log(
            `NOTICE: Using static data. Create a Firestore ${preference} object to dynamically pull.`
          );
          const starterOptions = starterPreferenceOptions[preference]
          resolve(starterOptions)
        }
      });
  });
};

const getPolicies = () => {
  return Promise.resolve(
    db
      .collection("App Admin")
      .doc("Policies")
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Firebase has been configured, use database data
          const data = doc.data();

          return data;
        } else {
          // firebase has not been configured, default to static data
          console.log(
            "NOTICE: Using static data. Create a Firestore Policies object to dynamically pull."
          );
          return starterPolicies;
        }
      })
  );
};

// only load these settings if Firestore has not been configured yet
const starterSettings = {
  Account: [
    {
      color: "#BE59F1",
      icon: "command",
      title: "Your plan",
      type: "status",
    },
  ],
  Information: [
    {
      color: "#2ED056",
      icon: "compass",
      link: "https://tylerj.me",
      title: "Send feedback",
      type: "option",
    },
    {
      color: "#66D1FD",
      icon: "copy",
      shareText: "Starter – kick off any project tylerj.me",
      title: "Share with a friend",
      type: "share",
    },
    {
      color: "#FADA4A",
      icon: "star",
      title: "Rate us on",
      type: "rate",
    },
  ],
  Preferences: [
    {
      color: "#615D67",
      icon: "sun",
      link: "Preferences",
      title: "Appearance",
      type: "preference",
    },
    {
      color: "#FE365E",
      icon: "bell",
      link: "Preferences",
      title: "Notifications",
      type: "preference",
    },
  ],
  Options: [
    {
      color: "#FE365E",
      title: "Log out",
      type: "logout",
    },
  ],
};

const starterPolicies = {
  privacy: "https://www.webflow-cms.com/policies/privacy",
  terms: "https://www.webflow-cms.com/policies/terms",
};

const starterPreferenceOptions = {
  Appearance: {
    options: [
      {
        description: "Match your OS appearance",
        title: "System",
        type: "option",
        value: "system",
      },
      {
        title: "Dark",
        type: "option",
        value: "dark",
      },
      {
        title: "Light",
        type: "option",
        value: "light",
      },
    ],
  },
  Notifications: {
    options: [
      {
        enabled: false,
        title: "@ mentions",
        type: "switch",
        value: "mentions",
      },
      {
        enabled: true,
        title: "New messages",
        type: "switch",
        value: "messages",
      },
      {
        enabled: true,
        title: "New friends",
        type: "switch",
        value: "friends",
      },
    ],
  },
};
