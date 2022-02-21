import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../components";

import NavigationButton from "./NavigationButton";

const ListHeader = (props) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{props.title}</Text>
      {false && ( // hide for now!
        <NavigationButton
          onPress={() => props.navigation.push("Settings")}
          icon={"sliders"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  header: { fontWeight: "600", marginBottom: 16 },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListHeader;
