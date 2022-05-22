import React from "react";

// Components
import { BlurView } from "expo-blur";
import { View, StyleSheet } from "react-native";
import { getTheme, useThemeColor } from "../../components";
import { Layout } from "../../constants";

const PhoneView = (props) => {
  const theme = getTheme();
  const background = useThemeColor({}, "background");
  const container = useThemeColor({}, "divider");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.container} fadingEdgeLength={100}>
      <View
        style={[
          styles.phone,
          {
            backgroundColor: container,
            borderColor: background,
            shadowColor: primary,
          },
          props.top ? { top: Layout.default.medium } : { bottom: 0 },
        ]}
      >
        <BlurView
          style={[
            styles.blur,
            props.top
              ? { top: 0, height: 240 }
              : {
                  bottom: 0,
                  borderTopLeftRadius: Layout.default.large,
                  borderTopRightRadius: Layout.default.large,
                },
          ]}
          intensity={50}
          tint={theme}
        />
        {props.top ? (
          <View style={[styles.handle, { backgroundColor: primary }]} />
        ) : (
          <View style={[styles.touchbar, { backgroundColor: primary }]} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 224,
    marginBottom: Layout.default.large,
    overflow: "hidden",
  },
  phone: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    margin: 6,
    left: 0,
    right: 0,
    height: 300,
    borderWidth: Layout.default.small,
    borderRadius: 50,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  blur: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 208,
    borderRadius: 44,
    margin: 1,
    overflow: "hidden",
    zIndex: 2,
  },
  handle: {
    position: "absolute",
    top: Layout.default.small,
    height: 2,
    width: 36,
    borderRadius: 100,
    opacity: 0.3,
    zIndex: 10,
  },
  touchbar: {
    position: "absolute",
    bottom: Layout.default.small,
    height: 3,
    width: 100,
    borderRadius: 100,
    zIndex: 10,
  },
});

export default PhoneView;
