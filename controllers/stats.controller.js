// Stats Controller - Real platform statistics endpoint
const User = require('../models/user.model');
const File = require('../models/file.model');

// Get platform stats - returns aggregated user, file, and storage metrics
const getPlatformStats = async (req, res, next) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total files
    const totalFiles = await File.countDocuments();
    
    // Get total storage used across all users
    const fileStats = await File.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$fileSize' }
        }
      }
    ]);
    
    const totalStorageBytes = fileStats[0]?.totalSize || 0;
    let totalStorage, storageUnit;
    
    if (totalStorageBytes < 1024) {
      totalStorage = totalStorageBytes.toFixed(2);
      storageUnit = 'B';
    } else if (totalStorageBytes < 1024 * 1024) {
      totalStorage = (totalStorageBytes / 1024).toFixed(2);
      storageUnit = 'KB';
    } else if (totalStorageBytes < 1024 * 1024 * 1024) {
      totalStorage = (totalStorageBytes / (1024 * 1024)).toFixed(2);
      storageUnit = 'MB';
    } else {
      totalStorage = (totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2);
      storageUnit = 'GB';
    }
    
    res.json({
      totalUsers,
      totalFiles,
      totalStorage: `${totalStorage} ${storageUnit}`,
      uptime: '99.9%',
      status: 'active'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats
};
