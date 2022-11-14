require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const {
  loginRouter,
  userRouter,
  moviesRouter,
} = require('./routes/index');
const { auth } = require('./middlewares/auth');
const { allErrors } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');
const { allowedUrls } = require('./utils/allowedUrls');

const { PORT = 3000 } = process.env;

const app = express();

async function mongoInit() {
  await mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_ADDRESS : 'mongodb://127.0.0.1:27017/moviesdb');
}

app.use(cors({
  origin(origin, callback) {
    if (allowedUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

mongoInit().catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger);

app.use('/', loginRouter);
app.use('/', userRouter);
app.use('/', moviesRouter);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Not found url'));
});
app.use(errorLogger);

app.use(errors());

app.use(allErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
