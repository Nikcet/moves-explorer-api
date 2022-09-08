/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authorization-error');

module.exports.auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = req.cookies.jwt;
  // console.log(token);
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    // console.log('С токеном все ок');
  } catch (err) {
    // console.log(err);
    next(new AuthError('Authentication need.'));
  }

  req.user = payload;
  next();
};
