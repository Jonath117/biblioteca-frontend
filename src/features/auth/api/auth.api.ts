import axios from 'axios';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  loginWithGoogle: async (idToken: string) => {
    const response = await axios.post(`${API_URL}/api/iam/auth/sso`, {
      idTokenGoogle: idToken
    });
    return response.data.token;
  },
  loginWithCredentials: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_URL}/api/iam/auth/login`, credentials);
    return response.data.token;
  },
 
  register: async (credentials: RegisterCredentials) => {
    const response = await axios.post(`${API_URL}/api/iam/auth/registro`, credentials);
    return response.data.id;
  },
};