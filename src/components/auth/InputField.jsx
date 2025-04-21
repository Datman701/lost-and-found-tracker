import React from 'react';

export default function InputField({ 
    id, 
    name, 
    type, 
    icon, 
    value, 
    onChange, 
    placeholder, 
    disabled, 
    label,
    autoComplete,
    required = true,
    className = ''
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input
                    id={id}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    required={required}
                    value={value}
                    onChange={onChange}
                    className={`pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                        placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
                        bg-white dark:bg-gray-700
                        text-black ${className}`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
        </div>
    );
} 