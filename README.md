
# 🚀 MyDrive - User Registration Platform

A modern, responsive web application built with Express.js and EJS featuring user registration with client-side and server-side validation.

## ✨ Features

- **Beautiful Registration Form**: Clean, modern UI with smooth animations
- **Dark/Light Theme**: Toggle between themes with localStorage persistence
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client-Side Validation**: Real-time validation feedback as users type
- **Server-Side Validation**: Secure validation using express-validator
- **Login & Registration**: Auth flows with matching client/server validation
- **Mobile-Friendly Navigation**: Hamburger menu for small screens
- **Professional Layout**: Header, footer, and main content areas

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating, CSS3, Vanilla JavaScript
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
├── views/                 # EJS templates
│   ├── layouts/          # Main layout
│   ├── pages/            # Page templates
│   └── partials/         # Reusable components
├── public/               # Static files
│   ├── css/              # Stylesheets
│   └── js/               # Client-side scripts
├── controllers/          # Business logic
├── models/               # Data models
├── middleware/           # Custom middleware
└── config/               # Configuration files
```

## 🎨 Features in Detail

### User Registration
- Username validation (3-20 characters, alphanumeric + underscore)
- Email validation (valid email format)
- Password strength requirements (8+ chars, uppercase, lowercase, number)

### Theme System
- Toggle between light and dark modes
- Preferences saved to localStorage
- Smooth transitions

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 640px, 768px, 968px
- Hamburger menu for mobile navigation

## 👑 Author
IMEER.ai
