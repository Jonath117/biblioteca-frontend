import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { authApi } from '../api/auth.api';
import type { LoginCredentials } from '../types/auth.types';

import axios from 'axios'; 

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await authApi.loginWithCredentials(credentials);
      login(token);
      navigate('/dashboard');
    }  catch (err) {
      console.error('Error al iniciar sesión:', err);

      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
};