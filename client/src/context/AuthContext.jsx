import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const FIREBASE_READY =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your-api-key';

// Allowed admin emails — defined in client/.env as VITE_ADMIN_EMAILS (comma-separated)
// This is a UX-level guard only; the real security check is on the server.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email) =>
  ADMIN_EMAILS.length === 0 // if not configured, fall back to server-only check
    ? false
    : ADMIN_EMAILS.includes((email || '').toLowerCase());

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!FIREBASE_READY) {
      setLoading(false);
      return;
    }

    let unsub;
    (async () => {
      const { auth } = await import('../firebase.js');
      const { onAuthStateChanged } = await import('firebase/auth');
      unsub = onAuthStateChanged(auth, u => {
        setUser(u);
        setLoading(false);
      });
    })();
    return () => unsub?.();
  }, []);

  const loginWithGoogle = async () => {
    if (!FIREBASE_READY) {
      throw new Error('Firebase is not configured.');
    }
    const { auth, googleProvider } = await import('../firebase.js');
    const { signInWithPopup } = await import('firebase/auth');
    return signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (!FIREBASE_READY || !user) return;
    const { auth } = await import('../firebase.js');
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setUser(null);
  };

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken?.() ?? null;
  };

  // True only if the signed-in email is in the allowlist
  const isAdmin = user ? isAdminEmail(user.email) : false;

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, getToken, isAdmin, devMode: !FIREBASE_READY }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
