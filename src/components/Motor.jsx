// components/Motor.js
import React, { useState } from 'react';
import '../styles/MotorControl.css';

//Your Express server
const API_URL = 'http://localhost:5000/api';

// Safe sensor hook with fallback
const useSafeSensor = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useSensor } = require('../context/SensorContext');
    return useSensor();
  } catch (error) {
    console.warn('❌ SensorContext not available, using mock data:', error);
    return {
      soilMoisture: 15,
      temperature: 28,
      humidity: 72
    };
  }
};

const Motor = () => {
  console.log('🎯 Motor component loading...');
  
  // Use safe sensor hook
  const sensorData = useSafeSensor();
  const soilMoisture = sensorData?.soilMoisture || 15;
  
  console.log('🌱 Sensor data:', sensorData);
  console.log('💧 Soil moisture:', soilMoisture);

  const [motorStatus, setMotorStatus] = useState('off');
  const [ledStatus, setLedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMotorToggle = async (action) => {
    console.log(`🔄 Toggling motor to: ${action}`);
    setIsLoading(true);
    setLedStatus('Sending command...');
    
    try {
      
        // setMotorStatus(action);
        // setIsLoading(false);
        // console.log(`✅ Motor ${action} successful`);

        const response = await fetch(`${API_URL}/led`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({action})
        });

        const data = await response.json();

         if (data.success) {
        setMotorStatus(action);
        setLedStatus(`✅ ${data.message}`);
        console.log('✅ Motor & LED control successful:', data);
        
        if ('speechSynthesis' in window) {
          const speech = new SpeechSynthesisUtterance(
            action === 'on' ? 'Motor started successfully' : 'Motor stopped successfully'
          );
          speech.lang = 'kn-IN';
          window.speechSynthesis.speak(speech);
        }
        } else {
        setLedStatus(`❌ Error: ${data.error}`);
        console.error('❌ LED control failed:', data);
      }
      
    } catch (error) {
      console.error('❌ Motor control error:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setTimeout(() => setLedStatus(''), 3000);
    }
  };

  const getMotorRecommendation = () => {
    if (soilMoisture < 40) return { action: 'on', message: 'Soil is dry. Start irrigation.' };
    if (soilMoisture > 80) return { action: 'off', message: 'Soil is wet enough. Stop irrigation.' };
    return { action: 'hold', message: 'Soil moisture is optimal.' };
  };

  const recommendation = getMotorRecommendation();

  console.log('🎯 Motor component rendering JSX...');

  return (
    <div className="motor-control">
      <h3>🚰 Irrigation Control with LED Feedback</h3>
      
      <div className="motor-status">
        <div className={`status-indicator ${motorStatus}`}>
          Motor is {motorStatus === 'on' ? 'RUNNING' : 'STOPPED'}
        </div>
        
        <div className="soil-moisture">
          Soil Moisture: <strong>{soilMoisture}%</strong>
        </div>
        
        <div className="recommendation">
          💡 {recommendation.message}
        </div>

         {ledStatus && (
          <div className="led-status">
            {ledStatus}
          </div>
        )}
      </div>

      <div className="motor-controls">
        <button 
          className={`btn btn-start ${motorStatus === 'on' ? 'active' : ''}`}
          onClick={() => handleMotorToggle('on')}
          disabled={isLoading || motorStatus === 'on'}
        >
          {isLoading ? '🔄 Starting...' : '🚀 Start Motor and Blink LED'}
        </button>
        
        <button 
          className={`btn btn-stop ${motorStatus === 'off' ? 'active' : ''}`}
          onClick={() => handleMotorToggle('off')}
          disabled={isLoading || motorStatus === 'off'}
        >
          {isLoading ? '🔄 Stopping...' : '🛑 Stop Motor'}
        </button>
      </div>

      <div className="voice-control">
        <h4>🎤 Voice Commands (Kannada)</h4>
        <div className="voice-commands">
          <button className="voice-btn" onClick={() => handleMotorToggle('on')}
             disabled={isLoading || motorStatus === 'on'}>
            "ಮೋಟರ್ ಆನ್ ಮಾಡಿ" (Start Motor)
          </button>
          <button className="voice-btn" onClick={() => handleMotorToggle('off')}
            disabled={isLoading || motorStatus === 'off'}>
            "ಮೋಟರ್ ಆಫ್ ಮಾಡಿ" (Stop Motor)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Motor;