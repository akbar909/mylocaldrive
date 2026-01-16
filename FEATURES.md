# IMEER.ai - MyDrive Cloud Storage Application

## Project Structure Overview

### Pages Created (Frontend)

1. **Dashboard** (`/dashboard`)
   - Home page after user login
   - Shows storage statistics (total files, storage used, storage limit)
   - Quick action buttons (My Files, My Profile, Upload Files)
   - Recent files preview section
   - File: `views/pages/dashboard.ejs`

2. **File Management** (`/files`)
   - Main file management interface
   - File upload area (single and multiple file support)
   - Drag-and-drop support
   - Storage usage progress bar
   - Files table/list with actions
   - File actions: Download, Delete, Rename, Share
   - Max file size: 1 GB per file
   - File: `views/pages/files.ejs`

3. **Profile Management** (`/profile`)
   - User profile information display
   - Quick links: Change Password, Security Settings
   - Account actions menu
   - Danger Zone: Delete Account option
   - File: `views/pages/profile.ejs`

4. **Edit Profile Name** (`/profile/edit-name`)
   - Form to edit first and last name
   - POST endpoint: `/profile/edit-name`
   - File: `views/pages/edit-name.ejs`

5. **Change Password** (`/profile/change-password`)
   - Form to change user password
   - Requires current password verification
   - Password strength requirements
   - POST endpoint: `/profile/change-password`
   - File: `views/pages/change-password.ejs`

## Routes Added

### GET Routes
- `/dashboard` - Dashboard home page
- `/profile` - User profile page
- `/profile/edit-name` - Edit profile name form
- `/profile/change-password` - Change password form
- `/profile/security` - Security settings (redirects to profile)
- `/files` - File management page
- `/files/:fileId` - View/Download specific file

### POST Routes
- `/profile/edit-name` - Update profile name
- `/profile/change-password` - Update password
- `/files/upload` - Upload files (single or multiple)
- `/files/:fileId/share` - Share file with others

### DELETE Routes
- `/files/:fileId` - Delete file

### PUT Routes
- `/files/:fileId/rename` - Rename file

## Controllers Created

### Profile Controller (`controllers/profile.controller.js`)
Handles all profile-related operations:
- `getProfile()` - Fetch user profile
- `updateProfileName()` - Update user name
- `changePassword()` - Update password
- `deleteAccount()` - Delete user account permanently

### File Controller (`controllers/file.controller.js`)
Handles all file operations:
- `getFiles()` - Get all user files
- `uploadSingleFile()` - Upload single file
- `uploadMultipleFiles()` - Upload multiple files
- `downloadFile()` - Download/view file
- `deleteFile()` - Delete file
- `renameFile()` - Rename file
- `shareFile()` - Share file with others

## Features to Implement (Backend)

### File Management Features
- [ ] File upload with size validation (1 GB limit)
- [ ] Single and multiple file upload support
- [ ] File storage (local or cloud storage like AWS S3)
- [ ] File download/streaming
- [ ] File deletion
- [ ] File rename functionality
- [ ] File sharing with email
- [ ] Shared file tracking and access control
- [ ] Storage quota management per user

### Profile Features
- [ ] Update user name
- [ ] Change password with current password verification
- [ ] Delete account with all associated data
- [ ] Security settings (sessions, login history)

### Database Models Needed
- User Profile Model (extension of User model)
- File Model (store file metadata)
- File Sharing Model (track shared files)

## Design Features

- **Dark Mode Only**: Clean, professional dark theme
- **Responsive Design**: Works on desktop, tablet, mobile
- **CSS Variables**: Consistent color scheme
- **Storage Progress Bar**: Visual representation of storage usage
- **File Status**: Shows file size, upload date
- **Action Buttons**: Inline file actions (download, delete, rename, share)

## Design Colors & Variables
- Primary Color: `#818cf8` (Indigo)
- Background Light: `#111827` (Dark Charcoal)
- Text Dark: `#f9fafb` (Off-white)
- Text Light: `#d1d5db` (Light Gray)
- Success: `#06b6d4` (Cyan)
- Danger: `#ef4444` (Red)

## Next Steps

1. Implement file upload controller with multer
2. Add file storage configuration (local or AWS S3)
3. Implement database models for profiles and files
4. Add middleware for file size validation
5. Implement file sharing and access control
6. Add error handling and validation
7. Create authentication middleware for protected routes
8. Add email notifications for file sharing
