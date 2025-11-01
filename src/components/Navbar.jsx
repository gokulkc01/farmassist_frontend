import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = ({ navigateTo, openModal, currentPage }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigateTo('home');
    };

    const isActive = (page) => {
        return currentPage === page ? "bg-blue-600 text-white px-4 py-2 rounded-md" 
            : "text-gray-700 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors";
    };

    return (
        <header>
            <div className="brand">
                <div className="logo">🌾</div>
                <span className="brand-name">FarmAssist</span>
            </div>
            <div className="spacer"></div>

            {/* Navigation Links for Authenticated Users */}
            <div className="nav-links">
                <button
                    className={`nav-link ${isActive('dashboard')}`}
                    onClick={() => navigateTo('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={`nav-link ${isActive('weather')}`}
                    onClick={() => navigateTo('weather')}
                >
                    Weather
                </button>
                <button
                    className={`nav-link ${isActive('PriceCard')}`}
                    onClick={() => navigateTo('PriceCard')}
                >
                    Market Prices
                </button>
                <button
                    className={`nav-link ${isActive('soilHealth')}`}
                    onClick={() => navigateTo('soilHealth')}
                >
                    Soil Health
                </button>
                <button
                    className={`nav-link ${isActive('PlantHealth')}`}
                    onClick={() => navigateTo('PlantHealth')}
                >
                    Plant Health
                </button>
            </div>

            <div className="spacer"></div>

            <div className="top-actions">
                <div className="user-info">
                    <span className="user-welcome">Hello, {user?.name}</span>
                </div>
                <button
                    onClick={() => navigateTo('home')}
                     className={`nav-link ${isActive('Home')}`}
                >
                    Home
                </button>
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;