import React from 'react';
import { Platform, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import QRWebScreen from '../screens/QRWebScreen';
import { useAuth } from '../store/useAuth';

const Stack = Platform.OS === 'web' ? null : createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeScreen = require('../screens/HomeScreen').default;
const CursosScreen = require('../screens/CursosScreen').default;
const EstudiantesScreen = require('../screens/EstudiantesScreen').default;
const ReportesScreen = require('../screens/ReportesScreen').default;
const QRComponent = Platform.OS === 'web' ? QRWebScreen : require('../screens/QRScreen').default;

const pillLabel = (label) => ({ focused }) => (
  <View style={[styles.tabPill, focused && styles.tabPillActive]}>
    <Text style={[styles.tabText, focused && styles.tabTextActive]}>{label}</Text>
  </View>
);

function AppTabs() {
  if (Platform.OS === 'web') {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.webTabBar,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarItemStyle: styles.webTabItem
        }}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Cursos" component={CursosScreen} />
        <Tab.Screen name="Estudiantes" component={EstudiantesScreen} />
        <Tab.Screen name="Reportes" component={ReportesScreen} />
        <Tab.Screen name="QR" component={QRComponent} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { display: 'none' },
      tabBarItemStyle: { marginHorizontal: 6 },
      tabBarLabelStyle: { fontWeight: '700', fontSize: 13 }
    }}>
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ tabBarLabel: pillLabel('Inicio') }} />
      <Tab.Screen name="Cursos" component={CursosScreen} options={{ tabBarLabel: pillLabel('Cursos') }} />
      <Tab.Screen name="Estudiantes" component={EstudiantesScreen} options={{ tabBarLabel: pillLabel('Estudiantes') }} />
      <Tab.Screen name="Reportes" component={ReportesScreen} options={{ tabBarLabel: pillLabel('Reportes') }} />
      <Tab.Screen name="QR" component={QRComponent} options={{ tabBarLabel: pillLabel('QR') }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const user = useAuth(s => s.user);

  if (Platform.OS === 'web') {
    return user ? <AppTabs /> : <LoginScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = {
  tabPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)' },
  tabPillActive: { backgroundColor: '#2563eb' },
  tabText: { color: '#9ca3af', fontWeight: '700' },
  tabTextActive: { color: '#fff' },
  webTabBar: {
    backgroundColor: '#0f172a',
    borderTopColor: 'rgba(255,255,255,0.08)',
    height: 60
  },
  webTabItem: {
    paddingBottom: 4
  }
};
