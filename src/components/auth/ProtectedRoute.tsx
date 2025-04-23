import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("UNIFIED" | "ADMIN")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem('token');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
} 