import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as screens from 'screens';
import { createSwitchNavigator } from '@react-navigation/compat'
import { navigationOptions, modalNavigationOptions, optionsWithBack, optionsWithBackTitle } from './navigationOptions'
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AuthStackScreen, AuthStackWithBack } from './auth';
import { TextButton, HeaderButtonContainer } from 'components';
import { Colors } from '../constants';
import DrawerContent from './DrawerContent';
import { store } from 'redux/store'
import { disableOnboarding } from 'redux/actions'
import AboutServiceScreen from 'screens/AboutServiceScreen'
import LegalInformationScreen from 'screens/LegalInformation'

const ApplicationsStack = createStackNavigator()
export function ApplicationsStackScreen({ navigation }) {
  return (
    <ApplicationsStack.Navigator
      initialRouteName="Applications"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <ApplicationsStack.Screen
        name="Applications"
        component={screens.PersonalAreaScreen}
        options={navigationOptions}
      />

      <ApplicationsStack.Screen
        name="ApplicationDetails"
        component={screens.ApplicationDetailsScreen}
        options={(props) => optionsWithBackTitle(props, 'К списку заявок')}
      />

      <ApplicationsStack.Screen
        name="PenaltyEdit"
        component={screens.PenaltyCreationScreen}
        options={optionsWithBack}
      />

      <ApplicationsStack.Screen
        name="PenaltyEdit2"
        component={screens.PenaltyCreationScreen2}
        options={optionsWithBack}
      />

    </ApplicationsStack.Navigator>
  )
}

