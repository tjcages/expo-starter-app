import React from "react";
import * as Analytics from "expo-firebase-analytics";
import { StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Icon } from "react-native-elements";

import { Container, View, Text, Header, useThemeColor } from "../components";
import { Color, Layout, Font } from "../constants";

const SettingsItem = (props) => {
  const item = props.item;
  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor({}, "container");

  const renderPreference = (preference) => {
    switch (preference) {
      case "Appearance":
        return props.theme.charAt(0).toUpperCase() + props.theme.slice(1);
    }
  };

  const renderPaymentStatus = (value) => {
    switch (value) {
      case "year":
        return "Personal – Yearly";
      case "month":
        return "Personal – Monthly";
      default:
        return "Basic – Free";
    }
  };

  const handlePress = () => {
    const event = item.title.replace(/ /g,"_");
    Analytics.logEvent(`${event}_selected`, {
      sender: event,
      purpose: `User selected ${event} in Settings`,
    });

    if (item.action) {
      item.action();
    }
  };

  return (
    <TouchableOpacity onPress={() => handlePress()}>
      <Container style={styles.item}>
        {item.icon && (
          <Icon
            name={item.icon}
            type="feather"
            size={Font.size.medium2}
            color={"white"}
            style={[styles.itemIcon, { backgroundColor: item.color }]}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Header
            style={[
              item.type === "logout" && { color: item.color },
              { fontSize: Font.size.medium2 },
            ]}
          >
            {item.title}
          </Header>
          {item.type === "preference" && (
            <Text style={{ marginRight: Layout.default.small }}>
              {renderPreference(item.title)}
            </Text>
          )}
        </View>
        {(item.type === "option" ||
          item.type === "preference" ||
          item.type === "share" ||
          item.type === "rate") && (
          <Icon
            name="chevron-right"
            type="feather"
            size={20}
            color={secondary}
          />
        )}
        {item.type === "switch" && (
          <Switch
            trackColor={{ false: container, true: Color.default.green }}
            thumbColor={"white"}
            ios_backgroundColor={{
              false: secondary,
              true: Color.default.green,
            }}
            onChange={() => item.action()}
            value={item.enabled}
          />
        )}
        {item.type === "status" && (
          <Text
            style={[
              styles.status,
              item.value === "free" && {
                backgroundColor: Color.default.orange,
                color: Color.default.lightOrange,
              },
            ]}
          >
            {renderPaymentStatus(item.value)}
          </Text>
        )}
      </Container>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.default.medium2,
    backgroundColor: "transparent",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Layout.default.medium,
    marginHorizontal: Layout.default.medium2,
    marginBottom: Layout.default.small,
    borderRadius: Layout.default.borderRadius,
  },
  itemIcon: {
    padding: Layout.default.small,
    marginRight: Layout.default.medium,
    borderRadius: Layout.default.borderRadiusSmall,
  },
  status: {
    backgroundColor: Color.default.green,
    color: Color.default.lightGreen,
    fontWeight: Font.weight.semiBold,
    paddingHorizontal: Layout.default.small,
    paddingVertical: Layout.default.small,
    borderRadius: Layout.default.borderRadiusSmall,
    overflow: "hidden",
  },
});

export default SettingsItem;
