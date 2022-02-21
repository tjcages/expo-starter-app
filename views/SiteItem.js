import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import { useThemeColor, Header, Text, Container } from "../components";

import { timeAgo } from "../utils";

const SiteItem = (props) => {
  const disabled =
    props.index !== 0 && props.user && props.user.status === "free";
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const container = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.highlight },
    "highlight"
  );

  return (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: container },
        disabled && { opacity: 0.5 },
      ]}
      disabled={disabled}
      onPress={() => props.onSelect(props.item)}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        {props.item.previewUrl && (
          <Image
            style={[styles.image]}
            source={{
              uri: props.item.previewUrl,
            }}
          />
        )}
        <Container style={[styles.content]}>
          <Header style={props.item.color && { color: props.item.color }}>
            {props.item.name}
          </Header>
          {props.item.lastPublished && (
            <Text style={{ marginTop: 8, flex: 1, flexWrap: "wrap" }}>
              Updated{" "}
              {timeAgo.format(
                new Date(props.item.lastPublished),
                "round-minute"
              )}
            </Text>
          )}
        </Container>
      </View>
      {props.item.type === "option" && (
        <Icon name="chevron-right" type="feather" size={20} color={secondary} />
      )}
      {props.item.type === "switch" && (
        <Switch
          trackColor={{ false: container, true: Colors.default.green }}
          thumbColor={"white"}
          ios_backgroundColor={{ false: secondary, true: Colors.default.green }}
          onChange={() => item.action()}
          value={item.enabled}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    height: 200,
  },
  content: {
    padding: 12,
  },
});

export default SiteItem;
