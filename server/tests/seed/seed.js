const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}];

// Seed data to be used for beforeEach so taht way we will have some data for our GET /todos request
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  // .remove() similar to mongodb native remove.. by passing it an empty object it will wipe all our current todos collection
  Todo.remove( {} ).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

// 'populateUsers' slightly different from above since we need to call .save() to activate the middleware that hashes our pasword, otherwise test will fail, hence the use of 'Promise.all()'
const populateUsers = (done) => {
  User.remove( {} ).then(() => {
    // userOne & userTwo are now promises due to '.save()' at end
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // Promise.all takes an array of promises and waits for them to resolve so we can then add a '.then()' call for furthur commands.
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
