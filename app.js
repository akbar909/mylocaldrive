
const express = require('express');
const path = require('path');
const app = express();
const regRouter = require('./routes/index.routes');
const engine = require('ejs-mate');

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/user', regRouter);

module.exports = app;
