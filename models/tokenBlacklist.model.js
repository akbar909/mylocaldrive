const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  userId: String,
  type: {
    type: String,
    enum: ['refresh'], // Only refresh tokens (can be reused)
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete when expired
  }
});

// Check if token is blacklisted
tokenBlacklistSchema.statics.isBlacklisted = async function(token) {
  const blacklisted = await this.findOne({ token });
  return !!blacklisted;
};

// Add token to blacklist (refresh tokens only)
tokenBlacklistSchema.statics.blacklistToken = async function(token, userId, expiresAt) {
  return await this.create({
    token,
    userId,
    type: 'refresh',
    expiresAt
  });
};

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
