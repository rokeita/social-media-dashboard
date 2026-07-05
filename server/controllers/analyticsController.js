const Post = require('../models/Post');
const Analytics = require('../models/Analytics');
const SocialAccount = require('../models/SocialAccount');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Get followers analytics
// @route   GET /api/analytics/followers
// @access  Private
exports.getFollowersAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return errorResponse(res, 'No connected accounts', 404);
    }

    const accountIds = accounts.map(acc => acc._id);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const followersData = await Analytics.find({
      socialAccountId: { $in: accountIds },
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const data = followersData.map(record => ({
      date: record.date.toISOString().split('T')[0],
      followers: record.followers,
      growth: record.followersGrowth
    }));

    // Calculate summary
    const totalGrowth = followersData.reduce((sum, record) => sum + record.followersGrowth, 0);
    const currentFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);

    successResponse(res, {
      analytics: {
        data,
        summary: {
          currentFollowers,
          totalGrowth,
          averageGrowth: followersData.length > 0 ? (totalGrowth / followersData.length).toFixed(2) : 0,
          period: `${days} days`
        }
      }
    }, 'Followers analytics retrieved successfully');
  } catch (error) {
    console.error('Get followers analytics error:', error);
    errorResponse(res, error.message || 'Failed to get followers analytics', 500, error);
  }
};

// @desc    Get likes analytics
// @route   GET /api/analytics/likes
// @access  Private
exports.getLikesAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return errorResponse(res, 'No connected accounts', 404);
    }

    const accountIds = accounts.map(acc => acc._id);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const likesData = await Post.aggregate([
      {
        $match: {
          socialAccountId: { $in: accountIds },
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
          totalLikes: { $sum: '$likes' },
          postCount: { $sum: 1 },
          avgLikes: { $avg: '$likes' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const data = likesData.map(record => ({
      date: record._id,
      likes: record.totalLikes,
      avgLikesPerPost: record.avgLikes?.toFixed(2) || 0,
      posts: record.postCount
    }));

    // Calculate summary
    const totalLikes = likesData.reduce((sum, record) => sum + record.totalLikes, 0);
    const avgDailyLikes = likesData.length > 0 ? (totalLikes / likesData.length).toFixed(2) : 0;

    successResponse(res, {
      analytics: {
        data,
        summary: {
          totalLikes,
          avgDailyLikes,
          period: `${days} days`
        }
      }
    }, 'Likes analytics retrieved successfully');
  } catch (error) {
    console.error('Get likes analytics error:', error);
    errorResponse(res, error.message || 'Failed to get likes analytics', 500, error);
  }
};

// @desc    Get comments analytics
// @route   GET /api/analytics/comments
// @access  Private
exports.getCommentsAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return errorResponse(res, 'No connected accounts', 404);
    }

    const accountIds = accounts.map(acc => acc._id);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const commentsData = await Post.aggregate([
      {
        $match: {
          socialAccountId: { $in: accountIds },
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
          totalComments: { $sum: '$comments' },
          postCount: { $sum: 1 },
          avgComments: { $avg: '$comments' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const data = commentsData.map(record => ({
      date: record._id,
      comments: record.totalComments,
      avgCommentsPerPost: record.avgComments?.toFixed(2) || 0,
      posts: record.postCount
    }));

    // Calculate summary
    const totalComments = commentsData.reduce((sum, record) => sum + record.totalComments, 0);
    const avgDailyComments = commentsData.length > 0 ? (totalComments / commentsData.length).toFixed(2) : 0;

    successResponse(res, {
      analytics: {
        data,
        summary: {
          totalComments,
          avgDailyComments,
          period: `${days} days`
        }
      }
    }, 'Comments analytics retrieved successfully');
  } catch (error) {
    console.error('Get comments analytics error:', error);
    errorResponse(res, error.message || 'Failed to get comments analytics', 500, error);
  }
};

// @desc    Get engagement analytics
// @route   GET /api/analytics/engagement
// @access  Private
exports.getEngagementAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return errorResponse(res, 'No connected accounts', 404);
    }

    const accountIds = accounts.map(acc => acc._id);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const engagementData = await Post.aggregate([
      {
        $match: {
          socialAccountId: { $in: accountIds },
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
          totalEngagement: { $sum: '$engagement' },
          avgEngagement: { $avg: '$engagement' },
          maxEngagement: { $max: '$engagement' },
          postCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const data = engagementData.map(record => ({
      date: record._id,
      engagement: record.totalEngagement,
      avgEngagement: record.avgEngagement?.toFixed(2) || 0,
      maxEngagement: record.maxEngagement,
      posts: record.postCount
    }));

    // Calculate summary
    const totalEngagement = engagementData.reduce((sum, record) => sum + record.totalEngagement, 0);
    const avgEngagement = engagementData.reduce((sum, record) => sum + record.avgEngagement, 0) / (engagementData.length || 1);

    successResponse(res, {
      analytics: {
        data,
        summary: {
          totalEngagement,
          avgEngagement: avgEngagement.toFixed(2),
          period: `${days} days`
        }
      }
    }, 'Engagement analytics retrieved successfully');
  } catch (error) {
    console.error('Get engagement analytics error:', error);
    errorResponse(res, error.message || 'Failed to get engagement analytics', 500, error);
  }
};

// @desc    Get platform comparison
// @route   GET /api/analytics/platforms
// @access  Private
exports.getPlatformComparison = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId });
    if (accounts.length === 0) {
      return errorResponse(res, 'No connected accounts', 404);
    }

    const accountIds = accounts.map(acc => acc._id);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const platformComparison = await Post.aggregate([
      {
        $match: {
          socialAccountId: { $in: accountIds },
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$platform',
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          avgEngagement: { $avg: '$engagement' }
        }
      },
      { $sort: { totalLikes: -1 } }
    ]);

    const data = platformComparison.map(record => ({
      platform: record._id,
      posts: record.totalPosts,
      likes: record.totalLikes,
      comments: record.totalComments,
      shares: record.totalShares,
      avgEngagement: record.avgEngagement?.toFixed(2) || 0
    }));

    successResponse(res, {
      analytics: {
        data,
        period: `${days} days`
      }
    }, 'Platform comparison retrieved successfully');
  } catch (error) {
    console.error('Get platform comparison error:', error);
    errorResponse(res, error.message || 'Failed to get platform comparison', 500, error);
  }
};
