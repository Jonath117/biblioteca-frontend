import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAuthStore } from '../../../store/authStore';
import { authApi } from '../api/auth.api';
import type { RegisterCredentials } from '../types/auth.types';

import axios from 'axios'; 

export const useRegister = () => {
  const navigate = useNavigate();
  //const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      await authApi.register(credentials);

      alert("¡Cuenta creada con éxito! Por favor, inicia sesión con tus credenciales.");

      navigate('/login');
    } catch (err) {
      console.error('Error al registrarse:', err);

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

  return { handleRegister, isLoading, error };
};