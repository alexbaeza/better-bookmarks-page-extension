import { createRoot } from 'react-dom/client';

import { App } from '@/app/app';

import reportWebVitals from './reportWebVitals';

import '@/styles/globals.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}
const root = createRoot(container);
root.render(<App />);

reportWebVitals();
