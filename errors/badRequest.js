const { ERROR_BED_REQUEST } = require('../utils/constants');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.type = ERROR_BED_REQUEST;
  }
}

module.exports = BadRequest;
