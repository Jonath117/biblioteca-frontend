import { useState } from 'react';
import { workflowApi } from '../api/workflow.api';

export const useWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignReviewer = async (id: string, asesorId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await workflowApi.assignReviewer(id, asesorId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al asignar revisor';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { assignReviewer, loading, error };
};