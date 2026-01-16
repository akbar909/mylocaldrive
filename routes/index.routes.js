const express = require("express");
const router = express.Router({ mergeParams: true });
const dashboardController = require('../controllers/dashboard.controller');
const profileController = require('../controllers/profile.controller');
const fileController = require('../controllers/file.controller');

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
router.get('/dashboard', dashboardController.getDashboard);

// Profile page routes
router.get('/profile', profileController.getProfile);
router.get('/profile/edit-name', profileController.getEditProfileName);
router.post('/profile/edit-name', profileController.updateProfileName);
router.get('/profile/change-password', profileController.getChangePassword);
router.post('/profile/change-password', profileController.changePassword);
router.get('/profile/security', profileController.getSecuritySettings);

// Files management routes
router.get('/files', fileController.getFiles);
router.post('/files/upload', fileController.uploadSingleFile);
router.get('/files/:fileId', fileController.downloadFile);
router.delete('/files/:fileId', fileController.deleteFile);
router.put('/files/:fileId/rename', fileController.renameFile);
router.post('/files/:fileId/share', fileController.shareFile);

module.exports = router;
