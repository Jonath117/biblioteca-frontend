export interface DocumentoDto {
  id: string;
  autorPrincipalId: string;
  titulo: string;
  resumen: string;
  archivoUrl: string;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string;
  coautoresIds: string[];
}

export interface SubirDocumentoRequest {
  titulo: string;
  resumen: string;
  archivo: File;
  coautoresEmails: string[];
}

export interface SubirDocumentoResponse {
  documentoId: string;
}
