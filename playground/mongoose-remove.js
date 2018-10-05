const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Mongoose Remove Methods :

// .remove(): by passing an empty object it removes all documents inside the collection
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// .findOneAndRemove(): find the first queried document and removes it, returns which doc is removed.
// Todo.findOneAndRemove({_id: '5bb77946d0a4d38b1afb37ce'}).then((todo) => {
//   console.log(todo);
// })

// .findByIdAndRemove(): find by ID and removes it, also returns removed document. If no doc was found, it will return 'null' and still be in success case, so make sure to 'if (!doc) {...}''
Todo.findByIdAndRemove('5bb779f3d0a4d38b1afb3811').then((todo) => {
  console.log(todo);
});

//.findOneAndUpdate() Todo.findOneAndUpdate({_id:'5bb779f3d0a4d38b1afb3811'}).then((doc) => {
//   console.log(doc);
//   doc.text = "Straight!"
//   doc.save((err, doc) => {
//     if (err) {
//       return console.log('ERROR', err)
//   }
//     console.log('SAVED!');
//     console.log(doc);
//   });
// });
