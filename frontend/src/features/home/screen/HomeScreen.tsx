import { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar.tsx";
import { useArticulosPublicados } from "../hooks/useArticulosPublicados.ts";
import type { ArticuloPublicado } from "../types/articulo";
import { ArticuloCard } from "../components/ArticuloCard";
import { ArticuloDetalle } from "../components/ArticuloDetalle";

export const HomeScreen = () => {
    const { articulos, loading, error } = useArticulosPublicados();
    const [seleccionado, setSeleccionado] = useState<ArticuloPublicado | null>(null);

    if (seleccionado) {
        return (
            <>
                <Navbar />
                <ArticuloDetalle articulo={seleccionado} onBack={() => setSeleccionado(null)} />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
                <div style={{ marginBottom: "1.75rem" }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        Artículos publicados
                    </h1>
                    {!loading && !error && (
                        <p style={{ margin: "0.35rem 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
                            {articulos.length} {articulos.length === 1 ? "artículo disponible" : "artículos disponibles"}
                        </p>
                    )}
                </div>

                {loading && (
                    <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
                        Cargando artículos…
                    </p>
                )}

                {error && (
                    <div style={{
                        background: "var(--color-background-danger)",
                        color: "var(--color-text-danger)",
                        borderRadius: "var(--border-radius-md)",
                        padding: "0.75rem 1rem",
                        fontSize: 13,
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && articulos.length === 0 && (
                    <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>
                        No hay artículos publicados aún.
                    </p>
                )}

                <div style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}>
                    {articulos.map((articulo) => (
                        <ArticuloCard
                            key={articulo.id}
                            articulo={articulo}
                            onClick={() => setSeleccionado(articulo)}
                        />
                    ))}
                </div>
            </main>
        </>
    );
};