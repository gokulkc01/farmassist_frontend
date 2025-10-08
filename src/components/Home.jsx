import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = ({ navigateTo, openModal }) => {
    const { isAuthenticated, user } = useAuth();

    const handleCardClick = (page) => {
        if (isAuthenticated) {
            navigateTo(page);
        } else {
            openModal('login');
        }
    };

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigateTo('dashboard');
        } else {
            openModal('register');
        }
    };

    return (
        <section id="home" className="page active">
            <div className="intro">
                <div className="intro-left">
                    <h1>FarmAssist — Smart tools for farmers</h1>
                    <p className="lead">
                        Practical farm tools: weather, soil health, moisture, motors, plant health and more — made simple.
                    </p>
                    <button onClick={handleGetStarted} className="primary btn-large">
                        {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                    </button>
                </div>
                <div style={{ minWidth: '140px', textAlign: 'right' }}>
                    {isAuthenticated ? (
                        <>
                            <small className="small">Welcome back, {user?.name}! 👨‍🌾</small>
                            <div style={{ marginTop: '0.5rem' }}>
                                <button onClick={() => navigateTo('dashboard')} className="primary">
                                    Go to Dashboard
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <small className="small">Welcome, Farmer</small>
                            <div style={{ marginTop: '0.5rem' }}>
                                <button onClick={() => openModal('login')} className="primary">
                                    Quick Weather
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="grid" style={{ marginTop: '1.6rem' }}>
                <div className="card" onClick={() => handleCardClick('weather')}>
                    <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-day.png" alt="weather" />
                    <span>Weather</span>
                </div>
                <div className="card" onClick={() => handleCardClick('soilHealth')}>
                    <img src="https://img.icons8.com/fluency/96/000000/soil.png" alt="soil" />
                    <span>Soil Health</span>
                </div>
                <div className="card" onClick={() => handleCardClick('soilMoisture')}>
                    <img src="https://img.icons8.com/fluency/96/000000/wet.png" alt="moisture" />
                    <span>Soil Moisture</span>
                </div>
                <div className="card" onClick={() => handleCardClick('Motor')}>
                    <img src="https://i.pinimg.com/736x/26/44/ea/2644eac00917804eb68c6e2fdc96470b.jpg" alt="motor" />
                    <span>Motor</span>
                </div>
                <div className="card" onClick={() => handleCardClick('plantHealth')}>
                    <img src="https://img.icons8.com/fluency/96/000000/leaf.png" alt="plant-health" />
                    <span>Plant Health</span>
                </div>
                <div className="card" onClick={() => handleCardClick('PriceCard')}>
                    <img src="https://img.icons8.com/fluency/96/000000/more.png" alt="more" />
                    <span>Market Prices</span>
                </div>
            </div>
        </section>
    );
};

export default Home;