import React from 'react';
import InputField from '../auth/InputField';
import LoadingButton from '../auth/LoadingButton';

export default function ProfileSettings({ 
    formData, 
    onChange, 
    onSubmit, 
    isLoading, 
    error 
}) {
    const emailIcon = (
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
    );

    const phoneIcon = (
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Profile Settings
            </h2>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
                <InputField
                    id="email"
                    name="email"
                    type="email"
                    icon={emailIcon}
                    value={formData.email}
                    onChange={onChange}
                    placeholder="your@email.com"
                    disabled={isLoading}
                    label="Email Address"
                    autoComplete="email"
                />

                <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    icon={phoneIcon}
                    value={formData.phoneNumber}
                    onChange={onChange}
                    placeholder="+1 (555) 000-0000"
                    disabled={isLoading}
                    label="Phone Number"
                    autoComplete="tel"
                />

                <LoadingButton
                    isLoading={isLoading}
                    text="Save Changes"
                    loadingText="Saving..."
                />
            </form>
        </div>
    );
} 