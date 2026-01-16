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

// Dashboard route (after login)
router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard', { title: "Dashboard - IMEER.ai" });
});

// Profile page route
router.get('/profile', (req, res) => {
  res.render('pages/profile', { title: "Profile - IMEER.ai" });
});

// Edit profile name route
router.get('/profile/edit-name', (req, res) => {
  res.render('pages/edit-name', { title: "Edit Profile - IMEER.ai" });
});

// Post edit profile name
router.post('/profile/edit-name', (req, res) => {
  // Backend functionality to be added
  res.redirect('/profile');
});

// Change password route
router.get('/profile/change-password', (req, res) => {
  res.render('pages/change-password', { title: "Change Password - IMEER.ai" });
});

// Post change password
router.post('/profile/change-password', (req, res) => {
  // Backend functionality to be added
  res.redirect('/profile');
});

// Security settings route
router.get('/profile/security', (req, res) => {
  res.render('pages/profile', { title: "Security Settings - IMEER.ai" });
});

// Files management route
router.get('/files', (req, res) => {
  res.render('pages/files', { title: "My Files - IMEER.ai" });
});

// Upload files route
router.post('/files/upload', (req, res) => {
  // Backend file upload functionality to be added
  res.redirect('/files');
});

// View file route
router.get('/files/:fileId', (req, res) => {
  // Backend file download functionality to be added
});

// Delete file route
router.delete('/files/:fileId', (req, res) => {
  // Backend file delete functionality to be added
});

// Edit file name route
router.put('/files/:fileId/rename', (req, res) => {
  // Backend file rename functionality to be added
});

// Share file route
router.post('/files/:fileId/share', (req, res) => {
  // Backend file share functionality to be added
});

module.exports = router;
