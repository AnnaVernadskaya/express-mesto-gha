const { Joi, celebrate } = require('celebrate');

const regex = /(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/;

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
    idUser: Joi.string().length(24).hex().required(),
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
  validateSignup,
  validateIdUser,
  validateSignin,
  validateProfile,
  validateAvatar,
  validateIdCard,
  validateFormCard,
};
