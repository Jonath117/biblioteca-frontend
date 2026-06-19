import api from '../../../config/axios';
import type { DocumentoDto, SubirDocumentoRequest, SubirDocumentoResponse } from '../types/workspace.types';

export const workspaceApi = {
  getDocumentos: async (): Promise<DocumentoDto[]> => {
    const response = await api.get<DocumentoDto[]>('/workspace/documentos');
    return response.data;
  },
  
  getDocumentoById: async (id: string): Promise<DocumentoDto> => {
    const response = await api.get<DocumentoDto>(`/workspace/documentos/${id}`);
    return response.data;
  },

  subirDocumento: async (data: SubirDocumentoRequest): Promise<SubirDocumentoResponse> => {
    const formData = new FormData();
    formData.append('Titulo', data.titulo);
    formData.append('Resumen', data.resumen);
    formData.append('Archivo', data.archivo);

    data.coautoresIds.forEach((id) => {
      formData.append('CoautoresIds', id);
    });

    const response = await api.post<SubirDocumentoResponse>(
      '/workspace/documentos/subir-borrador',
      formData,
    );

    return response.data;
  },
};
