import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { authApi } from '../api/auth.api';
import type { RegisterCredentials } from '../types/auth.types';

export const useRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await authApi.register(credentials);
      login(token);
      navigate('/dashboard');
    } catch (err) {
      setError('No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.');
      console.error('Error al registrarse:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading, error };
};