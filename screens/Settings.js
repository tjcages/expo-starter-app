import React, { useEffect, useState } from "react";
import * as Analytics from "expo-firebase-analytics";
import { StyleSheet, Share, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as StoreReview from "expo-store-review";
import * as WebBrowser from "expo-web-browser";
import { Container, NavButton, useThemeColor } from "../components";

import { revokeAuthToken } from "../api/auth";

import SettingsList from "../views/SettingsList";

const Settings = (props) => {
  const [notifications, setNotifications] = useState(true);
  const red = useThemeColor({}, "red");

  const title = props.user
    ? props.user.firstName + " " + props.user.lastName
    : "Plan";
  const description = props.user ? props.user.email : "1 site free";
  const value = props.user ? props.user.status : "free";

  const settings = [
    {
      category: "Account",
      data: [
        {
          title: title,
          description: description,
          type: "status",
          enabled: notifications,
          value: value,
        },
      ],
    },
    {
      category: "Preferences",
      data: [
        // {
        //   title: "Notifications",
        //   description: "Receive @ mentions or replies as notifications",
        //   type: "switch",
        //   enabled: notifications,
        //   action: () => setNotifications(!notifications),
        // },
        {
          title: "Appearance",
          description: capitalize(props.theme) + " mode",
          type: "option",
          action: () => props.navigation.push("Appearance"),
        },
      ],
    },
    {
      category: "Information",
      data: [
        {
          title: "Send feedback",
          type: "option",
          action: () => handleWebLink("https://www.webflow-cms.com/feedback"),
        },
        {
          title: "Share with a friend",
          type: "option",
          action: () => onShare(),
        },
        {
          title:
            Platform.OS === "ios"
              ? "Rate us on the App Store"
              : "Rate us on Google Play",
          type: "option",
          action: () => onReview(),
        },
      ],
    },
    {
      category: "Policies",
      data: [
        {
          title: "Privacy policy",
          type: "option",
          action: () =>
            handleWebLink("https://www.webflow-cms.com/policies/privacy"),
        },
        {
          title: "Terms of service",
          type: "option",
          action: () =>
            handleWebLink("https://www.webflow-cms.com/policies/terms"),
        },
      ],
    },
    {
      category: "Options",
      data: [
        {
          title: "Logout",
          type: "button",
          color: red,
          action: () => logoutUser(),
        },
      ],
    },
  ];

  useEffect(() => {
    Analytics.logEvent("screen_view", { screen_name: props.route.name });

    // modify settings based on user permissions
    if (props.user && !props.user.demo) {
      settings[0].data.push({
        title: "Manage subscription",
        type: "option",
        action: () => handleWebLink(`https://webflow-cms.com/dashboard?`),
      });
    }

    // setup navigation header options
    props.navigation.setOptions({
      headerRight: () => (
        <NavButton onPress={() => props.navigation.goBack()} text="Done" />
      ),
    });
  }, []);

  const onReview = () => {
    StoreReview.requestReview();
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "WebflowCMS | A mobile editor for Webflow content",
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

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function logoutUser() {
    props.revokeAuthToken(props.token);
    props.navigation.goBack();
  }

  const handleWebLink = (link) => {
    WebBrowser.openBrowserAsync(link);
  };

  return (
    <Container style={styles.container}>
      <SettingsList sections={settings} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      revokeAuthToken,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
