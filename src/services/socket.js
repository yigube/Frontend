import { io } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './api';

let socket;

export async function getSocket(){
  if (socket && socket.connected) return socket;
  const token = await SecureStore.getItemAsync('token');
  socket = io(API_URL, { transports:['websocket'], forceNew:true, reconnection:true, reconnectionAttempts:10, auth: token?{token}:undefined });
  socket.on('connect', ()=>console.log('[socket] connected:', socket.id));
  socket.on('disconnect', (r)=>console.log('[socket] disconnected:', r));
  socket.on('connect_error', (e)=>console.log('[socket] error:', e.message));
  return socket;
}
export function closeSocket(){ if(socket) socket.disconnect(); }
