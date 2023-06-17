const { UNAUTHORIZED_ERROR } = require('../utils/constants');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.type = UNAUTHORIZED_ERROR;
  }
}

module.exports = ErrorUnauthorized;
