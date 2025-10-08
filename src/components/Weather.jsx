import React, { useState, useEffect } from 'react';
import { weatherAPI, getWeatherIcon, getWeatherBackground } from '../utils/weatherAPI';
import '../styles/Weather.css';

const Weather = ({ navigateTo }) => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);

    // Add this function INSIDE the component
    const detectUserLocation = () => {
        setLocationLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;

                        // Reverse geocoding to get city name from coordinates
                        const response = await fetch(
                            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${weatherAPI.OWM_KEY}`
                        );

                        if (!response.ok) {
                            throw new Error('Failed to get location name');
                        }

                        const data = await response.json();

                        if (data && data.length > 0) {
                            setCity(data[0].name);
                            // Auto-search weather for detected location
                            await searchWeatherWithCoords(latitude, longitude, data[0].name);
                        }
                    } catch (error) {
                        setError('Could not detect your location. Please enter a city name manually.');
                        console.log('Location detection failed:', error);
                    } finally {
                        setLocationLoading(false);
                    }
                },
                (error) => {
                    setLocationLoading(false);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setError('Location access denied. Please enter a city name manually.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setError('Location information unavailable. Please enter a city name.');
                            break;
                        case error.TIMEOUT:
                            setError('Location request timeout. Please try again or enter a city name.');
                            break;
                        default:
                            setError('Location detection failed. Please enter a city name.');
                    }
                },
                {
                    timeout: 10000, // 10 seconds timeout
                    enableHighAccuracy: false // Faster response
                }
            );
        } else {
            setLocationLoading(false);
            setError('Geolocation is not supported by your browser. Please enter a city name.');
        }
    };

    // Separate function to search weather using coordinates
    const searchWeatherWithCoords = async (lat, lon, cityName = '') => {
        setLoading(true);
        setError('');

        try {
            // Get current weather by coordinates (more accurate)
            const currentWeather = await weatherAPI.getCurrentWeatherByCoords(lat, lon);

            // Get forecast using the same coordinates
            const forecast = await weatherAPI.getWeatherForecast(lat, lon);

            setWeatherData(currentWeather);
            setForecastData(forecast);

            // Update city name if we got it from reverse geocoding
            if (cityName) {
                setCity(cityName);
            }

        } catch (err) {
            setError(err.message);
            setWeatherData(null);
            setForecastData(null);
        } finally {
            setLoading(false);
        }
    };

    // Call detectUserLocation when component mounts
    useEffect(() => {
        detectUserLocation();
    }, []);

    const searchWeather = async () => {
        // Weather API implementation will be added later
        if (!city.trim()) {
            setError('Please enter a city name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Get current weather
            const currentWeather = await weatherAPI.getCurrentWeather(city);

            // Get forecast using coordinates from current weather
            const forecast = await weatherAPI.getWeatherForecast(
                currentWeather.coord.lat,
                currentWeather.coord.lon
            );

            setWeatherData(currentWeather);
            setForecastData(forecast);

        } catch (err) {
            setError(err.message);
            setWeatherData(null);
            setForecastData(null);
        } finally {
            setLoading(false);
        }
        console.log('Searching weather for:', city);
    };

    // Add a manual location trigger button
    const handleUseMyLocation = () => {
        detectUserLocation();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    };
    const formatTemperature = (temp) => {
        return `${Math.round(temp)}°C`;
    };

    const formatWindSpeed = (speed) => {
        return `${speed} m/s`;
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Group forecast by day
    const getDailyForecast = () => {
        if (!forecastData) return [];

        const daily = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!daily[date]) {
                daily[date] = item;
            }
        });

        return Object.values(daily).slice(0, 7); // Next 7 days
    };


    return (
        <section className="page active">
            <div className="page-header">
                <h2>Weather</h2>
                <div>
                    <button onClick={() => navigateTo('home')}>← Back</button>
                </div>
            </div>

            <div className="weather-wrap">
                <div className="weather-left">
                    <div className="search-row">
                        <input
                            id="cityInput"
                            type="text"
                            placeholder="Enter city or village"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading || locationLoading}
                        />
                        <button className="primary" onClick={searchWeather} disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Add location button */}
                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={handleUseMyLocation}
                            disabled={locationLoading}
                            className="secondary"
                        >
                            {locationLoading ? 'Detecting Location...' : '📍 Use My Location'}
                        </button>
                    </div>


                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {weatherData && (
                        <div className="weather-card">
                            <div className="weather-header">
                                <img
                                    src={getWeatherIcon(weatherData.weather[0].icon, '4x')}
                                    alt={weatherData.weather[0].description}
                                />
                                <div>
                                    <h3>{weatherData.name}, {weatherData.sys.country}</h3>
                                    <p className="small">
                                        {weatherData.weather[0].description} • {formatTime(weatherData.dt)}
                                    </p>
                                </div>
                            </div>

                            <div className="weather-details">
                                <div>
                                    <p className="big-temp">
                                        {formatTemperature(weatherData.main.temp)}
                                    </p>
                                    <p className="small">
                                        Feels like {formatTemperature(weatherData.main.feels_like)}
                                    </p>
                                </div>
                                <div className="weather-stats">
                                    <p className="small">
                                        <strong>Humidity:</strong> {weatherData.main.humidity}%
                                    </p>
                                    <p className="small">
                                        <strong>Wind:</strong> {formatWindSpeed(weatherData.wind.speed)}
                                    </p>
                                    <p className="small">
                                        <strong>Pressure:</strong> {weatherData.main.pressure} hPa
                                    </p>
                                    <p className="small">
                                        <strong>Visibility:</strong> {(weatherData.visibility / 1000).toFixed(1)} km
                                    </p>
                                </div>
                            </div>

                            <div className="forecast-section">
                                <h4>5-Day Forecast</h4>
                                <div className="forecast">
                                    {getDailyForecast().map((day, index) => (
                                        <div key={index} className="forecast-day">
                                            <div className="forecast-date">
                                                {formatDate(day.dt)}
                                            </div>
                                            <img
                                                src={getWeatherIcon(day.weather[0].icon)}
                                                alt={day.weather[0].description}
                                            />
                                            <div className="forecast-temp">
                                                {formatTemperature(day.main.temp)}
                                            </div>
                                            <div className="forecast-desc small">
                                                {day.weather[0].main}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {!weatherData && !loading && !error && (
                        <div className="weather-card placeholder">
                            <div className="weather-placeholder">
                                <div style={{ fontSize: '48px' }}>🌤</div>
                                <p>Enter a city name to see current weather and forecast</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="weather-right">
                    <div
                        className="weather-image"
                        style={{
                            backgroundImage: weatherData ?
                                `url(${getWeatherBackground(weatherData.weather[0].main)})` :
                                'none',
                            backgroundColor: weatherData ? 'transparent' : '#f0f6f0'
                        }}
                    >
                        {!weatherData ? (
                            <div className="weather-placeholder">
                                <div style={{ fontSize: '48px' }}>🌤</div>
                                <div className="small">Search to see dynamic weather images</div>
                            </div>
                        ) : (
                            <div className="weather-image-overlay">
                                <h3>Current Conditions</h3>
                                <p>{weatherData.weather[0].description}</p>
                            </div>
                        )}
                    </div>

                    <div className="weather-card monthly-summary">
                        <h4>Weather Summary</h4>
                        {weatherData ? (
                            <div>
                                <p className="small">
                                    <strong>Sunrise:</strong> {formatTime(weatherData.sys.sunrise)}
                                </p>
                                <p className="small">
                                    <strong>Sunset:</strong> {formatTime(weatherData.sys.sunset)}
                                </p>
                                <p className="small">
                                    <strong>Cloudiness:</strong> {weatherData.clouds.all}%
                                </p>
                                {weatherData.rain && (
                                    <p className="small">
                                        <strong>Rain (1h):</strong> {weatherData.rain['1h']} mm
                                    </p>
                                )}
                                {weatherData.snow && (
                                    <p className="small">
                                        <strong>Snow (1h):</strong> {weatherData.snow['1h']} mm
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="small">Weather data will appear here after search</p>
                        )}
                    </div>
                </div>
            </div>
        </section>

    );
};

export default Weather;