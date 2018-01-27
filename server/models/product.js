const mongoose = require('mongoose');

var Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    created_at: {
        type: Date,
        required: false,
    },
    updated_at: {
        type: Date,
        required: false,
    },
    users: [{
        user_id: {
            type: String,
            required: false,
        },
        amount: {
            type: Number,
            required: false,
        }
    }]
});


module.exports = {Product};