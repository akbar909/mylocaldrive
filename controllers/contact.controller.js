const User = require('../models/user.model');

const CONTACT_TO = process.env.CONTACT_TO || 'abbaszameer@example.com';
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

// Send contact message
const sendContactMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id;

    // Get user info
    const user = await User.findById(userId).select('email username');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      return res.status(500).json({ error: 'Contact service not configured. Please set WEB3FORMS_ACCESS_KEY.' });
    }

    // Send via Web3Forms
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      to: CONTACT_TO,
      from_name: user.username || 'User',
      from_email: user.email,
      reply_to: user.email,
      subject: `[IMEER Contact] ${subject}`,
      message: `From: ${user.username || 'User'} (Email: ${user.email})\n\n${message}`
    };

    const resp = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();

    if (!data.success) {
      return res.status(502).json({ error: data.message || 'Failed to send message' });
    }

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
