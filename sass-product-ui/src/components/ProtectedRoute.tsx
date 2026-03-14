// src/components/ProtectedRoute.tsx
// Wraps all routes that require the user to be logged in.
// If not authenticated → redirect to /login.
// Replace the isAuthenticated logic with your real auth check
// (e.g. check a token in localStorage, a context value, etc.)

import { Navigate, Outlet } from 'react-router-dom';

function isAuthenticated(): boolean {
  // TODO: Replace this with your real auth logic, e.g:
  // return !!localStorage.getItem('token');
  // return !!useAuthStore.getState().user;
  return !!localStorage.getItem('token');
}

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}