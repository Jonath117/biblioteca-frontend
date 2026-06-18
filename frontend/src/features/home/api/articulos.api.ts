import type { ArticuloPublicado } from "../types/articulo";

const BASE_URL = import.meta.env.VITE_API_URL;

export const articulosApi = {
    obtenerPublicados: async (): Promise<ArticuloPublicado[]> => {
        const response = await fetch(`${BASE_URL}/api/catalog/articulos`);

        if (!response.ok) {
            throw new Error("Error al cargar los artículos publicados.");
        }

        return response.json();
    },
};