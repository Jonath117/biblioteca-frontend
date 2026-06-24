import type { ArticuloPublicado } from "../types/articulo";
import { getCarreraColor, formatFecha } from "../utils/articulo.utils";

interface ArticuloCardProps {
    articulo: ArticuloPublicado;
    onClick: () => void;
}

export function ArticuloCard({ articulo, onClick }: ArticuloCardProps) {
    const color = getCarreraColor(articulo.carrera);
    const initiales = (articulo.nombresAutores ?? "")
        .split(",")[0]
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <article
            onClick={onClick}
            style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderTop: `3px solid ${color}`,
                borderRadius: "var(--border-radius-lg)",
                padding: "1.25rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = color;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${color}22`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border-tertiary)";
                (e.currentTarget as HTMLElement).style.borderTopColor = color;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
        >
            {/* Encabezado: avatar + título + autor */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div
                    aria-hidden="true"
                    style={{
                        flexShrink: 0,
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: `${color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 500,
                        color: color,
                    }}
                >
                    {initiales || "AU"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}>
                        {articulo.titulo}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }}>
                        {articulo.nombresAutores}
                    </p>
                </div>
            </div>

            {/* Resumen */}
            <p style={{
                margin: 0,
                fontSize: 12.5,
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                flexGrow: 1,
            }}>
                {articulo.resumen}
            </p>

            {/* Etiquetas */}
            {articulo.etiquetas?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {articulo.etiquetas.slice(0, 4).map((etiqueta) => (
                        <span
                            key={etiqueta}
                            style={{
                                background: `${color}14`,
                                color: color,
                                borderRadius: 4,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 500,
                            }}
                        >
                            {etiqueta}
                        </span>
                    ))}
                    {articulo.etiquetas.length > 4 && (
                        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", padding: "2px 4px" }}>
                            +{articulo.etiquetas.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div style={{
                borderTop: "0.5px solid var(--color-border-tertiary)",
                paddingTop: "0.6rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
            }}>
                <span style={{ fontSize: 11.5, color: "var(--color-text-secondary)" }}>
                    {articulo.carrera}
                    {articulo.materia ? <> · {articulo.materia}</> : null}
                </span>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    {formatFecha(articulo.fechaPublicacion)}
                </span>
            </div>
        </article>
    );
}