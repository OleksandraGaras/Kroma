const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    initialCode: {
        type: String,
        required: true
    },
    solutionCode: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'html'
    },
    order: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Level', levelSchema);
