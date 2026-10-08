import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator reaches your PC's localhost via 10.0.2.2.
// On a real phone, replace with your PC's LAN IP, e.g. http://192.168.1.5:5000/api
export const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

// Attach the saved JWT to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any axios error into a readable message
export const errMsg = (e: any): string =>
  e?.response?.data?.message ?? (e?.message === 'Network Error' ? 'Cannot reach server. Is the backend running?' : e?.message) ?? 'Something went wrong';

export default api;
