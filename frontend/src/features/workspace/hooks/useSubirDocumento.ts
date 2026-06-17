import { useState } from 'react';
import { workspaceApi } from '../api/workspace.api';
import type { SubirDocumentoRequest } from '../types/workspace.types';
import axios from 'axios';

export const useSubirDocumento = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentoId, setDocumentoId] = useState<string | null>(null);

  const subirDocumento = async (data: SubirDocumentoRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      setDocumentoId(null);

      const response = await workspaceApi.subirDocumento(data);
      setDocumentoId(response.documentoId);
      return response.documentoId;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al subir el documento.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { subirDocumento, isLoading, error, documentoId };
};
