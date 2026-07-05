const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all dashboard routes
router.use(authMiddleware);

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary
// @access  Private
router.get('/summary', (req, res) => {
  res.json({ message: 'Dashboard summary - to be implemented' });
});

// @route   GET /api/dashboard/cards
// @desc    Get summary cards
// @access  Private
router.get('/cards', (req, res) => {
  res.json({ message: 'Summary cards - to be implemented' });
});

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview
// @access  Private
router.get('/overview', (req, res) => {
  res.json({ message: 'Dashboard overview - to be implemented' });
});

module.exports = router;