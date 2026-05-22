import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import { QueryProvider } from './core/providers/QueryProvider';
import { ThemeProvider } from './theme/ThemeProvider';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
