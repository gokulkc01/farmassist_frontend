const OWM_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Replace with your real API key

export const weatherAPI = {
    // Get current weather by city name
    async getCurrentWeather(city) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OWM_KEY}`
            );

            if (!response.ok) {
                throw new Error('City not found');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch current weather: ' + error.message);
        }
    },
    // Add this to your existing weatherAPI object
    async getCurrentWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_KEY}`
            );

            if (!response.ok) {
                throw new Error('Weather data not available for this location');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch weather by coordinates: ' + error.message);
        }
    },


    // Get detailed forecast using coordinates
    async getWeatherForecast(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_KEY}`
            );

            if (!response.ok) {
                throw new Error('Forecast data unavailable');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch forecast: ' + error.message);
        }
    },

    // Get one call API (current + daily forecast)
    async getOneCallWeather(lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${OWM_KEY}`
            );

            if (!response.ok) {
                throw new Error('Weather data unavailable');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to fetch weather data: ' + error.message);
        }
    }
};

// Utility function to get weather icon URL
export const getWeatherIcon = (iconCode, size = '2x') => {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

// Utility function to get background image based on weather
export const getWeatherBackground = (weatherMain) => {
    const weatherMap = {
        'Clear': 'sunny',
        'Clouds': 'cloudy',
        'Rain': 'rain',
        'Drizzle': 'rain',
        'Thunderstorm': 'thunderstorm',
        'Snow': 'snow',
        'Mist': 'fog',
        'Fog': 'fog',
        'Haze': 'fog'
    };

    const query = weatherMap[weatherMain] || 'weather';
    return `https://source.unsplash.com/800x600/?${query},landscape,nature`;
};