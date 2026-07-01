import { useState, useEffect } from 'react';

interface PdfPreviewProps {
  file: File | null;
}

export const PdfPreview = ({ file }: PdfPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPdfUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-2xl p-8 text-gray-400 text-sm bg-gray-50">
        Ningún archivo PDF seleccionado para previsualizar.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-2xl border border-gray-400 shadow-xl overflow-hidden flex flex-col">
      <div className="bg-gray-800 text-white px-4 py-3 text-xs font-semibold flex justify-between items-center">
        <span>Vista Previa: {file.name}</span>
        <span className="bg-gray-700 px-2 py-1 rounded">PDF</span>
      </div>
      <div className="flex-1 bg-gray-100">
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="Previsualización de PDF"
          />
        )}
      </div>
    </div>
  );
};
