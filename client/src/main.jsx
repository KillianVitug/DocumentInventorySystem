import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from './context/userContext';
import { DocumentsContextProvider } from './context/documentContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserContextProvider>
        <DocumentsContextProvider>
          <App />
        </DocumentsContextProvider>
      </UserContextProvider>
    </Router>
  </StrictMode>
);
