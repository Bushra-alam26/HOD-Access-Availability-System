import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const location = useLocation();
  
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login/student" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not allowed, redirect to their dashboard
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case "hod":
        return <Navigate to="/hod-dashboard" replace />;
      case "faculty":
        return <Navigate to="/faculty-dashboard" replace />;
      case "student":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login/student" replace />;
    }
  }

  return <>{children}</>;
};

export const useAuth = () => {
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  return {
    userRole,
    isAuthenticated,
    login: (role: string) => {
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");
    },
    logout: () => {
      localStorage.removeItem("userRole");
      localStorage.removeItem("isAuthenticated");
    }
  };
};