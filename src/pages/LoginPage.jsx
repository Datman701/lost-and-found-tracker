import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doSignInWithEmailAndPassword } from '../utils/auth';
import AuthCard from '../components/auth/AuthCard';
import InputField from '../components/auth/InputField';
import LoadingButton from '../components/auth/LoadingButton';
import AuthFormError from '../components/auth/AuthFormError';
import AuthFormFooter from '../components/auth/AuthFormFooter';

export default function LoginPage() {
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (userLoggedIn) {
        return <Navigate to="/" replace={true} />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await doSignInWithEmailAndPassword(formData.email, formData.password);
            if (success) {
                setUserLoggedIn(true);
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const emailIcon = (
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
    );

    const passwordIcon = (
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
    );

    return (
        <AuthCard
            title="Welcome Back"
            subtitle="Sign in to access your account"
        >
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <AuthFormError error={error} />

                <div className="space-y-5">
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        icon={emailIcon}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        disabled={isLoading}
                        label="Email Address"
                        autoComplete="email"
                        className="text-black"
                    />

                    <InputField
                        id="password"
                        name="password"
                        type="password"
                        icon={passwordIcon}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        disabled={isLoading}
                        label="Password"
                        autoComplete="current-password"
                        className="text-black"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Remember me
                        </label>
                    </div>
                </div>

                <LoadingButton
                    isLoading={isLoading}
                    text="Sign in"
                    loadingText="Signing in..."
                />
            </form>

            <AuthFormFooter
                text="Don't have an account?"
                linkText="Sign up"
                linkTo="/signup"
            />
        </AuthCard>
    );
}