const ServicesStack = createStackNavigator()
export function ServicesStackScreen({ navigation }) {
  return (
    <ServicesStack.Navigator
      initialRouteName="Services"
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
      }}
    >
      <ServicesStack.Screen
        name="Services"
        component={screens.ServicesScreen}
        options={navigationOptions}
      />
      <ServicesStack.Screen
        name="ServiceDetails"
        component={screens.ServiceDetailsScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="PenaltyCalculation"
        component={screens.PenaltyCalculationScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="PenaltyCreation"
        component={screens.PenaltyCreationScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="PenaltyCreation2"
        component={screens.PenaltyCreationScreen2}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="PenaltyCreation3"
        component={screens.PenaltyCreationScreen3}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="Requisites"
        component={screens.RequisitesScreen}
        options={optionsWithBack}
      />


      <ServicesStack.Screen
        name="Auth"
        component={AuthStackWithBack}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="TransferDocuments"
        component={screens.TransferDocumentsScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="Camera"
        component={screens.CameraScreen}
        options={{
          headerShown: false
        }}
      />

      <ServicesStack.Screen
        name="CallACourier"
        component={screens.CallACourierScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="Signature"
        component={screens.SignatureScreen}
        options={optionsWithBack}
      />


    </ServicesStack.Navigator>
  )
}

const OnboardingStack = createStackNavigator();
export function OnboardingStackScreen({ navigation }) {
  return (
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen
        name="Onboarding"
        component={screens.OnboardingScreen}
        options={(props) => ({
          ...navigationOptions(props),
          // headerStyle: {
          //   ...navigationOptions['headerStyle'],
          //   backgroundColor: Colors.background,
          // },
          headerLeft: null,
          // title: null,
          headerRight: () => (
            <HeaderButtonContainer>
              <TextButton
                textColor="#1D5ACB"
                onPress={() => {
                  store.dispatch(disableOnboarding())
                  navigation.navigate('App')
                }}
                title="Пропустить"
                textSize={2}
              />
            </HeaderButtonContainer>
          ),
        })}
      />
    </OnboardingStack.Navigator>
  )
}

const PersonalAreaStack = createStackNavigator()
export function PersonalAreaStackScreen({ navigation }) {
  return (
    <PersonalAreaStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <PersonalAreaStack.Screen
        name="Applications"
        component={screens.PersonalAreaScreen}
        options={navigationOptions}
      />

      <ServicesStack.Screen
        name="PenaltyCalculation"
        component={screens.PenaltyCalculationScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="ServiceDetails"
        component={screens.ServiceDetailsScreen}
        options={optionsWithBack}
      />

      <PersonalAreaStack.Screen
        name="ApplicationDetails"
        component={screens.ApplicationDetailsScreen}
        options={(props) => optionsWithBackTitle(props, 'К списку заявок')}
      />

      <PersonalAreaStack.Screen
        name="PenaltyCreation"
        component={screens.PenaltyCreationScreen}
        options={optionsWithBack}
      />

      <PersonalAreaStack.Screen
        name="PenaltyCreation2"
        component={screens.PenaltyCreationScreen2}
        options={optionsWithBack}
      />

      <PersonalAreaStack.Screen
        name="PenaltyCreation3"
        component={screens.PenaltyCreationScreen3}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="Requisites"
        component={screens.RequisitesScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="TransferDocuments"
        component={screens.TransferDocumentsScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="Camera"
        component={screens.CameraScreen}
        options={{
          headerShown: false
        }}
      />

      <ServicesStack.Screen
        name="CallACourier"
        component={screens.CallACourierScreen}
        options={optionsWithBack}
      />

      <ServicesStack.Screen
        name="Signature"
        component={screens.SignatureScreen}
        options={optionsWithBack}
      />

    </PersonalAreaStack.Navigator>
  )
}

const AboutServiceStack = createStackNavigator()
export function AboutServiceStackScreen({ navigation }) {
  return (
    <AboutServiceStack.Navigator
      initialRouteName="AboutService"
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
      }}
    >
      <AboutServiceStack.Screen
        name="AboutService"
        component={AboutServiceScreen}
        options={navigationOptions}
      />
    </AboutServiceStack.Navigator>
  )
}

const LegalInformationStack = createStackNavigator()
export function LegalInformationStackScreen({ navigation }) {
  return (
    <LegalInformationStack.Navigator
      initialRouteName="LegalInformation"
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
      }}
    >
      <LegalInformationStack.Screen
        name="LegalInformation"
        component={LegalInformationScreen}
        options={navigationOptions}
      />
      <LegalInformationStack.Screen
        name="PrivacyPolicy"
        component={screens.PrivacyPolicyScreen}
        options={optionsWithBack}
      />
    </LegalInformationStack.Navigator>
  )
}

const AppDrawerNavigator = createDrawerNavigator();
export function AppDrawer({ navigation }) {
  return (
    <AppDrawerNavigator.Navigator
      initialRouteName="Services" // PersonalArea
      drawerPosition="right"
      drawerContent={DrawerContent}
    >
      <AppDrawerNavigator.Screen
        name="Services"
        component={ServicesStackScreen}
        options={{
          drawerLabel: 'Услуги'
        }}
      />
      <AppDrawerNavigator.Screen
        name="AboutService"
        component={AboutServiceStackScreen}
        options={{
          drawerLabel: 'О сервисе'
        }}
      />
      <AppDrawerNavigator.Screen
        name="LegalInfo"
        component={LegalInformationStackScreen}
        options={{
          drawerLabel: 'Правовая информация'
        }}
      />
      <AppDrawerNavigator.Screen
        name="PersonalArea"
        component={PersonalAreaStackScreen}
        options={{
          drawerLabel: 'Личный кабинет'
        }}
      />
      {/* <AppDrawerNavigator.Screen
        name="Settings"
        component={AuthStackScreen}
        options={{
          drawerLabel: 'Настройки'
        }}
      /> */}
      <AppDrawerNavigator.Screen
        name="Applications"
        component={PersonalAreaStackScreen}
        options={{
          drawerLabel: 'Мои Дела'
        }}
      />
      {/* <AppDrawerNavigator.Screen
        name="Documents"
        component={AuthStackScreen}
        options={{
          drawerLabel: 'Мои Документы'
        }}
      /> */}
      <AppDrawerNavigator.Screen
        name="Auth"
        component={AuthStackScreen}
      />
    </AppDrawerNavigator.Navigator>
  )
}

export const AppNavigator = createSwitchNavigator(
  {
    Onboarding: OnboardingStackScreen,
    App: AppDrawer,
    Loading: screens.LoadingScreen
  },
  {
    initialRouteName: 'Loading', // Onboarding
  }
);

// для вызова не только из компонентов но и из экшенов редакса
export const navigationRef: any = React.createRef();
export function navigate(name, params?) {
  navigationRef.current?.navigate(name, params);
}
export function dispatch(action) {
  navigationRef.current?.dispatch(action);
}