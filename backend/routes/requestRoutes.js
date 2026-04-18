const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getRequests, 
  getRequestById, 
  updateRequestStatus,
  deleteRequest,
  getRequestStats 
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeHOD, authorizeFaculty, authorizeStudent, authorizeHODAndFaculty } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

/**
 * Request Routes:
 * - POST /api/requests - Create request (Student only)
 * - GET /api/requests - Get all requests (role-based)
 * - GET /api/requests/stats - Get request statistics
 * - GET /api/requests/:id - Get single request
 * - PUT /api/requests/:id/status - Update request status (Faculty/HOD)
 * - DELETE /api/requests/:id - Delete request (Student, own pending only)
 */

// @route   POST /api/requests
// @desc    Create a new request
// @access  Private (Student only)
router.post('/', authorizeStudent, createRequest);

// @route   GET /api/requests
// @desc    Get all requests based on role
// @access  Private
router.get('/', getRequests);

// @route   GET /api/requests/stats
// @desc    Get request statistics
// @access  Private (HOD, Faculty)
router.get('/stats', authorizeHODAndFaculty, getRequestStats);

// @route   GET /api/requests/:id
// @desc    Get single request by ID
// @access  Private
router.get('/:id', getRequestById);

// @route   PUT /api/requests/:id/status
// @desc    Update request status (Approve/Reject)
// @access  Private (Faculty, HOD)
router.put('/:id/status', authorizeHODAndFaculty, updateRequestStatus);

// @route   DELETE /api/requests/:id
// @desc    Delete request
// @access  Private (Student, own pending only)
router.delete('/:id', authorizeStudent, deleteRequest);

module.exports = router;