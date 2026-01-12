import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return sendError(res, 'User already exists', 400);
  }

  const user = await User.create({ email, password });
  const token = generateToken(user._id);

  sendSuccess(res, {
    token,
    user: { id: user._id, email: user.email }
  }, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide an email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid credentials', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 401);
  }

  const token = generateToken(user._id);
  sendSuccess(res, {
    token,
    user: { id: user._id, email: user.email }
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, {
    user: { id: user._id, email: user.email }
  });
};
