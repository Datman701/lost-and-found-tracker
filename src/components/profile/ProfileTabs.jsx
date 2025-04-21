import React from 'react';

export default function ProfileTabs({ activeTab, onTabChange }) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => onTabChange('posted')}
                    className={`${
                        activeTab === 'posted'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Posted Items
                </button>
                <button
                    onClick={() => onTabChange('claimed')}
                    className={`${
                        activeTab === 'claimed'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Claimed Items
                </button>
                <button
                    onClick={() => onTabChange('pending')}
                    className={`${
                        activeTab === 'pending'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Pending Claims
                </button>
            </nav>
        </div>
    );
} 