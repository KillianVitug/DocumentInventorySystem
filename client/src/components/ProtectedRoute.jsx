import { useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not logged in
      navigate('/login');
    }
  }, [user, navigate]);

  // Render the children (Dashboard) if user is authenticated
  return user ? children : null;
}
