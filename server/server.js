
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

// setting up middleware with a method of body-parser's
// bodyParser.json() will return a function that acts as middleware to send JSON to our express app.. converts JSON to an object
app.use(bodyParser.json());

// Will use POST since we are doing CRUD operations..
// Takes two arguments, 1 is URL and 2nd is callback function
app.post('/todos', (req, res) => {
  // console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  // Status 400 : Bad Request
  todo.save().then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // res.send(todos) will not be ideal since it is sending an array. Wouldn't be able to attach additional properties
    // EX: res.send({todos: todos, code: 'asdf'})
    res.send({todos});
  }).catch((e) => {
    res.status(400).send();
  });
});

// :id creates a dynamic id variable for the parameter entered by user. It is accessible in the req object
app.get('/todos/:id', (req, res) => {
  // req.params is an object with a key  being 'id' and value being w/e user inputs
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// .delete() takes 1st argument the route, and then a callback
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndDelete({_id: id}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => res.status(400).send());
  // Todo.findByIdAndRemove(id).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send();
  //   }
  //
  //   res.send({todo});
  // }).catch((e) => res.status(400).send());
});

// UPDATE Route:
app.patch('/todos/:id', (req, res) => {
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

  // findByIdAndUpdate(): takes the ID as 1st arg (doesnt have to be ObjectID), 2nd arg takes 'update' options (what you are updating), 3rd arg takes an 'options' arg ('new' if set to true: returns the updated doc instead of original doc)
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = {app};
