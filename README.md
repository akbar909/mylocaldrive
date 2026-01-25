
# 🚀 MyDrive - Cloud Storage Application

A modern, secure cloud storage platform built with Express.js and EJS featuring file management, profile administration, and user authentication.

## ✨ Features

- **User Authentication**: Secure login/registration with OTP verification and JWT tokens
- **File Management**: Upload, download, delete, and rename files with Cloudflare R2 storage
- **Profile Management**: Edit profile, change password, forgot password with email recovery
- **Contact System**: Contact form with email notifications via Nodemailer
- **Security Features**: Rate limiting, input sanitization, token blacklisting, helmet security headers
- **Storage Quota**: 1 GB per user with file size validation
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

# Configure environment variables
# Create .env file with the following:
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Start development server
npm run dev

# Start production server
npm start
```

The application will run on `http://localhost:3000`

## Project Structure

```
├── app.js                 # Express application setup
├── server.js              # Server entry point
├── package.json           # Project dependencies
├── config/                # Configuration files
│   ├── db.js              # MongoDB connection
│   ├── email.js           # Email/SMTP setup
│   ├── multer.js          # File upload configuration
│   └── r2.js              # Cloudflare R2 storage
├── routes/                # API routes
│   ├── index.routes.js    # Main routes (pages)
│   └── user.routes.js     # User/auth routes
├── controllers/           # Business logic
│   ├── auth.controller.js # Authentication logic
│   ├── contact.controller.js # Contact form
│   ├── dashboard.controller.js # Dashboard
│   ├── file.controller.js # File operations
│   ├── profile.controller.js # Profile management
│   └── stats.controller.js # Statistics
├── models/                # Data models
│   ├── file.model.js      # File schema
│   ├── otp.model.js       # OTP schema
│   ├── tokenBlacklist.model.js # Blacklisted tokens
│   └── user.model.js      # User schema
├── middleware/            # Custom middleware
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Error handling
│   ├── rateLimiter.js     # Rate limiting
│   ├── sanitize.js        # Input sanitization
│   └── validation.js      # Input validation
├── views/                 # EJS templates
│   ├── layouts/           # Main layout
│   ├── pages/             # Page templates
│   ├── partials/          # Reusable components
│   └── errors/            # Error pages
├── public/                # Static files
│   ├── css/               # Stylesheets
```
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
- express@5.2.1 - Web framework
- mongoose@9.1.2 - MongoDB ODM
- bcryptjs@2.4.3 - Password hashing
- jsonwebtoken@9.0.3 - JWT authentication
- nodemailer@7.0.12 - Email sending
- @aws-sdk/client-s3@3.970.0 - S3-compatible storage
- multer@2.0.2 - File upload handling
- helmet@7.1.0 - Security headers
- express-rate-limit@7.1.5 - Rate limiting
- express-validator@7.3.1 - Input validation
- ejs@3.1.10 - Templating engine

### Development
- nodemon@3.1.11 - Development server with auto-reload

## 👨‍💻 Author
IMEER.ai
---

**Note**: This is a full-featured cloud storage application with enterprise-grade security features. Make sure to properly configure all environment variables before deployment.
