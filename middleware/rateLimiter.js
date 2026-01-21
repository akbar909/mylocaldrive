const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
	skip: (req) => {
		// Skip rate limiting for static files
		return req.path.startsWith('/public');
	}
});

// Auth rate limiter: 5 attempts per 15 minutes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: 'Too many login/register attempts, please try again after 15 minutes.',
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true // Don't count successful requests
});

// File upload rate limiter: 30 uploads per hour
const uploadLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 30,
	message: 'Too many file uploads, please try again after an hour.',
	standardHeaders: true,
	legacyHeaders: false
});

// API calls rate limiter: 50 requests per 15 minutes
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 50,
	message: 'Too many API requests, please try again later.',
	standardHeaders: true,
	legacyHeaders: false
});

// OTP verification rate limiter: 3 attempts per 15 minutes (brute force protection)
const otpLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 3,
	message: 'Too many OTP verification attempts, please try again after 15 minutes.',
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => {
		// Try to get email from various sources for rate limiting
		const email = req.body?.email || req.query?.email || req.user?.email;
		return email || req.ip; // Fallback to IP if no email
	}
});

module.exports = {
	generalLimiter,
	authLimiter,
	uploadLimiter,
	apiLimiter,
	otpLimiter
};
