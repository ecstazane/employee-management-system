// Helper functions for consistent API responses

export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    ...(typeof data === 'object' && !Array.isArray(data) ? data : { data })
  });
};

export const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message
  });
};
