import React from "react";
import { StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Icon } from "react-native-elements";

import { useThemeColor, Header, Text, View } from "../components";
import { Color, Layout, Font } from "../constants";

export const PreferenceItem = (props) => {
  const item = props.item;
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor({}, "highlight");

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: container }]}
      onPress={() => {
        if (item.action) {
          item.action();
        }
      }}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Header style={item.color && { color: item.color }}>
          {item.title}
        </Header>
        {item.description && (
          <Text
            style={{
              marginTop: Layout.default.small,
              marginRight: Layout.default.medium,
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            {item.description}
          </Text>
        )}
      </View>
      {item.value === props.theme && (
        <Icon name="check" type="feather" size={Font.size.medium2} color={primary} />
      )}
      {item.type === "switch" && (
        <Switch
          trackColor={{ false: container, true: Color.default.green }}
          thumbColor={"white"}
          ios_backgroundColor={{ false: secondary, true: Color.default.green }}
          onChange={() => item.action()}
          value={props.notifications.includes(item.value)}
        />
      )}
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
    marginBottom: Layout.default.small,
    borderRadius: Layout.default.small,
  },
});

export default PreferenceItem;
