const jwt = require('jsonwebtoken');
require('dotenv').config();
const ErrorUnauthorized = require('../errors/errorUnauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    next(new ErrorUnauthorized('Пройдите авторизацию'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
