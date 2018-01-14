const mongoose = require('mongoose');
const validator = require('validator');

// {
//     name: 'Marius',
//     document_number: '64700592M',
//     email: 'marius@gmail.com',
//     password: '1234567c',
//     address: 'Avenue of Europe',
//     created_at: '14/01/2018 20:58'
//     tokens: [{
//          access: 'auth',
//          token:  'pjmasdmfasdfkaklsdkfkaskdfaiqwe'
//     }]
// }

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
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE}  is not a valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
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
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});

module.exports = {Customer};