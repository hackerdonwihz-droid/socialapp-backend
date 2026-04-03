const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Please set a price in tokens'],
    min: 0,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  isPaid: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['Entertainment', 'Education', 'Music', 'Sports', 'Other'],
    default: 'Other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', VideoSchema);
