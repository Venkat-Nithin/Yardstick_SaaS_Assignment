const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Member'],
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);