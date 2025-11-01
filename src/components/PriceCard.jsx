// src/components/CropPrices/PriceCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import PropTypes from 'prop-types';
import '../styles/PriceCard.css';

const PriceCard = ({ cropType = 'Tomato', onRefresh, showDetails = true, className = '' }) => {
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    const isMounted = useRef(true);
    const abortControllerRef = useRef(null);

    // Online/offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        isMounted.current = true;
        abortControllerRef.current = new AbortController();

        fetchPriceData();

        return () => {
            isMounted.current = false;
            abortControllerRef.current?.abort();
        };
    }, [cropType]);

    const validatePriceData = (data) => {
        if (!data) return false;
        
        const requiredFields = ['stateAverage', 'priceRange', 'markets', 'unit'];
        const hasRequiredFields = requiredFields.every(field => field in data);
        
        if (!hasRequiredFields) return false;
        
        // Validate numerical values
        if (typeof data.stateAverage !== 'number' || data.stateAverage < 0) return false;
        if (data.priceRange.min > data.priceRange.max) return false;
        if (!Array.isArray(data.markets)) return false;
        
        return true;
    };

    const fetchPriceData = async (isRetry = false) => {
        if (!isMounted.current) return;

        if (isRetry) {
            setRetryCount(prev => prev + 1);
        } else {
            setRetryCount(0);
        }

        // Check offline state
        if (!isOnline) {
            setError('You are offline. Please check your internet connection.');
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            if (!isRetry) {
                setLoading(true);
            }
            setError(null);
            
            const response = await fetch(
                `http://localhost:5000/api/prices/${encodeURIComponent(cropType)}?state=Karnataka`,
                { 
                    signal: abortControllerRef.current?.signal,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (!isMounted.current) return;
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const json = await response.json();
            
            if (!isMounted.current) return;
            
            if (json.success && validatePriceData(json.data)) {
                setPriceData(json.data);
                if (onRefresh) onRefresh(json.data);
            } else {
                throw new Error(json.message || 'Invalid data received from server');
            }
            
        } catch (err) {
            if (!isMounted.current) return;
            
            if (err.name === 'AbortError') {
                console.log('Price data request cancelled');
                return;
            }
            
            console.error('Error fetching prices:', err);
            
            const errorMessage = err.message.includes('Failed to fetch') 
                ? 'Network error: Check your internet connection'
                : err.message.includes('HTTP error')
                ? `Server error: ${err.message}`
                : err.message;
                
            setError(errorMessage);

            // Auto-retry for network errors (max 3 times)
            if (retryCount < 3 && err.message.includes('Network error')) {
                setTimeout(() => {
                    if (isMounted.current) {
                        fetchPriceData(true);
                    }
                }, 2000 * (retryCount + 1));
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    };

    const handleRefresh = async () => {
        if (refreshing || loading) return;
        setRefreshing(true);
        await fetchPriceData();
    };

    const getPricePerKg = (pricePerQuintal) => {
        return (pricePerQuintal / 100).toFixed(2);
    };

    // Render loading state
    if (loading && !refreshing) {
        return (
            <div className={`price-card loading ${className}`} role="status" aria-label="Loading price data">
                <div className="spinner" aria-hidden="true"></div>
                <p>Loading {cropType} price data...</p>
            </div>
        );
    }

    // Render error state
    if (error && !priceData) {
        return (
            <div className={`price-card error ${className}`} role="alert">
                <div className="error-content">
                    <p>❌ {error}</p>
                    <div className="error-actions">
                        <button onClick={handleRefresh} className="refresh-btn" disabled={refreshing}>
                            {refreshing ? 'Retrying...' : 'Try Again'}
                        </button>
                        {!isOnline && (
                            <div className="offline-indicator">
                                <WifiOff size={16} />
                                <span>Offline</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!priceData) {
        return null;
    }

    return (
        <div className={`price-card ${className}`} role="article" aria-label={`${cropType} market prices`}>
            {/* Header with status */}
            <div className="price-header">
                <div>
                    <h2 className="price-title" id="price-title">{cropType} Market Price</h2>
                    <p className="price-subtitle">Karnataka State</p>
                </div>
                <div className="header-actions">
                    {!isOnline && (
                        <div className="offline-badge" title="You are offline">
                            <WifiOff size={16} />
                        </div>
                    )}
                    <button 
                        onClick={handleRefresh} 
                        className="refresh-icon-btn"
                        disabled={refreshing || loading}
                        aria-label="Refresh price data"
                        aria-describedby="price-title"
                    >
                        <RefreshCw className={refreshing ? 'spinning' : ''} size={20} />
                        {refreshing && <span className="sr-only">Refreshing...</span>}
                    </button>
                </div>
            </div>

            {/* Main Price */}
            <div className="price-main">
                <div className="price-value">
                    <span className="currency">₹</span>
                    <span className="amount">{priceData.stateAverage.toLocaleString()}</span>
                    <span className="unit">/{priceData.unit || 'Quintal'}</span>
                </div>
                <div className="price-per-kg">
                    (₹{getPricePerKg(priceData.stateAverage)}/kg)
                </div>
            </div>

            {/* Price Range */}
            <div className="price-range">
                <div className="range-label">Price Range Today</div>
                <div className="range-values">
                    <span className="range-min">₹{priceData.priceRange.min?.toLocaleString()}</span>
                    <span className="range-separator">-</span>
                    <span className="range-max">₹{priceData.priceRange.max?.toLocaleString()}</span>
                </div>
            </div>

            {/* Metadata */}
            <div className="price-meta">
                <div className="meta-item">
                    <Calendar size={16} />
                    <span>{priceData.lastUpdated}</span>
                </div>
                <div className="meta-item">
                    <MapPin size={16} />
                    <span>{priceData.totalMarkets} markets</span>
                </div>
            </div>

            {/* Top Markets */}
            {showDetails && priceData.markets && priceData.markets.length > 0 && (
                <div className="markets-section">
                    <h3 className="markets-title">Top Markets</h3>
                    <div className="markets-list">
                        {priceData.markets.slice(0, 5).map((market, index) => (
                            <div key={index} className="market-item">
                                <div className="market-info">
                                    <div className="market-name">{market.market}</div>
                                    <div className="market-district">{market.district}</div>
                                </div>
                                <div className="market-price">
                                    ₹{market.modalPrice?.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Source */}
            <div className="data-source">
                <span className="source-badge">✓ Verified</span>
                <span className="source-text">{priceData.dataSource}</span>
            </div>

            {/* Fallback Warning */}
            {priceData.isFallback && (
                <div className="fallback-warning" role="alert">
                    ⚠️ Showing approximate prices (Live data unavailable)
                </div>
            )}
        </div>
    );
};

PriceCard.propTypes = {
    cropType: PropTypes.string,
    onRefresh: PropTypes.func,
    showDetails: PropTypes.bool,
    className: PropTypes.string
};

PriceCard.defaultProps = {
    cropType: 'Tomato',
    showDetails: true,
    className: ''
};
PriceCard.defaultProps = {
    cropType: 'Potato',
    showDetails: true,
    className: ''
};

export default PriceCard;