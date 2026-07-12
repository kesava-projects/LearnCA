const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // 1. Get token from httpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    // 2. Verify JWT signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    // 3. Fetch user (including sessionToken for single-session check)
    const user = await User.findById(decoded.id).select('+sessionToken');

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    // 4. ── Single-session enforcement ──────────────────────────────────────
    // The JWT carries a sessionToken. If this doesn't match what's in DB,
    // the user logged in from another device/browser and this session is stale.
    if (decoded.sessionToken !== user.sessionToken) {
      return res.status(401).json({
        message: 'You have been logged out because a new session was started on another device.',
        code: 'SESSION_SUPERSEDED',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication error.' });
  }
};

// Admin-only guard (use after protect)
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { protect, adminOnly };
