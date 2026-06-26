import { useState, useEffect, useCallback } from 'react';
import { workspaceApi } from '../api/workspace.api';
import type { DocumentoDto } from '../types/workspace.types';

export const useDocumentos = () => {
  const [documentos, setDocumentos] = useState<DocumentoDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDocumentos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await workspaceApi.getDocumentos();
      setDocumentos(data);
    } catch {
      setError('No se pudieron cargar los documentos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDocumentos();
  }, [cargarDocumentos]);

  return { documentos, isLoading, error, recargar: cargarDocumentos };
};
