const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    socialAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SocialAccount',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    followers: {
      type: Number,
      default: 0
    },
    followersGrowth: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    likesGrowth: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    commentsGrowth: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);