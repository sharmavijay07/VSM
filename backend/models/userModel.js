const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['superadmin', 'subadmin', 'customer'],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
