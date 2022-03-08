# starter-app

This is the launching point for many of my latest projects. Rather than rebuilding each new project from scratch, just clone this repo and adjust to fit your needs.

**Built to be the ideal setup for new apps.**

## Screens
![screens](https://uploads-ssl.webflow.com/5f162b0e0ce5746130d59063/6226b3719b41223c64e031dc_screens.png)
Includes a Login-state & Home pages with Settings


## Features
- [x] Works with iOS & Android (uses React Native + Expo)
- [x] Google + Firebase Authentication (Google + Apple sign in)
- [x] Correctly saves & handles refresh tokens with Firebase
- [x] Firestore Database connection
- [x] React Navigation (best in class)
- [x] Redux Store + Thunk + Persistent storage (local & online data layer)
- [x] Light & Dark themes
- [x] Google Analytics w/ Page & Event tracking
- [x] Share w/ a friend feature
- [x] Rate on App/Google Store feature
- [x] Loading states w/ Activity Indication
- [x] Componentized views (change once, update everywhere)
- [x] SVG Rendering 
- [x] [Spline 3d rendering](https://spline.design) (just for fun!)


## Forward
This is a work in progress and is maintained for my own needs first. 

Starter App is built with Firebase using Google and Apple Authentication. This can easily be modified, but to run the initial project you will first need to configure Firebase and Google Cloud Platform to handle Authentication.

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

## Configure Firebase & Google Cloud Platform

After cloning and configuring Firebase