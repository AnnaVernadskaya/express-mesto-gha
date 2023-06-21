const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BadRequest = require('../errors/badRequest');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorConflict = require('../errors/errorConflict');
const User = require('../models/user');
const { OK_CREATED } = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(OK_CREATED).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorConflict('Такой email уже зарегистрирован'));
      } else if (err.code === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new ErrorNotFound('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ email });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(() => {
      res.clearCookie('token', { httpOnly: true }).send({ data: 'Выход успешно осуществлён.' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserInfo,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  logout,
};
