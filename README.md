# Frontend Asistencia (Expo 54) + Socket.IO

## Pasos
1) npm install
2) npx expo install expo-camera expo-secure-store expo-file-system expo-constants expo-asset react-native-screens react-native-safe-area-context
3) Crea `.env` (opcional en dev, requerido en produccion) con:
   API_URL=http://<TU_IP_LAN>:4000
4) npm start

## Notas
- Android fisico: usa IP LAN (no localhost) y Expo en modo LAN. El front intenta detectar la IP de Metro; si falla, usa `10.0.2.2` (emulador) o `localhost`.
- Interceptor Axios adjunta JWT automaticamente.
- `attendance:created` se escucha en tiempo real.
