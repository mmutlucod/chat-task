import axios from 'axios';
import { Platform } from 'react-native';
const getApiUrl = () => {
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

  console.log('Selected API URL:', selectedUrl);
  return selectedUrl;
};

const API_URL = getApiUrl();

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      // Network error detayları
      isNetworkError: error.message === 'Network Error',
      code: error.code,
      isAxiosError: error.isAxiosError,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export const api = {
  register: (data: { username: string; email: string; password: string }) => 
    axiosInstance.post('/auth/register', data),
  
  login: (data: { username: string; password: string }) => 
    axiosInstance.post('/auth/login', data),
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};