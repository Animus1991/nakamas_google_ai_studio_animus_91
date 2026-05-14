import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './lib/i18n';

// Suppress unhandled Google Maps script errors in dev overlay
window.addEventListener('error', (e) => {
  if (e.message && (e.message.includes('Google Maps') || e.message.includes('InvalidKeyMapError') || e.message === 'Script error.')) {
    e.preventDefault();
    console.warn('Suppressed global script error:', e.message);
  }
});

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.message && (e.reason.message.includes('Google Maps') || e.reason.message.includes('InvalidKeyMapError'))) {
    e.preventDefault();
    console.warn('Suppressed global rejection:', e.reason.message);
  }
});

(window as any).gm_authFailure = () => {
  console.warn('Google Maps Authentication Failed. API Key may be invalid or restricted.');
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Κάτι πήγε στραβά</h1>
          <pre className="text-xs text-gray-500 max-w-lg overflow-auto">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
