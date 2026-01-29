# MyDrive Production Checklist ✅

## Security & Auth
- ✅ OTP 5-minute expiration (models/otp.model.js)
- ✅ 6-character alphanumeric OTP (secure random generation)
- ✅ Rate limiting on auth endpoints (5 attempts/15 min)
- ✅ Password strength enforcement (8+ chars, uppercase, lowercase, number)
- ✅ JWT 30-day expiration (middleware/auth.js)
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ HTML escaping on contact emails (escapeHtml helper)
- ✅ HTTPS-only cookies in production (secure flag)
- ✅ SameSite=strict CSRF protection
- ✅ No dev logs in console (removed DEV OTP prints)

## API & Validation
- ✅ Contact form validation (subject + message required)
- ✅ Email format validation
- ✅ Username constraints (3-20 chars, alphanumeric + underscore)
- ✅ File upload rate limiting (30/hour)
- ✅ General API rate limiting (100 req/15 min)
- ✅ Error responses sanitized (no stack traces to client)
- ✅ CORS configured appropriately

## Email & Notifications
- ✅ Contact emails sent to admin with HTML sanitization
- ✅ Acknowledgment email auto-sent to user (non-blocking)
- ✅ OTP emails with 5-minute expiry warning
- ✅ One-click verification link (verifyOtpLink endpoint)
- ✅ Dark-themed email templates matching brand
- ✅ Fallback plain text for email clients

## UI/UX
- ✅ No browser alerts (custom toast notifications)
- ✅ Full-width gradient banner toasts
- ✅ 2-second auto-dismiss for messages
- ✅ Loading spinner on form submission
- ✅ Eye toggle inside password fields
- ✅ Form validation feedback inline

## Environment Variables Required
```
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-connection>
JWT_SECRET=<strong-random-secret>
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<sender-email>
SMTP_PASS=<sender-password>
CONTACT_TO=<admin-email>
APP_URL=<your-production-url>
```

## Before Deployment
1. Set `NODE_ENV=production` in .env
2. Use strong JWT_SECRET (min 32 chars, random)
3. Verify SMTP credentials work
4. Test OTP flow (register → verify → login)
5. Test password reset (email link + manual code)
6. Verify rate limiting works
7. Check all console logs removed (dev mode)
8. Test contact form (acknowledgment should arrive)
9. Enable HTTPS/SSL certificate






