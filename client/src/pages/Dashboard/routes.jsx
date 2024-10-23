import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProtectedRoute from '../../components/ProtectedRoute';


// Dashboard Routes
const dashboardRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="dashboard"
    path="/"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  
];

export default dashboardRoutes;
