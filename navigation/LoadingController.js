import React from "react";
import { StyleSheet } from "react-native";
import { View, ActivityIndicator } from "../components";

const LoadingController = (props) => {
  // if loadingState is true, show loading indicator over current view
  return (
    <>
      {props.loadingState && (
        <View style={styles.overlay}>
          <View style={styles.background} />
          <ActivityIndicator />
        </View>
      )}
      {props.children}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
});

export default LoadingController;
