const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthError = require('../errors/authorization-error');
const ValueError = require('../errors/value-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Иван',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new ValueError('Email is wrong.');
        } else {
          return value;
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByEmail = (email) => {
  this.findOne({ email })
    .then((user) => user);
};

userSchema.statics.findUserByCredentials = (email, password) => {
  this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Email or password is wrong');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Email or password is wrong');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
