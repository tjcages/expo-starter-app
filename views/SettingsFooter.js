import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { TouchableOpacity, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { View, Text } from "../components";
import { Layout, Font } from "../constants";

import * as WebBrowser from "expo-web-browser";

const SettingsFooter = (props) => {
  const version = Constants.manifest.version;

  const handlePolicyPress = (key, url) => {
    const event = key.replace(/ /g, "_");
    Analytics.logEvent(`${event}_selected`, {
      sender: event,
      purpose: `User selected ${event} in Settings`,
    });

    WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {props.policies &&
          Object.keys(props.policies).map((key, index) => {
            return (
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                key={index}
              >
                {index > 0 && <Text>•</Text>}
                <TouchableOpacity
                  style={styles.policyItem}
                  onPress={() => handlePolicyPress(key, props.policies[key])}
                >
                  <Text style={styles.policyText}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
      <View style={styles.content}>
        <Text style={styles.subtext}>Beta v{version}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtext}>Built by</Text>
        <TouchableOpacity
          style={styles.policyItem}
          onPress={() => handlePolicyPress("Built by", "https://tylerj.me")}
        >
          <Text style={styles.policyText}>@tylerj ✌️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: Layout.default.medium2,
    marginVertical: Layout.default.large,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.default.medium,
  },
  policyItem: {
    padding: Layout.default.small,
  },
  policyText: {
    fontWeight: Font.weight.semiBold,
  },
  subtext: {
    opacity: 0.6,
  },
});

export default SettingsFooter;
