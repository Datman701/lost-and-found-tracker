import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionCard({ 
    title, 
    description, 
    icon, 
    buttonText, 
    onClick,
    bgColor = "bg-blue-100",
    textColor = "text-blue-600",
    darkBgColor = "dark:bg-blue-900",
    darkTextColor = "dark:text-blue-300"
}) {
    return (
        <div className="card p-6 flex flex-col items-center text-center">
            <div className={`p-3 ${bgColor} ${darkBgColor} rounded-full mb-4`}>
                {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {description}
            </p>
            <button 
                onClick={onClick}
                className="btn-primary mt-auto"
            >
                {buttonText}
            </button>
        </div>
    );
} 