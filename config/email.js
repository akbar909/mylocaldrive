const nodemailer = require('nodemailer');

// SMTP configuration via environment variables (defaults for Zoho)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.zoho.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';

// Create reusable SMTP transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.SMTP_USER || 'noreply@example.com';
const CONTACT_TO = process.env.CONTACT_TO || 'abbaszameer234@gmail.com';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Send OTP email via Nodemailer
const sendOTPEmail = async (email, otp, type = 'verification') => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  const recipient = email;

  const subject = type === 'verification' ? 'Verify Your Email - MyDrive' : 'Reset Your Password - MyDrive';
  const heading = type === 'verification' ? 'Email Verification' : 'Password Reset';
  const message =
    type === 'verification'
      ? 'Welcome to MyDrive! Please verify your email address to complete your registration.'
      : 'We received a request to reset your password. Use the OTP below to proceed.';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1f2937; font-size: 24px; margin: 0 0 20px 0; }
    .content p { color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; }
    .otp-box { background: #f9fafb; border: 2px dashed #818cf8; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; }
    .otp-label { color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .otp-code { font-size: 36px; font-weight: 700; color: #6366f1; letter-spacing: 8px; font-family: 'Courier New', monospace; }
    .verify-btn { display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; transition: background 0.3s; }
    .verify-btn:hover { background: #4f46e5; }
    .expiry { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 25px 0; }
    .expiry p { color: #92400e; margin: 0; font-size: 14px; }
    .footer { background: #1f2937; padding: 25px 30px; text-align: center; }
    .footer p { color: #9ca3af; font-size: 14px; margin: 5px 0; }
    .footer a { color: #818cf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗂️ MyDrive</h1>
    </div>
    <div class="content">
      <h2>${heading}</h2>
      <p>${message}</p>
      
      <div class="otp-box">
        <div class="otp-label">Your OTP Code</div>
        <div class="otp-code">${otp}</div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${APP_URL}/user/verify-otp?email=${encodeURIComponent(email)}&type=${type}" class="verify-btn" style="display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background 0.3s;">
          ✓ Verify Email
        </a>
      </div>

      <div class="expiry">
        <p>⏰ <strong>Important:</strong> This OTP will expire in 5 minutes. Please verify immediately.</p>
      </div>

      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
    </div>
    <div class="footer">
      <p>Powered by <a href="https://imeer.ai" target="_blank">IMEER.ai</a></p>
      <p>&copy; ${new Date().getFullYear()} MyDrive. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailOptions = {
      from: `"MyDrive" <${FROM_EMAIL}>`,
      to: recipient,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

// Send contact form email via Nodemailer
const sendContactEmail = async (email, senderName, subject, message) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  const contactTo = CONTACT_TO;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; }
    .header p { margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; }
    .content { padding: 40px 30px; }
    .sender-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #818cf8; }
    .sender-info p { margin: 5px 0; color: #374151; font-size: 14px; }
    .sender-info strong { color: #1f2937; }
    .subject-box { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    .subject-box h2 { margin: 0 0 10px 0; color: #1e40af; font-size: 20px; }
    .message-box { background: #fafafa; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb; line-height: 1.8; }
    .message-box p { margin: 0; color: #374151; white-space: pre-wrap; word-wrap: break-word; }
    .footer { background: #1f2937; padding: 25px 30px; text-align: center; }
    .footer p { color: #9ca3af; font-size: 14px; margin: 5px 0; }
    .footer a { color: #818cf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Message</h1>
      <p>From MyDrive Contact Form</p>
    </div>
    
    <div class="content">
      <div class="sender-info">
        <p><strong>From:</strong> ${senderName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div class="subject-box">
        <h2>${subject}</h2>
      </div>

      <div class="message-box">
        <p>${message}</p>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        <strong>Reply instructions:</strong> Click the sender's email above to reply directly, or use your email client to respond to ${email}
      </p>
    </div>

    <div class="footer">
      <p>This is an automated message from <strong>MyDrive</strong> contact form</p>
      <p>Powered by <a href="https://imeer.ai" target="_blank">IMEER.ai</a></p>
      <p>&copy; ${new Date().getFullYear()} MyDrive. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const mailOptions = {
      from: `"MyDrive" <${FROM_EMAIL}>`,
      to: contactTo,
      replyTo: email,
      subject: `[MyDrive Contact] ${subject}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Contact email send error:', error);
    throw new Error('Failed to send email');
  }
};

// Optional: send acknowledgement email to the user
const sendAcknowledgementEmail = async (toEmail, subject) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  const htmlContent = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6;">
    <h2 style="color:#1f2937;">Thanks for contacting MyDrive</h2>
    <p>We received your message regarding: <strong>${subject}</strong>.</p>
    <p>Our team will get back to you shortly.</p>
    <p style="color:#6b7280; font-size: 14px;">This is an automated acknowledgement.</p>
  </div>`;

  const mailOptions = {
    from: `"MyDrive" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: `We received your message - MyDrive`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

module.exports = { sendOTPEmail, sendContactEmail, sendAcknowledgementEmail };
