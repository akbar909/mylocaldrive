const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
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
router.post("/verify-otp", authController.postVerifyOTP);
router.post("/resend-otp", authController.resendOTP);

// Reset password routes
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);

module.exports = router;

