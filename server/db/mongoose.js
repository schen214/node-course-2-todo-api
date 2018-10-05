const mongoose = require('mongoose');

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://ubarkandibite:Cha1rzard@ds123173.mlab.com:23173/node-todo-api'
};

mongoose.Promise = global.Promise;
// mongoose.connect(db.mlab || db.localhost, {useNewUrlParser: true});
mongoose.connect(db.localhost || db.mlab, {useNewUrlParser: true}).catch((err) => console.log('Unable to connect'));

// mongoose: mongoose.. ES6 syntax:
module.exports = {mongoose};
