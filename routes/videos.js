const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Upload Video
router.post('/upload', auth, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, price, duration, category } = req.body;

    if (!title || !videoUrl || !price) {
      return res.status(400).json({ message: 'Please provide title, videoUrl, and price' });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      price,
      duration,
      category,
      creator: req.userId,
    });

    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Videos
router.get('/all', async (req, res) => {
  try {
    const videos = await Video.find({ isApproved: true })
      .populate('creator', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Single Video
router.get('/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId).populate('creator', 'username profilePicture');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User's Videos
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const videos = await Video.find({ creator: req.params.creatorId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
