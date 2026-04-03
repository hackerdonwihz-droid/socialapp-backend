const express = require('express');
const User = require('../models/User');
const TimeLog = require('../models/TimeLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Log User Session
router.post('/log-session', auth, async (req, res) => {
  try {
    const { sessionStartTime, sessionEndTime } = req.body;

    if (!sessionStartTime || !sessionEndTime) {
      return res.status(400).json({ message: 'Please provide session start and end times' });
    }

    const startTime = new Date(sessionStartTime);
    const endTime = new Date(sessionEndTime);
    const hoursSpent = (endTime - startTime) / (1000 * 60 * 60);

    if (hoursSpent <= 0) {
      return res.status(400).json({ message: 'Invalid session duration' });
    }

    // Calculate tokens earned (example: 10 tokens per hour)
    const tokensEarned = Math.floor(hoursSpent * 10);
    const isCompletedDay = hoursSpent >= 12;
    const bonusTokens = isCompletedDay ? 50 : 0;

    const timeLog = new TimeLog({
      user: req.userId,
      sessionStartTime: startTime,
      sessionEndTime: endTime,
      hoursSpent,
      tokensEarned,
      bonusTokens,
      isCompletedDay,
    });

    await timeLog.save();

    // Update user token balance
    const user = await User.findById(req.userId);
    user.tokenBalance += tokensEarned + bonusTokens;
    user.totalEarnings += tokensEarned + bonusTokens;
    user.dailyHoursTracked += hoursSpent;
    await user.save();

    res.status(201).json({
      message: 'Session logged successfully',
      timeLog,
      tokensEarned: tokensEarned + bonusTokens,
      userBalance: user.tokenBalance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Daily Activity
router.get('/daily/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const logs = await TimeLog.find({
      user: req.userId,
      createdAt: { $gte: date, $lt: nextDate },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
