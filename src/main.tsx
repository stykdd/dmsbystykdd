
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple error boundary for production
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application error:", error);
    console.error("Error details:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          maxWidth: '600px', 
          margin: '40px auto', 
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1>Something went wrong</h1>
          <p>The application failed to load properly.</p>
          <div style={{ 
            backgroundColor: '#f8f8f8', 
            padding: '15px', 
            borderRadius: '4px',
            textAlign: 'left',
            overflow: 'auto',
            margin: '20px 0'
          }}>
            <pre>{this.state.error?.toString()}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting application');
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('Root element not found');
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Error: Root element not found</div>';
    return;
  }
  
  try {
    console.log('Creating React root and rendering app');
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ErrorBoundary>
    );
    console.log('App rendered successfully');
  } catch (err) {
    console.error('Error during app initialization:', err);
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Application Error</h2>
        <p>${err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    `;
  }
});
