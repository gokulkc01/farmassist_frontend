import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming priceAPI is available from '../services/api' but using mock data here
// import { priceAPI } from '../services/api'; 
import '../styles/MarketPrice.css'; // Corrected import path to match common file structure

// --- MOCK DATA ---
const MOCK_PRICES = [
    { id: 1, cropName: 'Tomato', state: 'Karnataka', price: 2000, unit: 'Quintal', rangeMin: 1500, rangeMax: 2500, trend: 'increasing', market: 'Bangalore APMC', latestDate: '2025-10-11', icon: '🍅' },
    { id: 2, cropName: 'Onion', state: 'Maharashtra', price: 1800, unit: 'Quintal', rangeMin: 1600, rangeMax: 2200, trend: 'decreasing', market: 'Nashik Mandi', latestDate: '2025-10-11', icon: '🧅' },
    { id: 3, cropName: 'Potato', state: 'Uttar Pradesh', price: 1200, unit: 'Quintal', rangeMin: 1000, rangeMax: 1500, trend: 'stable', market: 'Agra Bazaar', latestDate: '2025-10-10', icon: '🥔' },
    { id: 4, cropName: 'Corn', state: 'Bihar', price: 2500, unit: 'Quintal', rangeMin: 2300, rangeMax: 2800, trend: 'increasing', market: 'Patna Market', latestDate: '2025-10-10', icon: '🌽' },
    { id: 5, cropName: 'Garlic', state: 'Gujarat', price: 6000, unit: 'Quintal', rangeMin: 5500, rangeMax: 7000, trend: 'increasing', market: 'Rajkot APMC', latestDate: '2025-10-11', icon: '🧄' },
    { id: 6, cropName: 'Ginger', state: 'Kerala', price: 4500, unit: 'Quintal', rangeMin: 4000, rangeMax: 5000, trend: 'decreasing', market: 'Kochi Mandi', latestDate: '2025-10-10', icon: '🫚' },
    { id: 7, cropName: 'Wheat', state: 'Punjab', price: 2200, unit: 'Quintal', rangeMin: 2000, rangeMax: 2400, trend: 'stable', market: 'Amritsar Market', latestDate: '2025-10-11', icon: '🌾' },
    { id: 8, cropName: 'Rice', state: 'Andhra Pradesh', price: 3000, unit: 'Quintal', rangeMin: 2800, rangeMax: 3200, trend: 'increasing', market: 'Guntur Bazzar', latestDate: '2025-10-11', icon: '🍚' },
];

// --- SINGLE PRICE CARD SUB-COMPONENT ---
const SinglePriceCard = ({ crop }) => {
    // Dynamically assign classes based on trend
    const trendClass = crop.trend === 'increasing' ? 'increasing' : crop.trend === 'decreasing' ? 'decreasing' : 'stable';
    const trendIcon = crop.trend === 'increasing' ? '📈' : crop.trend === 'decreasing' ? '📉' : '➡️';
    
    // Calculate price per kg for display
    const pricePerKg = (crop.price / 100).toFixed(2); 

    return (
        <div className="price-card">
            <div className="card-header">
                <div className="crop-info">
                    <span className="crop-icon">{crop.icon}</span>
                    <div>
                        <h2 className="crop-name">{crop.cropName}</h2>
                        <p className="crop-state">{crop.state}</p>
                    </div>
                </div>
                <button className="refresh-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.188a2 2 0 002.347 1.954l.443.089a1 1 0 01.66 1.052l-.462 2.308a1 1 0 00.58 1.144l.278.093a1 1 0 01.554.921l-.11 1.096a1 1 0 00.518 1.011l.732.366A1 1 0 0113 18v2h-2v-2a1 1 0 01-1-1H7a1 1 0 01-1-1v-2a1 1 0 011-1h3.456a3.996 3.996 0 001.32-.42l.142-.047a2 2 0 001.116-2.185l-.216-1.08a2 2 0 00-.73-1.042l-.248-.124A3.996 3.996 0 009 6.273V3a1 1 0 011-1h1a1 1 0 011 1v3.273c0 .248-.05.489-.142.714l-.278.557A1 1 0 0111 8.52V10a1 1 0 01-1 1H7a1 1 0 01-1-1V8.52a1 1 0 01-.178-.557L5.568 6.714A3.996 3.996 0 005.188 6H3a1 1 0 01-1-1V3a1 1 0 011-1h1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Price Highlight */}
            <div className="price-highlight">
                <div className="current-price-main">
                    <span className="currency-symbol">₹</span>{crop.price.toLocaleString('en-IN')}<span className="unit-label">/{crop.unit}</span>
                </div>
                <div className="trend-details">
                    <p className={`trend-icon ${trendClass}`}>{trendIcon}</p>
                    <p className="price-per-kg">(₹{pricePerKg}/kg)</p>
                </div>
            </div>

            {/* Price Range */}
            <div className="price-range">
                <p className="range-label">Price Range Today</p>
                <div className="range-values">
                    <span className="min-price">Min: ₹{crop.rangeMin.toLocaleString('en-IN')}</span>
                    <span className="max-price">Max: ₹{crop.rangeMax.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* Market Info */}
            <div className="market-info">
                <span className="market-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {crop.latestDate}
                </span>
                <span className="market-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {crop.market}
                </span>
            </div>
        </div>
    );
};


// --- MAIN MARKET PRICES PAGE COMPONENT ---
const MarketPrices = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [prices, setPrices] = useState(MOCK_PRICES); // Use mock data

    // Memoize the filtered list for performance
    const filteredPrices = useMemo(() => {
        if (!searchTerm) {
            return prices;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return prices.filter(crop =>
            crop.cropName.toLowerCase().includes(lowerCaseSearch) ||
            crop.state.toLowerCase().includes(lowerCaseSearch) ||
            crop.market.toLowerCase().includes(lowerCaseSearch)
        );
    }, [prices, searchTerm]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p className="loading-text">Fetching live market data...</p>
            </div>
        );
    }

    return (
        <div className="market-prices-page">
            <div className="market-prices-container">
                {/* Header and Search Bar */}
                <header className="page-header">
                    <h1 className="page-title">
                        Global Market Prices 💰
                    </h1>
                    <p className="page-subtitle">Track real-time prices for your crops across different markets.</p>
                </header>

                {/* Search Input */}
                <div className="search-sticky-wrapper">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search by crop name, state, or market..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Crop Price Grid - Mobile Responsive */}
                {filteredPrices.length > 0 ? (
                    <div className="price-grid">
                        {filteredPrices.map(crop => (
                            <SinglePriceCard key={crop.id} crop={crop} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results-message">
                        <p className="no-results-title">
                            No market prices found for "{searchTerm}" 😔
                        </p>
                        <p className="no-results-subtitle">Try searching for another crop name or state.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketPrices;
