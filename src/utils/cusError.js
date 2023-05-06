export default class CusError extends Error {
  constructor(message, errCode) {
    super(message)

    this.statusCode = errCode
    this.status = errCode.toString()[0] === '4' ? 'Fail⚠️' : 'Error💥'
    this.isOperational = true
  }
}
