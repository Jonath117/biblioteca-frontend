export const EstadoRevision = {
    Pendiente: 0,
    EnRevision: 1,
    Aprobado: 2,
    Rechazado: 3,
    RequiereCorreccion: 4
} as const;

export type EstadoRevision = typeof EstadoRevision[keyof typeof EstadoRevision];

export type Revision = {
    id: string;
    documentoId: string;
    asesorId: string | null;
    estado: EstadoRevision;
    fechaAsignacion: string;
    fechaResolucion: string | null;
};

export type ComentarioRevision = {
    id: string;
    revisionId: string;
    contenido: string;
    fechaCreacion: string;
};