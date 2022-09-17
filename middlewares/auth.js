const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authorization-error');

module.exports.auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new AuthError('Authentication need.'));
  }

  req.user = payload;
  next();
};
