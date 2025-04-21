import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/auth/AuthCard';
import SignupForm from '../components/auth/SignupForm';
import AuthFormFooter from '../components/auth/AuthFormFooter';

export default function SignupPage() {
    const { userLoggedIn } = useAuth();

    if (userLoggedIn) {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <AuthCard
            title="Create Account"
            subtitle="Sign up to start tracking your lost and found items"
        >
            <SignupForm />
            <AuthFormFooter
                text="Already have an account?"
                linkText="Sign in"
                linkTo="/login"
            />
        </AuthCard>
    );
}