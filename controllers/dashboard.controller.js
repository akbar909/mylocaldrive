// Dashboard Controller
// Backend functionality to be implemented

// Get dashboard page
const getDashboard = (req, res) => {
  // TODO: Fetch user stats (total files, storage used)
  // TODO: Fetch recent files
  // TODO: Calculate storage usage percentage
  res.render('pages/dashboard', { title: "Dashboard - IMEER.ai", isLoggedIn: true });
};

module.exports = {
  getDashboard
};
