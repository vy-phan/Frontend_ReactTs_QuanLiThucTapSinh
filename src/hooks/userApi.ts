import apiClient from '../lib/apiClient';
import { USER_ENDPOINTS } from '../constants/api';
import { User } from '@/@type/type';

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get(USER_ENDPOINTS.GET_ALL);
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'Failed to fetch users');
    }
};

export const getUserById = async (id: number | string): Promise<User> => {
    const response = await apiClient.get(USER_ENDPOINTS.GET_BY_ID(id));
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'User not found');
    }
};

// thuộc tính Omit có nghĩa  là lấy tất cả trường của User trừ id
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await apiClient.post(USER_ENDPOINTS.CREATE, userData, { withCredentials: true });
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'Failed to create user');
    }
};

export const updateUser = async (id: number | string, userData: Partial<User> | FormData): Promise<User> => {
    const headers = userData instanceof FormData ? 
        { 'Content-Type': 'multipart/form-data' } : 
        undefined;
    
    const response = await apiClient.put(USER_ENDPOINTS.UPDATE(id), userData, { headers });
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'Failed to update user');
    }
};

export const deleteUser = async (id: number | string): Promise<void> => {
    const response = await apiClient.delete(USER_ENDPOINTS.DELETE(id));
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete user');
    }
};
