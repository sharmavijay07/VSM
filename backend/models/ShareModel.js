const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    shareValue: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const Share = mongoose.model('Share', shareSchema);

module.exports = Share;
