import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState, Suspense } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Lazy loaded Pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const WeatherPage = React.lazy(() => import('./pages/WeatherPage'));
const CropPage = React.lazy(() => import('./pages/CropPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const MarketplacePage = React.lazy(() => import('./pages/MarketplacePage'));
const SchemesPage = React.lazy(() => import('./pages/SchemesPage'));
const StoragePage = React.lazy(() => import('./pages/StoragePage'));
const LabourPage = React.lazy(() => import('./pages/LabourPage'));
const LoanPage = React.lazy(() => import('./pages/LoanPage'));
const KnowledgePage = React.lazy(() => import('./pages/KnowledgePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Fallback loader component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary)' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Layout for public / auth pages (no sidebar, full-width) ─── */
function PublicLayout({ children }) {
  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </div>
  );
}

/* ─── Layout for protected app pages (with collapsible sidebar) ─── */
function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        {/* Mobile sidebar toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰ Menu
        </button>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        {/* ── Public routes (full-width, no sidebar) ── */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <PublicLayout><LandingPage /></PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <PublicLayout><LoginPage /></PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <PublicLayout><RegisterPage /></PublicLayout>
          }
        />

        {/* ── Protected routes (with sidebar layout) ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/weather" element={
          <ProtectedRoute>
            <AppLayout><WeatherPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/crop" element={
          <ProtectedRoute>
            <AppLayout><CropPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <AppLayout><ChatPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <AppLayout><MarketplacePage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/schemes" element={
          <ProtectedRoute>
            <AppLayout><SchemesPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/storage" element={
          <ProtectedRoute>
            <AppLayout><StoragePage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/labour" element={
          <ProtectedRoute>
            <AppLayout><LabourPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/loans" element={
          <ProtectedRoute>
            <AppLayout><LoanPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/knowledge" element={
          <ProtectedRoute>
            <AppLayout><KnowledgePage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><ProfilePage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
