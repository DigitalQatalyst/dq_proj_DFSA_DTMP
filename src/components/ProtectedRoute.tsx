import {PropsWithChildren, useEffect} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from './Header';

/**
 * Guards routes behind MSAL auth. If unauthenticated, triggers login and
 * renders nothing while redirecting. If you prefer redirecting to home
 * instead of auto-login, set `AUTO_LOGIN` to false below.
 */
const AUTO_LOGIN = true;

export const ProtectedRoute: React.FC<PropsWithChildren> = ({children}) => {
    const {user, isLoading, login} = useAuth();
    const location = useLocation();

    // Not authenticated: either auto-login or redirect to home
    useEffect(() => {
        if (!isLoading && !user && AUTO_LOGIN) {
            // Kick off MSAL redirect sign-in flow
            // MSAL will remember current URL so user returns to the same route
            login();
        }
    }, [isLoading, user, login]);


    // While determining auth state, don't render or redirect
    if (isLoading) {
        return null;
    }

    // If authenticated, render the protected content
    if (user) {
        return <>{children}</>;
    }


    if (AUTO_LOGIN) return null;

    return <Navigate to="/" state={{from: location}} replace/>;
};

export default ProtectedRoute;
