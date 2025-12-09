import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CursosScreen from '../screens/CursosScreen';
import EstudiantesScreen from '../screens/EstudiantesScreen';
import ReportesScreen from '../screens/ReportesScreen';
import QRScreen from '../screens/QRScreen';
import { useAuth } from '../store/useAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const pillLabel = (label) => ({ focused }) => (
  <View style={[styles.tabPill, focused && styles.tabPillActive]}>
    <Text style={[styles.tabText, focused && styles.tabTextActive]}>{label}</Text>
  </View>
);

function AppTabs() {
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
      <Tab.Screen name="QR" component={QRScreen} options={{ tabBarLabel: pillLabel('QR') }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const user = useAuth(s => s.user);
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
  tabTextActive: { color: '#fff' }
};
