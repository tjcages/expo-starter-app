import React from "react";
import {
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Icon } from "react-native-elements";

import Colors from "../constants/Colors";
import { useThemeColor, View, Text, Header } from "../components";

const SettingsList = (props) => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={props.sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => {
          return <Item item={item} />;
        }}
        contentContainerStyle={{ paddingVertical: 100 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { category } }) => (
          <Text style={styles.header}>{category}</Text>
        )}
      />
    </View>
  );
};

const Item = ({ item }) => {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor(
    { light: Colors.light.container, dark: Colors.dark.highlight },
    "highlight"
  );

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
        <Header style={[item.color && { color: item.color }, { fontSize: 18 }]}>
          {item.title}
        </Header>
        {item.description && (
          <Text style={{ marginTop: 8, flex: 1, flexWrap: "wrap" }}>
            {item.description}
          </Text>
        )}
      </View>
      {item.type === "option" && (
        <Icon name="chevron-right" type="feather" size={20} color={secondary} />
      )}
      {item.type === "switch" && (
        <Switch
          trackColor={{ false: container, true: Colors.default.green }}
          thumbColor={"white"}
          ios_backgroundColor={{ false: secondary, true: Colors.default.green }}
          onChange={() => item.action()}
          value={item.enabled}
        />
      )}
      {item.type === "status" && (
        <Text
          style={[
            styles.status,
            item.value === "free" && {
              backgroundColor: Colors.default.orange,
              color: Colors.default.lightOrange,
            },
          ]}
        >
          {renderPaymentStatus(item.value)}
        </Text>
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
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  header: {
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  status: {
    backgroundColor: Colors.default.green,
    color: Colors.default.lightGreen,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
});

export default SettingsList;
