import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                fontSize: '0.9rem',
                boxShadow: 'var(--shadow-md)',
              },
              success: {
                iconTheme: { primary: 'var(--primary-light)', secondary: 'var(--bg-dark)' },
              },
              error: {
                iconTheme: { primary: '#ef5350', secondary: 'var(--bg-dark)' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
