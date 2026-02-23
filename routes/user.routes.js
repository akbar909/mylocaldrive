const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { authLimiter, otpVerifyLimiter, otpResendLimiter } = require('../middleware/rateLimiter');
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validation");

// Registration routes
router.get("/register", authController.getRegister);
router.post("/register", authLimiter, registerValidationRules(), validate, authController.postRegister);

// Login routes
router.get("/login", authController.getLogin);
router.post("/login", authLimiter, loginValidationRules(), validate, authController.postLogin);

// Get current user
router.get("/me", requireAuth, authController.getCurrentUser);

// Logout route
router.get("/logout", authController.logout);

// Check if email exists
router.get("/check-email", authController.checkEmail);

// Forgot password routes
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authLimiter, authController.postForgotPassword);

// OTP verification routes
router.get("/verify-otp", authController.getVerifyOTP);
router.get("/verify-otp-link", otpVerifyLimiter, authController.verifyOtpLink);
router.post("/verify-otp", otpVerifyLimiter, authController.postVerifyOTP);
router.post("/resend-otp", otpResendLimiter, authController.resendOTP);

// Reset password routes
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);

module.exports = router;

