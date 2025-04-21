import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileHeader() {
    const { user } = useAuth();

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                            {user?.email?.[0].toUpperCase()}
                        </span>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user?.email}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Member since {new Date(user?.metadata?.creationTime).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
} 