import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { getTheme } from "../components";

import Sites from "../screens/Sites";
import Collections from "../screens/Collections";
import Items from "../screens/Items";
import EditItem from "../screens/EditItem";
import Publish from "../screens/Publish";
import Settings from "../screens/Settings";
import Appearance from "../screens/Appearance";
import Options from "../screens/Options";

const HomeStack = createNativeStackNavigator();

const Navigation = (props) => {
  const theme = props.theme === "system" ? getTheme() : props.theme;

  const HomeScreens = () => (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <HomeStack.Navigator
        screenOptions={{
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: theme,
        }}
      >
        <HomeStack.Screen name="Sites" component={Sites} />
        <HomeStack.Screen name="Collections" component={Collections} />
        <HomeStack.Screen name="Items" component={Items} />
        <HomeStack.Screen name="EditItem" component={EditItem} />

        <HomeStack.Group
          screenOptions={{
            presentation: "modal",
            headerStyle: {
              marginTop: 12,
            },
          }}
        >
          <HomeStack.Screen name="Publish" component={Publish} />
          <HomeStack.Screen name="Settings" component={Settings} />
          <HomeStack.Screen name="Appearance" component={Appearance} />
          <HomeStack.Screen name="Options" component={Options} />
        </HomeStack.Group>
      </HomeStack.Navigator>
    </NavigationContainer>
  );

  return HomeScreens();
};

export default Navigation;
