import apiClient from '../lib/apiClient'; 
import { AUTH_ENDPOINTS } from '../constants/api'; 
import { LoginApiResponse, LoginCredentials, LogoutApiResponse, MeApiResponse, User } from '@/@type/type';


export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  const response = await apiClient.post<LoginApiResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  if (response.data.success && response.data.data?.user) {
      return response.data.data.user;
  } else {
      throw new Error(response.data.message || 'Login failed');
  }
};

export const logoutUser = async (): Promise<void> => {
  const response = await apiClient.post<LogoutApiResponse>(AUTH_ENDPOINTS.LOGOUT);
  if(response.data.success) {
    return;
  } else {
    throw new Error(response.data.message || 'Logout failed');
  }
};

export const checkUserAuthStatus = async (): Promise<User> => {
  const response = await apiClient.get<MeApiResponse>(AUTH_ENDPOINTS.ME);
   if (response.data.success && response.data.data) {
      return response.data.data;
  } else {
      throw new Error(response.data.message || 'Failed to fetch current user');
  }
};

export const refreshToken = async (): Promise<void> => {
   await apiClient.post(AUTH_ENDPOINTS.REFRESH);
};