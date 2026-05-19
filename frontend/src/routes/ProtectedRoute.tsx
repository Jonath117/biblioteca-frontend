import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Tu manejador de estado

interface Props {
  allowedRoles?: number[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { token, roleId  } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(roleId ?? 0)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />; 
};