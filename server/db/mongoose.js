//process.env.NODE_ENV is a global node property
// process.env.NODE_ENV === 'production' (ex: Heroku)
// process.env.NODE_ENV === 'test' (ex: mocha)
// process.env.NODE_ENV === 'development' (ex: local)
const mongoose = require('mongoose');

// var db = {
//   // localhost: 'mongodb://localhost:27017/TodoApp',
//   mlab: 'mongodb://ubarkandibite:Cha1rzard@ds123173.mlab.com:23173/node-todo-api'
// };
mongoose.Promise = global.Promise;

// Gets rid of deprecated warnings..
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).catch((e) => console.log('Unable to connect to database'));
// mongoose.connect(db.localhost || db.mlab, {useNewUrlParser: true}).catch((e) => console.log('Unable to connect'));

// mongoose: mongoose.. ES6 syntax:
module.exports = {mongoose};
