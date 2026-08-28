import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MineSafetyProvider } from './context/MineSafetyContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MineSafetyProvider>
      <App />
    </MineSafetyProvider>
  </React.StrictMode>
);
