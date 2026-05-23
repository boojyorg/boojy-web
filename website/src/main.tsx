import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../public/css/shared.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.DEV) {
  const script = document.createElement('script');
  script.src = '/js/dev-tools.js';
  document.body.appendChild(script);
}
