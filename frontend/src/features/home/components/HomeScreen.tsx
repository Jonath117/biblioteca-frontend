import "../../../components/Navbar/Navbar.tsx";
import Navbar from "../../../components/Navbar/Navbar.tsx";
import { useArticulosPublicados } from "../hooks/useArticulosPublicados.ts";

export const HomeScreen = () => {
    const { articulos, loading, error } = useArticulosPublicados();

    return (
        <div>
            <Navbar />

            <main style={{ padding: "2rem" }}>
                <h1>Artículos Publicados</h1>

                {loading && <p>Cargando artículos...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                    {articulos.map((articulo) => (
                        <div key={articulo.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
                            <h2 style={{ fontSize: "1.1rem" }}>{articulo.titulo}</h2>
                            <p style={{ color: "#555", fontSize: "0.9rem" }}>{articulo.nombresAutores}</p>
                            <p style={{ fontSize: "0.85rem" }}>{articulo.resumen}</p>
                            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#777" }}>
                                <span>{articulo.carrera}</span> · <span>{articulo.materia}</span>
                            </div>
                            <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                                {articulo.etiquetas.map((etiqueta) => (
                                    <span key={etiqueta} style={{ background: "#e0e0e0", borderRadius: "4px", padding: "2px 8px", fontSize: "0.75rem" }}>
                                        {etiqueta}
                                    </span>
                                ))}
                            </div>
                            <a href={articulo.archivoUrl} target="_blank" rel="noopener noreferrer"
                               style={{ display: "inline-block", marginTop: "0.75rem", color: "#1a73e8" }}>
                                Ver documento →
                            </a>
                        </div>
                    ))}
                </div>
            </main>

        </div>
    )
}