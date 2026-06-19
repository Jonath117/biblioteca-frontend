import api from '../../../config/axios';
import type { Revision } from '../types/workflow.types';

export const workflowApi = {
  getAllRevisiones: async (): Promise<Revision[]> => {
    const response = await api.get('/workflow/revisions');
    return response.data;
  },

  assignReviewer: async (id: string) => {
    const response = await api.post(`/workflow/revisions/${id}/assign-reviewer`);
    return response.data;
  },

  addComment: async (id: string, contenido: string) => {
    const response = await api.post(`/workflow/revisions/${id}/comments`, { contenido });
    return response.data;
  },

  resolveRevision: async (id: string, nuevoEstado: number) => {
    const response = await api.post(`/workflow/revisions/${id}/resolve`, { nuevoEstado });
    return response.data;
  }
};