import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { getTheme } from "../components"

import Login from "../screens/Login";

const LoginStack = createNativeStackNavigator();

const Navigation = (props) => {
  const theme = props.theme === "system" ? getTheme() : props.theme

  const LoginScreens = () => (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <LoginStack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <LoginStack.Screen
          name="Login"
          component={Login}
        />
      </LoginStack.Navigator>
    </NavigationContainer>
  );

  // determine if the user has already been authenticated
  return LoginScreens();
};

export default Navigation
