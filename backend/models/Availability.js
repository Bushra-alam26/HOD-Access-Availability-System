const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available'
  },
  nextAvailable: {
    type: Date
  },
  customMessage: {
    type: String,
    trim: true,
    maxlength: [200, 'Message cannot exceed 200 characters']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
availabilitySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Availability', availabilitySchema);