const { UniqueConstraintError: SeqUniqueConstraintError } = require('sequelize');

class BaseError extends Error {
  constructor(msg) {
    super();
    this.msg = msg;
    this.errno = -1;
  }

  toObject() {
    return { errno: this.errno, errmsg: this.msg };
  }
}

class AuthError extends BaseError {
  constructor(msg) {
    super(msg);
    this.errno = -403;
  }
}

class ValidateError extends BaseError {
  constructor(msg) {
    super(msg);
    this.errno = -400;
  }
}

module.exports = {
  BaseError,
  UniqueConstraintError: SeqUniqueConstraintError,
  ValidateError,
  AuthError
}
