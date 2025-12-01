const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a Student Name'],
        trim: true
    },
    service: {
        type: String,
        required: [true, 'Please add a Course Name (e.g. IELTS, Grammar)']
    },
    value: {
        type: Number,
        required: [true, 'Please add Tuition Amount']
    },
    status: {
        type: String,
        enum: ['Trial', 'Enrolled', 'Paused', 'Graduated'],
        default: 'Trial'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Client', ClientSchema);