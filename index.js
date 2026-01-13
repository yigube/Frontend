import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Ensure EXPO_OS is defined at runtime before importing the app tree.
global.process = global.process || {};
global.process.env = global.process.env || {};
if (!global.process.env.EXPO_OS) {
  global.process.env.EXPO_OS = Platform.OS;
}

import App from './App';

registerRootComponent(App);
