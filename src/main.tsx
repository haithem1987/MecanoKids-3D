import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initServiceWorker } from './utils/pwa';

initServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
