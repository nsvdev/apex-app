import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as screens from 'screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createSwitchNavigator } from '@react-navigation/compat'
import { navigationOptions, modalNavigationOptions, optionsWithBack } from './navigationOptions'


export const AuthStack = createStackNavigator();
export function AuthStackScreen({ navigation }) {
  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >

      <AuthStack.Screen
        name="SignIn"
        component={screens.SignInScreen}
        options={navigationOptions}
      />

      <AuthStack.Screen
        name="PhoneSignIn"
        component={screens.PhoneSignInScreen}
        options={optionsWithBack}
      />

      <AuthStack.Screen
        name="CodeInput"
        component={screens.CodeInputScreen}
        options={optionsWithBack}
      />

      <AuthStack.Screen
        name="PrivacyPolicy"
        component={screens.PrivacyPolicyScreen}
        options={optionsWithBack}
      />
      <AuthStack.Screen
        name="LicenseAgreement"
        component={screens.LicenseAgreementScreen}
        options={optionsWithBack}
      />

    </AuthStack.Navigator>
  );
}

export function AuthStackWithBack({ navigation }) {
  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >

      <AuthStack.Screen
        name="SignIn"
        component={screens.SignInScreen}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="PhoneSignIn"
        component={screens.PhoneSignInScreen}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="CodeInput"
        component={screens.CodeInputScreen}
        options={{
          headerShown: false
        }}
        initialParams={{ fromServices: true }}
      />

      <AuthStack.Screen
        name="PrivacyPolicy"
        component={screens.PrivacyPolicyScreen}
        options={{
          headerShown: false
        }}
      />
      <AuthStack.Screen
        name="LicenseAgreement"
        component={screens.LicenseAgreementScreen}
        options={{
          headerShown: false
        }}
      />

    </AuthStack.Navigator>
  );
}