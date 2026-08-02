import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(15, 35, 20, 0.95)',
              color: '#e8f5e9',
              border: '1px solid rgba(26, 122, 74, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
            success: {
              iconTheme: { primary: '#2ea865', secondary: '#0a1a10' },
            },
            error: {
              iconTheme: { primary: '#ef5350', secondary: '#0a1a10' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
