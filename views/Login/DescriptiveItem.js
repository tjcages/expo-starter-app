import React from "react";

// Components
import { BlurView } from "expo-blur";
import { View, StyleSheet } from "react-native";
import { Container, Text, Header, getTheme, useThemeColor } from "../../components";
import { Layout, Font, Color } from "../../constants";

// Views
import PhoneView from "./PhoneView";
import GradientView from "./GradientView";

class DescriptiveItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const theme = getTheme();
    const divider = useThemeColor({}, "divider");

    return (
      <View style={[styles.container, { borderColor: divider}]}>
        <GradientView {...this.props} />
        <Container style={[styles.blur, { opacity: 0.2}]} />
        <BlurView style={styles.blur} intensity={100} tint={theme} />

        <PhoneView {...this.props} />
        <Header style={[styles.header, { opacity: this.props.opacity }]}>
          {this.props.title}
        </Header>
        <Text
          style={[
            styles.text,
            {
              opacity: this.props.opacity,
            },
          ]}
        >
          {this.props.description}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    justifyContent: "center",
    padding: Layout.default.large,
    paddingTop: 0,
    marginBottom: Layout.default.large,
    borderWidth: 1,
    borderRadius: Layout.default.large,
    overflow: "hidden",
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    fontSize: 36,
    fontWeight: Font.weight.bold,
    textAlign: "center",
  },
  text: {
    marginTop: Layout.default.medium,
    textAlign: "center",
  },
});

export default DescriptiveItem;
