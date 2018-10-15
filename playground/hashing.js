const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// jwt.sign(): takes 1st arg the object (ex: data: {id:4}) and 2nd arg is the 'salt' and signs it. Creates the hash and returns the token value as a object.
// jwt.verify() takes the token and secret and decodes it to verify that data has not been manipualted.
var data = {
  id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

// Hashing is  way to hide plain text passwords in databases
// return value of SHA256(message) is a object, so we have to use toString()
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// Data sending from server back to client
// var data = {
//   id: 4
// };
// // this token variable will be sent back to the client (AKA jwt.sign())
// // We now need to 'Salt' the hash (Add a "secret" to the hash to change its hash value)... Otherwise the user/client might be able to change data.id property to something else and then rehash it, which would be a flaw
// var token = {
//   // data:data
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // This is where a client might try to manipulate data to login someone's account
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// // Validate that the token is not manipulated: (AKA jwt.verify())
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
