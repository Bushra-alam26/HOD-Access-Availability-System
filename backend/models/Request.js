const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentUSN: {
    type: String
  },
  studentBranch: {
    type: String
  },
  studentSemester: {
    type: Number
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  facultyName: {
    type: String
  },
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hodName: {
    type: String
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  requestDate: {
    type: String,
    required: [true, 'Request date is required']
  },
  requestTime: {
    type: String,
    required: [true, 'Request time is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedByName: {
    type: String
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedByName: {
    type: String
  },
  rejectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
requestSchema.index({ studentId: 1, createdAt: -1 });
requestSchema.index({ status: 1 });
requestSchema.index({ facultyId: 1 });
requestSchema.index({ hodId: 1 });

module.exports = mongoose.model('Request', requestSchema);