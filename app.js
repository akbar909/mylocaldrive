
// ========== DEPENDENCIES ==========
// Express framework for building robust web applications
const express = require('express');
const path = require('path');
const app = express();
const regRouter = require('./routes/index.routes');
const engine = require('ejs-mate');
const dotenv = require('dotenv');
// Load environment variables from .env file for secure configuration
dotenv.config();
const connectDB = require('./config/db');
 
// ========== DATABASE CONNECTION ==========
connectDB();

// ========== VIEW ENGINE CONFIGURATION ==========
app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// ========== STATIC FILES & MIDDLEWARE ==========
app.use(express.static(path.join(__dirname, "public")));
// Enable JSON body parsing for API requests
app.use(express.json());
// Parse URL-encoded bodies from form submissions
app.use(express.urlencoded({extended:true}));

// ========== ROUTES ==========
app.use('/user', regRouter);

// ========== EXPORT APP ==========
module.exports = app;
