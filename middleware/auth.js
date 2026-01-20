const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-change-me"; 

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

function requireAuth(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  
  console.log('🔐 Auth middleware - Token check:', token ? 'token found' : 'no token');

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('🔐 JWT verified. Payload:', payload);
    req.user = { id: payload.sub };
    console.log('🔐 req.user set to:', req.user);
    console.log('🔐 Passing to next handler...');
    return next();
  } catch (err) {
    console.log('❌ JWT verification failed:', err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  signToken,
  requireAuth,
};
