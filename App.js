import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuth } from './src/store/useAuth';

export default function App() {
  const restore = useAuth(s => s.restore);
  useEffect(() => { restore(); }, []);
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
