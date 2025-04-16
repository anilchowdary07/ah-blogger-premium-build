import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure React is available globally
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

// Create root element if it doesn't exist
const createRootElement = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    return newRoot;
  }
  return rootElement;
};

// Initialize the app
const initializeApp = async () => {
  try {
    const rootElement = createRootElement();
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    const rootElement = createRootElement();
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Error Loading Application</h2>
        <p>There was an error loading the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">
          Refresh Page
        </button>
      </div>
    `;
  }
};

// Start the app
initializeApp();
