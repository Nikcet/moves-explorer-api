const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

const linkRegExp = require('../utils/regexp');

const { auth } = require('../middlewares/auth');

router.get('/movies', auth, getMovies);

router.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().min(2).pattern(linkRegExp).required(),
    trailerLink: Joi.string().min(2).pattern(linkRegExp).required(),
    thumbnail: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().length(36),
    owner: Joi.string().length(24).hex(),
  }),
}), postMovie);

router.delete('/movies/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
