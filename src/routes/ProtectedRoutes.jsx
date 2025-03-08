import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!token) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
