const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return errorResponse(res, 'Please provide all required fields', 400);
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password
    });

    // Generate token
    const token = generateToken(user._id);

    // Send response
    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture
        }
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, error.message || 'Registration failed', 500, error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Find user and select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio
        }
      },
      'Logged in successfully',
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, error.message || 'Login failed', 500, error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
          isVerified: user.isVerified
        }
      },
      'User retrieved successfully'
    );
  } catch (error) {
    console.error('Get user error:', error);
    errorResponse(res, error.message || 'Failed to get user', 500, error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(name && { name: name.trim() }),
        ...(bio !== undefined && { bio }),
        ...(profilePicture && { profilePicture })
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio
        }
      },
      'Profile updated successfully'
    );
  } catch (error) {
    console.error('Update profile error:', error);
    errorResponse(res, error.message || 'Failed to update profile', 500, error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return errorResponse(res, 'Please provide all required fields', 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'New passwords do not match', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // Get user with password
    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    successResponse(res, {}, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    errorResponse(res, error.message || 'Failed to change password', 500, error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a real app, you might want to invalidate the token on the server side
    // For now, we'll just send a success response
    successResponse(res, {}, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    errorResponse(res, error.message || 'Logout failed', 500, error);
  }
};
