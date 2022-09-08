const { v4: uuidv4 } = require('uuid');
const Movie = require('../models/movieSchema');
const ValueError = require('../errors/value-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => {
      res.send({ movies });
    })
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const movieId = uuidv4();
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((newMovie) => {
      if (newMovie) {
        res.send(newMovie);
      } else {
        throw new ValueError('Value error');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValueError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(() => {
      throw new NotFoundError('The movie not found by id.');
    })
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        return movie.remove().then(() => res.send({ message: 'The movie deleted.' }));
      }
      throw new BadRequestError('You can delete only your own movies.');
    })
    .catch(next);
};
