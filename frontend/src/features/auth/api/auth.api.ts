import axios from 'axios';
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types';

export const authApi = {
  loginWithGoogle: async (idToken: string) => {
    const response = await axios.post('http://localhost:5198/api/iam/auth/sso', {
      idTokenGoogle: idToken
    });
    return response.data.token;
  },
    // TODO: ajustar endpoint cuando el backend esté listo
  loginWithCredentials: async (credentials: LoginCredentials) => {
    const response = await axios.post('http://localhost:5198/api/iam/auth/login', credentials);
    return response.data.token;
  },
 
  // TODO: ajustar endpoint cuando el backend esté listo
  register: async (credentials: RegisterCredentials) => {
    const response = await axios.post('http://localhost:5198/api/iam/auth/register', credentials);
    return response.data.token;
  },
};