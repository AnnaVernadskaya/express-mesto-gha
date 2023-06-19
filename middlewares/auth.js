const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/errorUnauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorUnauthorized('Пройдите авторизацию'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(new ErrorUnauthorized('Пройдите авторизацию'));
  }

  req.user = payload;

  return next();
};
