const {MongoClient, ObjectID} = require('mongodb');

// CHALLENGE : Query documents in 'Users' collection to only display {name: 'Steven'}
MongoClient.connect('mongodb://localhost;27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  const db = client.db('TodoApp');
  console.log('Connected to MongoDB server');

  db.collection('Users').find({
    name: 'Steven'
  }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch Users', err);
  });

  // client.close();
});

// MONGODB .count() method :
// MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
//   if (err) {
//     return console.log('Unable to connect to MongoDB server');
//   }
//
//   const db = client.db('TodoApp');
//   console.log('Connected to MongoDB server');
//
//   // .count() returns a promise if no arguments passed in that returns # of documents in that collection
//   db.collection('Todos').find().count().then((count) => {
//     console.log(`Todos count: ${count}`);
//   }, (err) => {
//     console.log('Unable to fetch todos', err);
//   });

  // client.close();
// });



// MONGODB .find() method :
// MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
//   if (err) {
//     return console.log('Unable to connect to MongoDB server');
//   }
//   console.log('Connected to MongoDB server');
//   const db = client.db('TodoApp');

  // .find() returns a mongodb cursor; which has a bunch of methods on the cursor (MongoDB cursor is a pointer to those documents).
  // .find() finds all documents in 'Todos' collection if no argument specified.. can also call it with arguments, thus what to query for
  // .toArray() is one method of mongoDB cursors and it returns a array as a promise
  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {

  // If we wanted to .find() by passing in the ID of document as a string, it wouldn't work since the _id property is not a string, but an ObjectID..
//   db.collection('Todos').find({
//     _id: new ObjectID('5ba94fa1a23ca71f90efb0e7')
//   }).toArray().then((docs) => {
//     console.log('Todos');
//     console.log(JSON.stringify(docs, undefined, 2));
//   }, (err) => {
//     console.log('Unable to fetch todos', err);
//   });
//
//   client.close();
// });
