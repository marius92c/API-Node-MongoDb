const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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

},
{
    usePushEach: true 
});

// Method to generate token
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abcd1234!').toString();

    user.tokens.push({access,token});

    return user.save().then(() => {
        return token;
    });
};

// Method to return final response
/*UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}*/

UserSchema.statics.findByToken = function (token) {

    var User = this;
    var decodedToken;

    try{
        decodedToken = jwt.verify(token,'abcd1234!');
    }catch(e){
        return Promise.reject();
    }

    return User.findOne({
        '_id': decodedToken._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

}

UserSchema.pre('save',function(next){
    var user = this;

    if ( !user.isModified('password') ) next();

    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
    
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};