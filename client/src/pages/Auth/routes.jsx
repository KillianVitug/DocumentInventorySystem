import { Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import PublicRoute from '../../components/PublicRoute';
import ProtectedRoute from '../../components/ProtectedRoute';

const authRoutes = [
  <Route
    key="login"
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />,
  <Route
    key="register"
    path="/register"
    element={
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    }
  />,
];

export default authRoutes;
