const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Обязательное для заполнения поле'],
      minlength: [2, 'Минимальное количество символов в поле ввода - 2'],
      maxlength: [30, 'Максимальное количество символов в поле ввода - 30'],
    },
    about: {
      type: String,
      required: [true, 'Обязательное для заполнения поле'],
      minlength: [2, 'Минимальное количество символов в поле ввода - 2'],
      maxlength: [30, 'Максимальное количество символов в поле ввода - 30'],
    },
    avatar: {
      type: String,
      required: [true, 'Обязательное для заполнения поле'],
    },
  },
);

module.exports = mongoose.model('user', userSchema);