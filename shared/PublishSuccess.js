import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { View, Header, Text, getTheme } from "../components";
import LottieView from "lottie-react-native";

const PublishSuccess = (props) => {
  const animation = useRef();
  const theme = getTheme();

  useEffect(() => {
    animation.current.play();
    // Or set a specific startFrame and endFrame with:
    animation.current.play(30, 120);

    var delayInMilliseconds = 5000; // extra 4 second pause

    setTimeout(function () {
      props.updatePublishStatus(false);
    }, delayInMilliseconds);
  }, []);

  return (
    <View style={styles.overlay}>
      <Header style={{ marginBottom: 6 }}>Site publish queued!</Header>
      <Text>Your changes will be reflected soon.</Text>
      <LottieView
        ref={animation}
        source={
          theme === "dark"
            ? require("../assets/dark_lottie.json")
            : require("../assets/light_lottie.json")
        }
        loop={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "column",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});

export default PublishSuccess;
