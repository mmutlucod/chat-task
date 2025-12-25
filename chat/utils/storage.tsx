import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  setToken: (token: string) => AsyncStorage.setItem('token', token),
  getToken: () => AsyncStorage.getItem('token'),
  removeToken: () => AsyncStorage.removeItem('token'),
};