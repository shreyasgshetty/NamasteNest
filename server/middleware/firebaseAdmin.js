const admin = require('firebase-admin');

// Allowed admin emails — read from env (comma-separated)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

// Initialize Firebase Admin once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized');
    console.log(`🔒 Admin emails allowlist: [${ADMIN_EMAILS.join(', ')}]`);
  } catch (err) {
    console.error('❌ Firebase Admin init failed:', err.message);
  }
}

const verifyAdmin = async (req, res, next) => {
  // Reject immediately if Firebase is not configured
  if (!admin.apps.length) {
    return res.status(503).json({ message: 'Admin auth not available — Firebase not configured on server.' });
  }

  // Require Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized — no token provided.' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    // Check the email is in the allowlist
    const email = (decoded.email || '').toLowerCase();
    if (!ADMIN_EMAILS.includes(email)) {
      console.warn(`🚫 Blocked admin attempt from: ${email}`);
      return res.status(403).json({
        message: `Access denied. Your account (${email}) is not authorized as admin.`,
      });
    }

    req.adminUid   = decoded.uid;
    req.adminEmail = email;
    next();
  } catch (err) {
    console.warn('🚫 Invalid admin token:', err.message);
    res.status(401).json({ message: 'Invalid or expired token. Please sign in again.' });
  }
};

module.exports = { verifyAdmin };
