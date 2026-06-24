import { useState } from "react";
import type { ArticuloPublicado } from "../types/articulo";
import { getCarreraColor, formatFecha } from "../utils/articulo.utils";

interface ArticuloDetalleProps {
    articulo: ArticuloPublicado;
    onBack: () => void;
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-neutral-100 last:border-0">
            <span className="shrink-0 w-24 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 pt-0.5">
                {label}
            </span>
            <div className="flex-1 text-sm text-neutral-800 leading-relaxed">
                {children}
            </div>
        </div>
    );
}

export function ArticuloDetalle({ articulo, onBack }: ArticuloDetalleProps) {
    const [pdfError, setPdfError] = useState(false);
    const color = getCarreraColor(articulo.carrera);

    const autores = (articulo.nombresAutores ?? "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">

            {/* Botón volver */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm text-neutral-500 border border-neutral-200 rounded-lg px-3.5 py-1.5 mb-6 hover:bg-neutral-50 transition-colors cursor-pointer bg-transparent"
            >
                ← Volver a artículos
            </button>

            {/* Tarjeta de información */}
            <div
                className="bg-white border border-neutral-200 rounded-xl p-6 mb-5"
                style={{ borderTop: `4px solid ${color}` }}
            >
                {/* Título */}
                <h1 className="text-xl font-medium text-neutral-900 leading-snug mb-5">
                    {articulo.titulo}
                </h1>

                {/* Metadatos fila a fila */}
                <div className="mb-5">
                    <MetaRow label="Autores">
                        <div className="flex flex-wrap gap-1.5">
                            {autores.map((a) => (
                                <span
                                    key={a}
                                    className="rounded-md px-2.5 py-0.5 text-sm font-medium"
                                    style={{ background: `${color}12`, color }}
                                >
                                    {a}
                                </span>
                            ))}
                        </div>
                    </MetaRow>

                    <MetaRow label="Carrera">{articulo.carrera}</MetaRow>

                    {articulo.materia && (
                        <MetaRow label="Materia">{articulo.materia}</MetaRow>
                    )}

                    {articulo.fechaPublicacion && (
                        <MetaRow label="Publicado">{formatFecha(articulo.fechaPublicacion)}</MetaRow>
                    )}

                    {articulo.etiquetas?.length > 0 && (
                        <MetaRow label="Etiquetas">
                            <div className="flex flex-wrap gap-1.5">
                                {articulo.etiquetas.map((e) => (
                                    <span
                                        key={e}
                                        className="rounded px-2.5 py-0.5 text-xs font-medium"
                                        style={{ background: `${color}14`, color }}
                                    >
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </MetaRow>
                    )}
                </div>

                {/* Resumen */}
                <div className="pt-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        Resumen
                    </p>
                    <p className="text-sm leading-7 text-neutral-600">
                        {articulo.resumen}
                    </p>
                </div>
            </div>

            {/* Visor PDF */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
                    <span className="text-sm font-medium text-neutral-800">
                        Documento
                    </span>
                    <a
                        href={articulo.archivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1 rounded-md border transition-colors hover:opacity-80"
                        style={{ color, borderColor: `${color}55` }}
                    >
                        Abrir en nueva pestaña ↗
                    </a>
                </div>

                {!pdfError ? (
                    <iframe
                        src={articulo.archivoUrl}
                        title={`PDF: ${articulo.titulo}`}
                        className="w-full border-0 block"
                        style={{ height: "75vh" }}
                        onError={() => setPdfError(true)}
                    />
                ) : (
                    <div className="py-12 text-center text-neutral-500 text-sm">
                        <p className="mb-3">No se pudo mostrar el PDF directamente en el navegador.</p>
                        <a
                            href={articulo.archivoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                            style={{ color }}
                        >
                            Descargar o abrir el documento →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}