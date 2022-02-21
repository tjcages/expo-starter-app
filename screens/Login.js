import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import getEnvVars from "../environment";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { BlurView } from "expo-blur";

import { getAccessToken } from "../api/auth";
import { updateAppTheme } from "../api/app";

import {
  View,
  Container,
  Text,
  Header,
  Button,
  StatusBar,
  getTheme,
} from "../components";

WebBrowser.maybeCompleteAuthSession();
const { clientId } = getEnvVars();

const SCHEME = Constants.manifest.scheme;
const useProxy = Constants.appOwnership === "expo" && Platform.OS !== "web";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://webflow.com/oauth/authorize",
};

const redirectUri = makeRedirectUri({
  // For usage in bare and standalone
  native: `${SCHEME}://redirect`,
  useProxy,
});

const Login = (props) => {
  const theme = getTheme();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      redirectUri,
      response_type: "code",
    },
    discovery
  );

  useEffect(() => {
    if (response && response.type === "success") {
      props.getAccessToken(response.params.code);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{
          uri:
            theme === "dark"
              ? "https://my.spline.design/webflowcms-4faa9dcf1025db743529ff02d1e0db31/"
              : "https://my.spline.design/webflowcmscopy-2a820586230af098b9306dd89839469a/",
        }}
      />
      <View style={styles.content}>
        <BlurView style={styles.blur} intensity={50} tint={theme} />
        <Container style={styles.overlay} />
        <SafeAreaView edges={["bottom"]}>
          <Header style={styles.header}>Manage your website content</Header>
          <Header style={styles.header}>from anywhere</Header>
          <Text style={styles.text}>
            Edit and publish collection items on the go for all your Webflow
            sites
          </Text>
          <Button
            text={"Login with webflow"}
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          ></Button>
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
  webview: {
    flex: 1,
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
    opacity: 0.8,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    backgroundColor: "transparent",
    padding: 24,
    paddingTop: 36,
    borderRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
  },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  text: { marginTop: 16, marginBottom: 36, textAlign: "center" },
  button: {
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getAccessToken,
      updateAppTheme,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
