import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuth } from './src/store/useAuth';
import AppErrorBoundary from './src/components/AppErrorBoundary';
import { getNextInactivityDelay, hasSessionExpired } from './src/services/inactivitySession';

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

if (!globalThis.__keepAwakeErrorFiltered) {
  const originalError = console.error;
  console.error = (...args) => {
    const first = args[0];
    if (
      typeof first === 'string'
      && first.includes('Unable to activate keep awake')
    ) {
      return;
    }
    originalError(...args);
  };
  globalThis.__keepAwakeErrorFiltered = true;
}

export default function App() {
  const restore = useAuth(s => s.restore);
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  const timerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const loggingOutRef = useRef(false);

  useEffect(() => { restore(); }, []);

  const clearInactivityTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const logoutByInactivity = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    clearInactivityTimer();
    try {
      await logout();
    } finally {
      loggingOutRef.current = false;
    }
  }, [clearInactivityTimer, logout]);

  const scheduleInactivityLogout = useCallback(() => {
    clearInactivityTimer();
    if (!useAuth.getState().user) return;
    const delay = getNextInactivityDelay(lastActivityRef.current);
    timerRef.current = setTimeout(() => {
      if (hasSessionExpired(lastActivityRef.current)) {
        logoutByInactivity();
        return;
      }
      scheduleInactivityLogout();
    }, delay);
  }, [clearInactivityTimer, logoutByInactivity]);

  const registerActivity = useCallback(() => {
    if (!useAuth.getState().user) return;
    if (hasSessionExpired(lastActivityRef.current)) {
      logoutByInactivity();
      return;
    }
    lastActivityRef.current = Date.now();
    scheduleInactivityLogout();
  }, [logoutByInactivity, scheduleInactivityLogout]);

  useEffect(() => {
    if (!user) {
      clearInactivityTimer();
      lastActivityRef.current = Date.now();
      return undefined;
    }

    lastActivityRef.current = Date.now();
    scheduleInactivityLogout();

    return clearInactivityTimer;
  }, [clearInactivityTimer, scheduleInactivityLogout, user]);

  useEffect(() => {
    if (!user) return undefined;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') return;
      if (hasSessionExpired(lastActivityRef.current)) {
        logoutByInactivity();
        return;
      }
      registerActivity();
    });

    return () => subscription.remove();
  }, [logoutByInactivity, registerActivity, user]);

  useEffect(() => {
    if (!user || Platform.OS !== 'web' || typeof window === 'undefined') return undefined;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];
    events.forEach((eventName) => window.addEventListener(eventName, registerActivity, { passive: true }));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, registerActivity));
    };
  }, [registerActivity, user]);

  return (
    <AppErrorBoundary>
      <View
        style={styles.appRoot}
        onStartShouldSetResponderCapture={() => {
          registerActivity();
          return false;
        }}
        onMoveShouldSetResponderCapture={() => {
          registerActivity();
          return false;
        }}
      >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  appRoot: { flex: 1 }
});
