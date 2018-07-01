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
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

// Method to find user by Token
UserSchema.statics.findByToken = function (token) {

    var user = this;
    var decodedToken;

    try{
        decodedToken = jwt.verify(token,'abcd1234!');
    }catch(e){
        return Promise.reject();
    }

    return user.findOne({
        '_id': decodedToken._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

}

// Method that encrypts the password with Hash before saving it in the database
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

// Method that compares the user's credentials
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

var User = mongoose.model('User',UserSchema);

module.exports = {User};