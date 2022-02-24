import React, { useEffect, useState } from "react";
import * as Analytics from "expo-firebase-analytics";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { updateAppTheme } from "../api/app"

import {
  View,
  Container,
  NavButton
} from "../components";
import AppearanceList from "../views/AppearanceList";

const Options = (props) => {
  const [settings, setSettings] = useState([])

  useEffect(() => {
    Analytics.logEvent("screen_view", { screen_name: props.route.name });

    const items = props.route.params.data
    const newSettings = [
    {
      category: "Options",
      data: items.map(item => {
        return {
          title: item.name,
          description: item.id,
          type: "option",
          action: () => {
            props.route.params.onSelected(item.id)
            props.navigation.pop(1)  
          }
        }
      }),
    },
  ];
  setSettings(newSettings)
  
    // setup navigation header options
    props.navigation.setOptions({
      title: props.route.params.title,
      headerRight: () => (
        <NavButton
          onPress={() => props.navigation.goBack()}
          text="Done"
        />
      ),
    });
  }, [])

  const setSystemTheme = (theme) => {
    props.updateAppTheme(theme)
    props.navigation.pop(1)
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.content}>
        <AppearanceList sections={settings} />
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateAppTheme,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Options);
