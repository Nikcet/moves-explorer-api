const mongoose = require('mongoose');
const linkRegExp = require('../utils/regexp');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Country required'],
  },
  director: {
    type: String,
    required: [true, 'Director required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration required'],
  },
  year: {
    type: String,
    required: [true, 'Year required'],
  },
  description: {
    type: String,
    required: [true, 'Description required'],
  },
  image: {
    type: String,
    validate: {
      validator(value) {
        return linkRegExp.test(value);
      },
      message: (props) => `${props.value} is not valid`,
    },
    required: [true, 'Image required'],
  },
  trailerLink: {
    type: String,
    validate: {
      validator(value) {
        return linkRegExp.test(value);
      },
      message: (props) => `${props.value} is not valid`,
    },
    required: [true, 'Trailer-link required'],
  },
  thumbnail: {
    type: String,
    validate: {
      validator(value) {
        return linkRegExp.test(value);
      },
      message: (props) => `${props.value} is not valid`,
    },
    required: [true, 'Thumbnail required'],
  },
  nameRU: {
    type: String,
    required: [true, 'NameRU required'],
  },
  nameEN: {
    type: String,
    required: [true, 'NameEN required'],
  },
  movieId: {
    type: String,
    required: [true, 'MovieId required'],
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
