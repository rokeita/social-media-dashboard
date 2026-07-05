const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    platform: {
      type: String,
      enum: ['instagram', 'twitter', 'facebook', 'tiktok', 'youtube', 'linkedin'],
      required: true
    },
    username: {
      type: String,
      required: true
    },
    accountId: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      default: null
    },
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    },
    totalPosts: {
      type: Number,
      default: 0
    },
    isConnected: {
      type: Boolean,
      default: true
    },
    lastSyncedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SocialAccount', socialAccountSchema);