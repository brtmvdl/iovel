
const RESPONSES = {
  FORBIDDEN: { statusCode: '403', statusMessage: 'Forbidden' },
  NOT_FOUND: { statusCode: '404', statusMessage: 'Not found' },
}

class ApplicationError extends Error {
  constructor(message, {
    statusCode,
    statusMessage,
  }, extras = {}) {
    super(message)
    this.statusCode = statusCode
    this.statusMessage = statusMessage
    this.extras = extras
  }
}

class ServerError extends ApplicationError {
  constructor(){
    super('Server error', {
      statusCode: 500,
      statusMessage: 'Error'
    })
  }
}

class UserError extends ApplicationError{
}

class DuplicationError extends UserError {
  constructor(extras = {}) {
    super('Can not duplicate this item.', RESPONSES.FORBIDDEN, extras)
  }
}

module.exports = {
  ApplicationError,
  UserError,
  DuplicationError,
  ServerError,
}
