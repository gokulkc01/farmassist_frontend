import React from 'react';

const soilMoisture = ({ navigateTo }) => {
    return (
        <section className="page active">
            <div className="page-header">
                <h2>Soil Moisture level</h2>
                <div>
                    <button onClick={() => navigateTo('home')}>← Back</button>
                </div>
            </div>
            <div className="weather-card">
                <p>Soil moisture monitoring: connect IoT sensors and visualize moisture levels over time.</p>
            </div>
        </section>
    );
};

export default soilMoisture;