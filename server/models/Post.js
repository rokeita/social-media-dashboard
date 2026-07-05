const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
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
    platform: {
      type: String,
      required: true
    },
    postId: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: null
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Date,
      required: true
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

module.exports = mongoose.model('Post', postSchema);