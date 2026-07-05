const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Apply auth middleware to all dashboard routes
router.use(authMiddleware);

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary
// @access  Private
router.get('/summary', dashboardController.getSummary);

// @route   GET /api/dashboard/cards
// @desc    Get summary cards
// @access  Private
router.get('/cards', dashboardController.getCards);

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview
// @access  Private
router.get('/overview', dashboardController.getOverview);

// @route   GET /api/dashboard/stats
// @desc    Get statistics for a time period
// @access  Private
router.get('/stats', dashboardController.getStats);

// @route   GET /api/dashboard/engagement
// @desc    Get engagement metrics
// @access  Private
router.get('/engagement', dashboardController.getEngagement);

module.exports = router;
