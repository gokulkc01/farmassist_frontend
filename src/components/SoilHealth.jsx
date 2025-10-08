import React from 'react';

const SoilHealth = ({ navigateTo }) => {
    return (
        <section className="page active">
            <div className="page-header">
                <h2>Soil Health</h2>
                <div>
                    <button onClick={() => navigateTo('home')}>← Back</button>
                </div>
            </div>
            <div className="weather-card">
                <p>Soil health tools: upload soil test result (CSV/photo), get nutrient recommendations (N-P-K), and localized fertilizer suggestions.</p>
            </div>
        </section>
    );
};

export default SoilHealth;