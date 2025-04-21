import React from 'react';

export default function StatisticsCard({ count, label, color = "text-blue-600" }) {
    return (
        <div className="card p-6 text-center">
            <h3 className={`text-3xl font-bold ${color} mb-2`}>
                {count}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
                {label}
            </p>
        </div>
    );
} 