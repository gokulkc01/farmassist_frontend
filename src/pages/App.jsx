import React, { useState, useEffect } from 'react';
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

// Main App Content Component
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('login');

  const { isAuthenticated, user, loading } = useAuth();

  // Redirect to login if not authenticated and trying to access protected pages
  useEffect(() => {
    if (!loading && !isAuthenticated && currentPage !== 'home') {
      setCurrentPage('home');
    }
  }, [isAuthenticated, loading, currentPage]);

  const navigateTo = (page) => {
    // If trying to access protected pages without authentication, show login modal
    if (page !== 'home' && !isAuthenticated) {
      setModalType('login');
      setIsModalOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAuthSuccess = () => {
    closeModal();
    // Redirect to dashboard after successful login/register
    setCurrentPage('dashboard');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Loading FarmAssist...</p>
      </div>
    );
  }

  // Show login/register pages directly if not authenticated
  if (!isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
    return (
      <div className="app">
        {currentPage === 'login' ? (
          <Login onAuthSuccess={handleAuthSuccess} />
        ) : (
          <Register onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
    );
  }

  // Show authentication pages if not logged in and trying to access app
  if (!isAuthenticated && currentPage !== 'home') {
    return (
      <div className="app">
        <Home navigateTo={navigateTo} openModal={openModal} />
        {isModalOpen && (
          <Modal type={modalType} onClose={closeModal} onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
    );
  }

  // Render the main app for authenticated users
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'weather':
        return <Weather navigateTo={navigateTo} />;
      case 'soilHealth':
        return <SoilHealth navigateTo={navigateTo} />;
      case 'soilMoisture':
        return <SoilMoisture navigateTo={navigateTo} />;
      case 'Motor':
        return <Motor navigateTo={navigateTo} />;
      case 'planHealth':
        return <PlantHealth navigateTo={navigateTo} />;
      case 'PriceCard':
        return <PriceCard navigateTo={navigateTo} />;
      case 'more':
        return <More navigateTo={navigateTo} />;
      case 'login':
        return <Login onAuthSuccess={handleAuthSuccess} />;
      case 'register':
        return <Register onAuthSuccess={handleAuthSuccess} />;
      default:
        return <Home navigateTo={navigateTo} openModal={openModal} />;
    }
  };

  return (
    <div className="app">
      {/* Show navbar only for authenticated users on app pages */}
      {(isAuthenticated && currentPage !== 'home' && currentPage !== 'login' && currentPage !== 'register') && (
        <Navbar
          navigateTo={navigateTo}
          openModal={openModal}
          currentPage={currentPage}
        />
      )}

      <main>
        <div className="center-card">
          {renderPage()}
        </div>
      </main>

      {/* Show footer only for home page and authenticated app pages */}
      {(currentPage === 'home' || isAuthenticated) && (
        <footer>&copy; 2025 FarmAssist — Built for farmers</footer>
      )}

      {/* Modal for login/register (used on home page) */}
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

// Main App Wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <SensorProvider>
      <AppContent />
      </SensorProvider>
    </AuthProvider>
  );
}

export default App;