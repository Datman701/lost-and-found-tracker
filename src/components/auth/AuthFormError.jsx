import React from 'react';

export default function AuthFormError({ error }) {
    if (!error) return null;
    
    return (
        <div className="p-4 text-sm font-medium text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
            {error}
        </div>
    );
} 