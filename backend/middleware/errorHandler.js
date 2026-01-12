import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendError(res, 'Resource not found', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return sendError(res, messages.join(', '), 400);
  }

  // Default error
  sendError(res, err.message || 'Server Error', err.statusCode || 500);
};
