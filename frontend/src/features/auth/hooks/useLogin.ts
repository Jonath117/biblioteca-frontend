import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { authApi } from '../api/auth.api';
import type { LoginCredentials } from '../types/auth.types';

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
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
      console.error('Error al iniciar sesión:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
};