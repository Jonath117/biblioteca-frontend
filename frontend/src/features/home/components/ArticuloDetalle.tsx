import { useState } from "react";
import type { ArticuloPublicado } from "../types/articulo";
import { getCarreraColor, formatFecha } from "../utils/articulo.utils";

interface ArticuloDetalleProps {
    articulo: ArticuloPublicado;
    onBack: () => void;
}

export function ArticuloDetalle({ articulo, onBack }: ArticuloDetalleProps) {
    const [pdfError, setPdfError] = useState(false);
    const color = getCarreraColor(articulo.carrera);

    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
            <button
                onClick={onBack}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "0.5px solid var(--color-border-secondary)",
                    borderRadius: "var(--border-radius-md)",
                    padding: "6px 14px",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    cursor: "pointer",
                    marginBottom: "1.5rem",
                }}
            >
                ← Volver a artículos
            </button>

            <div style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderTop: `4px solid ${color}`,
                borderRadius: "var(--border-radius-lg)",
                padding: "1.5rem",
                marginBottom: "1.5rem",
            }}>
                <h1 style={{
                    margin: "0 0 0.75rem",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.3,
                }}>
                    {articulo.titulo}
                </h1>

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1rem",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                }}>
                    <span> {articulo.nombresAutores}</span>
                    <span> {articulo.carrera}</span>
                    {articulo.materia && <span> {articulo.materia}</span>}
                    {articulo.fechaPublicacion && <span> {formatFecha(articulo.fechaPublicacion)}</span>}
                </div>

                {articulo.etiquetas?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
                        {articulo.etiquetas.map((e) => (
                            <span
                                key={e}
                                style={{
                                    background: `${color}14`,
                                    color,
                                    borderRadius: 4,
                                    padding: "3px 10px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                            >
                                {e}
                            </span>
                        ))}
                    </div>
                )}

                <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: "1rem" }}>
                    <p style={{
                        margin: "0 0 0.4rem",
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--color-text-tertiary)",
                    }}>
                        Resumen
                    </p>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
                        {articulo.resumen}
                    </p>
                </div>
            </div>

            {/* Visor PDF */}
            <div style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                overflow: "hidden",
            }}>
                <div style={{
                    padding: "0.9rem 1.25rem",
                    borderBottom: "0.5px solid var(--color-border-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        Documento
                    </span>
                    <a
                        href={articulo.archivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: 12,
                            color: color,
                            textDecoration: "none",
                            border: `0.5px solid ${color}55`,
                            borderRadius: "var(--border-radius-md)",
                            padding: "4px 12px",
                        }}
                    >
                        Abrir en nueva pestaña ↗
                    </a>
                </div>

                {!pdfError ? (
                    <iframe
                        src={articulo.archivoUrl}
                        title={`PDF: ${articulo.titulo}`}
                        style={{ width: "100%", height: "75vh", border: "none", display: "block" }}
                        onError={() => setPdfError(true)}
                    />
                ) : (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
                        <p style={{ marginBottom: "1rem" }}>
                            No se pudo mostrar el PDF directamente en el navegador.
                        </p>
                        <a
                            href={articulo.archivoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color, fontWeight: 500 }}
                        >
                            Descargar o abrir el documento →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}