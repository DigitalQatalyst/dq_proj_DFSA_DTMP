import './index.css';
import { AppRouter } from './AppRouter';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<AppRouter />);
}