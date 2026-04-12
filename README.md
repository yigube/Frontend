# Frontend Asistencia (Expo 54) + Socket.IO

## Pasos
1) npm install
2) npx expo install expo-camera expo-secure-store expo-file-system expo-constants expo-asset react-native-screens react-native-safe-area-context react-dom react-native-web @expo/metro-runtime
3) Crea `.env` y `.env.production` (opcional):
   EXPO_PUBLIC_API_URL=http://192.168.1.174:4000
4) Mobile: `npm start` (o `npm run android` / `npm run ios`)
5) Web: `npm run web`

## Notas
- Android fisico: usa IP LAN (no localhost) y Expo en modo LAN.
- Si no defines `EXPO_PUBLIC_API_URL`, el cliente API detecta automaticamente la IP del host de Expo/web y hace health-check para elegir una URL activa.
- En web se usa `localStorage` para el token y en mobile `SecureStore`.
- Si usas backend con CORS restringido, agrega el origen web (`http://localhost:8081` o el puerto que use Expo) a `CORS_ORIGINS`.
- Interceptor Axios adjunta JWT automaticamente.
- Se escuchan eventos real-time `attendance:created` y `asistencia:registrada`.
