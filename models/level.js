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
        required: false
    },
    language: {
        type: String,
        default: 'html'
    },
    htmlContext: {
        type: String,
        default: ''
    },
    cssContext: {
        type: String,
        default: ''
    },
    validationType: {
        type: String,
        enum: ['literal', 'regex', 'dom'],
        default: 'literal'
    },
    validationTests: [
        {
            type: { type: String }, // e.g., 'selectorExists', 'textContentMatch'
            selector: String,
            expected: String,
            attributeName: String,
            propertyName: String,
            message: String
        }
    ],
    order: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Level', levelSchema);
