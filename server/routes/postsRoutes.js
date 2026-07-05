const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const postsController = require('../controllers/postsController');

// Apply auth middleware to all post routes
router.use(authMiddleware);

// @route   GET /api/posts
// @desc    Get all posts for user
// @access  Private
router.get('/', postsController.getAllPosts);

// @route   GET /api/posts/top/performing
// @desc    Get top performing posts
// @access  Private
router.get('/top/performing', postsController.getTopPerformingPosts);

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Private
router.get('/:id', postsController.getPost);

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', postsController.createPost);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', postsController.updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', postsController.deletePost);

module.exports = router;
