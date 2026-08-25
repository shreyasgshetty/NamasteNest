import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', background: '#0d0d0d', color: '#f5f0e8', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: '2.5rem' }}>🏡</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c8a96e', fontSize: '2rem' }}>Namaste Nest</h2>
        <p style={{ color: '#9a9080' }}>Something went wrong. Please refresh the page.</p>
        <button onClick={() => this.setState({ hasError: false })} style={{ background: 'linear-gradient(135deg,#c8a96e,#a8864a)', color: '#000', padding: '11px 28px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
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
