const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get User Profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update User Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, profilePicture, bankDetails } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { bio, profilePicture, bankDetails, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      tokenBalance: user.tokenBalance,
      totalEarnings: user.totalEarnings,
      dailyHoursTracked: user.dailyHoursTracked,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
