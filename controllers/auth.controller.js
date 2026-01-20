const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');
const { sendOTPEmail } = require('../config/email');

// Get registration page
const getRegister = (req, res) => {
  // If user is already logged in, redirect to dashboard
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render('pages/register', {
    title: 'User Registration',
    currentPage: 'register',
    error: req.query.error || null,
  });
};

// Handle registration
const postRegister = async (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const duplicateField = existingUser.username === username ? 'username' : 'email';
      return res.redirect(`/user/register?error=${duplicateField} already exists`);
    }

    // Create OTP and send email
    const { otp } = await OTP.createOTP(email, 'registration');
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔐 DEV OTP (registration):', otp, '→', email);
    }
    await sendOTPEmail(email, otp, 'verification');

    // Store user data temporarily in session or pass via query
    req.session = req.session || {};
    req.session.pendingUser = { username, email, password, firstName: firstName || '', lastName: lastName || '' };

    return res.redirect(`/user/verify-otp?email=${encodeURIComponent(email)}&type=registration`);
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue || {})[0] || 'username';
      return res.redirect(`/user/register?error=${duplicateField} already exists`);
    }
    console.error('Error registering user:', err);
    return res.redirect('/user/register?error=Failed to send verification email');
  }
};

// Get login page
const getLogin = (req, res) => {
  // If user is already logged in, redirect to dashboard
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render('pages/login', { 
    title: 'User Login', 
    currentPage: 'login',
    error: req.query.error || null,
  });
};

// Handle login
const postLogin = async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.redirect('/user/login?error=Invalid username or password');
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.redirect('/user/login?error=Invalid username or password');
    }

    const token = signToken(existingUser._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error logging in:', err);
    return next(err);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return next(err);
  }
};

// Handle logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

// Check if email exists
const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.json({ exists: false });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    return res.json({ exists: !!existingUser });
  } catch (err) {
    console.error('Error checking email:', err);
    return res.status(500).json({ error: 'Error checking email' });
  }
};

// ===== FORGOT PASSWORD & OTP VERIFICATION =====

// Get forgot password page
const getForgotPassword = (req, res) => {
  res.render('pages/forgot-password', {
    title: 'Forgot Password',
    currentPage: 'forgot-password',
    error: req.query.error || null
  });
};

// Handle forgot password request
const postForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.redirect('/user/forgot-password?error=Email not found');
    }

    // Create OTP and send email
    const { otp } = await OTP.createOTP(email, 'password-reset');
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔐 DEV OTP (forgot-password):', otp, '→', email);
    }
    await sendOTPEmail(email, otp, 'password-reset');

    return res.redirect(`/user/verify-otp?email=${encodeURIComponent(email)}&type=password-reset`);
  } catch (err) {
    console.error('Error in forgot password:', err);
    return res.redirect('/user/forgot-password?error=Failed to send OTP. Please try again.');
  }
};

// Get OTP verification page
const getVerifyOTP = (req, res) => {
  const { email, type } = req.query;
  
  if (!email || !type) {
    return res.redirect('/user/login');
  }

  res.render('pages/verify-otp', {
    title: 'Verify OTP',
    currentPage: 'verify-otp',
    email,
    type,
    error: req.query.error || null
  });
};

// Handle OTP verification
const postVerifyOTP = async (req, res) => {
  const { email, otp, type } = req.body;

  try {
    const result = await OTP.verifyOTP(email, otp, type);

    if (!result.success) {
      return res.redirect(`/user/verify-otp?email=${encodeURIComponent(email)}&type=${type}&error=${encodeURIComponent(result.message)}`);
    }

    // If registration OTP, create user and log in
    if (type === 'registration') {
      const pendingUser = req.session?.pendingUser;
      if (!pendingUser) {
        return res.redirect('/user/register?error=Session expired. Please register again.');
      }

      const hashedPassword = bcrypt.hashSync(pendingUser.password, 10);
      const newUser = new User({
        username: pendingUser.username,
        email: pendingUser.email,
        password: hashedPassword,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName
      });

      await newUser.save();
      delete req.session.pendingUser;

      const token = signToken(newUser._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      res.cookie('success', 'Registration successful! Welcome to MyDrive.', { maxAge: 5000 });
      return res.redirect('/dashboard');
    }

    // If password reset OTP, redirect to reset password page
    if (type === 'password-reset') {
      return res.redirect(`/user/reset-password?email=${encodeURIComponent(email)}`);
    }

    return res.redirect('/user/login');
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.redirect(`/user/verify-otp?email=${encodeURIComponent(email)}&type=${type}&error=Verification failed`);
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { email, type } = req.body;

  try {
    const { otp } = await OTP.createOTP(email, type);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔐 DEV OTP (resend:${type}):`, otp, '→', email);
    }
    await sendOTPEmail(email, otp, type === 'registration' ? 'verification' : 'password-reset');

    return res.json({ success: true });
  } catch (err) {
    console.error('Error resending OTP:', err);
    return res.status(500).json({ success: false });
  }
};

// Get reset password page
const getResetPassword = (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.redirect('/user/login');
  }

  res.render('pages/reset-password', {
    title: 'Reset Password',
    currentPage: 'reset-password',
    email,
    error: req.query.error || null
  });
};

// Handle password reset
const postResetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.redirect(`/user/reset-password?email=${encodeURIComponent(email)}&error=Passwords do not match`);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.redirect('/user/login?error=User not found');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.cookie('success', 'Password reset successful! Please login with your new password.', { maxAge: 5000 });
    return res.redirect('/user/login');
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.redirect(`/user/reset-password?email=${encodeURIComponent(email)}&error=Failed to reset password`);
  }
};

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getCurrentUser,
  logout,
  checkEmail,
  getForgotPassword,
  postForgotPassword,
  getVerifyOTP,
  postVerifyOTP,
  resendOTP,
  getResetPassword,
  postResetPassword
};
