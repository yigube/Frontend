import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';
import { Buffer as BufferPolyfill } from 'buffer';

if (typeof globalThis !== 'undefined' && typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = BufferPolyfill;
}
if (typeof global !== 'undefined' && typeof global.Buffer === 'undefined') {
  global.Buffer = BufferPolyfill;
}

const App = require('./App').default;

registerRootComponent(App);
