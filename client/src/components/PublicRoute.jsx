import React from 'react';
import { Navigate } from 'react-router-dom';

// PublicRoute Component
// - Redirects authenticated users to the dashboard
// - Renders children if the user is not authenticated
const PublicRoute = ({ children }) => {
  // Check if there is a logged-in user in sessionStorage or localStorage
  const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));

  // If user is logged in, redirect them to the dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, allow access to the children components (e.g., login page)
  return children;
};

export default PublicRoute;
