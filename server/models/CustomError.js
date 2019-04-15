module.exports = class CustomError extends Error {
  constructor(message, status){
    super(message)
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError)
    }
    this.status = status
    this.name = 'CustomError'
  }
}
