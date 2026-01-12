import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return sendError(res, 'Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return sendError(res, 'User not found', 401);
    }

    next();
  } catch (error) {
    return sendError(res, 'Not authorized to access this route', 401);
  }
};
