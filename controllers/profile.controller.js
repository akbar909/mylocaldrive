// Profile Controller
// Backend functionality to be implemented

// Get user profile
const getProfile = (req, res) => {
  // TODO: Fetch user profile from database
  res.render('pages/profile', { title: "Profile - IMEER.ai", isLoggedIn: true });
};

// Get edit profile name page
const getEditProfileName = (req, res) => {
  res.render('pages/edit-name', { title: "Edit Profile - IMEER.ai", isLoggedIn: true });
};

// Update profile name
const updateProfileName = (req, res) => {
  const { firstName, lastName } = req.body;
  // TODO: Validate input
  // TODO: Update user in database
  // TODO: Send success message
  res.redirect('/profile');
};

// Get change password page
const getChangePassword = (req, res) => {
  res.render('pages/change-password', { title: "Change Password - IMEER.ai", isLoggedIn: true });
};

// Change password
const changePassword = (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  // TODO: Validate passwords
  // TODO: Verify current password
  // TODO: Update password in database
  // TODO: Send success message
  res.redirect('/profile');
};

// Get security settings page
const getSecuritySettings = (req, res) => {
  res.render('pages/profile', { title: "Security Settings - IMEER.ai", isLoggedIn: true });
};

// Delete account
const deleteAccount = (req, res) => {
  // TODO: Verify user password
  // TODO: Delete all user files
  // TODO: Delete user from database
  // TODO: Clear session
  res.redirect('/');
};

module.exports = {
  getProfile,
  getEditProfileName,
  updateProfileName,
  getChangePassword,
  changePassword,
  getSecuritySettings,
  deleteAccount
};
