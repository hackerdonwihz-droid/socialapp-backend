const mongoose = require('mongoose');

const TimeLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  sessionStartTime: {
    type: Date,
    required: true,
  },
  sessionEndTime: {
    type: Date,
    required: true,
  },
  hoursSpent: {
    type: Number,
    required: true,
  },
  tokensEarned: {
    type: Number,
    default: 0,
  },
  bonusTokens: {
    type: Number,
    default: 0,
  },
  isCompletedDay: {
    type: Boolean,
    default: false, // true if user spent >= 12 hours
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TimeLog', TimeLogSchema);
