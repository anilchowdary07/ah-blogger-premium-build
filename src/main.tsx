import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeServices } from './services/initializeServices';
import './index.css';

// Initialize services before rendering the app
initializeServices()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('Failed to initialize services:', error);
    // You might want to show an error UI here
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <div>
        <h1>Error Initializing Application</h1>
        <p>Please try refreshing the page. If the problem persists, contact support.</p>
      </div>
    );
  });
