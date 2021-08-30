import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { persistStore, persistReducer } from 'redux-persist'
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'onboarding', 'auth']
}

const composeEnhancers = typeof window === 'object'
  && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

const persistedReducer = persistReducer(persistConfig, reducers)


export const store = createStore(persistedReducer, enhancer);
// @ts-ignore
export const persistor = persistStore(store);
