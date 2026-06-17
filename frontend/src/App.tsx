import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './features/auth/components/LoginScreen';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { HomeScreen } from './features/home/components/HomeScreen';
import { WorkflowListScreen } from './features/workflow/components/WorkflowListScreen';
import { WorkspaceScreen } from './features/workspace/components/WorkspaceScreen';
import { useAuthStore } from './store/authStore';

const DashboardPrueba = () => {
  const { logout } = useAuthStore();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenido al Repositorio Académico</h1>
      <button 
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPrueba />} />
          <Route path="/workflow" element={<WorkflowListScreen />} />
          <Route path="/workspace" element={<WorkspaceScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;