import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import WeatherPage from './pages/WeatherPage';
import CropPage from './pages/CropPage';
import ChatPage from './pages/ChatPage';
import MarketplacePage from './pages/MarketplacePage';
import SchemesPage from './pages/SchemesPage';
import StoragePage from './pages/StoragePage';
import LabourPage from './pages/LabourPage';
import LoanPage from './pages/LoanPage';
import KnowledgePage from './pages/KnowledgePage';
import ProfilePage from './pages/ProfilePage';

/* ─── Layout for public / auth pages (no sidebar, full-width) ─── */
function PublicLayout({ children }) {
  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      {children}
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
        {children}
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
