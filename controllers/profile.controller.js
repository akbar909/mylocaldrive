// Profile Controller
// Backend functionality to be implemented

// Get user profile
const getProfile = (req, res) => {
  // TODO: Fetch user profile from database
  res.render('pages/profile');
};

// Update profile name
const updateProfileName = (req, res) => {
  const { firstName, lastName } = req.body;
  // TODO: Validate input
  // TODO: Update user in database
  // TODO: Send success message
  res.redirect('/profile');
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
  updateProfileName,
  changePassword,
  deleteAccount
};
