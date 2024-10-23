// import { useContext, useEffect } from 'react';
// import { UserContext } from '../context/userContext';
// import { useNavigate } from 'react-router-dom';

// export default function ProtectedRoute({ children }) {
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       // Redirect to login if user is not logged in
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   // Render the children (Dashboard) if user is authenticated
//   return user ? children : null;
// }

import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute Component
// - Redirects unauthenticated users to the login page
// - Renders children if the user is authenticated
const ProtectedRoute = ({ children }) => {
  // Check if there is a logged-in user in sessionStorage or localStorage
  const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));

  // If user is not logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, allow access to the children components (protected page)
  return children;
};

export default ProtectedRoute;


