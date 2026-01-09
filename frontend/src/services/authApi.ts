import apiClient from './apiClient';
import { AuthResponse, ProfileResponse, RefreshResponse } from '@/types/auth';

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await apiClient.post('/api/v1/auth/login', { email, password });
        return response.data.data;
    },

    refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
        const response = await apiClient.post('/api/v1/auth/refresh', { refreshToken });
        return response.data.data;
    },

    getProfile: async (): Promise<ProfileResponse> => {
        const response = await apiClient.get('/api/v1/auth/profile');
        return { user: response.data.data, permissions: response.data.permissions || [] };
    },
};
