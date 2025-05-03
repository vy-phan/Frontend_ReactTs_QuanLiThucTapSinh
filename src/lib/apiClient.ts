import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants/api'; // Giả sử bạn có file này
import { RefreshApiResponse } from '@/@type/type';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// --- Response Interceptor ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

let globalLogoutHandler: () => void = () => {
    console.error("Logout handler not set in Axios interceptor");
    window.location.href = '/login'; // Fallback
};

export const setGlobalLogoutHandler = (handler: () => void) => {
    globalLogoutHandler = handler;
};


apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== AUTH_ENDPOINTS.REFRESH) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
            return apiClient(originalRequest);
        }).catch(err => {
            return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post<RefreshApiResponse>(AUTH_ENDPOINTS.REFRESH, {}); 
        processQueue(null);
        isRefreshing = false;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        processQueue(refreshError as AxiosError);
        isRefreshing = false;
        globalLogoutHandler();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
