const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  updateUser,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.get('/users/me', auth, getUser);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = router;
