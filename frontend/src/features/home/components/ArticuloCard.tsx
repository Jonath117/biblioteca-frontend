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
            className="bg-white border border-neutral-200 rounded-xl p-5 cursor-pointer flex flex-col gap-3 hover:shadow-md transition-shadow duration-150"
            style={{ borderTop: `3px solid ${color}` }}
        >
            {/* Encabezado: avatar + título + autor */}
            <div className="flex items-start gap-3">
                <div
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ background: `${color}18`, color }}
                >
                    {initiales || "AU"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 leading-snug line-clamp-2">
                        {articulo.titulo}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                        {articulo.nombresAutores}
                    </p>
                </div>
            </div>

            {/* Resumen */}
            <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 grow">
                {articulo.resumen}
            </p>

            {/* Etiquetas */}
            {articulo.etiquetas?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {articulo.etiquetas.slice(0, 4).map((etiqueta) => (
                        <span
                            key={etiqueta}
                            className="rounded px-2 py-0.5 text-[11px] font-medium"
                            style={{ background: `${color}14`, color }}
                        >
                            {etiqueta}
                        </span>
                    ))}
                    {articulo.etiquetas.length > 4 && (
                        <span className="text-[11px] text-neutral-400 px-1 py-0.5">
                            +{articulo.etiquetas.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="border-t border-neutral-100 pt-2.5 flex justify-between items-center flex-wrap gap-1">
                <span className="text-xs text-neutral-500">
                    {articulo.carrera}
                    {articulo.materia ? ` · ${articulo.materia}` : ""}
                </span>
                <span className="text-[11px] text-neutral-400">
                    {formatFecha(articulo.fechaPublicacion)}
                </span>
            </div>
        </article>
    );
}