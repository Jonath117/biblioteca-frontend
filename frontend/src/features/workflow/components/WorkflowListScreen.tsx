import { useEffect, useState } from 'react';
import { useWorkflow } from '../hooks/useWorkflow';
import { EstadoRevision } from '../types/workflow.types';
import { useAuthStore } from '../../../store/authStore';
import Navbar from '../../../components/Navbar/Navbar';
import { workspaceApi } from '../../workspace/api/workspace.api';

interface JwtPayload {
  sub: string;
  role: string;
}

export const WorkflowListScreen = () => {
  const { revisiones, loading, error, fetchRevisiones, addComment, assignReviewer, resolveRevision } = useWorkflow();
  const { token } = useAuthStore();
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(null);
  const [comentario, setComentario] = useState('');
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [documentTitles, setDocumentTitles] = useState<Record<string, string>>({});


  useEffect(() => {
    fetchRevisiones();

    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        setUserData(JSON.parse(jsonPayload));
      } catch (err) {
        console.error('Error decodificando token', err);
      }
    }
  }, [fetchRevisiones, token]);

  useEffect(() => {
    const fetchTitles = async () => {
      // Obtenemos los IDs únicos que aún no hemos buscado
      const idsToFetch = [...new Set(revisiones.map(r => r.documentoId))].filter(id => !documentTitles[id]);
      
      if (idsToFetch.length > 0) {
        const newTitles: Record<string, string> = {};
        await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const doc = await workspaceApi.getDocumentoById(id);
              newTitles[id] = doc.titulo;
            } catch (err) {
              console.error(`Error fetching document ${id}`, err);
              newTitles[id] = 'Título no disponible';
            }
          })
        );
        
        setDocumentTitles(prev => ({ ...prev, ...newTitles }));
      }
    };

    if (revisiones.length > 0) {
      fetchTitles();
    }
  }, [revisiones]);

  const selectedRevision = revisiones.find(r => r.id === selectedRevisionId) || null;

  // 1 = Estudiante, 2 = Asesor, 3 = Admin
  const esAsesorOAdmin = userData?.role === '2' || userData?.role === '3';

  const handleAssignReviewer = async () => {
    if (!selectedRevision || !userData?.sub) return;
    await assignReviewer(selectedRevision.id);
  };

  const handleAddComment = async () => {
    if (!selectedRevision || !comentario.trim() || !userData?.sub) return;
    await addComment(selectedRevision.id, comentario);
    setComentario('');
  };

  const handleResolve = async (nuevoEstado: number) => {
    if (!selectedRevision) return;
    const confirmar = window.confirm('¿Estás seguro de finalizar esta revisión con este estado?');
    if (confirmar) {
      await resolveRevision(selectedRevision.id, nuevoEstado);
      setSelectedRevisionId(null);
    }
  };

  if (loading && revisiones.length === 0) {
    return <div className="p-8 text-center text-gray-500">Cargando datos del servidor...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto flex gap-6 items-start">

        {/* ── Tabla ── */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Revisiones</h1>
          {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded shadow-sm">{error}</div>}

          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revisiones.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-50" title={rev.documentoId}>
                      {documentTitles[rev.documentoId] || 'Cargando...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-transparent
                        ${rev.estado === 'Pendiente'   ? 'bg-yellow-100 text-yellow-800' :
                          rev.estado === 'EnRevision'  ? 'bg-blue-100 text-blue-800'   :
                          rev.estado === 'Aprobado'    ? 'bg-green-100 text-green-800' :
                                                         'bg-red-100 text-red-800'}`}>
                        {rev.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(rev.fechaAsignacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* Asesor/Admin ve "Abrir Revisión", Estudiante ve "Ver Detalles" */}
                      <button
                        onClick={() => setSelectedRevisionId(rev.id)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                      >
                        {esAsesorOAdmin ? 'Abrir Revisión' : 'Ver Detalles'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Panel lateral ── */}
        {selectedRevision && (
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200 sticky top-8 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Panel de Revisión</h2>
              <button
                onClick={() => setSelectedRevisionId(null)}
                className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info del documento */}
            <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-bold text-gray-900">Documento:</span><br />
                <span className="break-all">{documentTitles[selectedRevision.documentoId] || 'Cargando...'}</span>
              </p>
              <p className="text-xs text-gray-400 mb-2">
                <span className="font-bold">ID:</span> {selectedRevision.documentoId}
              </p>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                      onClick={async () => {
                        try {
                          const docOriginal = await workspaceApi.getDocumentoById(selectedRevision.documentoId);
                          
                          if (docOriginal && docOriginal.archivoUrl) {
                            window.open(docOriginal.archivoUrl, '_blank');
                          } else {
                            alert("El documento no tiene un archivo adjunto válido.");
                          }
                        } catch (err) {
                          alert("Error: No se encontró el documento en el repositorio principal.");
                        }
                      }}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Ver / Descargar Documento Original
                    </button>
                  </div>

              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">Estado Actual:</span> {selectedRevision.estado}
              </p>
            </div>

            {/* ── Estado: Pendiente ── */}
            {selectedRevision.estado === 'Pendiente' && esAsesorOAdmin && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-4">Esta revisión aún no tiene un asesor asignado.</p>
                <button
                  onClick={handleAssignReviewer}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-all font-semibold shadow-sm"
                >
                  {loading ? 'Asignando...' : 'Asignarme como Revisor'}
                </button>
              </div>
            )}

            {selectedRevision.estado === 'Pendiente' && !esAsesorOAdmin && (
              <div className="mt-4 text-center p-3 bg-gray-50 rounded text-gray-500 text-sm">
                En espera de asignación de Asesor...
              </div>
            )}

            {/* ── Historial de comentarios (todos lo ven) ── */}
            {selectedRevision.comentarios && selectedRevision.comentarios.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Historial de Comentarios</h3>
                <div className="space-y-3">
                  {selectedRevision.comentarios.map(c => (
                    <div key={c.id} className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
                      <p className="text-gray-800 whitespace-pre-wrap">{c.contenido}</p>
                      <p className="text-xs text-gray-500 mt-2 text-right">{new Date(c.fechaCreacion).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Estado: EnRevision ── */}
            {selectedRevision.estado === 'EnRevision' && (
              <div className="mt-2 space-y-6">

                {/* Nuevo comentario — todos pueden escribir */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nuevo Comentario</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-sm"
                    rows={3}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe aquí las notas..."
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={loading || !comentario.trim()}
                    className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-all font-semibold shadow-sm text-sm"
                  >
                    {loading ? 'Guardando...' : 'Guardar Comentario'}
                  </button>
                </div>

                {/* Finalizar revisión — solo Asesor/Admin */}
                {esAsesorOAdmin && (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Finalizar Revisión</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleResolve(EstadoRevision.Aprobado)}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all font-semibold shadow-sm text-sm"
                      >
                        Aprobar Documento
                      </button>
                      <button
                        onClick={() => handleResolve(EstadoRevision.RequiereCorreccion)}
                        disabled={loading}
                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-all font-semibold shadow-sm text-sm"
                      >
                        Requiere Correcciones
                      </button>
                      <button
                        onClick={() => handleResolve(EstadoRevision.Rechazado)}
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all font-semibold shadow-sm text-sm"
                      >
                        Rechazar Documento
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};