// ES6 Object Destructuring: Allows one to take a property of an object and set taht equal to another variable by wrapping the variable in curly braces and setting it equal to that object... Example:
// var user = {name: 'Andrew', age: 25};
// var {name} = user;

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// creates a new instance of ObjectID and you can set it to the id property of result.ops altho its easier to let Mongo do that for us..
// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  db.collection('Users').insertOne({
    name: 'Steven',
    age: 26,
    location: 'New York'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to create user', err);
    }

    // console.log(JSON.stringify(result.ops, undefined, 2));

    // if no _id was specified for ur document, an object id automatically created.
    // the object _id contains the time when doc was created, machine identifier, proccess id, and a 3byte counter that is a randomly generated value
    console.log(result.ops[0]._id.getTimestamp());
  });

  client.close();
});



// connect() connects to the mongo database. It takes two argument: 1st argument takes a URL as a string or in this case our localhost:27017 **Prefix the URL with mongodb protocol**. 2nd argument is a callbackfunction that handles success or failure of connection. Takes error and client object as arguments. The db property of client is used to read/write data...
// No need to create TodoApp database, connect() connects to a database even if it hasn't existed but doesn't create taht database until you input data to it
// MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
//   if (err) {
//     return console.log('Unable to connect to MongoDB server');
//   }
//   console.log('Connected to MongoDB server');
  // client.db() takes an argument that is the database reference you are looking for
  // const db = client.db('TodoApp');

  // db.collection() takes 1 argument, as a string, the name you want for your collection. No need to run any command to create it, this will do.
  // .collection.insertOne() allows you to insert a new document to your colelction. 2nd argument is callback function that handles either error or result if it succeeded
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }

    // result.ops property holds an array of all the documents that were inserted, in this case:  {text: 'Soemthing to do', completed: false}
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // client.close() closes the connection with MongoDB server
//   client.close();
// });
