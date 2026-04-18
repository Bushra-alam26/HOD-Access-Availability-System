const express = require('express');
const router = express.Router();
const { 
  updateAvailability, 
  getAvailability, 
  getAvailabilityByRole,
  getMyAvailability,
  getHODAvailability
} = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeHOD, authorizeFaculty, authorizeHODAndFaculty } = require('../middleware/roleMiddleware');

/**
 * Availability Routes:
 * - PUT /api/availability - Update availability (HOD, Faculty)
 * - GET /api/availability - Get all availability
 * - GET /api/availability/me - Get my availability
 * - GET /api/availability/hod - Get HOD availability (for students)
 * - GET /api/availability/role/:role - Get availability by role
 */

// @route   PUT /api/availability
// @desc    Update or create availability status
// @access  Private (HOD, Faculty)
router.put('/', protect, authorizeHODAndFaculty, updateAvailability);

// @route   GET /api/availability
// @desc    Get all availability statuses
// @access  Public
router.get('/', getAvailability);

// @route   GET /api/availability/me
// @desc    Get my availability
// @access  Private (HOD, Faculty)
router.get('/me', protect, authorizeHODAndFaculty, getMyAvailability);

// @route   GET /api/availability/hod
// @desc    Get HOD availability (for student dashboard)
// @access  Public
router.get('/hod', getHODAvailability);

// @route   GET /api/availability/role/:role
// @desc    Get availability by role
// @access  Public
router.get('/role/:role', getAvailabilityByRole);

module.exports = router;