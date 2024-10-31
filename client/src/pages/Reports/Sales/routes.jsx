import { Route } from 'react-router-dom';
import PublicRoute from '../../../components/PublicRoute';
import ProtectedRoute from '../../../components/ProtectedRoute';
import SalesReportsPage from './SalesReportsPage';

const salesReportsRoutes = [
  <Route
    key="sales-reports"
    path="/sales-reports"
    element={
      <ProtectedRoute>
        <SalesReportsPage />
      </ProtectedRoute>
    }
  />,
];

export default salesReportsRoutes;
