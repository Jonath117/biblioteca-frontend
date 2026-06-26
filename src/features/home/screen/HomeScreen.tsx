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
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-7">
                    <h1 className="text-2xl font-medium text-neutral-900">
                        Artículos publicados
                    </h1>
                    {!loading && !error && (
                        <p className="mt-1 text-sm text-neutral-500">
                            {articulos.length} {articulos.length === 1 ? "artículo disponible" : "artículos disponibles"}
                        </p>
                    )}
                </div>

                {loading && (
                    <p className="text-sm text-neutral-500 py-8">Cargando artículos…</p>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && articulos.length === 0 && (
                    <p className="text-sm text-neutral-500">No hay artículos publicados aún.</p>
                )}

                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
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