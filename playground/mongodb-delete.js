const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost;27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  const db = client.db('TodoApp');
  console.log('Connected to MongoDB server');

  // CHALLENGE
  // db.collection('Users').deleteMany({name: 'Steven'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID("5bb28f0e6061fa97e2066649")}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  // deleteMany : deletes documents according to the argument and contains a 'result' obejct: {n: 3, ok: 1}.. n is number of docs deleted
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne : similar to deleteMany except it deletes the first document that matches the argument and then stops. Also contains a 'result' object
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete : Finds only the first doc  and delete that document, also returns the deleted doc.. result.value contains the deleted doc and its properties
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // client.close();
});
