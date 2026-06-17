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
  autorPrincipalId: string;
  titulo: string;
  resumen: string;
  archivo: File;
  coautoresIds: string[];
}

export interface SubirDocumentoResponse {
  documentoId: string;
}
