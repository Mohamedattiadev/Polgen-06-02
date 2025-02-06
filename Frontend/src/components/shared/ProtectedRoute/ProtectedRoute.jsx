import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = React.memo(({ children, requiredRole }) => {
  const token = sessionStorage.getItem("token"); // Use sessionStorage
  const location = useLocation();

  // Safely parse user data from sessionStorage
  let user = null;
  try {
    const userData = sessionStorage.getItem("user"); // Use sessionStorage
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error(
      "ProtectedRoute: Failed to parse user data from sessionStorage.",
      error
    );
    user = null;
  }

  console.log(
    `ProtectedRoute: Checking access for location: ${location.pathname}`
  );

  // Redirect to login if the token is missing
  if (!token) {
    console.warn("ProtectedRoute: No token found. Redirecting to /login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role mismatch and redirect
  if (requiredRole && user?.role !== requiredRole) {
    console.warn(
      `ProtectedRoute: Role mismatch. Expected '${requiredRole}', got '${user?.role}'. Redirecting to /error404...`
    );
    return <Navigate to="/error404" replace />;
  }

  console.log(
    `ProtectedRoute: Access granted for role: ${
      user?.role || "No role specified"
    }`
  );
  return children;
});

export default ProtectedRoute;
