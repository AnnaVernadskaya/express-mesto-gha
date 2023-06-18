const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { validateSignin } = require('./middlewares/errorsValidation');
const { validateSignup } = require('./middlewares/errorsValidation');
const { auth } = require('./middlewares/auth');
const { errorInternalServer } = require('./middlewares/errorsValidation');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Файл не найден' }));

app.use(errors());
app.use(errorInternalServer);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
