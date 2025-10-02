import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  // If authentication is required but user is not authenticated
  if (requireAuth && !authenticated) {
    // Redirect to login page and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth pages (login/register)
  if (!requireAuth && authenticated) {
    // Redirect to dashboard if already logged in
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;