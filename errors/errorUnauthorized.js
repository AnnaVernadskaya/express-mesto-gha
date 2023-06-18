const { ERROR_UNAUTHORIZED } = require('../utils/constants');

class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.type = ERROR_UNAUTHORIZED;
  }
}

module.exports = ErrorUnauthorized;
