const { Joi, celebrate } = require('celebrate');
const { ERROR_INTERNAL_SERVER } = require('../utils/constants');

const regex = /^(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/;

const errorInternalServer = ((err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === 500 ? 'Внутренняя ошибка сервера' : message,
    });

  next();
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    about: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateIdUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
});

const validateIdCard = celebrate({
  params: Joi.object().keys({
    idCard: Joi.string().length(24).hex().required(),
  }),
});

const validateFormCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).required().pattern(regex),
  }),
});

module.exports = {
  errorInternalServer,
  validateSignup,
  validateIdUser,
  validateSignin,
  validateProfile,
  validateAvatar,
  validateIdCard,
  validateFormCard,
};
