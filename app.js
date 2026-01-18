// ========== LOAD ENVIRONMENT VARIABLES FIRST ==========
const dotenv = require('dotenv');
dotenv.config();

// ========== DEPENDENCIES ==========
const express = require('express');
const path = require('path');
const app = express();
const regRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const engine = require('ejs-mate');
const cookieParser = require('cookie-parser');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// ========== VIEW ENGINE CONFIGURATION ==========
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// ========== STATIC FILES & MIDDLEWARE ==========
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// ========== AUTH STATUS MIDDLEWARE ==========
// Check if user is logged in and pass to all views
app.use(async (req, res, next) => {
  res.locals.isLoggedIn = req.cookies.token ? true : false;
  
  // Flash message system
  res.locals.success = req.cookies.success || null;
  res.locals.error = req.cookies.error || null;
  res.clearCookie('success');
  res.clearCookie('error');
  
  // Helper function to set flash messages
  res.flash = (type, message) => {
    res.cookie(type, message, { maxAge: 5000 }); // 5 seconds
  };
  
  // If logged in, fetch user and pass to views
  if (res.locals.isLoggedIn && req.cookies.token) {
    try {
      const User = require('./models/user.model');
      const decoded = require('jsonwebtoken').decode(req.cookies.token);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id).select('-password');
        res.locals.user = user;
      }
    } catch (err) {
      console.error('Error fetching user for views:', err);
    }
  }
  
  next();
});

// ========== ROUTES ==========
app.use('/', indexRouter);
app.use('/user', regRouter);

// ========== HANDLERS ==========
app.use(notFoundHandler);
app.use(errorHandler);

// ========== EXPORT APP ==========
module.exports = app;
