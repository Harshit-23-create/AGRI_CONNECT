const User = require('../models/User');

// @desc    Get profile
// @route   GET /api/profile
// @access  Protected
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Protected
const updateProfile = async (req, res) => {
  const { username, serviceProvider, language } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (serviceProvider) user.serviceProvider = serviceProvider;
    if (language) user.language = language;

    const updatedUser = await user.save();
    res.json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
