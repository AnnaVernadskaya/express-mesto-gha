const User = require('../models/user');
const {
  ERROR_BED_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER)
      .send({ message: 'Ошибка по умолчанию' }));
};

const getUserById = (req, res) => {
  User.findById({ _id: req.params.userId })
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные id' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(ERROR_BED_REQUEST).send({ message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Пользователь не найден') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
