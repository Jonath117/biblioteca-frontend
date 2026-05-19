import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './features/auth/LoginScreen';
import { ProtectedRoute } from './routes/ProtectedRoute'; // El componente que diseñamos antes
import { useAuthStore } from './store/authStore';

//componente rapido para probar el Dashboard
const DashboardPrueba = () => {
  const { logout } = useAuthStore();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenido al Repositorio Academico</h1>
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
        <Route path="/login" element={<LoginScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPrueba />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;