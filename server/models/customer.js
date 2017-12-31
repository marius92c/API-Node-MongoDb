const mongoose = require('mongoose');

var Customer = mongoose.model('Customer',{
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    document_number: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    address: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    created_at: {
        type: Date,
        required: true,
    }

});

module.exports = {Customer};