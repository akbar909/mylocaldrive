const User = require('../models/user.model');
const { sendContactEmail, sendAcknowledgementEmail } = require('../config/email');

// Send formatted contact email
const sendContactMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User authentication required' });
    }

    // Get user info
    const user = await User.findById(userId).select('email username firstName lastName');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message are required' });
    }

    // Send formatted email via Resend
    const senderName = `${user.firstName || user.username || 'User'} ${user.lastName || ''}`.trim();
    
    await sendContactEmail(user.email, senderName, subject, message);
    // Always attempt acknowledgement but do not block success if it fails
    try {
      await sendAcknowledgementEmail(user.email, subject);
    } catch (ackErr) {
      // Silently fail, non-blocking
    }

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully. Our team will respond shortly.' 
    });
  } catch (err) {
    console.error('Contact message error:', err.message);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to send message. Please try again.' });
  }
};

module.exports = {
  sendContactMessage
};
