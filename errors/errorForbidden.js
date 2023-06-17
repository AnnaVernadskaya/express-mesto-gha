const { ERROR_FORBIDDEN } = require('../utils/constants');

class ErrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.type = ERROR_FORBIDDEN;
  }
}

module.exports = ErrorForbidden;
