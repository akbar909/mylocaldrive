# MyDrive

MyDrive ek secure cloud storage web app hai jahan user account bana kar apni files upload, manage aur access kar sakta hai.

## Project Overview

Is project ka main goal simple aur practical file management dena hai:

- User register/login system with OTP verification
- Dashboard se file upload, rename, download, delete
- Profile management (name/password update)
- Forgot password + reset flow via email
- Contact form support
- Security middleware (rate limit, sanitize, auth guards)

## Tech Stack

- Node.js + Express.js
- EJS templates + Vanilla JavaScript + CSS
- MongoDB (Mongoose)
- Cloudflare R2 / S3-style object storage
- Nodemailer (SMTP)

## Main Modules (Short)

- `controllers/` - auth, files, profile, dashboard, stats logic
- `routes/` - app routes and user routes
- `models/` - user, file, otp, token blacklist schemas
- `config/` - db, email, multer, r2 config
- `middleware/` - auth, validation, sanitize, error handling, rate limiter
- `views/` + `public/` - UI templates and frontend JS/CSS

## Local Setup

```bash
npm install
npm run dev
```

App local pe run hoga: `http://localhost:3000`

## Environment (Required)

Project run karne ke liye aapko DB, JWT, SMTP, aur storage keys set karni hongi (example: Mongo URI, JWT secret, SMTP creds, R2/S3 creds).

## Live Demo / Deploy Link

Deploy URL: **https://your-deploy-link-here.com**

> Is link ko aap baad mein apne actual deploy URL se replace kar dena.

## Visual Preview

### Screenshot 1
![MyDrive Preview 1](display/up1.png)

### Screenshot 2
![MyDrive Preview 2](display/up2.png)

## Author

IMEER.ai
