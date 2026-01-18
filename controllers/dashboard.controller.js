// Dashboard Controller
const User = require('../models/user.model');
const File = require('../models/file.model');

const formatStorage = (bytes) => {
  if (bytes < 1024) return { storageUsed: bytes.toFixed(2), storageUnit: 'B' };
  if (bytes < 1024 * 1024) return { storageUsed: (bytes / 1024).toFixed(2), storageUnit: 'KB' };
  if (bytes < 1024 * 1024 * 1024) return { storageUsed: (bytes / (1024 * 1024)).toFixed(2), storageUnit: 'MB' };
  return { storageUsed: (bytes / (1024 * 1024 * 1024)).toFixed(2), storageUnit: 'GB' };
};

// Get dashboard page
const getDashboard = async (req, res, next) => {
  try {
    // Fetch user data from database using user ID from JWT token
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).render('errors/error', {
        title: 'User Not Found',
        status: 404,
        message: 'User profile not found'
      });
    }

    // Fetch user's files for recent files section (top 10)
    const files = await File.find({ userId: req.user.id, isDeleted: false })
      .sort({ uploadedAt: -1 })
      .limit(10);

    // Fetch files shared with the user
    const sharedFiles = await File.find({ sharedWith: req.user.id, isDeleted: false })
      .sort({ uploadedAt: -1 })
      .limit(10)
      .populate('userId', 'username firstName lastName');
    
    // Calculate storage stats
    const allFiles = await File.find({ userId: req.user.id, isDeleted: false });
    const totalSize = allFiles.reduce((sum, file) => sum + file.fileSize, 0);
    const { storageUsed, storageUnit } = formatStorage(totalSize);

    res.render('pages/dashboard', { 
      title: "Dashboard - IMEER.ai", 
      isLoggedIn: true,
      user: user,
      files: files,
      sharedFiles,
      fileCount: allFiles.length,
      storageUsed: storageUsed,
      storageUnit: storageUnit
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    return next(err);
  }
};

module.exports = {
  getDashboard
};
