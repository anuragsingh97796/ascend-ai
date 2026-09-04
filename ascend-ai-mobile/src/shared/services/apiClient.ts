import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@core/constants/api';
import { storage } from '@shared/services/storage';
import { STORAGE_KEYS } from '@core/constants/storage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
