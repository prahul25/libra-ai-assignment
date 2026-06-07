import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>;

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
