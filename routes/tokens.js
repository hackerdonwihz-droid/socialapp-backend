const express = require('express');
const User = require('../models/User');
const TokenTransaction = require('../models/Token');
const auth = require('../middleware/auth');

const router = express.Router();

// Get Token Balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ tokenBalance: user.tokenBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send Token Gift
router.post('/gift', auth, async (req, res) => {
  try {
    const { receiverId, amount } = req.body;

    if (!receiverId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide valid receiverId and amount' });
    }

    const sender = await User.findById(req.userId);
    if (sender.tokenBalance < amount) {
      return res.status(400).json({ message: 'Insufficient token balance' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Deduct from sender
    sender.tokenBalance -= amount;
    await sender.save();

    // Add to receiver
    receiver.tokenBalance += amount;
    await receiver.save();

    // Log transaction
    const transaction = new TokenTransaction({
      sender: req.userId,
      receiver: receiverId,
      amount,
      type: 'gift',
      description: `Gift from ${sender.username}`,
    });
    await transaction.save();

    res.json({ message: 'Token gift sent successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Transaction History
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await TokenTransaction.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
    })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
