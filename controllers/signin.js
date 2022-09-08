// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const AuthError = require('../errors/authorization-error');

// Авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      if (!token) {
        throw new AuthError('Authorization failed.');
      }
      res
        .cookie(
          'jwt',
          token,
          {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          },
        );
      res.send({ token });
    })
    .catch(next);
};
