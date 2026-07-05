const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', statusCode = 400, error = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error })
  });
};

module.exports = {
  successResponse,
  errorResponse
};