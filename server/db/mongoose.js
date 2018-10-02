const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

// mongoose: mongoose.. ES6 syntax:
module.exports = {mongoose};
