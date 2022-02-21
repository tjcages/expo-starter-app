import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Container, Text, Header, useThemeColor } from "../components";
import { Icon } from "react-native-elements";
import * as WebBrowser from "expo-web-browser";

import Colors from "../constants/Colors";

const SiteNotice = (props) => {
  const secondary = useThemeColor({}, "secondary");

  const handleWebLink = (link) => {
    WebBrowser.openBrowserAsync(link);
  };

  return (
    <TouchableOpacity onPress={() => handleWebLink(`https://webflow-cms.com/dashboard?`)}>
      <Container style={styles.container}>
        <Icon
          name="alert-triangle"
          type="feather"
          color={Colors.default.orange}
          size={24}
        />
        <Container style={styles.content}>
          <Header style={{ marginBottom: 4 }}>Basic – Free</Header>
          <Text>
            Your current account plan only allows for one site. Upgrade here for
            more.
          </Text>
        </Container>
        <Icon name="chevron-right" type="feather" size={20} color={secondary} />
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 24,
    borderColor: Colors.default.orange,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 12,
  },
});

export default SiteNotice;
