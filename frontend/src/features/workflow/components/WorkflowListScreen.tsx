import { useEffect, useState } from 'react';
import { workflowApi } from '../api/workflow.api';
import type { Revision } from '../types/workflow.types';

export const WorkflowListScreen = () => {
  const [revisiones, setRevisiones] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await workflowApi.getAllRevisiones();
        setRevisiones(data);
      } catch (error) {
        console.error("Error al cargar revisiones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando revisiones...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Revisiones Pendientes</h1>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">ID Revisión</th>
            <th className="p-3 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {revisiones.map((rev) => (
            <tr key={rev.id} className="border-t">
              <td className="p-3">{rev.id}</td>
              <td className="p-3">{rev.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};