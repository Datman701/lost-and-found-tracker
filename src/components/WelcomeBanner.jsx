import React from 'react';

export default function WelcomeBanner() {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-2">
                Welcome to Lost and Found Tracker
            </h1>
            <p className="text-blue-100">
                Help the community reunite with their lost items
            </p>
        </div>
    );
} 