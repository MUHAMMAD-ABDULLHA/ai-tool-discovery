// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <div className="text-center p-8 text-red-600">You don't have permission to view this page.</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;