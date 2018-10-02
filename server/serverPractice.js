// PRACTICE/LECTURE
// REFACTORED to mongoose.js/todo.js/user.js
// const mongoose = require('mongoose');

// this will use Mongoose built in Promise as opposed to 3rd party Promises
// mongoose.Promise = global.Promise;
// As opposed to MongoClient.connect, Mongoose will wait for the connection to finish, and then run the next line of code. No need for callback function
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

// Create a Mongoose model .. organizes documents in a collection to follow a specified model with specified properties
// mongoose.model() takes 2 args, 1st one is string name of model and 2nd one is object that defines various properties of the model
// Can set up validators for properties
// var Todo = mongoose.model('Todo', {
//   text: {
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   completedAt: {
//     type: Number,
//     default: null
//   }
// });

// We are creating an instance of the model 'Todo', since the code above sets up a constructor function
// Takes an object as argument where we can specify the model's properties
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });

// .save() will save the data to MongoDB and returns a promise
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save Todo');
// });

// CHALLENGE
// var otherTodo = new Todo({text: ' Edit this video  '});
//
// otherTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save todo', e);
// });

// CHALLENGE
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var user = new User({
  email: ' andrew@exmaple.com  '
});

user.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save User', e);
});
