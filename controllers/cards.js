const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500)
      .send({ message: 'Internal Server Error' }));
};

const createCard = (res, req) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
};

const deleteCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndRemove({ _id })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
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
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const deleteLike = (req, res) => {
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
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'Карточка не найдена') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, deleteLike,
};