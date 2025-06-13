import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, role } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`[ProtectedRoute] Auth state: authenticated=${isAuthenticated}`);
    // Simulasi pengecekan async
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="fullscreen-loading">Memverifikasi otentikasi...</div>;
  }

  // Tambahkan pengecekan role admin
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default ProtectedRoute;
