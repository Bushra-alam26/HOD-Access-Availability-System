const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  getMe, 
  updateUser, 
  deleteUser,
  getUsersByRole,
  getLoggedInUsers
} = require('../controllers/userController');
const { protect, isAuthenticated } = require('../middleware/authMiddleware');
const { authorizeHOD, authorizeHODAndFaculty } = require('../middleware/roleMiddleware');

// All routes below require authentication
router.use(protect);

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', getMe);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (HOD only)
router.get('/', authorizeHOD, getAllUsers);

// @route   GET /api/users/role/:role
// @desc    Get users by role
// @access  Private (HOD, Faculty)
router.get('/role/:role', authorizeHODAndFaculty, getUsersByRole);

// @route   GET /api/users/logged-in
// @desc    Get logged in users
// @access  Private (HOD, Faculty)
router.get('/logged-in', authorizeHODAndFaculty, getLoggedInUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Own profile or HOD)
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (HOD only)
router.delete('/:id', authorizeHOD, deleteUser);

module.exports = router;