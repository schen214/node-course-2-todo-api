var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      // res.status(401).send()
      // Above code works but a better technique would be:
      // this will allow the catch block to receive the rejection and then sets status to 401 and sends empty body
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    // 401 status means unauthorized/authorization required
    res.status(401).send(e);
  });
};

module.exports = {authenticate};
