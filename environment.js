/*****************************
* environment.js
* path: '/environment.js' (root of your project)
******************************/

import Constants from "expo-constants";
import { Platform } from "react-native";

const localhost =
 Platform.OS === "ios" ? "localhost:8080" : "10.0.2.2:8080";

const ENV = {
 dev: {
   apiUrl: localhost,
   amplitudeApiKey: null,
   clientId: "90a23b25750dab7327ffa7257a9a65d885485a08c379b438e4a9ff53ded41f14",
   clientSecret: "a4a715574ed9419d5df5c42813eff354307746818fd39fa66f10e54a74a0d3cc",
 },
 staging: {
   apiUrl: "[your.staging.api.here]",
   amplitudeApiKey: "[Enter your key here]",
   clientId: "2714d8df1598e78386d650d6bc08345273c93fe2d79983e217e6fd9cf52ced9b",
   clientSecret: "aece9ff37fc5cebf9ebd5762ce5ff7e878030a3802fe82d27d6df8ff26725f72",
 },
 production: {
   apiUrl: "[your.production.api.here]",
   amplitudeApiKey: "[Enter your key here]",
   clientId: "2714d8df1598e78386d650d6bc08345273c93fe2d79983e217e6fd9cf52ced9b",
   clientSecret: "aece9ff37fc5cebf9ebd5762ce5ff7e878030a3802fe82d27d6df8ff26725f72",
 }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (__DEV__) {
   return ENV.dev;
 } else if (env === 'staging') {
   return ENV.staging;
 } else if (env === 'production') {
   return ENV.production;
 } else { // strange error not selecting a release channel
  return ENV.production;
 }
};

export default getEnvVars;