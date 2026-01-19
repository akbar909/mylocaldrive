const User = require('../models/user.model');
const { sendContactEmail } = require('../config/email');

// Send formatted contact email
const sendContactMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id;

    // Get user info
    const user = await User.findById(userId).select('email username firstName lastName');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    // Send formatted email via Resend
    const senderName = `${user.firstName || user.username || 'User'} ${user.lastName || ''}`.trim();
    await sendContactEmail(user.email, senderName, subject, message);

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully. Our team will respond shortly.' 
    });
  } catch (err) {
    console.error('Error sending contact message:', err);
    next(err);
  }
};

module.exports = {
  sendContactMessage
};
