import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import { useThemeColor, Header } from "../components";

const CollectionItem = (props) => {
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
        <Icon
          style={{ marginRight: 8 }}
          name="database"
          type="feather"
          size={20}
          color={secondary}
        />
        <Header>{props.item.name}</Header>
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default CollectionItem;
