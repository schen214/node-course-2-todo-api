const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// CHALLENGE
User.findById('5bb38936c988a60abc4a54b9').then((todo) => {
  if (!todo) {
    return console.log('Unable to find Users');
  }
  console.log('Todo', todo);
}, (e) => copnsole.log(e));

// var id = '5bb4fabfb0a108283cc83d6b11';

// .isValid() takes the ObjectID and returns true or false for their validity.
// if (!ObjectID.isValid(id)) {
//   return console.log('ID not valid');
// }

// Mongoose .find() returns an array of objects
// Mongoose .find() will query the ObjectID in the backend without the need to call 'new ObjectID'..
// If an invalid ObjectID is being queried, it will  not throw an err, but instead return an empty array
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// .findOne() similar to find() but only the first doc it finds and will return an object instead of an array (recommended)
// If invalid ObjectID is used, it will return null
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// .findById() queries DB based on ID..
// If invalid ObjectID is used, it will return null
// Added a catch statement for invalid ObjectID but using ObjectID.isValid() is better alternative.
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo By ID', todo);
// }).catch((e) => console.log(e));
