
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
│   └── js/                # Client-side scripts
└── uploads/               # Temporary file uploads
```

## 🎨 Features in Detail

### User Authentication
- Username validation (3-20 characters, alphanumeric + underscore)
- Email validation and OTP verification
- Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
- Secure password encryption with bcrypt
- JWT token-based authentication
- Forgot password with email recovery
- Token blacklisting on logout

### Dashboard (`/dashboard`)
- Personalized welcome message
- Storage statistics (total files, storage used, 1 GB limit)
- Quick action buttons (My Files, My Profile, Upload Files)
- Recent activity overview

### File Management (`/files`)
- Upload files with drag-and-drop support
- File size validation (1 GB max per file)
- Cloudflare R2 cloud storage integration
- File operations:
  - Download files
  - Delete files
  - Rename files
- Storage usage tracking
- File metadata management

### Profile Management (`/profile`)
- View user profile information
- Edit name functionality
- Change password with current password verification
- Delete account option
- User statistics display

### Contact System (`/contact`)
- Contact form with validation
- Email notifications to admin
- Rate limiting to prevent spam
- Flash messages for user feedback

## 📋 API Routes

### Authentication Routes
- `POST /user/register` - User registration
- `POST /user/verify-otp` - Verify email OTP
- `POST /user/login` - User login
- `GET /user/logout` - User logout
- `POST /user/forgot-password` - Request password reset
- `POST /user/reset-password/:token` - Reset password

### Page Routes
- `GET /` - Home page
- `GET /about` - About page
- `GET /features` - Features page
- `GET /contact` - Contact page
- `POST /contact` - Submit contact form

### Dashboard & Profile Routes
- `GET /dashboard` - Dashboard home (protected)
- `GET /profile` - User profile (protected)
- `GET /profile/edit-name` - Edit profile form (protected)
- `POST /profile/edit-name` - Update profile name (protected)
- `GET /profile/change-password` - Change password form (protected)
- `POST /profile/change-password` - Update password (protected)
- `POST /profile/delete-account` - Delete account (protected)

### File Management Routes
- `GET /files` - File management page (protected)
- `POST /files/upload` - Upload files (protected)
- `GET /files/:fileId/download` - Download file (protected)
- `DELETE /files/:fileId` - Delete file (protected)
- `PUT /files/:fileId/rename` - Rename file (protected)

### Statistics Routes
- `GET /api/stats/storage` - Get storage statistics (protected)

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

## 🎨 Color Scheme
- Primary: `#818cf8` (Indigo)
- Background: `#111827` (Dark Charcoal)
- Text Dark: `#f9fafb` (Off-white)
- Text Light: `#d1d5db` (Light Gray)
- Accent: `#06b6d4` (Cyan)
- Danger: `#ef4444` (Red)

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

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure secure MongoDB connection
- [ ] Set up Cloudflare R2 bucket
- [ ] Configure email service (SMTP)
- [ ] Set strong JWT_SECRET and SESSION_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up logging and monitoring
- [ ] Regular database backups
- [ ] Configure rate limits appropriately

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000

## 👨‍💻 Author
IMEER.ai
---

**Note**: This is a full-featured cloud storage application with enterprise-grade security features. Make sure to properly configure all environment variables before deployment.
