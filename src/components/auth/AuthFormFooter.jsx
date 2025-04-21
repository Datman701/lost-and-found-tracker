import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthFormFooter({ text, linkText, linkTo }) {
    return (
        <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {text}{' '}
                <Link to={linkTo} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    {linkText}
                </Link>
            </p>
        </div>
    );
} 