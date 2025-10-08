import React from 'react';

const PlantHealth = ({ navigateTo }) => {
    return (
        <section className="page active">
            <div className="page-header">
                <h2>Plant Health</h2>
                <div>
                    <button onClick={() => navigateTo('home')}>← Back</button>
                </div>
            </div>
            <div className="weather-card">
                <p>Plant health: upload photos for pest/disease detection and get treatment suggestions.</p>
            </div>
        </section>
    );
};

export default PlantHealth;