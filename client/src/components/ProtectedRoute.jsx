import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.2rem' }}>
        Loading...
      </div>
    );
  }

  // Not signed in at all → go to login
  if (!user) return <Navigate to="/admin/login" replace />;

  // Signed in but not an authorized admin → show access denied
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', padding: '24px',
      }}>
        <div style={{
          textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '48px 40px', maxWidth: '440px', width: '100%',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚫</div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '8px' }}>
            Your Google account
          </p>
          <p style={{
            color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600,
            background: 'rgba(200,169,110,0.1)', border: '1px solid var(--border)',
            padding: '8px 16px', borderRadius: '8px', marginBottom: '24px',
          }}>
            {user.email}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '28px' }}>
            is not authorized to access the admin panel. Please sign in with the correct admin account.
          </p>
          <button
            onClick={logout}
            style={{
              background: 'var(--primary)', color: '#1a1209', border: 'none', cursor: 'pointer',
              padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
              width: '100%',
            }}
          >
            Sign Out & Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
}
