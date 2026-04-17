const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {Object} user - User object containing id and role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      email: user.email 
    },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    {
      expiresIn: '7d'
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };