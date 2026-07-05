const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

// @route   GET /api/analytics/followers
// @desc    Get followers analytics
// @access  Private
router.get('/followers', analyticsController.getFollowersAnalytics);

// @route   GET /api/analytics/likes
// @desc    Get likes analytics
// @access  Private
router.get('/likes', analyticsController.getLikesAnalytics);

// @route   GET /api/analytics/comments
// @desc    Get comments analytics
// @access  Private
router.get('/comments', analyticsController.getCommentsAnalytics);

// @route   GET /api/analytics/engagement
// @desc    Get engagement analytics
// @access  Private
router.get('/engagement', analyticsController.getEngagementAnalytics);

// @route   GET /api/analytics/platforms
// @desc    Get platform comparison
// @access  Private
router.get('/platforms', analyticsController.getPlatformComparison);

module.exports = router;
