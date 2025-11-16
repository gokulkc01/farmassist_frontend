import React, { useState, useEffect } from 'react';
import { Droplets, Leaf, Cloud, AlertTriangle, TrendingUp, Battery, Thermometer, Wind } from 'lucide-react';

const Analytics = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 28,
    humidity: 65,
    soilMoisture: 45,
    phLevel: 6.8,
    lightIntensity: 45000,
    batteryLevel: 85
  });

  // initialize recommendations with safe defaults so UI can render immediately
  const [recommendations, setRecommendations] = useState({
    watering: {
      action: 'optimal',
      message: 'Soil moisture is perfect',
      priority: 'low',
      icon: '✓'
    },
    fertilizer: {
      action: 'optimal',
      message: 'Soil pH is in healthy range',
      priority: 'low',
      icon: '✓'
    },
    weather: {
      action: 'favorable',
      message: 'Weather conditions are optimal for growth',
      priority: 'low',
      icon: '☀️'
    }
  });

  // Simulate real-time sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: Math.max(15, Math.min(40, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 3)),
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 4)),
        phLevel: Math.max(5.5, Math.min(7.5, prev.phLevel + (Math.random() - 0.5) * 0.2)),
        lightIntensity: Math.max(10000, Math.min(80000, prev.lightIntensity + (Math.random() - 0.5) * 5000)),
        batteryLevel: Math.max(20, prev.batteryLevel - 0.1)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // AI-powered recommendations engine
  useEffect(() => {
    generateRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorData]);

  const generateRecommendations = () => {
    // Watering Insights (using ML-like logic)
    let wateringRec = {
      action: 'optimal',
      message: 'Soil moisture is perfect',
      priority: 'low',
      icon: '✓'
    };

    if (sensorData.soilMoisture < 30) {
      wateringRec = {
        action: 'water_now',
        message: `Critical: Soil moisture at ${sensorData.soilMoisture.toFixed(1)}%. Water immediately with 25-30mm`,
        priority: 'high',
        icon: '🚨',
        ml_confidence: 0.94
      };
    } else if (sensorData.soilMoisture < 40) {
      wateringRec = {
        action: 'water_soon',
        message: `Soil moisture dropping to ${sensorData.soilMoisture.toFixed(1)}%. Plan watering within 12 hours`,
        priority: 'medium',
        icon: '⚠️',
        ml_confidence: 0.87
      };
    } else if (sensorData.soilMoisture > 70) {
      wateringRec = {
        action: 'reduce_water',
        message: `High moisture (${sensorData.soilMoisture.toFixed(1)}%). Risk of root rot. Skip next watering`,
        priority: 'medium',
        icon: '💧',
        ml_confidence: 0.91
      };
    }

    // Fertilizer Insights
    let fertilizerRec = {
      action: 'optimal',
      message: 'Soil pH is in healthy range',
      priority: 'low',
      icon: '✓'
    };

    if (sensorData.phLevel < 6.0) {
      fertilizerRec = {
        action: 'add_lime',
        message: `Acidic soil detected (pH ${sensorData.phLevel.toFixed(1)}). Apply 2kg limestone per 10m²`,
        priority: 'high',
        icon: '🧪',
        nutrients: 'Add calcium carbonate to raise pH',
        ml_confidence: 0.89
      };
    } else if (sensorData.phLevel > 7.3) {
      fertilizerRec = {
        action: 'add_sulfur',
        message: `Alkaline soil (pH ${sensorData.phLevel.toFixed(1)}). Apply sulfur-based fertilizer`,
        priority: 'medium',
        icon: '⚗️',
        nutrients: 'Use elemental sulfur to lower pH',
        ml_confidence: 0.86
      };
    } else if (sensorData.soilMoisture > 40 && sensorData.temperature > 25) {
      fertilizerRec = {
        action: 'fertilize_now',
        message: 'Ideal conditions for fertilization. Apply NPK 10-10-10',
        priority: 'low',
        icon: '🌱',
        nutrients: 'Good nitrogen uptake conditions',
        ml_confidence: 0.92
      };
    }

    // Weather Insights (simulated forecast analysis)
    let weatherRec = {
      action: 'favorable',
      message: 'Weather conditions are optimal for growth',
      priority: 'low',
      icon: '☀️'
    };

    if (sensorData.temperature > 35) {
      weatherRec = {
        action: 'heat_stress',
        message: `Heat stress alert! Temperature ${sensorData.temperature.toFixed(1)}°C. Increase watering by 30%`,
        priority: 'high',
        icon: '🌡️',
        forecast: 'Continue for next 48 hours',
        ml_confidence: 0.95
      };
    } else if (sensorData.temperature < 18) {
      weatherRec = {
        action: 'cold_protection',
        message: `Low temperature (${sensorData.temperature.toFixed(1)}°C). Risk of slow growth. Consider row covers`,
        priority: 'medium',
        icon: '❄️',
        forecast: 'Cold spell expected',
        ml_confidence: 0.88
      };
    } else if (sensorData.humidity > 80 && sensorData.temperature > 25) {
      weatherRec = {
        action: 'disease_risk',
        message: 'High humidity + warm temps = fungal disease risk. Improve ventilation',
        priority: 'medium',
        icon: '🍄',
        forecast: 'Monitor for next 3 days',
        ml_confidence: 0.84
      };
    }

    setRecommendations({
      watering: wateringRec,
      fertilizer: fertilizerRec,
      weather: weatherRec
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Leaf className="text-green-600" size={36} />
                स्मार्ट खेती सहायक | Smart Farming AI
              </h1>
              <p className="text-gray-600 mt-2">आपकी फसल के लिए बुद्धिमान सिफारिशें | Intelligent recommendations for your crops</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Live Monitoring</span>
            </div>
          </div>
        </div>

        {/* Sensor Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="text-orange-500" size={20} />
              <span className="text-sm text-gray-600">तापमान | Temp</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{sensorData.temperature.toFixed(1)}°C</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-blue-500" size={20} />
              <span className="text-sm text-gray-600">नमी | Humidity</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{sensorData.humidity.toFixed(1)}%</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-cyan-600" size={20} />
              <span className="text-sm text-gray-600">मिट्टी की नमी</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{sensorData.soilMoisture.toFixed(1)}%</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="text-green-600" size={20} />
              <span className="text-sm text-gray-600">pH Level</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{sensorData.phLevel.toFixed(1)}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="text-yellow-500" size={20} />
              <span className="text-sm text-gray-600">प्रकाश | Light</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{(sensorData.lightIntensity/1000).toFixed(0)}k</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="text-purple-500" size={20} />
              <span className="text-sm text-gray-600">बैटरी | Battery</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{sensorData.batteryLevel.toFixed(0)}%</p>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            AI सिफारिशें | AI Recommendations
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Watering Insights */}
            <div className={`border-l-4 rounded-xl p-6 shadow-lg ${getPriorityColor(recommendations.watering?.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{recommendations.watering?.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">सिंचाई | Watering</h3>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getPriorityBadge(recommendations.watering?.priority)}`}>
                      {recommendations.watering?.priority?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                <Droplets className="text-blue-600" size={24} />
              </div>
              
              <p className="text-gray-700 mb-3 font-medium">{recommendations.watering?.message}</p>
              
              {recommendations.watering?.ml_confidence && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">AI Confidence:</span>
                    <span className="font-bold text-blue-600">{(recommendations.watering.ml_confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fertilizer Insights */}
            <div className={`border-l-4 rounded-xl p-6 shadow-lg ${getPriorityColor(recommendations.fertilizer?.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{recommendations.fertilizer?.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">उर्वरक | Fertilizer</h3>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getPriorityBadge(recommendations.fertilizer?.priority)}`}>
                      {recommendations.fertilizer?.priority?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                <Leaf className="text-green-600" size={24} />
              </div>

              <p className="text-gray-700 mb-3 font-medium">{recommendations.fertilizer?.message}</p>

              {recommendations.fertilizer?.nutrients && (
                <p className="text-gray-600 text-sm italic mt-2">{recommendations.fertilizer.nutrients}</p>
              )}

              {recommendations.fertilizer?.ml_confidence && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">AI Confidence:</span>
                    <span className="font-bold text-green-600">{(recommendations.fertilizer.ml_confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weather Insights */}
            <div className={`border-l-4 rounded-xl p-6 shadow-lg ${getPriorityColor(recommendations.weather?.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{recommendations.weather?.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">मौसम | Weather</h3>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getPriorityBadge(recommendations.weather?.priority)}`}>
                      {recommendations.weather?.priority?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                <Wind className="text-blue-600" size={24} />
              </div>

              <p className="text-gray-700 mb-3 font-medium">{recommendations.weather?.message}</p>

              {recommendations.weather?.forecast && (
                <p className="text-gray-600 text-sm italic mt-2">{recommendations.weather.forecast}</p>
              )}

              {recommendations.weather?.ml_confidence && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">AI Confidence:</span>
                    <span className="font-bold text-blue-600">{(recommendations.weather.ml_confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;