import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useSubirDocumento } from '../hooks/useSubirDocumento';
import { workspaceApi } from '../api/workspace.api';

interface SubirDocumentoFormProps {
  onDocumentoSubido?: () => void;
  archivo: File | null;    
  onArchivoChange: (file: File | null) => void;
}

export const SubirDocumentoForm = ({ 
  onDocumentoSubido, 
  archivo,        
  onArchivoChange 
}: SubirDocumentoFormProps) => {
  const { token } = useAuthStore();
  const { subirDocumento, isLoading, error, documentoId } = useSubirDocumento();

  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [coautoresInput, setCoautoresInput] = useState('');
  const [coautoresEmails, setCoautoresEmails] = useState<string[]>([]);
  const [verificando, setVerificando] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState<string | null>(null);

  const agregarCoautor = async () => {
    const trimmed = coautoresInput.trim();
    
    if (!trimmed) return;
    
    if (coautoresEmails.includes(trimmed)) {
      setErrorCorreo('Este correo ya está en la lista.');
      return;
    }

    setVerificando(true);
    setErrorCorreo(null);
    try {
      await workspaceApi.verificarEstudiante(trimmed);
      setCoautoresEmails([...coautoresEmails, trimmed]);
      setCoautoresInput('');
    } catch (err: any) {
      setErrorCorreo('No se encontró un estudiante con ese correo.');
    } finally {
      setVerificando(false);
    }
  };

  const quitarCoautor = (email: string) => {
    setCoautoresEmails(coautoresEmails.filter((c) => c !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (!archivo) return;

    await subirDocumento({
      titulo,
      resumen,
      archivo,
      coautoresEmails,
    });

    onDocumentoSubido?.();
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onArchivoChange?.(file);
    }
  };

  const handleReset = () => {
    setTitulo('');
    setResumen('');
    onArchivoChange?.(null);
    setCoautoresEmails([]);
    setCoautoresInput('');
  };

  if (documentoId) {
    return (
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto overflow-hidden">
        <div className="bg-green-500 px-10 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Documento subido con exito</h1>
        </div>
        <div className="px-8 py-6 text-center space-y-4">
          <p className="text-gray-600 text-sm">
            Tu documento ha sido guardado como borrador.
          </p>
          <p className="text-xs text-gray-400 font-mono bg-gray-100 rounded-lg px-4 py-2">
            ID: {documentoId}
          </p>
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 hover:bg-yellow-400 text-white hover:text-blue-900 font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm"
          >
            Subir otro documento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-400 shadow-lg shadow-xl w-full max-w-lg mx-auto overflow-hidden">
      <div className="bg-blue-600 px-10 py-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.971M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Subir Documento</h1>
        <p className="text-blue-200 text-sm mt-1">Crear un nuevo borrador en el repositorio</p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Titulo
          </label>
          <input
            type="text"
            placeholder="Titulo del documento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={250}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Resumen
          </label>
          <textarea
            placeholder="Breve resumen del documento..."
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Archivo PDF
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleArchivoChange}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
            />
          </div>
          {archivo && (
            <p className="text-xs text-gray-400 mt-1">
              Seleccionado: {archivo.name} ({(archivo.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            Coautores
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Correo del coautor (ej. luis@ucb.edu.bo)"
              value={coautoresInput}
              onChange={(e) => setCoautoresInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  agregarCoautor();
                }
              }}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
              <button
              type="button"
              onClick={agregarCoautor}
              disabled={verificando}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {verificando ? 'Buscando...' : 'Agregar'}
            </button>
          </div>
          {errorCorreo && (
            <p className="text-xs text-red-500 mt-1">{errorCorreo}</p>
          )}
          {coautoresEmails.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {coautoresEmails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => quitarCoautor(email)}
                    className="text-blue-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-yellow-400 text-white hover:text-blue-900 font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subiendo documento...' : 'Subir documento'}
        </button>
      </form>
    </div>
  );
};
