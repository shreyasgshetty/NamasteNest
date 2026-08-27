import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import logoImg from './assets/logo.png'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', textAlign: 'center', padding: '24px' }}>
        <img src={logoImg} alt="Namaste Nest" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '2rem' }}>Namaste Nest</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>Something went wrong. Please refresh the page.</p>
        <button onClick={() => this.setState({ hasError: false })} className="btn-primary" style={{ marginTop: '8px' }}>
          Try Again
        </button>
      </div>
    );
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
