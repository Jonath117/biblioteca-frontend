import { useState, useCallback } from 'react';
import { workflowApi } from '../api/workflow.api';
import type { Revision } from '../types/workflow.types';

export const useWorkflow = () => {
  const [revisiones, setRevisiones] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevisiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workflowApi.getAllRevisiones();
      setRevisiones(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar revisiones';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignReviewer = async (id: string, asesorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await workflowApi.assignReviewer(id, asesorId);
      await fetchRevisiones();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al asignar revisor';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (id: string, autorId: string, contenido: string) => {
    setLoading(true);
    setError(null);
    try {
      await workflowApi.addComment(id, autorId, contenido);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al agregar comentario';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    revisiones, 
    loading, 
    error, 
    fetchRevisiones, 
    assignReviewer, 
    addComment 
  };
};