// ========== DEPENDENCIES ==========
const express = require('express');
const path = require('path');
const app = express();
const regRouter = require('./routes/index.routes');
const engine = require('ejs-mate');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

// ========== VIEW ENGINE CONFIGURATION ==========
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// ========== STATIC FILES & MIDDLEWARE ==========
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// ========== ROUTES ==========
app.get('/', (req, res) => {
  res.render('pages/home', { title: "IMEER.ai" });
});
app.use('/user', regRouter);

// ========== 404 HANDLER ==========
app.use((req, res, next) => {
  const error = new Error('The page you are looking for does not exist.');
  error.status = 404;
  error.title = 'Page Not Found';
  error.details = 'The requested URL was not found on this server.';
  next(error);
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  try {
    return res.status(status).render('errors/error', {
      title: err.title || 'Something went wrong',
      status,
      message,
      details: err.details,
    });
  } catch (renderErr) {
    // Fallback if rendering fails
    return res.status(status).json({ 
      status, 
      message,
      details: err.details 
    });
  }
});

// ========== EXPORT APP ==========
module.exports = app;
