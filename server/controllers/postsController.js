const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Get all posts for user
// @route   GET /api/posts
// @access  Private
exports.getAllPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, platform, sortBy = '-publishedAt' } = req.query;
    const skip = (page - 1) * limit;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return successResponse(res, { posts: [], total: 0, pages: 0 }, 'No posts found');
    }

    const accountIds = accounts.map(acc => acc._id);

    // Build filter
    const filter = { socialAccountId: { $in: accountIds } };
    if (platform) {
      filter.platform = platform;
    }

    // Get posts
    const posts = await Post.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Post.countDocuments(filter);

    const data = posts.map(post => ({
      id: post._id,
      platform: post.platform,
      caption: post.caption,
      imageUrl: post.imageUrl,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      engagement: post.engagement,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt
    }));

    successResponse(res, {
      posts: data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    }, 'Posts retrieved successfully');
  } catch (error) {
    console.error('Get all posts error:', error);
    errorResponse(res, error.message || 'Failed to get posts', 500, error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return errorResponse(res, 'Post not found', 404);
    }

    // Verify ownership
    const account = await SocialAccount.findById(post.socialAccountId);
    if (account.userId.toString() !== userId) {
      return errorResponse(res, 'Not authorized to access this post', 403);
    }

    successResponse(res, {
      post: {
        id: post._id,
        platform: post.platform,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        engagement: post.engagement,
        publishedAt: post.publishedAt
      }
    }, 'Post retrieved successfully');
  } catch (error) {
    console.error('Get post error:', error);
    errorResponse(res, error.message || 'Failed to get post', 500, error);
  }
};

// @desc    Get top performing posts
// @route   GET /api/posts/top/performing
// @access  Private
exports.getTopPerformingPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 5, days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return successResponse(res, { posts: [] }, 'No posts found');
    }

    const accountIds = accounts.map(acc => acc._id);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const posts = await Post.find({
      socialAccountId: { $in: accountIds },
      publishedAt: { $gte: startDate }
    })
      .sort({ engagement: -1 })
      .limit(parseInt(limit));

    const data = posts.map(post => ({
      id: post._id,
      platform: post.platform,
      caption: post.caption?.substring(0, 100),
      imageUrl: post.imageUrl,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      engagement: post.engagement,
      publishedAt: post.publishedAt
    }));

    successResponse(res, { posts: data }, 'Top performing posts retrieved successfully');
  } catch (error) {
    console.error('Get top performing posts error:', error);
    errorResponse(res, error.message || 'Failed to get top performing posts', 500, error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { platform, caption, imageUrl, likes, comments, shares } = req.body;

    // Validation
    if (!platform || !caption) {
      return errorResponse(res, 'Platform and caption are required', 400);
    }

    // Find social account
    const account = await SocialAccount.findOne({ userId, platform });
    if (!account) {
      return errorResponse(res, 'Social account not found', 404);
    }

    // Calculate engagement
    const engagement = (likes || 0) + (comments || 0) + (shares || 0);

    const post = await Post.create({
      userId,
      socialAccountId: account._id,
      platform,
      postId: `${platform}-${Date.now()}`,
      caption,
      imageUrl,
      likes: likes || 0,
      comments: comments || 0,
      shares: shares || 0,
      engagement,
      publishedAt: new Date()
    });

    successResponse(res, {
      post: {
        id: post._id,
        platform: post.platform,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        engagement: post.engagement
      }
    }, 'Post created successfully', 201);
  } catch (error) {
    console.error('Create post error:', error);
    errorResponse(res, error.message || 'Failed to create post', 500, error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { likes, comments, shares, caption } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return errorResponse(res, 'Post not found', 404);
    }

    // Verify ownership
    const account = await SocialAccount.findById(post.socialAccountId);
    if (account.userId.toString() !== userId) {
      return errorResponse(res, 'Not authorized to update this post', 403);
    }

    // Update fields
    if (likes !== undefined) post.likes = likes;
    if (comments !== undefined) post.comments = comments;
    if (shares !== undefined) post.shares = shares;
    if (caption !== undefined) post.caption = caption;

    // Recalculate engagement
    post.engagement = post.likes + post.comments + post.shares;
    await post.save();

    successResponse(res, {
      post: {
        id: post._id,
        platform: post.platform,
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        engagement: post.engagement
      }
    }, 'Post updated successfully');
  } catch (error) {
    console.error('Update post error:', error);
    errorResponse(res, error.message || 'Failed to update post', 500, error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return errorResponse(res, 'Post not found', 404);
    }

    // Verify ownership
    const account = await SocialAccount.findById(post.socialAccountId);
    if (account.userId.toString() !== userId) {
      return errorResponse(res, 'Not authorized to delete this post', 403);
    }

    await Post.findByIdAndDelete(id);

    successResponse(res, {}, 'Post deleted successfully');
  } catch (error) {
    console.error('Delete post error:', error);
    errorResponse(res, error.message || 'Failed to delete post', 500, error);
  }
};
