const User = require('../models/User');
const SocialAccount = require('../models/SocialAccount');
const Post = require('../models/Post');
const Analytics = require('../models/Analytics');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Get dashboard summary with all key metrics
// @route   GET /api/dashboard/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's social accounts
    const accounts = await SocialAccount.find({ userId, isConnected: true });
    if (accounts.length === 0) {
      return successResponse(res, {
        totalFollowers: 0,
        totalLikes: 0,
        totalComments: 0,
        totalPosts: 0,
        averageEngagement: 0,
        platformCount: 0
      }, 'No connected accounts');
    }

    const accountIds = accounts.map(acc => acc._id);

    // Get aggregated data from posts
    const postStats = await Post.aggregate([
      { $match: { socialAccountId: { $in: accountIds } } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          averageEngagement: { $avg: '$engagement' }
        }
      }
    ]);

    // Calculate totals from social accounts
    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    const totalFollowing = accounts.reduce((sum, acc) => sum + acc.following, 0);

    const stats = postStats[0] || {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      averageEngagement: 0
    };

    successResponse(res, {
      totalFollowers,
      totalFollowing,
      totalLikes: stats.totalLikes || 0,
      totalComments: stats.totalComments || 0,
      totalPosts: stats.totalPosts || 0,
      totalShares: stats.totalShares || 0,
      averageEngagement: stats.averageEngagement ? stats.averageEngagement.toFixed(2) : 0,
      platformCount: accounts.length,
      platforms: accounts.map(acc => acc.platform)
    }, 'Summary retrieved successfully');
  } catch (error) {
    console.error('Get summary error:', error);
    errorResponse(res, error.message || 'Failed to get summary', 500, error);
  }
};

// @desc    Get summary cards data
// @route   GET /api/dashboard/cards
// @access  Private
exports.getCards = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's social accounts
    const accounts = await SocialAccount.find({ userId, isConnected: true });
    if (accounts.length === 0) {
      return successResponse(res, {
        cards: [
          { icon: '👥', label: 'Followers', value: 0, change: 0 },
          { icon: '❤️', label: 'Likes', value: 0, change: 0 },
          { icon: '💬', label: 'Comments', value: 0, change: 0 },
          { icon: '📈', label: 'Engagement', value: '0%', change: 0 },
          { icon: '📊', label: 'Posts', value: 0, change: 0 }
        ]
      }, 'Cards data retrieved');
    }

    const accountIds = accounts.map(acc => acc._id);

    // Get today's posts
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysPosts = await Post.find({
      socialAccountId: { $in: accountIds },
      publishedAt: { $gte: today }
    });

    // Calculate metrics
    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    const totalLikes = todaysPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = todaysPosts.reduce((sum, post) => sum + post.comments, 0);
    const totalPosts = todaysPosts.length;
    const avgEngagement = totalPosts > 0
      ? ((totalLikes + totalComments) / (totalFollowers || 1) * 100).toFixed(2)
      : 0;

    const cards = [
      {
        icon: '👥',
        label: 'Followers',
        value: totalFollowers.toLocaleString(),
        change: Math.floor(Math.random() * 100) // Mock change
      },
      {
        icon: '❤️',
        label: 'Likes',
        value: totalLikes.toLocaleString(),
        change: Math.floor(Math.random() * 50)
      },
      {
        icon: '💬',
        label: 'Comments',
        value: totalComments.toLocaleString(),
        change: Math.floor(Math.random() * 30)
      },
      {
        icon: '📈',
        label: 'Engagement',
        value: `${avgEngagement}%`,
        change: Math.floor(Math.random() * 20) - 10
      },
      {
        icon: '📊',
        label: 'Posts',
        value: totalPosts.toString(),
        change: totalPosts
      }
    ];

    successResponse(res, { cards }, 'Cards data retrieved successfully');
  } catch (error) {
    console.error('Get cards error:', error);
    errorResponse(res, error.message || 'Failed to get cards', 500, error);
  }
};

