const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// trim: trims all white space before and after
// unique: verifies that email value is not the same as any other email in documents of a collection
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: props => `${props.value} is not a valid email`
    }
  },
  password: {
    type: String,
    required:true,
    minlength: 6
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

// .methods is an object where we can create/override any 'instance methods' we like
// Override the toJSON method so we only return  properties that are needed and hide those that are not needed(ex: email, id);
// toJSON() will automatically be called whenever a object (mongoose model) is converted to a JSON value (stringified)
// toObject() converts a 'document' into a regular JS object
UserSchema.methods.toJSON = function () {
  // var user = this; Used so we wont forget what 'this' is ..
  var userObject = this.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// Used a regular function expression instead of arrow function because we need 'this' to be binded
// 'this' will be variable for each instance of an individual 'user' document
UserSchema.methods.generateAuthToken = function () {
  // var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();

  this.tokens = this.tokens.concat({access, token});

  return this.save().then(() => {
    return token;
  });
};

// .statics is a object, similiar to .methods, with the difference being that every method you add, it becomes a 'model method' instead of 'instance method'
UserSchema.statics.findByToken = function (token) {
  // var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // shorthand for above:
    return Promise.reject('INVALID TOKEN');
  }

  // We HAVE to add  quotes around nested objects in 'key' values
  return this.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  // var User = this;

  return this.findOne({email}).then((user) => {
    // if no user found, the rejected promise will be caught in 'server.js' catch block, along with the 'Promise.reject()' message/argument..
    if (!user) {
      return Promise.reject('Email Invalid, no user found!');
    }

    // Since bcrypt only take callbacks and we'd like to stick with Promises..
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);;
        } else {
        reject()
        }
      });
    });
  });
};

// Using pre/post hooks (mongoose middleware) on the 'save' event so we can hash passwords before saving them to db..
// Have to use 'function' keyword cause of 'this'. additionally, must call next
UserSchema.pre('save', function (next) {
  // var user = this;

  // Will be times where we save document (ex: update email) but never changed the password, this will cause program to rehash a hashed pw which will crash app.
  // Document.prototype.isModified() returns true if its been modified or false if not. can pass in an args to check for change or if no args, it checks whole document
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}
