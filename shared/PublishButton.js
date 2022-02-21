import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View, Button, getTheme } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const PublishButton = (props) => {
  const [disabled, setDisabled] = useState(false);

  return (
    <View style={styles.container}>
      <BlurView style={styles.blur} intensity={50} tint={getTheme()} />
      <View style={styles.blurOverlay} />

      <SafeAreaView edges={["bottom"]}>
        <Button
          text="Publish"
          flex
          onPress={props.onPress}
          onPress={() => {
            setDisabled(true);
            props.onPress();
          }}
          disabled={
            disabled || props.changes
              ? Object.keys(props.changes ?? {}).length === 0
              : false
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
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
    opacity: 0.5,
  },
});

export default PublishButton;
