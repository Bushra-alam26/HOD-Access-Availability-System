const Availability = require('../models/Availability');
const User = require('../models/User');

/**
 * @desc    Update or create availability status
 * @route   PUT /api/availability
 * @access  Private (HOD, Faculty)
 */
exports.updateAvailability = async (req, res) => {
  try {
    const { status, message, nextAvailable } = req.body;

    // Validate status
    if (!status || !['Available', 'Busy', 'Offline'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Available, Busy, or Offline'
      });
    }

    // Check if user is HOD or Faculty
    if (req.user.role !== 'hod' && req.user.role !== 'faculty') {
      return res.status(403).json({
        success: false,
        message: 'Only HOD and Faculty can update availability'
      });
    }

    // Find or create availability
    let availability = await Availability.findOne({ userId: req.user.id });

    if (availability) {
      // Update existing
      availability.status = status;
      if (message !== undefined) {
        availability.message = message;
      }
      if (nextAvailable) {
        availability.nextAvailable = nextAvailable;
      }
      availability.updatedAt = new Date();
    } else {
      // Create new
      availability = await Availability.create({
        userId: req.user.id,
        role: req.user.role,
        status,
        message: message || '',
        nextAvailable: nextAvailable || null
      });
    }

    await availability.save();

    // Get user details for response
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      availability: {
        ...availability.toObject(),
        userName: `${user.firstName} ${user.surname}`,
        userEmail: user.email
      }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating availability'
    });
  }
};

/**
 * @desc    Get availability status
 * @route   GET /api/availability
 * @access  Public
 */
exports.getAvailability = async (req, res) => {
  try {
    // Get all availability statuses for HOD and Faculty
    const availability = await Availability.find()
      .populate('userId', 'firstName surname email branch')
      .sort({ updatedAt: -1 });

    // Transform response
    const transformedAvailability = availability.map(av => ({
      id: av._id,
      userId: av.userId._id,
      userName: av.userId.firstName && av.userId.surname 
        ? `${av.userId.firstName} ${av.userId.surname}` 
        : 'Unknown',
      userEmail: av.userId.email,
      branch: av.userId.branch,
      role: av.role,
      status: av.status,
      message: av.message,
      nextAvailable: av.nextAvailable,
      updatedAt: av.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: transformedAvailability.length,
      availability: transformedAvailability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching availability'
    });
  }
};

/**
 * @desc    Get availability by role (HOD or Faculty)
 * @route   GET /api/availability/role/:role
 * @access  Public
 */
exports.getAvailabilityByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role
    if (!['hod', 'faculty'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be hod or faculty'
      });
    }

    const availability = await Availability.find({ role })
      .populate('userId', 'firstName surname email branch')
      .sort({ updatedAt: -1 });

    const transformedAvailability = availability.map(av => ({
      id: av._id,
      userId: av.userId._id,
      userName: av.userId.firstName && av.userId.surname 
        ? `${av.userId.firstName} ${av.userId.surname}` 
        : 'Unknown',
      userEmail: av.userId.email,
      branch: av.userId.branch,
      role: av.role,
      status: av.status,
      message: av.message,
      nextAvailable: av.nextAvailable,
      updatedAt: av.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: transformedAvailability.length,
      availability: transformedAvailability
    });
  } catch (error) {
    console.error('Get availability by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching availability'
    });
  }
};

/**
 * @desc    Get my availability (current user)
 * @route   GET /api/availability/me
 * @access  Private (HOD, Faculty)
 */
exports.getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ userId: req.user.id })
      .populate('userId', 'firstName surname email branch');

    if (!availability) {
      return res.status(200).json({
        success: true,
        availability: null,
        message: 'No availability set yet'
      });
    }

    res.status(200).json({
      success: true,
      availability: {
        id: availability._id,
        userId: availability.userId._id,
        userName: `${availability.userId.firstName} ${availability.userId.surname}`,
        userEmail: availability.userId.email,
        branch: availability.userId.branch,
        role: availability.role,
        status: availability.status,
        message: availability.message,
        nextAvailable: availability.nextAvailable,
        updatedAt: availability.updatedAt
      }
    });
  } catch (error) {
    console.error('Get my availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your availability'
    });
  }
};

/**
 * @desc    Get HOD availability (for student dashboard)
 * @route   GET /api/availability/hod
 * @access  Public
 */
exports.getHODAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({ role: 'hod' })
      .populate('userId', 'firstName surname email branch')
      .sort({ updatedAt: -1 })
      .limit(1);

    if (availability.length === 0) {
      return res.status(200).json({
        success: true,
        availability: null,
        message: 'No HOD availability found'
      });
    }

    const av = availability[0];
    res.status(200).json({
      success: true,
      availability: {
        id: av._id,
        userId: av.userId._id,
        userName: `${av.userId.firstName} ${av.userId.surname}`,
        userEmail: av.userId.email,
        branch: av.userId.branch,
        role: av.role,
        status: av.status,
        message: av.message,
        nextAvailable: av.nextAvailable,
        updatedAt: av.updatedAt
      }
    });
  } catch (error) {
    console.error('Get HOD availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching HOD availability'
    });
  }
};