
# 🚀 MyDrive - Cloud Storage Application

A modern, secure cloud storage platform built with Express.js and EJS featuring file management, profile administration, and user authentication.

## ✨ Features

- **User Authentication**: Secure login and registration with validation
- **File Management**: Upload, download, delete, rename, and share files
- **Profile Management**: Edit profile, change password, security settings
- **Dark Mode Design**: Clean, professional dark theme with consistent styling
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Storage Quota**: 1 GB per user with single/multiple file uploads
- **Real-time Progress**: Storage usage visualization and file management UI

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating, CSS3, Vanilla JavaScript
- **Database**: MongoDB
- **Validation**: express-validator
- **Styling**: CSS custom properties for theming
- **Version Control**: Git

## ▶️ Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run on `http://localhost:3000`

## 📁 Project Structure

```
├── app.js                 # Express application setup
├── server.js              # Server entry point
├── package.json           # Project dependencies
├── routes/                # API routes
│   ├── index.routes.js    # Main routes (pages)
│   └── user.routes.js     # User/auth routes
├── views/                 # EJS templates
│   ├── layouts/           # Main layout
│   ├── pages/             # Page templates
│   └── partials/          # Reusable components
├── public/                # Static files
│   ├── css/               # Stylesheets
│   └── js/                # Client-side scripts
├── controllers/           # Business logic
│   ├── profile.controller.js
│   └── file.controller.js
├── models/                # Data models
├── middleware/            # Custom middleware
└── config/                # Configuration files
```

## 🎨 Features in Detail

### User Authentication
- Username validation (3-20 characters, alphanumeric + underscore)
- Email validation (valid email format)
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Secure password encryption
- JWT token-based sessions

### Dashboard (`/dashboard`)
- Welcome page after user login
- Storage statistics (total files, storage used, 1 GB limit)
- Quick action buttons (My Files, My Profile, Upload Files)
- Recent files preview section

### File Management (`/files`)
- Upload area with single & multiple file support
- Drag-and-drop upload interface
- Storage usage progress bar (1 GB limit per file)
- File list with inline actions:
  - Download/View file
  - Delete file
  - Rename file
  - Share with others

### Profile Management (`/profile`)
- View user profile information
- Edit name functionality
- Change password with verification
- Security settings access
- Delete account option

## 📋 Routes

### Authentication
- `POST /user/register` - User registration
- `POST /user/login` - User login
- `GET /user/logout` - User logout

### Pages
- `GET /` - Home page
- `GET /about` - About page
- `GET /features` - Features page
- `GET /contact` - Contact page

### Dashboard & User
- `GET /dashboard` - Dashboard home
- `GET /profile` - User profile
- `GET /profile/edit-name` - Edit profile form
- `POST /profile/edit-name` - Update profile name
- `GET /profile/change-password` - Change password form
- `POST /profile/change-password` - Update password

### File Operations
- `GET /files` - File management
- `POST /files/upload` - Upload files
- `GET /files/:fileId` - View/Download file
- `DELETE /files/:fileId` - Delete file
- `PUT /files/:fileId/rename` - Rename file
- `POST /files/:fileId/share` - Share file

## 🎨 Color Scheme
- Primary: `#818cf8` (Indigo)
- Background: `#111827` (Dark Charcoal)
- Text Dark: `#f9fafb` (Off-white)
- Text Light: `#d1d5db` (Light Gray)
- Accent: `#06b6d4` (Cyan)
- Danger: `#ef4444` (Red)

## 🔧 Backend Implementation Roadmap

### Priority 1 - File Management
- [ ] File upload with multer
- [ ] File size validation (1 GB limit)
- [ ] Single/multiple file uploads
- [ ] File storage (local/AWS S3)
- [ ] File download/streaming

### Priority 1 - Profile Features
- [ ] Update profile name
- [ ] Change password
- [ ] Delete account

### Priority 2 - Advanced
- [ ] File sharing system
- [ ] Access control
- [ ] Email notifications
- [ ] Storage quota management

## 👑 Author
IMEER.ai
