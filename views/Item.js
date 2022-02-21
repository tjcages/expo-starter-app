import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import { useThemeColor, Header } from "../components";

const Item = (props) => {
  const topRounded = props.index === 0;
  const bottomRounded = props.index === props.collections.length - 1;

  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor({}, "container");
  const divider = useThemeColor({}, "divider");

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: container, borderColor: divider },
        topRounded && { borderTopLeftRadius: 6, borderTopRightRadius: 6 },
        bottomRounded && {
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          borderBottomWidth: 0,
        },
      ]}
      onPress={() => props.onSelect(props.item)}
    >
      <View style={styles.content}>
        <View style={styles.indicator} />
        <Header style={{ flex: 1 }} numberOfLines={2}>
          {props.item.name}
        </Header>
      </View>
      <Icon name="chevron-right" type="feather" size={20} color={secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.default.green,
    borderRadius: 8,
    marginRight: 12,
  },
});

export default Item;
