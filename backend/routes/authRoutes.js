const express = require('express');
const router = express.Router();
const { login, register, logout, getLoggedInUsers, getAllUsers } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Login user or check if new user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', logout);

// @route   GET /api/auth/logged-users
// @desc    Get all logged in users (for HOD)
// @access  Private
router.get('/logged-users', getLoggedInUsers);

// @route   GET /api/auth/users
// @desc    Get all users (for HOD)
// @access  Private
router.get('/users', getAllUsers);

module.exports = router;