// @desc    Get dashboard overview with key metrics
// @route   GET /api/dashboard/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    const userId = req.userId;

    const accounts = await SocialAccount.find({ userId, isConnected: true });
    if (accounts.length === 0) {
      return successResponse(res, {
        overview: {
          totalAccounts: 0,
          totalFollowers: 0,
          totalPosts: 0,
          topPerformingPlatform: null,
          recentPosts: [],
          accountBreakdown: []
        }
      }, 'No connected accounts');
    }

    const accountIds = accounts.map(acc => acc._id);

    // Get all posts
    const posts = await Post.find({ socialAccountId: { $in: accountIds } })
      .sort({ publishedAt: -1 })
      .limit(10);

    // Get top performing platform
    const platformStats = await Post.aggregate([
      { $match: { socialAccountId: { $in: accountIds } } },
      {
        $group: {
          _id: '$platform',
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalEngagement: { $sum: { $add: ['$likes', '$comments'] } }
        }
      },
      { $sort: { totalEngagement: -1 } }
    ]);

    // Account breakdown by platform
    const accountBreakdown = accounts.map(acc => ({
      platform: acc.platform,
      username: acc.username,
      followers: acc.followers,
      posts: acc.totalPosts
    }));

    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    const totalPosts = accounts.reduce((sum, acc) => sum + acc.totalPosts, 0);

    successResponse(res, {
      overview: {
        totalAccounts: accounts.length,
        totalFollowers,
        totalPosts,
        topPerformingPlatform: platformStats[0] || null,
        recentPosts: posts.map(post => ({
          id: post._id,
          platform: post.platform,
          caption: post.caption,
          imageUrl: post.imageUrl,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          publishedAt: post.publishedAt
        })),
        accountBreakdown
      }
    }, 'Overview retrieved successfully');
  } catch (error) {
    console.error('Get overview error:', error);
    errorResponse(res, error.message || 'Failed to get overview', 500, error);
  }
};

// @desc    Get statistics for a specific time period
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    const accounts = await SocialAccount.find({ userId, isConnected: true });
    if (accounts.length === 0) {
      return errorResponse(res, 'No connected accounts', 404);
    }

    const accountIds = accounts.map(acc => acc._id);
    const start = new Date(startDate) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = new Date(endDate) || new Date();

    const stats = await Post.aggregate([
      {
        $match: {
          socialAccountId: { $in: accountIds },
          publishedAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
          postsCount: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' },
          avgEngagement: { $avg: '$engagement' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    successResponse(res, { stats }, 'Statistics retrieved successfully');
  } catch (error) {
    console.error('Get stats error:', error);
    errorResponse(res, error.message || 'Failed to get statistics', 500, error);
  }
};

// @desc    Get engagement metrics
// @route   GET /api/dashboard/engagement
// @access  Private
exports.getEngagement = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const accounts = await SocialAccount.find({ userId, isConnected: true });
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
          _id: null,
          totalEngagement: { $sum: '$engagement' },
          averageEngagement: { $avg: '$engagement' },
          maxEngagement: { $max: '$engagement' },
          minEngagement: { $min: '$engagement' },
          totalPosts: { $sum: 1 }
        }
      }
    ]);

    const data = engagementData[0] || {
      totalEngagement: 0,
      averageEngagement: 0,
      maxEngagement: 0,
      minEngagement: 0,
      totalPosts: 0
    };

    successResponse(res, {
      engagement: {
        totalEngagement: data.totalEngagement,
        averageEngagement: data.averageEngagement?.toFixed(2) || 0,
        maxEngagement: data.maxEngagement,
        minEngagement: data.minEngagement,
        totalPosts: data.totalPosts,
        period: `${days} days`
      }
    }, 'Engagement metrics retrieved successfully');
  } catch (error) {
    console.error('Get engagement error:', error);
    errorResponse(res, error.message || 'Failed to get engagement metrics', 500, error);
  }
};
