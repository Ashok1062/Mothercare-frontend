import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoutes({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />; // not logged in

  try {
    const decoded = jwtDecode(token); // decode JWT
    const role = decoded.role; // assuming your token has a "role" field
    console.log(role);
    if (allowedRoles && !allowedRoles.includes(role)) {
      // role not allowed
      return <Navigate to="/" />; // or a "Not Authorized" page
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" />;
  }
}

export default ProtectedRoutes;
