const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const ValueError = require('../errors/value-error');
const BadRequestError = require('../errors/bad-request-error');

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.findUserByEmail(email)
        .then((user) => {
          if (user) {
            throw new BadRequestError('The same user is exist.');
          } else {
            User.create({
              name, email, password: hash,
            })
              .then((newUser) => {
                if (!newUser) {
                  throw new ValueError('Bad values to create new user.');
                }
                res.send({
                  name, email,
                });
              })
              .catch(next);
          }
        })
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};
