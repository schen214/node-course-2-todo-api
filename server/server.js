const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    // res.send(todos) will not be ideal since it is sending an array. Wouldn't be able to attach additional properties
    // EX: res.send({todos: todos, code: 'asdf'})
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
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

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
