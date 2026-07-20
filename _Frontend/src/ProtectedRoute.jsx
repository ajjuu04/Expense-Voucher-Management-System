import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    const home = user.role === 'EMPLOYEE' ? '/employee/dashboard'
      : user.role === 'DIRECTOR' ? '/director/dashboard'
      : '/accounts/dashboard';
    return <Navigate to={home} replace />;
  }
  return children;
}
