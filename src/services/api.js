// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('farmassist_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('farmassist_token');
            localStorage.removeItem('farmassist_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTHENTICATION API ====================
export const authAPI = {
    // Register new user
    register: (userData) =>
        api.post('/auth/register', userData),

    // Login user
    login: (credentials) =>
        api.post('/auth/login', credentials),

    // Get current user profile
    getCurrentUser: () =>
        api.get('/auth/me'),

    // Update user profile
    updateProfile: (userData) =>
        api.put('/auth/profile', userData),

    // Change password
    changePassword: (passwordData) =>
        api.put('/auth/change-password', passwordData),

    // Logout (client-side only)
    logout: () => {
        localStorage.removeItem('farmassist_token');
        localStorage.removeItem('farmassist_user');
    }
};


// Sensor Data API calls
export const sensorAPI = {
    getSensorData: (farmId, params) =>
        api.get(`/sensors/farm/${farmId}`, { params }),

    getCurrentReadings: (farmId) =>
        api.get(`/sensors/farm/${farmId}/summary`),
};

// Weather API calls
export const weatherAPI = {
    getCurrentWeather: (city) =>
        api.get('/weather/current', { params: { city } }),

    getForecast: (lat, lon) =>
        api.get('/weather/forecast', { params: { lat, lon } }),
};

// AI Services API calls
export const aiAPI = {
    analyzePlantHealth: (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return api.post('/ai/plant-health', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getSoilRecommendation: (soilData) =>
        api.post('/ai/soil-recommendation', { soilData }),
};

// Motor Control API calls
export const motorAPI = {
    controlMotor: (farmId, state) =>
        api.post('/motor/control', { farmId, motorState: state }),
};



export const marketAPI = {
    getPrices: (filters) =>
        api.get('/market-prices', { params: filters }),

    getTrends: (cropName, district) =>
        api.get(`/market-prices/trends/${cropName}`, { params: { district } }),

    getBestMarkets: (cropName, limit) =>
        api.get(`/market-prices/best-markets/${cropName}`, { params: { limit } }),

    getCrops: () =>
        api.get('/market-prices/crops'),

    getDistricts: (state) =>
        api.get('/market-prices/districts', { params: { state } }),

    getAlerts: () =>
        api.get('/market-prices/alerts'),

    createAlert: (alertData) =>
        api.post('/market-prices/alerts', alertData),

    updateAlert: (alertId, alertData) =>
        api.put(`/market-prices/alerts/${alertId}`, alertData),

    deleteAlert: (alertId) =>
        api.delete(`/market-prices/alerts/${alertId}`),

    fetchLatest: (state) =>
        api.post('/market-prices/fetch-latest', { state })
};

// ==================== CROP MANAGEMENT API ====================
export const cropAPI = {
  // Get all crops for a farm
  getFarmCrops: (farmId) =>
    api.get(`/crops/farm/${farmId}`),
  
  // Get specific crop details
  getCrop: (cropId) =>
    api.get(`/crops/${cropId}`),
  
  // Add new crop
  addCrop: (cropData) =>
    api.post('/crops', cropData),
  
  // Update crop
  updateCrop: (cropId, cropData) =>
    api.put(`/crops/${cropId}`, cropData),
  
  // Delete crop
  deleteCrop: (cropId) =>
    api.delete(`/crops/${cropId}`),
  
  // Get crop updates
  getCropUpdates: (cropId, params = {}) =>
    api.get(`/crops/${cropId}/updates`, { params }),
  
  // Get farm-wide crop updates
  getFarmUpdates: (farmId, params = {}) =>
    api.get(`/crops/farm/${farmId}/updates`, { params }),
  
  // Mark update as read
  markUpdateRead: (updateId) =>
    api.patch(`/crops/updates/${updateId}/read`),
  
  // Add crop task
  addTask: (cropId, taskData) =>
    api.post(`/crops/${cropId}/tasks`, taskData),
  
  // Update task status
  updateTask: (taskId, taskData) =>
    api.put(`/crops/tasks/${taskId}`, taskData),
  
  // Delete task
  deleteTask: (taskId) =>
    api.delete(`/crops/tasks/${taskId}`),
  
  // Report crop issue
  reportIssue: (cropId, issueData) =>
    api.post(`/crops/${cropId}/issues`, issueData),
  
  // Update crop stage
  updateCropStage: (cropId, stageData) =>
    api.patch(`/crops/${cropId}/stage`, stageData),
  
  // Record harvest
  recordHarvest: (cropId, harvestData) =>
    api.post(`/crops/${cropId}/harvest`, harvestData),
  
  // Get crop analytics
  getCropAnalytics: (cropId) =>
    api.get(`/crops/${cropId}/analytics`),
  
  // Generate crop updates (for testing)
  generateUpdates: (farmId) =>
    api.post(`/crops/farm/${farmId}/generate-updates`),
  
  // Get crop health summary
  getCropHealth: (farmId) =>
    api.get(`/crops/farm/${farmId}/health`),
  
  // Upload crop image
  uploadCropImage: (cropId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post(`/crops/${cropId}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

//======Market trends government API======
 export const priceAPI = {
    getCropPrice: (cropName, state = 'Karnataka') => 
        api.get(`/prices/${cropName}?state=${state}`),
    
    getBulkPrices: (crops) => 
        api.get(`/prices/bulk/${crops}`)
};

export default api;
