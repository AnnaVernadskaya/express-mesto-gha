const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/badRequest');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden');
const { OK_STATUS, OK_CREATED, ERROR_INTERNAL_SERVER } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const user = req.user._id;

  Card.create({ name, link, owner: user })
    .then((card) => res.status(OK_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const _id = req.params.cardId;

  Card.findById({ _id })
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Переданы некорректные данные');
      } else if (!(req.user._id === card.owner._id.toString())) {
        throw new ErrorForbidden('Невозможно удалить чужую карточку');
      } else {
        card
          .deleteOne()
          .then((cardId) => {
            res.status(OK_STATUS).send({ data: cardId });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('Карточка не найдена'))
    .then((card) => res.status(OK_STATUS).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'Карточка не найдена') {
        next(new ErrorNotFound('Карточка не найдена'));
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'Карточка не найдена') {
        next(new ErrorNotFound('Карточка не найдена'));
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
