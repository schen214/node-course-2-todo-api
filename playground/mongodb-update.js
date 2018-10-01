const {MongoClient, ObjectID} = require('mongodb');

// CHALLENGE
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  const db = client.db('TodoApp');
  console.log('Connected to MongoDB server');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5bb2562f3027d574f7db504e")
  }, {
    $inc: {
      age: 1
    },
    $set: {
      name: "Steven"
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  client.close();
});

// Update MongoDB documents :
// MongoClient.connect('mongodb://localhost;27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
//   if (err) {
//     return console.log('Unable to connect to MongoDB server');
//   }
//
//   const db = client.db('TodoApp');
//   console.log('Connected to MongoDB server');

  // findOneAndUpdate : finds one document and updates it, returns that updated document
  // Can pass a bunch of arguments. 2nd argument is 'update operators', and 3rd argument takes a bunch of options.
  // In this case, we set 'returnOriginal' to false so that the updated document is returned and not the original doc.. check out mongodb native apis and mongodb update operator
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5bb2969c6061fa97e2066a3f"
  // )}, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then ((result) => {
  //   console.log(result);
  // });

  // client.close();
// });
