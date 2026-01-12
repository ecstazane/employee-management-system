import { sendError } from '../utils/response.js';

export const notFound = (req, res, next) => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
