const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// HASHING PASSWORD:
var password = '123abc!';

//.genSalt() salts and hashes password, 1st argument is number of rounds you want to use to generate the salt. Some use high rounds intentionally so if one tries to guess password with a list of hashed pws, itll take longer to test each pw. 2nd arg callback
bcrypt.genSalt(10, (err, salt) => {
  // .hash() takes 3 args, 1st is password to hash, 2nd is 'salt', 3rd is callback
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
})

var hashedPassword = '$2a$10$Tcu4P69Z4BSbJd4OqPj9X.KSFcmZB.9NtOTgQPo0R47AUgzUasSHy';

// // .compare(): Comparse if hashed password is same as plain text password. 1st arg is plain password, 2nd is hashed value, 3rd is callback where res is either true/false
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});


// HASHING TOKEN:
// jwt.sign(): takes 1st arg the object (ex: data: {id:4}) and 2nd arg is the 'salt' and signs it. Creates the hash and returns the token value as a object.
// jwt.verify() takes the token and secret and decodes it to verify that data has not been manipualted.
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);


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
