import { useState, useCallback } from 'react';
import { workspaceApi } from '../api/workspace.api';
import type { DocumentoDto } from '../types/workspace.types';
import axios from 'axios';

export const useWorkspace = () => {
  const [documentos, setDocumentos] = useState<DocumentoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspaceApi.getDocumentos();
      setDocumentos(data);
    } catch (err: unknown) {
      console.error(err);
      let message = 'Error al cargar documentos';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        message = err.response.data.error;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const subirBorrador = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await workspaceApi.subirBorrador(formData);
      await fetchDocumentos();
    } catch (err: unknown) {
      console.error(err);
      let message = 'Error al subir el documento';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        message = err.response.data.error;
      }
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { documentos, loading, error, fetchDocumentos, subirBorrador };
};
