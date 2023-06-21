require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { login, createUser, logout } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { validateSignin } = require('./middlewares/errorsValidation');
const { validateSignup } = require('./middlewares/errorsValidation');
const { errorInternalServer } = require('./middlewares/errorsValidation');
const ErrorNotFound = require('./errors/errorNotFound');

const { PORT = 3000 } = process.env;
const { MONGO_DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);
app.post('/signout', auth, logout);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', auth, (req, res, next) => next(new ErrorNotFound('Файл не найден')));

app.use(errors());
app.use(errorInternalServer);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
