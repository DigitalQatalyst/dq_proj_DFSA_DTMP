import './index.css';
import { AppRouter } from './AppRouter';
import { createRoot } from 'react-dom/client';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './services/auth/msal';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <MsalProvider instance={msalInstance}>
            <AppRouter />
        </MsalProvider>
    );
}