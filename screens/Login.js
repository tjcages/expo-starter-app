import React, { useEffect } from "react";
import * as Analytics from "expo-firebase-analytics";
import * as AppleAuthentication from 'expo-apple-authentication';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { WebView } from "react-native-webview";
import { Layout, Font } from "../constants";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";

import { onSignInGoogle, onSignInApple } from "../api/auth";

import {
  Container,
  View,
  Text,
  Header,
  Button,
  StatusBar,
  getTheme,
} from "../components";

import GoogleIcon from "../assets/icons/google.svg";
import AppleIcon from "../assets/icons/apple.svg";

WebBrowser.maybeCompleteAuthSession();

const Login = (props) => {
  const theme = getTheme();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "363530651033-gq3dbmh1dp95847okpplh0k8k2o220ob.apps.googleusercontent.com",
  });

  useEffect(() => {
    Analytics.logEvent("screen_view", { screen_name: props.route.name });

    if (response?.type === "success") {
      props.onSignInGoogle(response.params.id_token);
    }
  }, [response]);

  async function promptAppleAsync() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      props.onSignInApple(credential.identityToken)
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.image}
        source={{
          uri: "https://my.spline.design/spiralapp-95c732c53f110a24754112326ed79c2f/",
        }}
      />

      <View style={styles.content}>
        <BlurView style={styles.blur} intensity={50} tint={theme} />
        <Container style={styles.overlay} />
        <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
          <Header style={styles.header}>YOU can build an awesome app</Header>
          <Text style={styles.text}>
            An informative description would go here!
          </Text>
          <Button
            text={"Get started"}
            style={{ marginBottom: Layout.default.small }}
            disabled={!request}
            inverted={true}
            onPress={() => {
              // trigger analytics event
              Analytics.logEvent(`Google_login`, {
                sender: "Login",
                purpose: `User selected Google Login to get started`,
              });

              promptAsync();
            }}
            icon={
              <GoogleIcon
                style={[
                  theme === "dark" ? { color: "black" } : { color: "black" },
                  styles.googleIcon,
                ]}
              />
            }
          />
          <Button
            text={"Continue with Apple"}
            disabled={!request}
            onPress={() => {
              // trigger analytics event
              Analytics.logEvent(`Apple_login`, {
                sender: "Login",
                purpose: `User selected Apple Login to get started`,
              });

              promptAppleAsync();
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
        </SafeAreaView>
      </View>

      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "90%",
    backgroundColor: "transparent",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    backgroundColor: "transparent",
    padding: Layout.default.large,
    paddingTop: Layout.default.xLarge,
    borderRadius: Layout.default.large,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
  },
  blur: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    opacity: 0.4,
  },
  header: {
    fontSize: Font.size.xLarge,
    fontWeight: Font.weight.bold,
    marginBottom: Layout.default.small,
    textAlign: "center",
  },
  text: {
    marginTop: Layout.default.medium2,
    marginBottom: Layout.default.xLarge,
    textAlign: "center",
  },
  googleIcon: {
    width: Layout.default.large,
    height: Layout.default.large,
    marginRight: Layout.default.medium2,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSignInGoogle,
      onSignInApple
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
