const User = require('../models/user.model');
const { sendContactEmail } = require('../config/email');

// Send formatted contact email
const sendContactMessage = async (req, res, next) => {
  try {
    console.log('✓ Contact endpoint hit. req.user:', req.user);
    console.log('✓ req.body:', req.body);
    
    const { subject, message } = req.body;
    const userId = req.user?.id;

    console.log('✓ userId:', userId);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User authentication required' });
    }

    // Get user info
    const user = await User.findById(userId).select('email username firstName lastName');
    
    console.log('✓ User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message are required' });
    }

    // Send formatted email via Resend
    const senderName = `${user.firstName || user.username || 'User'} ${user.lastName || ''}`.trim();
    console.log('✓ Sending email from:', senderName, 'to abbaszameer234@gmail.com');
    
    await sendContactEmail(user.email, senderName, subject, message);

    console.log('✓ Email sent successfully');

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully. Our team will respond shortly.' 
    });
  } catch (err) {
    console.error('❌ Error sending contact message:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to send message. Please try again.' });
  }
};

module.exports = {
  sendContactMessage
};
