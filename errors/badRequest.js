const { ERROR_BED_REQUEST } = require('../utils/constants');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BED_REQUEST;
  }
}

module.exports = BadRequest;
