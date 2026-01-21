require('dotenv').config();
const nodemailer = require('nodemailer');
/////test smpt

/////test smpt/////test smpt

/////test smpt


/////test smpt

/////test smpt



const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log('Testing SMTP connection...');
console.log('User:', process.env.SMTP_USER);
console.log('Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-3) : 'NOT SET');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
    console.error('Full error:', error);
  } else {
    console.log('✓ SMTP Server is ready to send emails');
    
    // Try sending a test email
    const mailOptions = {
      from: `"MyDrive Test" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || 'abbaszameer234@gmail.com',
      subject: 'Test Email from MyDrive',
      text: 'If you receive this, Nodemailer SMTP is working!',
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Send Failed:', err.message);
      } else {
        console.log('✓ Test email sent:', info.messageId);
      }
    });
  }
});

/////test smpt
/////test smpt

