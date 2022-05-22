import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Expo
import * as Analytics from "expo-firebase-analytics";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Components
import { FlatList, Dimensions, StyleSheet } from "react-native";
import {
  View,
  StatusBar,
  getTheme,
  useThemeColor,
  getGradientColor,
} from "../components";
import { LinearGradient } from "expo-linear-gradient";

// APIs
import { onSignInGoogle, onSignInApple } from "../api/auth";

// Views
import IntroView from "../views/Login/IntroView";
import DescriptiveView from "../views/Login/DescriptiveView";

WebBrowser.maybeCompleteAuthSession();

const Login = (props) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "363530651033-gq3dbmh1dp95847okpplh0k8k2o220ob.apps.googleusercontent.com",
    iosClientId:
      "363530651033-ed4ipt5t82pe3aasrg2ob6v60the0ja1.apps.googleusercontent.com",
  });

  const [contentOffset, setContentOffset] = useState(0);
  const scrollRef = useRef();
  const windowHeight = Dimensions.get("window").height;
  const limit = (windowHeight * 3) / 4;

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
      props.onSignInApple(credential.identityToken);
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  const background = useThemeColor({}, "background");
  const clear = useThemeColor({}, "clear");
  const gradient = getGradientColor()

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollRef}
        data={[1, 2, 3]}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => {
          if (index === 0 || index === 2) {
            return (
              <IntroView
                {...props}
                request={request}
                promptAsync={promptAsync}
                promptAppleAsync={promptAppleAsync}
                contentOffset={
                  index === 0 && limit > contentOffset ? contentOffset : 0
                }
                windowHeight={windowHeight}
                colorTop={gradient.colorTop}
                colorBottom={gradient.colorBottom}
              />
            );
          } else {
            return (
              <DescriptiveView
                {...props}
                contentOffset={contentOffset}
                windowHeight={windowHeight}
                colorTop={gradient.colorTop}
                colorBottom={gradient.colorBottom}
              />
            );
          }
        }}
        onEndReachedThreshold={0}
        onEndReached={() => {
          scrollRef.current?.scrollToOffset({ animated: false, offset: 0 });
          // scrollView.current.scrollTo({ x: 0, y: 0, animated: true })
        }}
        // removeClippedSubviews={true}
        decelerationRate={"fast"}
        disableIntervalMomentum={true}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        // snapToInterval={windowHeight}
        // snapToAlignment={"start"}
        onScroll={({ nativeEvent }) => {
          setContentOffset(nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      />

      <LinearGradient
        colors={[background, clear]}
        style={[styles.gradient, { top: 0 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[clear, background]}
        style={[styles.gradient, { bottom: 0 }]}
        pointerEvents="none"
      />

      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 124,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSignInGoogle,
      onSignInApple,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Login);
