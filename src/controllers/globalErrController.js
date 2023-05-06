export default (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const status = err.status || 'Error💥'

  // if (process.env.NODE_ENV === 'development')
  res.status(statusCode).json({
    status,
    statusCode,
    err,
    message: err.message,
  })
}
