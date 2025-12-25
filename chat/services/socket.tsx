import io, { Socket } from 'socket.io-client';
import { Platform } from 'react-native';

const getSocketUrl = () => {
  const urls = {
    web: 'http://192.168.1.159:3000',
    android: 'http://192.168.1.159:3000',
    androidEmulator: 'http://10.0.2.2:3000',
    ios: 'http://localhost:3000',
  };

  let selectedUrl;
  
  if (Platform.OS === 'android') {
    const isEmulator = false; 
    selectedUrl = isEmulator ? urls.androidEmulator : urls.android;
  } else if (Platform.OS === 'ios') {
    selectedUrl = urls.ios;
  } else {
    selectedUrl = urls.web;
  }

  console.log('Selected Socket URL:', selectedUrl);
  return selectedUrl;
};

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!token) {
    throw new Error('Token is required');
  }

  if (socket) {
    socket.disconnect();
  }

  const SOCKET_URL = getSocketUrl();
  console.log('Connecting to socket server:', `${SOCKET_URL}/chat`);

  const socketOptions = {
    auth: {
      token: token
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000, 
    forceNew: true,
    path: '/socket.io/',
  };

  socket = io(`${SOCKET_URL}/chat`, socketOptions);

  socket.on('connect', () => {
    console.log('Socket connected successfully! Socket ID:', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', {
      message: error.message,
     
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected. Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket connection not established');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};