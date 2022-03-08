# starter-app

This is the launching point for many of my latest projects. Rather than rebuilding each new project from scratch, just clone this repo and adjust to fit your needs.

**Built to be the ideal setup for new apps.**

## Screens
![screens](https://uploads-ssl.webflow.com/5f162b0e0ce5746130d59063/6226b3719b41223c64e031dc_screens.png)
Includes a Login-state & Home pages with Settings

---

## Features
- [x] Works with iOS & Android (uses React Native + Expo)
- [x] Google + Firebase Authentication (Google + Apple sign in)
- [x] Correctly saves & handles refresh tokens with Firebase
- [x] Firestore Database connection
- [x] React Navigation (best in class)
- [x] Redux Store + Thunk + Persistent storage (local & online data layer)
- [x] Light & Dark themes
- [x] Google Analytics w/ Page & Event tracking
- [x] Updating User Preferences locally and in Database
- [x] Share w/ a friend feature
- [x] Rate on App/Google Store feature
- [x] Loading states w/ Activity Indication
- [x] Componentized views (change once, update everywhere)
- [x] SVG Rendering 
- [x] [Spline 3d rendering](https://spline.design) (just for fun!)

---

## Forward
This is a work in progress and is maintained for my own needs first. 

Starter App is built with Firebase using Google and Apple Authentication. This can easily be modified, but to run the initial project you will first need to configure Firebase and Google Cloud Platform to handle Authentication.

---

## Setup
First, clone the project and give it a name
```
git clone https://github.com/tjcages/starter-app {your-project-name}
```
Install dependencies
```
yarn
```
Then run with
```
npx expo start
```
And open the iOS or Android simulator with `i` or `a`, respectively.

---

## Configure Firebase & Google Cloud Platform

Initially the app should run fine using my existing Firebase & Google Cloud Platform API Keys (these are for development purposes anyway – not used in production).
Please replace these credentials with your own to be sure you have full control over your own data and authenticated users.

### Firebase setup
1. First, [Add a Project to your Firebase account](https://console.firebase.google.com/u/0/).

2. Give this project a name, make sure Google Analytics is checked, and create the project.

3. Once the project is initialized, click `Web` to add Firebase to the app. Give a nickname to the web app like `{your-project-name}-web`.

4. Copy the `firebaseConfig` object and paste this object in the `config.js` file in your code. 

It should look like this once you're done (with your own values):
```js
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDPLhqimd-1wINpjOa9c9VQrbUIJHundRQ",
  authDomain: "splice-282b0.firebaseapp.com",
  projectId: "splice-282b0",
  storageBucket: "splice-282b0.appspot.com",
  messagingSenderId: "594942079912",
  appId: "1:594942079912:web:85b5a1a9561a4b919de39d",
  measurementId: "G-YFG3EJZG8P"
};
```
5. Navigate to the `app.json` file in your code and replace the current values for `config.firebase` with your new values.
> If you skip this step, Google Analytics will not initiate properly.

6. Click `Continue to console`.

7. Navigate to your Project's Settings by clicking the gear icon in the Navigation Menu. Scroll down to `Your apps` and click `Add app`. Select iOS, enter the Bundle ID as it is in the `app.json`, give it a nickname (like "{your-project-name}-iOS"), and click `Register App`. Download the config file title `GoogleService-Info.plist` and replace the existing file in your code with this file. Click Next until you return back to the console.

> Repeat steps, this time for Android (downloading the `google-services.json` file) and replacing in your code for Android apps.

### Authentication setup
1. Head to the Authentication page by clicking it in the Navigation menu.
2. First, click "Get started" to initialize Authentication. You will now see the list of selected Authentication providers. For this project, we will use Google and Apple sign in.
3. Click `Google` and `Enable` then `Save`. Click `Add a new provider` then `Apple` and `Enable` then `Save`.

### Google Cloud Platform setup
1. [Sign into Google Cloud Platform](https://console.cloud.google.com/home/dashboard). In the top left, click on your current project then `New Project` and give it a name. The project will initialize.
2. Select the Navigation menu, `APIs & Services`, then `OAuth consent screen`. Select `External` and `Create`. Enter your app's name, your email, a logo if applicable, a link to the application home page (or any link), link for privacy policy, and a link for terms of service.
3. Click `Add Domain` under Authorized domains. Add the same application home page you added earlier as well as "expo.io". Finally, add your Developer contact information and click `Save and Continue`. Click `Save and Continue` again for each of the next steps until complete.
4. Now we will go to the Credentials tab in the Navigation menu. Click `Create Credentials` and `OAuth Client ID`. Select `Web Application` for `Application type` and give it a name like "Web Client". For `Authorized JavaScript origins` click `Add URI` and add "https://auth.expo.io". For `Authorized redirect URIs` click `Add URI` and add "https://auth.expo.io/@{your-expo-username}/{your-project-name}" like "https://auth.expo.io/@tylerjcagle/starter". 
5. Finally click `Create` to create the OAuth Client.
6. You should be presented with a popup that contains your newly created Client ID. Copy this key and navigate to `screens/Login.js`. Replace the value of `clientId` in the `Google.useIdTokenAuthRequest` request with your copied key.
7. Navigate back to the Authentication page in Firebase and click on the Edit icon for Google. Expand the `Web SDK configuration` section and replace the existing `Web client ID` key with your new key. Navigate back to the popup and also copy the `Client Secret` key. Paste this value for `Web client secret` for your Google Provider in Firebase Authentication. Click `Save`.
> Note: Firebase sometimes shows an 'Error updating Google' message – the key should still be saved properly.

8. Now we will repeat the process to create an OAuth Client ID for iOS this time – keep in mind, you will also need to repeat the process for Android for Google Auth to correctly work with that platform as well. Follow the same initial steps as before, entering the Bundle ID and ensuring it matches that in your `app.json`. 9. Click `Create`.
> You do not need to replace any Firebase keys for iOS or Android – only Web

10. Copy the newly created Client ID key and navigate back to `screens/Login.js`. Replace the value of `iosClientId` in the `Google.useIdTokenAuthRequest` request with your copied iOS key. 
> Perform the same steps (except adding `androidClientId`) for Android.

---

## Testing & next steps
Rerun your app again using
```
npx expo start
```
> If steps were followed exactly, you should notice an error 'Could not reach Cloud Firestore backend', but the app should still run.

### Configure Firestore
Head back to Firebase and open the Firestore Database page from the Navigation menu. Click `Create database` and select `Start in test mode`. Select a Cloud Firestore location and click `Enable`.
> You will want to modify these rules before releasing to production, but for now they are fine.

Refresh the app with `r` and the error should go away.

**Your app is now ready to Login & begin building!! 🚀**

### Next steps
Currently, starter data is stored in `api/settings.js` for basic Settings functionality. It is recommended to move these values into Firestore so they may be modified on the fly. An example setup is below:
![Firestore App Admin example](https://uploads-ssl.webflow.com/5f162b0e0ce5746130d59063/6226e0f7a926ce643938e4df_Screen%20Shot%202022-03-07%20at%209.50.14%20PM.png)
You should configure your Firestore based on the provided objects in `settings.js` for Settings, Policies, Appearance, and Notifications.

---

## Final thoughts
If you've made it this far, then thanks for sticking around! If you found this project useful or you have any feedback you can reach me on [Twitter](https://twitter.com/tj_cages). Hope you enjoy!! 🎉🎉

Built by [Tyler J. ✌️](https://tylerj.me)