import React from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Icon, Button } from "react-native-elements";
import {
  View,
  Divider,
  Header,
  getTheme,
  useThemeColor,
} from "../components";
import { SafeAreaView } from "react-native-safe-area-context";

const Navigation = (props) => {
  const secondary = useThemeColor({}, "primary");

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <BlurView style={[styles.blur]} intensity={50} tint={getTheme()} />
      <View style={styles.blurOverlay} />

      <View style={styles.content}>
        <Button
          buttonStyle={styles.button}
          icon={
            <Icon
              name="chevron-left"
              type="feather"
              color={secondary}
              size={24}
            />
          }
          onPress={() => props.buttonHandler()}
        />
        <Header style={styles.title}>{props.title}</Header>
      </View>
      <Divider style={{ marginBottom: 0 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: "transparent",
  },
  button: {
    padding: 0,
    marginRight: 8,
    backgroundColor: "transparent",
  },
});

export default Navigation;
