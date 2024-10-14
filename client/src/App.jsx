import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Documents from './pages/Documents';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Delivery from './pages/Delivery';
import ProtectedRoute from './components/ProtectedRoute';
import AddDocumentForm from './components/AddDocumentForm';
import ViewDocument from './components/ViewDocument';
import EditDocumentForm from './components/EditDocumentForm';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './context/userContext';
import { DocumentsContextProvider } from './context/documentContext';

axios.defaults.baseURL = 'http://localhost:3500';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <DocumentsContextProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <div className="pages">
          <NavBar />
          <Routes>
            {/* Ensure NavBar is part of the layout */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/add"
              element={
                <ProtectedRoute>
                  <AddDocumentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/view/:id"
              element={
                <ProtectedRoute>
                  <ViewDocument />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/edit/:id"
              element={
                <ProtectedRoute>
                  <EditDocumentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <ProtectedRoute>
                  <Delivery />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </DocumentsContextProvider>
    </UserContextProvider>
  );
}

export default App;
