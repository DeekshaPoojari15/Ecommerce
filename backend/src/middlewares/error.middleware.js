const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    err.statusCode = 400;
    err.message = message;
  }

  // JWT malformed error
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 400;
    err.message = 'Invalid token';
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 400;
    err.message = 'Token expired';
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
