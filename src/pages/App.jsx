import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SensorProvider } from '../context/SensorContext';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import Weather from '../components/Weather';
import SoilHealth from '../components/SoilHealth';
import SoilMoisture from '../components/SoilMoisture';
import Motor from '../components/Motor';
import PlantHealth from '../components/PlantHealth';
import More from '../components/More';
import Modal from '../components/Modal';
import PriceCard from '../components/PriceCard';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../components/Dashboard';
import '../styles/App.css';
import MarketPrices from '../components/MarketPrice';
import FarmRegister from '../components/FarmRegister';

// Component to wrap protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading state while auth status is being determined
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Loading FarmAssist...</p>
      </div>
    );
  }

  // Redirect to home if not authenticated, preserving the current location
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Main App Layout/Content Component
const AppContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('login');
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show loading state for the initial load
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Loading FarmAssist...</p>
      </div>
    );
  }

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAuthSuccess = () => {
    closeModal();
    // Use react-router's navigate to go to the dashboard or the page they tried to access
    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  };

  // Determine current page for Navbar active link state
  const currentPagePath = location.pathname.substring(1); // e.g., 'dashboard' from '/dashboard'

  // Determine if Navbar should be shown
  const showNavbar = isAuthenticated && !['home', 'login', 'register', ''].includes(currentPagePath);
  
  // Determine if Footer should be shown
  const showFooter = location.pathname === '/' || isAuthenticated;


  return (
    <div className="app">
      {/* Navbar for authenticated users on app pages */}
      {showNavbar && (
        <Navbar
          navigateTo={navigate} // Use react-router's navigate
          openModal={openModal}
          currentPage={currentPagePath}
        />
      )}

      <main>
        <div className="center-card">
          <Routes>
            {/* Public Routes */}
              <Route path="/" element={<Home navigateTo={navigate} openModal={openModal} />} />
            <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><Weather navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/soilHealth" element={<ProtectedRoute><SoilHealth navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/soilMoisture" element={<ProtectedRoute><SoilMoisture navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/motor" element={<ProtectedRoute><Motor navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/plantHealth" element={<ProtectedRoute><PlantHealth navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/priceCard" element={<ProtectedRoute><MarketPrices navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/more" element={<ProtectedRoute><More navigateTo={navigate} /></ProtectedRoute>} />
            <Route path="/FarmRegister" element={<ProtectedRoute><FarmRegister navigateTo={navigate} /></ProtectedRoute>} />

            {/* Catch-all for 404 - redirects to home or another page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer>&copy; 2025 FarmAssist — Built for farmers</footer>
      )}

      {/* Modal for login/register (only opened manually, e.g., from home or a button) */}
      {isModalOpen && (
        <Modal
          type={modalType}
          onClose={closeModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

// Main App Wrapper with AuthProvider and BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SensorProvider>
          <AppContent />
        </SensorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;