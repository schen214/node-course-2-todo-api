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

// .methods is an object where we can create/add any 'instance methods' we like
// toObject() converts a 'document' into a JS object which can then be stored in MongoDB
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


var User = mongoose.model('User', UserSchema);

module.exports = {User}
