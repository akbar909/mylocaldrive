const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true   ,
        trim: true,
        maxlength: [30, 'Username cannot exceed 30 characters'],
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true    
        , lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
        , trim: true
        , maxlength: [100, 'Email cannot exceed 100 characters'],
        minlength: [5, 'Email must be at least 5 characters long']

    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password cannot exceed 128 characters'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', userSchema);
