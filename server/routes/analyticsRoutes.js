const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

// @route   GET /api/analytics/followers
// @desc    Get followers analytics
// @access  Private
router.get('/followers', (req, res) => {
  res.json({ message: 'Followers analytics - to be implemented' });
});

// @route   GET /api/analytics/likes
// @desc    Get likes analytics
// @access  Private
router.get('/likes', (req, res) => {
  res.json({ message: 'Likes analytics - to be implemented' });
});

// @route   GET /api/analytics/comments
// @desc    Get comments analytics
// @access  Private
router.get('/comments', (req, res) => {
  res.json({ message: 'Comments analytics - to be implemented' });
});

// @route   GET /api/analytics/engagement
// @desc    Get engagement analytics
// @access  Private
router.get('/engagement', (req, res) => {
  res.json({ message: 'Engagement analytics - to be implemented' });
});

module.exports = router;