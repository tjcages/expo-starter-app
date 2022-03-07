import React, { useEffect, useState } from "react";
import * as Analytics from "expo-firebase-analytics";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, FlatList } from "react-native";
import { Container, NavButton } from "../components";
import { Layout } from "../constants"

import { updateAppTheme, updateNotificationPreferences } from "../api/app";
import { loadPreferenceOptions } from "../api/settings";

import AppearanceItem from "../views/PreferenceItem";

const Preferences = (props) => {
  const settings = props.route.params.settings;

  useEffect(() => {
    Analytics.logEvent("screen_view", { screen_name: settings.title });

    // setup navigation header options
    props.navigation.setOptions({
      headerTitle: settings.title,
      headerRight: () => (
        <NavButton onPress={() => props.navigation.goBack()} text="Done" />
      ),
    });
  }, []);

  const setSystemTheme = (theme) => {
    props.updateAppTheme(theme);
    props.navigation.pop(1);
  };

  const setNotificationPreferences = (option) => {
    props.updateNotificationPreferences(option, props.notifications);
  };

  return (
    <Container style={styles.content}>
      <FlatList
        data={settings.options}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => {
          if (settings.title === "Appearance") {
            item.action = () => setSystemTheme(item.value);
          } else if (settings.title === "Notifications") {
            item.action = () => setNotificationPreferences(item);
          }
          return <AppearanceItem {...props} item={item} />;
        }}
        contentContainerStyle={{ paddingVertical: 124 }}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Layout.default.medium2,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadPreferenceOptions,
      updateAppTheme,
      updateNotificationPreferences
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
