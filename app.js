
// ========== DEPENDENCIES ==========
const express = require('express');
const path = require('path');
const app = express();
const regRouter = require('./routes/index.routes');
const engine = require('ejs-mate');
const dotenv = require('dotenv');
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
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user', regRouter);


module.exports = app;
