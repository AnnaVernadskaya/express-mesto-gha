const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Обязательное для заполнения поле'],
      minlength: [2, 'Минимальное количество символов в поле ввода - 2'],
      maxlingth: [30, 'Максимальное количество символов в поле ввода - 30'],
    },
    link: {
      type: String,
      required: [true, 'Обязательное для заполнения поле'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Обязательное для заполнения поле'],
      ref: 'user',
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'user',
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model('card', cardSchema);