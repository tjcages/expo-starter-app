import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { getTheme, useThemeColor } from "../components";
import { Icon } from "react-native-elements";

import Inbox from "../screens/Home";
import Search from "../screens/Search";
import Settings from "../screens/Settings";
import Preferences from "../screens/Preferences";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const MiddleStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const Navigation = (props) => {
  const theme = props.theme === "system" ? getTheme() : props.theme;
  const background = useThemeColor({}, "background")
  const container = useThemeColor({}, "container")

  const HomeScreens = () => (
    <HomeStack.Navigator
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerBlurEffect: theme,
        headerStyle: {
          backgroundColor: background
        }
      }}
    >
      <HomeStack.Screen
        name="Inbox"
        component={Inbox}
        screenOptions={{
          headerSearchBarOptions: {
            autoFocus: true,
          },
        }}
      />

      <HomeStack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: {
            marginTop: 12,
          },
        }}
      >
        {/* <HomeStack.Screen name="Publish" component={Publish} /> */}
      </HomeStack.Group>
    </HomeStack.Navigator>
  );

  const MiddleScreens = () => (
    <MiddleStack.Navigator
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerBlurEffect: theme,
        headerStyle: {
          backgroundColor: background
        }
      }}
    >
      <MiddleStack.Screen name="Search" component={Search} />
    </MiddleStack.Navigator>
  );

  const SettingsScreens = () => (
    <SettingsStack.Navigator
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerBlurEffect: theme,
        headerShadowVisible: true,
        headerStyle: {
          backgroundColor: background
        }
      }}
    >
      <SettingsStack.Screen name="Settings" component={Settings} />

      <SettingsStack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: container
          },
        }}
      >
        <SettingsStack.Screen name="Preferences" component={Preferences} />
      </SettingsStack.Group>
    </SettingsStack.Navigator>
  );

  const render = () => (
    <NavigationContainer ref={props.navRef} theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: { paddingHorizontal: 24, backgroundColor: background },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreens}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" type="feather" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Middle"
          component={MiddleScreens}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" type="feather" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreens}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" type="feather" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );

  return render();
};

export default Navigation;
