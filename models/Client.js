const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a client name'],
        trim: true
    },
    service: {
        type: String,
        required: [true, 'Please add a service (e.g. Personal Training)']
    },
    value: {
        type: Number,
        required: [true, 'Please add a value']
    },
    status: {
        type: String,
        enum: ['New', 'Active', 'Completed', 'Lost'],
        default: 'New'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Client', ClientSchema);