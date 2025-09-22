import './index.css';
import { AppRouter } from './AppRouter';
import { createRoot } from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './services/auth/msal';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    // Ensure MSAL is initialized and redirect response handled before using any APIs
    msalInstance
        .initialize()
        .then(() => msalInstance.handleRedirectPromise())
        .then((result) => {
            if (result?.account) {
                msalInstance.setActiveAccount(result.account);
            } else {
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length === 1) {
                    msalInstance.setActiveAccount(accounts[0]);
                }
            }
            // If this was an explicit Sign Up flow or a brand new account, route to onboarding
            try {
                const isSignupState = typeof result?.state === 'string' && result.state.includes('ej-signup');
                const claims = (result as any)?.idTokenClaims || {};
                const isNewUser = claims?.newUser === true || claims?.newUser === 'true';
                if (isSignupState || isNewUser) {
                    // Navigate to onboarding without adding history entry
                    window.location.replace('/dashboard/onboarding');
                    return;
                }
            } catch {}
            root.render(
                <MsalProvider instance={msalInstance}>
                    <AppRouter />
                </MsalProvider>
            );
        })
        .catch((e) => {
            console.error('MSAL initialization failed:', e);
        });
}
