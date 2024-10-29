import { Route } from 'react-router-dom';
import PublicRoute from '../../../components/PublicRoute';
import ProtectedRoute from '../../../components/ProtectedRoute';
import PurchasesTablePage from './PurchasesTablePage';

const purchasesRoutes = [
  <Route key="purchases" path="/purchases" element={<ProtectedRoute><PurchasesTablePage /></ProtectedRoute>} />,
  <Route key="purchase-form" path="/purchase/form" element={<ProtectedRoute><PurchasesTablePage /></ProtectedRoute>} />,
];

export default purchasesRoutes;
