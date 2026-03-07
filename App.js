import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuth } from './src/store/useAuth';
import AppErrorBoundary from './src/components/AppErrorBoundary';

if (typeof window !== 'undefined' && !globalThis.__pointerEventsWarnFiltered) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const first = args[0];
    if (
      typeof first === 'string' &&
      first.includes('props.pointerEvents is deprecated. Use style.pointerEvents')
    ) {
      return;
    }
    originalWarn(...args);
  };
  globalThis.__pointerEventsWarnFiltered = true;
}

export default function App() {
  const restore = useAuth(s => s.restore);
  useEffect(() => { restore(); }, []);
  return (
    <AppErrorBoundary>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppErrorBoundary>
  );
}
