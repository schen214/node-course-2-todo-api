const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
// 'this' will be variable for each instance of an individual document
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


  // We have to add  quotes around nested objects in 'key' values
  return this.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'

  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User}
