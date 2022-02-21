import React, { useEffect }from "react";
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

const Appearance = (props) => {
  useEffect(() => {
    // setup navigation header options
    props.navigation.setOptions({
      headerRight: () => (
        <NavButton
          onPress={() => props.navigation.goBack()}
          text="Done"
        />
      ),
    });
  }, [])

  const settings = [
    {
      category: "Appearance",
      data: [
        {
          title: "System",
          description: "Match your iOS appearance",
          type: "option",
          action: () => setSystemTheme("system")
        },
        {
          title: "Dark",
          type: "option",
          action: () => setSystemTheme("dark")
        },
        {
          title: "Light",
          type: "option",
          action: () => setSystemTheme("light")
        },
      ],
    },
  ];

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

export default connect(mapStateToProps, mapDispatchToProps)(Appearance);
