
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// setting up middleware with a method of body-parser's
// bodyParser.json() will be used  as middleware to parse JSON .. converts JSON to an object
app.use(bodyParser.json());

// Will use POST since we are doing CRUD operations..
// Takes two arguments, 1 is URL and 2nd is callback function
app.post('/todos', authenticate, (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  // Status 400 : Bad Request
  todo.save().then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    // res.send(todos) will not be ideal since it is sending an array. Wouldn't be able to attach additional properties
    // Here we are sending a property named '"todos"' with a value that is an object of arrays ( [{}] )...
    // EX: res.send({todos: todos, code: 'asdf'})
    res.send({todos});
  }).catch((e) => {
    res.status(400).send();
  });
});

// :id creates a dynamic id variable for the parameter entered by user. It is accessible in the req object
app.get('/todos/:id', authenticate, (req, res) => {
  // req.params is an object with a key  being 'id' and value being w/e user inputs
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// .delete() takes 1st argument the route, and then a callback
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => res.status(400).send());
  // Code below 'findByIdAndRemove' is outdated..
  // Todo.findByIdAndRemove(id).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send();
  //   }
  //
  //   res.send({todo});
  // }).catch((e) => res.status(400).send());
});

// UPDATE Route:
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  // Since we do not want the user to be able to update the 'completedAt' property (Program will take care of that once the 'completed' property is set), we will use lodash to help
  // .pick() creates an object composed of the objects properties predicate truthy for.. 1st argument is the source object, and 2nd arg is an array of properties to be picked:
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // Set 'completedAt' once 'completed' is true..
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // findByIdAndUpdate(): takes the ID as 1st arg (doesnt have to be type 'ObjectID'), 2nd arg takes 'update' options (what you are updating), 3rd arg takes an 'options' arg ('new' if set to true: returns the updated doc instead of original doc)
  // Switched to 'findOneAndUpdate' later in the course due to addition of 'authenticate' middleware
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User({
    email: body.email,
    password: body.password
  });
  // shorthand for above: var user = new User(body);

  user.save().then(() => {
    // 'return' the method so that way if any errors, we will 'catch' it
    return user.generateAuthToken();
  }).then((token) => {
    // whenever a header begins with 'x-' it means its a custom header created by/for us and not native to HTTP
    // Send token back as http header so we can get access to it
    res.header('x-auth', token).send(user)
  }).catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  // 'removeToken()' will be an 'instance method' we create on user model..
  req.user.removeToken(req.token).then(() => {
    res.status(200).send('Successfuly removed token');

  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = {app};
