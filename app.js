/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('cors');

const {
  loginRouter,
  userRouter,
  moviesRouter,
} = require('./routes/index');
const { auth } = require('./middlewares/auth');
const { allErrors } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

async function mongoInit() {
  await mongoose.connect(process.env.DB_ADDRESS);
}

mongoInit().catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

app.use('/', loginRouter);
app.use('/', userRouter);
app.use('/', moviesRouter);

app.use(errorLogger);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Not found url'));
});

app.use(errors());

app.use(allErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
