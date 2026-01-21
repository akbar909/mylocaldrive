const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  otpHash: {
    type: String,
    required: true
  },
  verificationToken: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['registration', 'password-reset'],
    required: true
  },
  failedAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedUntil: Date,
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete
  }
});

// Generate 6-char alphanumeric OTP
otpSchema.statics.generateOTP = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
};

// Create OTP (delete old, save new)
otpSchema.statics.createOTP = async function(email, type = 'registration') {
  // Delete old OTPs - no blacklist needed, just delete
  await this.deleteMany({ email: email.toLowerCase(), type });

  const otp = this.generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  await this.create({
    email: email.toLowerCase(),
    otpHash,
    verificationToken,
    type,
    expiresAt: new Date(Date.now() + 3 * 60 * 1000) // 3 min
  });

  return { otp, verificationToken }; // Return both OTP and token
};

// Verify OTP via token from email link (more secure)
otpSchema.statics.verifyOTPByToken = async function(email, token, type) {
  if (!token || !email) {
    return { success: false, message: 'Email and token required' };
  }

  email = email.toLowerCase();
  const otpDoc = await this.findOne({
    email,
    type,
    verificationToken: token,
    expiresAt: { $gt: new Date() }
  });

  if (!otpDoc) {
    return { success: false, message: 'Invalid or expired verification link' };
  }

  // Check lockout
  if (otpDoc.isLocked && otpDoc.lockedUntil > new Date()) {
    const mins = Math.ceil((otpDoc.lockedUntil - new Date()) / 60000);
    return { success: false, message: `Try again in ${mins} minute(s)` };
  }

  // Token verified - delete OTP after successful verification (one-time use)
  await this.deleteOne({ _id: otpDoc._id });
  return { success: true, message: 'Email verified successfully' };
};

// Verify OTP (then delete it) - for manual entry
otpSchema.statics.verifyOTP = async function(email, otp, type) {
  if (!otp || !email) {
    return { success: false, message: 'Email and OTP required' };
  }

  email = email.toLowerCase();
  const otpDoc = await this.findOne({
    email,
    type,
    expiresAt: { $gt: new Date() }
  });

  if (!otpDoc) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  // Check lockout
  if (otpDoc.isLocked && otpDoc.lockedUntil > new Date()) {
    const mins = Math.ceil((otpDoc.lockedUntil - new Date()) / 60000);
    return { success: false, message: `Try again in ${mins} minute(s)` };
  }

  // Verify OTP
  const isMatch = await bcrypt.compare(String(otp).toUpperCase(), otpDoc.otpHash);

  if (isMatch) {
    // Delete OTP after successful verification (one-time use)
    await this.deleteOne({ _id: otpDoc._id });
    return { success: true, message: 'OTP verified' };
  }

  // Failed attempt
  otpDoc.failedAttempts += 1;
  
  if (otpDoc.failedAttempts >= 5) {
    otpDoc.isLocked = true;
    otpDoc.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    await otpDoc.save();
    return { success: false, message: 'Locked 15 minutes. Too many attempts.' };
  }

  await otpDoc.save();
  const left = 5 - otpDoc.failedAttempts;
  return { success: false, message: `Incorrect. ${left} attempts left.` };
};

module.exports = mongoose.model('OTP', otpSchema);
