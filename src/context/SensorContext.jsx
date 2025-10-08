// context/SensorContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const SensorContext = createContext();

export const useSensor = () => {
  const context = useContext(SensorContext);
  
  if (!context) {
    console.error('❌ useSensor must be used within a SensorProvider');
    // Return mock data instead of throwing error
    return {
      soilMoisture: 65,
      temperature: 28,
      humidity: 72,
      loading: false
    };
  }
  
  return context;
};

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({
    soilMoisture: 65,
    temperature: 28,
    humidity: 72,
    loading: false
  });

  // Mock data simulation - replace with real API calls
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        soilMoisture: Math.floor(Math.random() * 30) + 50,
        temperature: Math.floor(Math.random() * 15) + 25,
        humidity: Math.floor(Math.random() * 30) + 60,
        loading: false
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    ...sensorData,
    refreshData: () => console.log('Refresh sensor data')
  };

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  );
};