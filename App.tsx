import React from 'react';
import { YellowBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppNavigator, navigationRef } from './src/navigation';
import * as Updates from 'expo-updates';
import moment from 'moment'
import 'moment/locale/ru'

// moment.locale('ru')
// YellowBox

export default class App extends React.Component {

  async componentDidMount() {
    // persistor.purge()

    if (!__DEV__) {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
           // ... notify user of update ...
          await Updates.reloadAsync()
        }
      } catch (e) {
        // alert(e)
        // console.log(e)
      }
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
  
}
