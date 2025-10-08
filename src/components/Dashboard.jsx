import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sensorAPI, weatherAPI, cropAPI, priceAPI } from '../services/api';

import '../styles/Dashboard.css';

const Dashboard = () => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        sensorReadings: [],
        weather: null,
        cropUpdates: [],
        marketPrices: [],
        alerts: []
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // In a real app, you'd have farm IDs from user data
            const farmId = 'demo-farm-123'; // This would come from user's farms

            // Load all data in parallel
            const [sensorData, weatherData, cropData, marketData] = await Promise.all([
                sensorAPI.getCurrentReadings(farmId).catch(() => ({ data: { data: [] } })),
                weatherAPI.getCurrentWeather({ city: user?.location?.district || 'Bangalore' }).catch(() => ({ data: { data: null } })),
                cropAPI.getFarmUpdates(farmId, { limit: 5 }).catch(() => ({ data: { data: [] } })),
                priceAPI.getCropPrice('Tomato','Karnataka').catch(() => ({ data: { data: [] } }))
            ]);

            setDashboardData({
                sensorReadings: sensorData.data.data,
                weather: weatherData.data.data,
                cropUpdates: cropData.data.data,
                marketPrices: marketData.data.data,
                alerts: [] // You can add alert logic here
            });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Loading your farm dashboard...</p>
            </div>
        );
    }
    

     const handleCardClick = (page) => {
        if (isAuthenticated) {
            navigateTo(page);
        } else {
            openModal('login');
        }
    };

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user?.name}!
                        👨‍🌾</h1>
                    <p>Here's what's happening on your farm today</p>
                </div>
                <div className="date-section">
                    <p>{new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🌡️</div>
                    <div className="stat-info">
                        <h3>Temperature</h3>
                        <p className="stat-value">
                            {dashboardData.sensorReadings.find(s => s._id === 'temperature')?.latestValue || '--'}°C
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💧</div>
                    <div className="stat-info">
                        <h3>Soil Moisture</h3>
                        <p className="stat-value">
                            {dashboardData.sensorReadings.find(s => s._id === 'soil_moisture')?.latestValue || '--'}%
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🌧️</div>
                    <div className="stat-info">
                        <h3>Humidity</h3>
                        <p className="stat-value">
                            {dashboardData.sensorReadings.find(s => s._id === 'humidity')?.latestValue || '--'}%
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🚜</div>
                    <div className="stat-info">
                        <h3>Active Crops</h3>
                        <p className="stat-value">3</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="dashboard-column">
                    {/* Weather Widget */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>🌤️ Current Weather</h3>
                        </div>
                        <div className="card-content">
                            {dashboardData.weather ? (
                                <div className="weather-widget">
                                    <div className="weather-main">
                                        <div className="weather-temp">
                                            {dashboardData.weather.temperature}°C
                                        </div>
                                        <div className="weather-desc">
                                            {dashboardData.weather.description}
                                        </div>
                                    </div>
                                    <div className="weather-details">
                                        <div className="weather-detail">
                                            <span>Feels like</span>
                                            <span>{dashboardData.weather.feelsLike}°C</span>
                                        </div>
                                        <div className="weather-detail">
                                            <span>Humidity</span>
                                            <span>{dashboardData.weather.humidity}%</span>
                                        </div>
                                        <div className="weather-detail">
                                            <span>Wind</span>
                                            <span>{dashboardData.weather.windSpeed} m/s</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="no-data">Weather data not available</p>
                            )}
                        </div>
                    </div>

                    {/* Crop Updates */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>🌱 Recent Crop Updates</h3>
                        </div>
                        <div className="card-content">
                            {dashboardData.cropUpdates.length > 0 ? (
                                <div className="updates-list">
                                    {dashboardData.cropUpdates.slice(0, 4).map(update => (
                                        <div key={update._id} className="update-item">
                                            <div className="update-icon">
                                                {update.type === 'growth_update' && '🌱'}
                                                {update.type === 'health_alert' && '⚠️'}
                                                {update.type === 'task_reminder' && '📅'}
                                                {update.type === 'harvest_ready' && '🚜'}
                                            </div>
                                            <div className="update-content">
                                                <p className="update-title">{update.title}</p>
                                                <p className="update-message">{update.message}</p>
                                                <span className="update-time">
                                                    {new Date(update.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No recent crop updates</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-column">
                    {/* Market Prices */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>💰 Market Prices</h3>
                        </div>
                        <div className="card-content">
                            {dashboardData.marketPrices.length > 0 ? (
                                <div className="prices-list">
                                    {dashboardData.marketPrices.slice(0, 4).map(price => (
                                        <div key={price._id} className="price-item">
                                            <div className="crop-name">{price.cropName}</div>
                                            <div className="price-details">
                                                <span className="price">₹{price.modalPrice}/{price.priceUnit}</span>
                                                <span className="market">{price.marketName}</span>
                                            </div>
                                            <div className={`price-trend ${price.priceTrend}`}>
                                                {price.priceTrend === 'increasing' && '📈'}
                                                {price.priceTrend === 'decreasing' && '📉'}
                                                {price.priceTrend === 'stable' && '➡️'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">Market prices not available</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>⚡ Quick Actions</h3>
                        </div>
                        <div className="card-content">
                            <div className="actions-grid">
                                <button className="action-btn" onClick={() => handleCardClick('weather')}>
                                    <span className="action-icon">🌤️</span>
                                    <span>Check Weather</span>
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">💰</span>
                                    <span>Market Prices</span>
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">🌱</span>
                                    <span>Crop Health</span>
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">💧</span>
                                    <span>Irrigation</span>
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">📊</span>
                                    <span>Analytics</span>
                                </button>
                                <button className="action-btn">
                                    <span className="action-icon">⚙️</span>
                                    <span>Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="dashboard-card alert-card">
                        <div className="card-header">
                            <h3>🔔 Important Alerts</h3>
                        </div>
                        <div className="card-content">
                            <div className="alert-item urgent">
                                <div className="alert-icon">⚠️</div>
                                <div className="alert-content">
                                    <p className="alert-title">Low Soil Moisture</p>
                                    <p className="alert-message">Tomato field needs irrigation</p>
                                </div>
                            </div>
                            <div className="alert-item info">
                                <div className="alert-icon">🌧️</div>
                                <div className="alert-content">
                                    <p className="alert-title">Rain Forecast</p>
                                    <p className="alert-message">Expected rainfall in 2 days</p>
                                </div>
                            </div>
                            <div className="alert-item warning">
                                <div className="alert-icon">🐛</div>
                                <div className="alert-content">
                                    <p className="alert-title">Pest Alert</p>
                                    <p className="alert-message">Check corn field for pests</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;