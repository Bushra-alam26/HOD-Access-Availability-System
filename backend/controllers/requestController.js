const Request = require('../models/Request');
const User = require('../models/User');

/**
 * @desc    Create a new request (Student only)
 * @route   POST /api/requests
 * @access  Private (Student)
 */
exports.createRequest = async (req, res) => {
  try {
    const { reason, description, requestDate, requestTime } = req.body;

    // Validate required fields
    if (!reason || !requestDate || !requestTime) {
      return res.status(400).json({
        success: false,
        message: 'Reason, request date, and request time are required'
      });
    }

    // Get student info from authenticated user
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create request
    const request = await Request.create({
      studentId: req.user.id,
      studentName: `${student.firstName} ${student.surname}`,
      studentEmail: student.email,
      studentUSN: student.usn || '',
      studentBranch: student.branch || '',
      studentSemester: student.semester,
      reason,
      description: description || '',
      requestDate,
      requestTime,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating request'
    });
  }
};

/**
 * @desc    Get all requests based on role
 * @route   GET /api/requests
 * @access  Private
 */
exports.getRequests = async (req, res) => {
  try {
    let query = {};

    // Filter based on user role
    if (req.user.role === 'student') {
      // Students can only see their own requests
      query = { studentId: req.user.id };
    } else if (req.user.role === 'faculty') {
      // Faculty can see requests assigned to them or all pending
      query = {
        $or: [
          { facultyId: req.user.id },
          { status: 'Pending' }
        ]
      };
    }
    // HOD can see all requests (no filter)

    const requests = await Request.find(query)
      .populate('studentId', 'firstName surname email usn branch semester')
      .populate('facultyId', 'firstName surname')
      .populate('hodId', 'firstName surname')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
};

/**
 * @desc    Get single request by ID
 * @route   GET /api/requests/:id
 * @access  Private
 */
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('studentId', 'firstName surname email usn branch semester')
      .populate('facultyId', 'firstName surname')
      .populate('hodId', 'firstName surname')
      .populate('approvedBy', 'firstName surname')
      .populate('rejectedBy', 'firstName surname');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Students can only view their own requests
    if (req.user.role === 'student' && request.studentId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request'
    });
  }
};

/**
 * @desc    Update request status (Approve/Reject)
 * @route   PUT /api/requests/:id/status
 * @access  Private (Faculty, HOD)
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Approved or Rejected'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if already processed
    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Request has already been ${request.status.toLowerCase()}`
      });
    }

    // Get user info for audit
    const user = await User.findById(req.user.id);

    if (status === 'Approved') {
      request.status = 'Approved';
      request.approvedBy = req.user.id;
      request.approvedByName = `${user.firstName} ${user.surname}`;
      request.approvedAt = new Date();
    } else {
      request.status = 'Rejected';
      request.rejectedBy = req.user.id;
      request.rejectedByName = `${user.firstName} ${user.surname}`;
      request.rejectedAt = new Date();
      request.rejectionReason = rejectionReason || '';
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      request
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating request status'
    });
  }
};

/**
 * @desc    Delete request (only by student for their own pending requests)
 * @route   DELETE /api/requests/:id
 * @access  Private (Student)
 */
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Only student can delete their own pending requests
    if (req.user.role !== 'student' || request.studentId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    // Only pending requests can be deleted
    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete processed requests'
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting request'
    });
  }
};

/**
 * @desc    Get request statistics (for HOD/Faculty dashboard)
 * @route   GET /api/requests/stats
 * @access  Private (HOD, Faculty)
 */
exports.getRequestStats = async (req, res) => {
  try {
    const matchStage = req.user.role === 'student' 
      ? { studentId: req.user.id } 
      : req.user.role === 'faculty'
      ? { facultyId: req.user.id }
      : {};

    const stats = await Request.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      result[stat._id.toLowerCase()] = stat.count;
      result.total += stat.count;
    });

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStats = await Request.aggregate([
      {
        $match: {
          ...matchStage,
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const todayResult = { pending: 0, approved: 0, rejected: 0 };
    todayStats.forEach(stat => {
      todayResult[stat._id.toLowerCase()] = stat.count;
    });

    res.status(200).json({
      success: true,
      stats: result,
      todayStats: todayResult
    });
  } catch (error) {
    console.error('Get request stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request statistics'
    });
  }
};