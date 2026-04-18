/**
 * Debug Controller
 * API endpoints to fetch and display stored MongoDB data
 */

const User = require('../models/User');
const Request = require('../models/Request');
const Availability = require('../models/Availability');

// @desc    Get all users
// @route   GET /api/debug/users
// @access  Public (for debugging)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    console.log(`Fetched ${users.length} users from database`);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all requests
// @route   GET /api/debug/requests
// @access  Public (for debugging)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find({});
    
    console.log(`Fetched ${requests.length} requests from database`);
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all availability records
// @route   GET /api/debug/availability
// @access  Public (for debugging)
exports.getAllAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({}).populate('userId', 'firstName surname email');
    
    console.log(`Fetched ${availability.length} availability records from database`);
    
    res.status(200).json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all data (users, requests, availability)
// @route   GET /api/debug/all-data
// @access  Public (for debugging)
exports.getAllData = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const requests = await Request.find({});
    const availability = await Availability.find({}).populate('userId', 'firstName surname email');
    
    console.log(`Fetched all data - Users: ${users.length}, Requests: ${requests.length}, Availability: ${availability.length}`);
    
    res.status(200).json({
      success: true,
      data: {
        users: users,
        requests: requests,
        availability: availability
      },
      counts: {
        users: users.length,
        requests: requests.length,
        availability: availability.length
      }
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get database connection status
// @route   GET /api/debug/status
// @access  Public (for debugging)
exports.getStatus = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.status(200).json({
      success: true,
      database: {
        status: states[connectionState] || 'unknown',
        readyState: connectionState,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};