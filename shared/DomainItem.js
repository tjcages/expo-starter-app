import React from "react";
import { StyleSheet, View, Switch } from "react-native";
import { Header, useThemeColor } from "../components";
import Colors from "../constants/Colors";

const DomainItem = (props) => {
  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor(
    { light: Colors.light.container, dark: Colors.dark.highlight },
    "highlight"
  );

  const selected = props.domain.selected ?? true;

  return (
    <View style={styles.container}>
      <Header style={styles.header}>{props.domain.name}</Header>
      <Switch
        trackColor={{ false: container, true: Colors.default.green }}
        thumbColor={"white"}
        ios_backgroundColor={{ false: secondary, true: Colors.default.green }}
        onChange={() =>
          props.updateDomainSelection(
            props.selectedSite,
            props.domain,
            selected
          )
        }
        value={selected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  header: { fontWeight: "600", fontSize: 18 },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DomainItem;
