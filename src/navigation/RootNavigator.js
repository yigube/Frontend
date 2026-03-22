import React from 'react';
import { Platform, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import QRWebScreen from '../screens/QRWebScreen';
import { useAuth } from '../store/useAuth';
import { LOCAL_MODE } from '../config/runtime';

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
  const user = useAuth(s => s.user);
  const isAdmin = user?.rol === 'admin';
  if (LOCAL_MODE) {
    const localScreens = [
      { name: 'Cursos', component: CursosScreen },
      { name: 'Estudiantes', component: EstudiantesScreen },
      { name: 'QR', component: QRComponent }
    ];
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
        {localScreens.map((screen) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{ tabBarLabel: pillLabel(screen.name) }}
          />
        ))}
      </Tab.Navigator>
    );
  }
  const screens = [
    { name: 'Inicio', component: HomeScreen },
    { name: 'Cursos', component: CursosScreen },
    ...(!isAdmin ? [{ name: 'Estudiantes', component: EstudiantesScreen }] : []),
    { name: 'Reportes', component: ReportesScreen },
    ...(!isAdmin ? [{ name: 'QR', component: QRComponent }] : [])
  ];

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
        {screens.map((screen) => (
          <Tab.Screen key={screen.name} name={screen.name} component={screen.component} />
        ))}
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
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ tabBarLabel: pillLabel(screen.name) }}
        />
      ))}
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
