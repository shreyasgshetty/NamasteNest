import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import './AdminLogin.css';

export default function AdminLogin() {
  const { user, isAdmin, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // If already signed in as admin, go straight to dashboard
  useEffect(() => {
    if (user && isAdmin) navigate('/admin');
  }, [user, isAdmin, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigation is handled by the useEffect above after auth state updates.
      // If the user is not an admin, ProtectedRoute will show "Access Denied".
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">🏡</div>
        <h1>Namaste Nest</h1>
        <p className="admin-login__sub">Admin Panel</p>
        <div className="admin-login__divider" />

        <p className="admin-login__desc">
          Sign in with your authorized Google account to manage properties.
        </p>

        <button className="admin-login__btn" onClick={handleLogin}>
          <FcGoogle size={22} />
          Sign in with Google
        </button>

        <p className="admin-login__note">
          🔒 Only the authorized admin account can access this panel.
        </p>
      </div>
    </div>
  );
}
