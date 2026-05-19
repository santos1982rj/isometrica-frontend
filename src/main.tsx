import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { QueryProvider } from './core/providers/QueryProvider';

import './styles/tokens.css';
import './styles/animations.css';
import './styles/liquid-glass.css';
import './styles/global.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);