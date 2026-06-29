import { useState, useCallback } from 'react';
import { useDocumentos } from '../hooks/useDocumentos';
import { SubirDocumentoForm } from '../components/SubirDocumentoForm';
import Navbar from '../../../components/Navbar/Navbar';

export const WorkspaceScreen = () => {
  const { documentos, isLoading, error, recargar } = useDocumentos();
  const [recargarTrigger, setRecargarTrigger] = useState(0);

  const handleDocumentoSubido = useCallback(() => {
    recargar();
    setRecargarTrigger((n) => n + 1);
  }, [recargar]);

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'Borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'EnRevision':
        return 'bg-blue-100 text-blue-800';
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="min-h-screen">
      <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-300 rounded-2xl shadow-md p-6 sticky top-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Mis Documentos</h2>

                {isLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
                    <p className="text-gray-400 text-sm mt-3">Cargando...</p>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {!isLoading && !error && documentos.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">Aun no tienes documentos.</p>
                    <p className="text-gray-300 text-xs mt-1">Sube tu primer borrador para empezar.</p>
                  </div>
                )}

                {!isLoading && documentos.length > 0 && (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-800 truncate flex-1">
                            {doc.titulo}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${estadoColor(doc.estado)}`}>
                            {doc.estado}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {doc.resumen.length > 80 ? doc.resumen.substring(0, 80) + '...' : doc.resumen}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-2">
                          {new Date(doc.fechaCreacion).toLocaleDateString('es-BO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4">
              <SubirDocumentoForm key={recargarTrigger} onDocumentoSubido={handleDocumentoSubido} />
            </div>

            <div className="bg-gray-300 rounded-2xl lg:col-span-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Previsualizacion</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
