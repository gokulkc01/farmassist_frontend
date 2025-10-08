import React from 'react';

const More = ({ navigateTo }) => {
    return (
        <section className="page active">
            <div className="page-header">
                <h2>More</h2>
                <div>
                    <button onClick={() => navigateTo('home')}>← Back</button>
                </div>
            </div>
            <div className="weather-card">
                <ul>
                    <li data-i18n="more_tip1">Local market prices & demand predictions</li>
                    <li data-i18n="more_tip2">Task reminders (sowing, fertilizing, harvesting)</li>
                    <li data-i18n="more_tip3">Community Q&A and extension officer contacts</li>
                </ul>
            </div>
        </section>
    );
};

export default More;