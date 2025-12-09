import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

// Ensure EXPO_OS is defined at runtime for dependencies expecting it to be inlined.
// Some Metro setups skip inlining, so we provide a safe fallback.
global.process = global.process || {};
global.process.env = global.process.env || {};
if (!global.process.env.EXPO_OS) {
  global.process.env.EXPO_OS = Platform.OS;
}

registerRootComponent(App);
