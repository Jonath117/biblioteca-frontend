import api from '../../../config/axios';
import type { Revision } from '../types/workflow.types';

export const workflowApi = {
  getAllRevisiones: async (): Promise<Revision[]> => {
    const response = await api.get('/workflow/revisions'); 
    return response.data;
  },

  assignReviewer: async (id: string, asesorId: string) => {
    const response = await api.post(`/workflow/revisions/${id}/assign-reviewer`, { 
        asesorId 
    });
    return response.data;
  },

  addComment: async (id: string, autorId: string, contenido: string) => {
    const response = await api.post(`/workflow/revisions/${id}/comments`, { 
        autorId, 
        contenido 
    });
    return response.data;
  }
};