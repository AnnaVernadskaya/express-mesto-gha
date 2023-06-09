const Card = require('../models/card');
const {
  OK_CREATED,
  ERROR_BED_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER)
      .send({ message: 'Ошибка по умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const user = req.user._id;

  Card.create({ name, link, owner: user })
    .then((card) => res.status(OK_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message).join('; ');
        res.status(ERROR_BED_REQUEST).send({ message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BED_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
