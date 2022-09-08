const User = require('../models/userSchema');
const ValueError = require('../errors/value-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

// Получение пользователя по id
module.exports.getUser = (req, res, next) => {
  const findUser = (id) => {
    User.findById(id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('The user not found by id.');
        }
        res.send({ user });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError(err.message));
        } else {
          next(err);
        }
      });
  };
  if (req.path.endsWith('me')) {
    findUser(req.user._id);
  } else {
    findUser(req.params.id);
  }
};

// Редактирование информации о пользователе
module.exports.updateUser = (req, res, next) => {
  const {
    name = req.params.name,
    email = req.params.email,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('The user not found by id.');
      }
      res.send({
        name: user.name, email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValueError('Validation failed with update user data.'));
      } else {
        next(err);
      }
    });
};
