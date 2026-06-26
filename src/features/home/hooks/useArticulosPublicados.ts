import { useEffect, useState } from "react";
import { articulosApi } from "../api/articulos.api";
import type { ArticuloPublicado } from "../types/articulo";

interface UseArticulosPublicadosResult {
    articulos: ArticuloPublicado[];
    loading: boolean;
    error: string | null;
}

export const useArticulosPublicados = (): UseArticulosPublicadosResult => {
    const [articulos, setArticulos] = useState<ArticuloPublicado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchArticulos = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await articulosApi.obtenerPublicados();
                if (!cancelled) setArticulos(data);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchArticulos();
        return () => { cancelled = true; };
    }, []);

    return { articulos, loading, error };
};