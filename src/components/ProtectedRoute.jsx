import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps any route that requires a signed-in student. Unauthenticated
// visitors are sent home, where the Navbar's Sign In button is always
// visible — kept deliberately simple rather than chaining redirect state.
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
