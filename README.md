
# 🚀 MyDrive - Cloud Storage Application
A modern, secure cloud storage platform built with Express.js and EJS featuring file management, profile administration, and user authentication.

## ✨ Features

- **User Authentication**: Secure login/registration with OTP verification and JWT tokens
- **File Management**: Upload, download, delete, and rename files with Cloudflare R2 storage
- **Profile Management**: Edit profile, change password, forgot password with email recovery
- **Contact System**: Contact form with email notifications via Nodemailer
- **Security Features**: Rate limiting, input sanitization, token blacklisting, helmet security headers
- **Storage Quota**: 0.5 GB per user with file size validation
- **Email System**: OTP verification and password reset via SMTP
- **Modern UI**: Clean, professional dark theme with responsive design

## 🛠️ Technology Stack
- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating, CSS3, Vanilla JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Storage**: Cloudflare R2 (AWS S3 compatible)
- **Email**: Nodemailer with SMTP
- **Security**: Helmet, bcrypt, JWT, express-rate-limit
- **Validation**: express-validator with custom sanitization middleware

## ▶️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudflare R2 account (or AWS S3)
- SMTP email service (Gmail, SendGrid, etc.)

### Installation Steps
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```
The application will run on `http://localhost:3000`

## 🔒 Security Features
- **Authentication**: JWT-based authentication with httpOnly cookies
- **Password Security**: Bcrypt hashing with salt rounds
- **OTP Verification**: Email-based OTP for registration
- **Rate Limiting**: Request throttling to prevent abuse
- **Input Sanitization**: MongoDB injection and XSS protection
- **Token Blacklisting**: Invalidate tokens on logout
- **Helmet Security**: HTTP headers protection
- **Session Management**: Secure session configuration
- **CORS Protection**: Configured cross-origin resource sharing
- **File Validation**: Type and size validation for uploads

## 📦 Dependencies

### Production
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken@9.0.3 - JWT authentication
- nodemailer@7.0.12 - Email sending

## 👨‍💻 Author
IMEER.ai
---

**Note**: This is a full-featured cloud storage application with enterprise-grade security features. Make sure to properly configure all environment variables before deployment.
