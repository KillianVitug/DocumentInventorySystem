import { Route } from 'react-router-dom';
import Delivery from './Delivery';
import PublicRoute from '../../components/PublicRoute';
import ProtectedRoute from '../../components/ProtectedRoute';

const authRoutes = [
  <Route
    key="delivery"
    path="/delivery"
    element={
      <ProtectedRoute>
        <Delivery />
      </ProtectedRoute>
    }
  />
];

export default authRoutes;
