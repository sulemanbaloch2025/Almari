const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
