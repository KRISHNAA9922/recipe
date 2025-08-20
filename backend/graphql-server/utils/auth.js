const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const getUserFromToken = async (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return await User.findById(decoded.userId);
  } catch (error) {
    return null;
  }
};

const authMiddleware = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  return await getUserFromToken(token);
};

module.exports = {
  generateToken,
  getUserFromToken,
  authMiddleware,
  JWT_SECRET
};
