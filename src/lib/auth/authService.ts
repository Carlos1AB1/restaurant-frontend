// src/lib/auth/authService.ts
import apiClient from '../api/client';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const authService = {
  register: async (data: RegisterData) => {
    return apiClient.post('/users/register/', data);
  },
  
  verifyEmail: async (token: string) => {
    return apiClient.post('/users/verify-email/', { token });
  },
  
  login: async (data: LoginData) => {
    const response = await apiClient.post('/users/login/', data);
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  resetPasswordRequest: async (email: string) => {
    return apiClient.post('/users/password-reset/', { email });
  },
  
  resetPasswordConfirm: async (token: string, new_password: string, confirm_password: string) => {
    return apiClient.post('/users/password-reset/confirm/', {
      token,
      new_password,
      confirm_password
    });
  },
  
  getUserProfile: async () => {
    return apiClient.get('/users/profile/');
  },
  
  updateUserProfile: async (data: any) => {
    return apiClient.patch('/users/profile/', data);
  }
};

export default authService;