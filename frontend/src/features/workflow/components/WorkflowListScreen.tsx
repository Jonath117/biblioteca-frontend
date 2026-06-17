import { useEffect, useState } from 'react';
import { useWorkflow } from '../hooks/useWorkflow';
import type { Revision } from '../types/workflow.types';
import { useAuthStore } from '../../../store/authStore';

export const WorkflowListScreen = () => {
  const { revisiones, loading, error, fetchRevisiones, addComment } = useWorkflow();
  const { token } = useAuthStore();
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    fetchRevisiones();
  }, [fetchRevisiones]);

  const getUserIdFromToken = (): string | null => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload.sub || null;
    } catch {
      return null;
    }
  };

  const handleAddComment = async () => {
    const userId = getUserIdFromToken();
    if (!selectedRevision || !comentario.trim() || !userId) return;
    try {
      await addComment(selectedRevision.id, userId, comentario);
      setComentario('');
      alert('Comentario agregado con éxito');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && revisiones.length === 0) {
    return <div className="p-8 text-center text-gray-500">Cargando datos del servidor...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex gap-6 items-start">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Revisiones</h1>
        {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded shadow-sm">{error}</div>}
        
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revisiones.map((rev) => (
                <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[200px]">
                    {rev.documentoId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {rev.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rev.fechaAsignacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedRevision(rev)}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      Abrir Revisión
                    </button>
                  </td>
                </tr>
              ))}
              {revisiones.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No hay revisiones pendientes en el sistema en este momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRevision && (
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200 sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Panel de Revisión</h2>
            <button 
              onClick={() => setSelectedRevision(null)} 
              className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-bold text-gray-900">ID Documento:</span><br/>
              <span className="break-all">{selectedRevision.documentoId}</span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">Estado Actual:</span> {selectedRevision.estado}
            </p>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Feedback del Asesor</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm"
              rows={5}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe aquí las correcciones o notas para el autor del documento..."
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !comentario.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm"
            >
              {loading ? 'Procesando...' : 'Guardar Comentario'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};