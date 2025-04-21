import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doCreateUserWithEmailAndPassword } from '../../utils/auth';
import InputField from './InputField';
import LoadingButton from './LoadingButton';
import AuthFormError from './AuthFormError';

export default function SignupForm() {
    const navigate = useNavigate();
    const { setUserLoggedIn } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const success = await doCreateUserWithEmailAndPassword(formData.email, formData.password);
            if (success) {
                setUserLoggedIn(true);
                navigate('/');
            } else {
                setError('Failed to create account');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during sign up');
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
                    autoComplete="new-password"
                    className="text-black"
                />

                <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    icon={passwordIcon}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    label="Confirm Password"
                    autoComplete="new-password"
                    className="text-black"
                />
            </div>

            <LoadingButton
                isLoading={isLoading}
                text="Sign up"
                loadingText="Creating account..."
            />
        </form>
    );
} 