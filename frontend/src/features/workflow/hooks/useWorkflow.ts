import { useState, useCallback } from 'react';
import { workflowApi } from '../api/workflow.api';
import type { Revision } from '../types/workflow.types';
import axios from 'axios';

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
      console.error(err);
      setError('Error al cargar revisiones');
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
      let message = 'Error al asignar revisor';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        message = err.response.data.error;
      }
      console.error(err);
      setError(message);
      alert(`Error del Backend: ${message}`);
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
      await fetchRevisiones(); 
    } catch (err: unknown) {
      let message = 'Error al agregar comentario';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
         message = err.response.data.error; 
      } else if (axios.isAxiosError(err) && err.response?.data) {
         message = JSON.stringify(err.response.data);
      }
      console.error(err);
      setError(message);
      alert(`Mensaje del Backend: ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resolveRevision = async (id: string, nuevoEstado: number) => {
    setLoading(true);
    setError(null);
    try {
      await workflowApi.resolveRevision(id, nuevoEstado);
      await fetchRevisiones(); 
    } catch (err: unknown) {
      let message = 'Error al resolver la revisión';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
         message = err.response.data.error; 
      }
      console.error(err);
      setError(message);
      alert(`Error del Backend: ${message}`);
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
    addComment,
    resolveRevision
  };
};