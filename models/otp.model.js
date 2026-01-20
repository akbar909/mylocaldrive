const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['registration', 'password-reset'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Auto-delete when expired
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate secure 6-digit alphanumeric OTP
otpSchema.statics.generateOTP = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
};

// Create and save OTP
otpSchema.statics.createOTP = async function(email, type = 'registration') {
  // Delete any existing unverified OTPs for this email and type
  await this.deleteMany({ email, type, verified: false });

  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const otpDoc = await this.create({
    email,
    otp,
    type,
    expiresAt
  });

  return { otp: otpDoc.otp, expiresAt: otpDoc.expiresAt };
};

// Verify OTP
otpSchema.statics.verifyOTP = async function(email, otp, type) {
  if (!otp) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  const otpDoc = await this.findOne({
    email,
    otp: String(otp).toUpperCase(),
    type,
    verified: false,
    expiresAt: { $gt: new Date() }
  });

  if (!otpDoc) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  // Mark as verified
  otpDoc.verified = true;
  await otpDoc.save();

  return { success: true, message: 'OTP verified successfully' };
};

// Clean up expired OTPs (optional manual cleanup)
otpSchema.statics.cleanupExpired = async function() {
  await this.deleteMany({ expiresAt: { $lt: new Date() } });
};

module.exports = mongoose.model('OTP', otpSchema);
