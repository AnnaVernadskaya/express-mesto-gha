const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/badRequest');
const ErrorNotFound = require('../errors/errorNotFound');
const ErrorForbidden = require('../errors/errorForbidden');
const { OK_CREATED } = require('../utils/constants');

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
    .orFail(new ErrorNotFound('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ErrorForbidden('Невозможно удалить чужую карточку'));
      }
      return Card
        .deleteOne(card)
        .then(() => res.send({ data: card }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new ErrorNotFound('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new ErrorNotFound('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
