const mongoose = require('mongoose');

// File model schema for storing file metadata and tracking file operations
const FileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true // in bytes
    },
    filePath: {
      type: String,
      required: false,
      default: null
    },
    r2Key: {
      type: String,
      required: false,
      default: null,
      index: true
    },
    bucket: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    isShared: {
      type: Boolean,
      default: false
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    shareCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    shareCodeCreatedAt: {
      type: Date
    },
    tags: {
      type: [String],
      default: [],
      index: true
    }
  },
  { timestamps: true }
);

// Create composite indexes for common queries
FileSchema.index({ userId: 1, isDeleted: 1 }); // For finding user files
FileSchema.index({ userId: 1, uploadedAt: -1 }); // For sorting user files by date
FileSchema.index({ userId: 1, isDeleted: 1, uploadedAt: -1 }); // For paginated queries
FileSchema.index({ shareCode: 1, isDeleted: 1 }); // For public share access

// Delete all files when user is deleted
FileSchema.post('findByIdAndDelete', async function(result) {
  if (result) {
    await this.model('File').deleteMany({ userId: result._id });
  }
});

// Pre-delete hook for cascade delete
FileSchema.pre('deleteMany', async function() {
  const query = this.getFilter();
  if (query.userId) {
    const files = await this.model.find({ userId: query.userId });
    // Files array contains docs to be deleted
  }
});

module.exports = mongoose.model('File', FileSchema);
