const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist.model");
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || "dev-change-me";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-dev-change-me";

// Generate access token (short-lived, 1 hour)
function signAccessToken(userId) {
  return jwt.sign({ sub: userId, type: 'access' }, JWT_SECRET, { expiresIn: "1h" });
}

// Generate refresh token (long-lived, 30 days)
function signRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: "30d" });
}

// Generate token ID for tracking
function generateTokenId() {
  return crypto.randomBytes(16).toString('hex');
}

async function requireAuth(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    // Check if it's an API request or page request
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ message: "Missing authentication token" });
    }
    return res.redirect('/');
  }

  try {
    // Verify JWT signature & expiry (access token expires in 1h, no need for blacklist)
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Ensure token is access token (not refresh)
    if (payload.type !== 'access') {
      // Clear invalid token and redirect
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ message: "Invalid token type" });
      }
      return res.redirect('/');
    }

    req.user = { id: payload.sub };
    req.token = token;
    return next();
  } catch (err) {
    // Clear invalid/expired token
    res.clearCookie('token');
    
    if (err.name === 'TokenExpiredError') {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ message: "Token expired. Please refresh." });
      }
      return res.redirect('/');
    }
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.redirect('/');
  }
}

// Refresh expired access token using refresh token
async function refreshAccessToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // Check if refresh token is blacklisted
    const isBlacklisted = await TokenBlacklist.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'strict' });
      return res.status(401).json({ message: "Refresh token expired. Login again." });
    }

    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    
    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const newAccessToken = signAccessToken(payload.sub);
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    return res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  generateTokenId,
  requireAuth,
  refreshAccessToken,
};
