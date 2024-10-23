import { Route } from 'react-router-dom';
import BirPermitTypesCrudPage from './BirPermitsTypesCrudPage';
import BirPermitsCrudPage from './BirPermitsCrudPage';
import PublicRoute from '../../components/PublicRoute';
import ProtectedRoute from '../../components/ProtectedRoute';

const companyRoutes = [
  <Route key="bir-permit-types" path="/bir-permit-types" element={<ProtectedRoute><BirPermitTypesCrudPage /></ProtectedRoute>} />,
  <Route key="bir-permits" path="/bir-permits" element={<ProtectedRoute><BirPermitsCrudPage /></ProtectedRoute>} />,
];

export default companyRoutes;
