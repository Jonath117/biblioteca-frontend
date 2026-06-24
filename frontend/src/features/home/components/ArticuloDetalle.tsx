import { useState } from "react";
import axios from "axios"; // 1. NO OLVIDES IMPORTAR AXIOS
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
    const [isAnalyzing, setIsAnalyzing] = useState(false); // Estado para animar el botón
    
    const color = getCarreraColor(articulo.carrera);

    const autores = (articulo.nombresAutores ?? "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

    // 2. LA FUNCIÓN VA ADENTRO DEL COMPONENTE
    const handleAnalizarServerless = async () => {
        setIsAnalyzing(true); // Bloqueamos el botón temporalmente
        try {
            // Asegúrate de poner aquí tu URL real de API Gateway
            const response = await axios.get('https://znooosy8ng.execute-api.us-east-1.amazonaws.com/default/fn-analizar-documento');
            console.log("Respuesta de la Lambda Serverless:", response.data);
            
            alert(`⚡ Procesado por: ${response.data.motorCómputo}\n Palabras: ${response.data.conteoPalabras}\n Estado: ${response.data.verificacionEstructura}`);
        } catch (error) {
            console.error("Error al invocar la función Serverless:", error);
            alert("Hubo un error al conectar con AWS Lambda.");
        } finally {
            setIsAnalyzing(false); // Restauramos el botón
        }
    };

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

            {/* Visor PDF y Botón Serverless */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
                    <span className="text-sm font-medium text-neutral-800">
                        Documento
                    </span>
                    
                    {/* 3. AQUÍ AÑADIMOS EL BOTÓN JUNTO AL LINK DE ABRIR */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAnalizarServerless}
                            disabled={isAnalyzing}
                            className="text-xs px-3 py-1.5 rounded-md font-medium text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            style={{ backgroundColor: color }}
                        >
                            {isAnalyzing ? "Analizando..." : "⚡ Analizar Serverless"}
                        </button>

                        <a
                            href={articulo.archivoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-md border transition-colors hover:opacity-80"
                            style={{ color, borderColor: `${color}55` }}
                        >
                            Abrir en nueva pestaña ↗
                        </a>
                    </div>
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