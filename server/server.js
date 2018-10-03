var express = require('express');
var bodyParser = require('body-parser');

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

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
