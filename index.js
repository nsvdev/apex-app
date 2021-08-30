// import { registerRootComponent } from 'expo';
import { YellowBox, AppRegistry } from "react-native";
import { name as appName } from './app.json';
import App from './App';
import StorybookUI from './storybook';

// export default StorybookUI;

YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately

// registerRootComponent(App);

AppRegistry.registerComponent('main', () => App); // appName
