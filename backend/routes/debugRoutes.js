/**
 * Debug Routes
 * API endpoints to fetch and display stored MongoDB data
 */

const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getAllRequests, 
  getAllAvailability, 
  getAllData,
  getStatus 
} = require('../controllers/debugController');

/**
 * Debug Routes:
 * - GET /api/debug/users - Get all users
 * - GET /api/debug/requests - Get all requests
 * - GET /api/debug/availability - Get all availability records
 * - GET /api/debug/all-data - Get all data combined
 * - GET /api/debug/status - Get database connection status
 */

// @route   GET /api/debug/users
// @desc    Get all users from database
// @access  Public
router.get('/users', getAllUsers);

// @route   GET /api/debug/requests
// @desc    Get all requests from database
// @access  Public
router.get('/requests', getAllRequests);

// @route   GET /api/debug/availability
// @desc    Get all availability records from database
// @access  Public
router.get('/availability', getAllAvailability);

// @route   GET /api/debug/all-data
// @desc    Get all data (users, requests, availability)
// @access  Public
router.get('/all-data', getAllData);

// @route   GET /api/debug/status
// @desc    Get database connection status
// @access  Public
router.get('/status', getStatus);

module.exports = router;