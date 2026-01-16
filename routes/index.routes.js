const express = require("express");
const router = express.Router({ mergeParams: true });

// Home page route
router.get('/', (req, res) => {
  res.render('pages/home', { title: "IMEER.ai" });
});

// About page route
router.get('/about', (req, res) => {
  res.render('pages/about', { title: "About Us - IMEER.ai" });
});

// Features page route
router.get('/features', (req, res) => {
  res.render('pages/features', { title: "Features - IMEER.ai" });
});

// Contact page route
router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: "Contact Us - IMEER.ai" });
});

module.exports = router;
