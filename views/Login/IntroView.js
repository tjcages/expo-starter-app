import React from "react";
import * as Analytics from "expo-firebase-analytics";

// Expo
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
// import { Accelerometer } from "expo-sensors";

// Components
import { View, Animated, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import {
  Container,
  Header,
  Text,
  Button,
  getTheme,
  useThemeColor,
} from "../../components";
import { Layout, Font } from "../../constants";
import MaskedView from "@react-native-masked-view/masked-view";

// Icons
import GoogleIcon from "../../assets/icons/google.svg";
import AppleIcon from "../../assets/icons/apple.svg";

class IntroView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.easeOutCubic = this.easeOutCubic.bind(this);
    this.gradientColorMap = this.gradientColorMap.bind(this);

    const marginTop = 100;

    this.state = {
      marginTop,
      marginAnim: new Animated.Value(marginTop),
      accelerometerSubscription: null,
      accelerometerData: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
  }

  // componentDidMount() {
  //   Accelerometer.setUpdateInterval(500);
  //   this.setState({
  //     subscription: Accelerometer.addListener((accelerometerData) => {
  //       this.setState({ accelerometerData });
  //     }),
  //   });
  // }

  componentWillUnmount() {
    this.state.subscription && this.state.subscription.remove();
    this.setState({ accelerometerSubscription: null });
  }

  componentDidUpdate(prevProps) {
    const percentage = this.props.contentOffset / this.props.windowHeight;
    const easing = this.easeOutCubic(percentage);
    const margin = this.state.marginTop - this.state.marginTop * easing;

    Animated.timing(this.state.marginAnim, {
      toValue: margin,
      duration: 16,
      useNativeDriver: false,
      easing: Animated.eastOutCubic,
    }).start();
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  // individual letter classes:
  gradientColorMap(blueBoost) {
    const interval = 0.5;
    const value = Math.abs(this.state.accelerometerData.z);
    // const rounded = Math.round(value / interval) * interval;
    const rounded = value;
    let hue = Math.floor(rounded * 341); // between 0 and 340
    let hue2 = Math.floor((1 - rounded) * 341); // between 0 and 340
    let saturation = 100;
    let lightness = 50;

    // color adjustment:
    if (blueBoost && hue > 215 && hue < 265) {
      const gain = 20;
      let blueness = 1 - Math.abs(hue - 240) / 25;
      let change = Math.floor(gain * blueness);
      lightness += change;
      saturation -= change;
    }
    let hsls = [
      `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      `hsl(${hue2}, ${saturation}%, ${lightness}%)`,
    ];

    return hsls;
  }

  render() {
    const theme = getTheme();
    const secondary = useThemeColor({}, "secondary");

    return (
      <View
        style={[
          styles.intro,
          {
            height: this.props.windowHeight,
            // paddingTop: (this.props.windowHeight * 1) / 6,
          },
        ]}
      >
        <View style={styles.container}>
          {/* <BlurView style={styles.blur} intensity={50} tint={theme} /> */}
          <Header style={styles.headerGradient}>🎉</Header>
          <Container style={styles.headerContained}>
            <BlurView style={styles.blur} intensity={50} tint={theme} />
            <Header style={styles.header}>Be a part of</Header>
          </Container>
          <MaskedView
            style={{ height: 156, backgroundColor: "blue" }}
            maskElement={
              <View
                style={{
                  // Transparent background because mask is based off alpha channel.
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Header style={styles.headerGradientSmall}>the next</Header>
                <Header style={styles.headerGradient}>BIG THING</Header>
              </View>
            }
          >
            {/* Shows behind the mask, you can put anything here, such as an image */}
            <LinearGradient
              style={{ height: "100%", width: "100%" }}
              // colors={this.gradientColorMap(true)}
              colors={[this.props.colorTop, this.props.colorBottom]}
              pointerEvents="none"
            />
          </MaskedView>
          <Animated.View
            style={[
              styles.buttonsContainer,
              { marginTop: this.state.marginAnim },
            ]}
          >
            {/* <Button
            text={"Get started"}
            style={{ marginBottom: Layout.default.small }}
            disabled={!this.props.request}
            inverted={true}
            onPress={() => {
              // trigger analytics event
              Analytics.logEvent(`Google_login`, {
                sender: "Login",
                purpose: `User selected Google Login to get started`,
              });

              this.props.promptAsync();
            }}
            icon={
              <GoogleIcon
                style={[
                  theme === "dark" ? { color: "black" } : { color: "black" },
                  styles.googleIcon,
                ]}
              />
            }
          /> */}
            <Button
              text={"Continue with Apple"}
              onPress={() => {
                // trigger analytics event
                Analytics.logEvent(`Apple_login`, {
                  sender: "Login",
                  purpose: `User selected Apple Login to get started`,
                });
                this.props.promptAppleAsync();
              }}
              icon={
                <AppleIcon
                  style={[
                    theme === "dark" ? { color: "black" } : { color: "white" },
                    styles.googleIcon,
                  ]}
                />
              }
            />
          </Animated.View>

          <Text style={styles.text}>
            Join with an invite code from an existing user or enter the waitlist
            by continuing.
          </Text>

          <View style={styles.scrollContainer}>
            <Icon
              name={"arrow-down"}
              type="feather"
              size={20}
              color={secondary}
              style={{ marginRight: Layout.default.small, opacity: 0.5 }}
            />
            <Text style={{ opacity: 0.5 }}>Scroll down for more</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  intro: {
    flex: 1,
    alignItems: "center",
    padding: Layout.default.xLarge,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 600,
  },
  headerContained: {
    position: "relative",
    alignItems: "center",
    marginVertical: Layout.default.large,
    paddingVertical: Layout.default.small,
    paddingHorizontal: Layout.default.medium2,
    borderRadius: Layout.default.borderRadius,
    overflow: "hidden",
  },
  blur: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    fontSize: Font.size.xLarge,
    fontWeight: Font.weight.bold,
    textAlign: "center",
  },
  headerGradientSmall: {
    fontSize: 64,
    fontWeight: Font.weight.bold,
    textAlign: "center",
  },
  headerGradient: {
    fontSize: 72,
    fontWeight: Font.weight.buldge,
    textAlign: "center",
  },
  buttonsContainer: {},
  text: {
    marginTop: Layout.default.large,
    textAlign: "center",
  },
  googleIcon: {
    width: Layout.default.large,
    height: Layout.default.large,
    marginRight: Layout.default.medium2,
  },
  scrollContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Layout.default.xLarge,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Layout.default.xLarge,
  },
});

export default IntroView;
