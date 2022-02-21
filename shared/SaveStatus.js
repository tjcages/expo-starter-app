import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { View, Text } from "../components";
import Colors from "../constants/Colors";

const SaveStatus = (props) => {
  const firstAnimation = 200;
  const secondAnimation = 200;
  const pause = 4000;

  useEffect(() => {
    fadeIn();
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: firstAnimation,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(function () {
        fadeOut();
      }, pause);
    });
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: secondAnimation,
      useNativeDriver: true,
    }).start(() => {
      props.animationDone();
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <Animated.View
          style={{
            // Bind opacity to animated value
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim }],
          }}
        >
          <View
            style={styles.content}
            lightColor={Colors.dark.background}
            darkColor={Colors.light.background}
          >
            <Text
              style={styles.text}
              lightColor={Colors.dark.primary}
              darkColor={Colors.light.primary}
            >
              {props.title}
            </Text>
          </View>
        </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default SaveStatus;
