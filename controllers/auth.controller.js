const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');

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
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ 
    username, 
    email, 
    password: hashedPassword,
    firstName: firstName || '',
    lastName: lastName || ''
  });
  
  try {
    await newUser.save();
    return res.redirect('/user/login');
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue || {})[0] || 'username';
      return res.redirect(`/user/register?error=${duplicateField} already exists`);
    }
    console.error('Error registering user:', err);
    return next(err);
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

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getCurrentUser,
  logout,
  checkEmail
};
